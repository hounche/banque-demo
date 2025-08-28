import React, { useEffect, useState } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { Text, Button, Card } from 'react-native-paper';
import { getAccounts } from '../services/api';
import { Account } from '../types';

export default function DashboardScreen({ navigation }: any) {
  const [accounts, setAccounts] = useState<Account[]>([]);

  useEffect(() => {
    const load = async () => {
      const acc = await getAccounts();
      setAccounts(acc);
    };
    const unsub = navigation.addListener('focus', load);
    load();
    return unsub;
  }, [navigation]);

  const total = accounts.reduce((s, a) => s + a.balance, 0);

  return (
    <View style={styles.container}>
      <Text variant="headlineSmall" style={{ marginBottom: 12 }}>Solde total: {total.toFixed(2)} EUR</Text>
      <FlatList data={accounts} keyExtractor={i => i.id} renderItem={({ item }) => (
        <Card style={{ marginBottom: 8 }} onPress={() => navigation.navigate('Accounts')}> 
          <Card.Title title={item.name} subtitle={`${item.balance.toFixed(2)} ${item.currency}`} />
        </Card>
      )} />

      <View style={styles.actions}>
        <Button mode="outlined" onPress={() => navigation.navigate('Accounts')}>Comptes</Button>
        <Button mode="contained" onPress={() => navigation.navigate('Transfer')}>Virement</Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({ container: { flex: 1, padding: 16 }, actions: { flexDirection: 'row', justifyContent: 'space-around', marginTop: 16 } });