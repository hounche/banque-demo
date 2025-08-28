import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { Button, TextInput, Text, Menu, Divider } from 'react-native-paper';
import { getAccounts, transfer } from '../services/api';
import { Account } from '../types';

export default function TransferScreen({ navigation }: any) {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [from, setFrom] = useState<string | undefined>(undefined);
  const [to, setTo] = useState<string | undefined>(undefined);
  const [amount, setAmount] = useState<string>('');

  const [fromMenuVisible, setFromMenuVisible] = useState(false);
  const [toMenuVisible, setToMenuVisible] = useState(false);

  useEffect(() => {
    getAccounts().then(acc => {
      setAccounts(acc);
      if (acc[0] && !from) setFrom(acc[0].id);
      if (acc[1] && !to) setTo(acc[1].id);
    }).catch(e => Alert.alert('Erreur', e.message || 'Impossible de charger les comptes'));
  }, []);

  const doTransfer = async () => {
    try {
      if (!from || !to) return Alert.alert('Erreur', 'Sélectionne les comptes source et destination.');
      if (from === to) return Alert.alert('Erreur', 'Les comptes doivent être différents.');
      const amt = parseFloat(amount);
      if (isNaN(amt) || amt <= 0) return Alert.alert('Erreur', 'Montant invalide.');

      const fromAcc = accounts.find(a => a.id === from);
      if (!fromAcc) return Alert.alert('Erreur', 'Compte source introuvable.');
      if (fromAcc.balance < amt) return Alert.alert('Erreur', "Fonds insuffisants.");

      await transfer(from, to, amt);
      Alert.alert('Succès', 'Virement effectué.');
      navigation.navigate('Dashboard');
    } catch (e: any) {
      Alert.alert('Erreur', e.message || 'Échec du virement');
    }
  };

  const fromLabel = accounts.find(a => a.id === from)?.name ?? 'Sélectionner';
  const toLabel = accounts.find(a => a.id === to)?.name ?? 'Sélectionner';

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Depuis</Text>
      <Menu visible={fromMenuVisible} onDismiss={() => setFromMenuVisible(false)} anchor={<Button mode="outlined" onPress={() => setFromMenuVisible(true)}>{fromLabel}</Button>}>
        {accounts.map(a => (
          <Menu.Item key={a.id} title={`${a.name} (${a.balance.toFixed(2)}€)`} onPress={() => { setFrom(a.id); setFromMenuVisible(false); }} />
        ))}
      </Menu>

      <Text style={styles.label}>Vers</Text>
      <Menu visible={toMenuVisible} onDismiss={() => setToMenuVisible(false)} anchor={<Button mode="outlined" onPress={() => setToMenuVisible(true)}>{toLabel}</Button>}>
        {accounts.map(a => (
          <Menu.Item key={a.id} title={`${a.name} (${a.balance.toFixed(2)}€)`} onPress={() => { setTo(a.id); setToMenuVisible(false); }} />
        ))}
      </Menu>

      <Text style={styles.label}>Montant</Text>
      <TextInput style={styles.input} keyboardType="numeric" value={amount} onChangeText={setAmount} />

      <Button mode="contained" onPress={doTransfer}>Envoyer</Button>
    </View>
  );
}

const styles = StyleSheet.create({ container: { flex: 1, padding: 16 }, label: { marginTop: 12, marginBottom: 6, fontWeight: '700' }, input: { borderWidth: 1, borderColor: '#ddd', padding: 10, borderRadius: 6, marginBottom: 12 } });