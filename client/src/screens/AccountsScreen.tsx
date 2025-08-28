import React, { useEffect, useState } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { Card, Text } from 'react-native-paper';
import { getAccounts, getTransactions } from '../services/api';
import { Account, Transaction } from '../types';

function TransactionList({ accountId }: { accountId: string }) {
  const [txns, setTxns] = useState<Transaction[]>([]);
  useEffect(() => { getTransactions(accountId).then(setTxns); }, [accountId]);
  return (
    <FlatList data={txns} keyExtractor={t => t.id} renderItem={({ item }) => (
      <View style={styles.txn}><Text>{item.description}</Text><Text style={{ color: item.type === 'credit' ? 'green' : 'red' }}>{item.type === 'credit' ? '+' : '-'}{item.amount.toFixed(2)}€</Text></View>
    )} ListEmptyComponent={<Text style={{ textAlign: 'center', marginTop: 8 }}>Aucune transaction</Text>} />
  );
}

export default function AccountsScreen() {
  const [accounts, setAccounts] = useState<Account[]>([]);
  useEffect(() => { getAccounts().then(setAccounts); }, []);
  return (
    <View style={styles.container}>
      <FlatList data={accounts} keyExtractor={a => a.id} renderItem={({ item }) => (
        <Card style={styles.account}>
          <Card.Title title={`${item.name} — ${item.balance.toFixed(2)} ${item.currency}`} />
          <Card.Content>
            <TransactionList accountId={item.id} />
          </Card.Content>
        </Card>
      )} />
    </View>
  );
}

const styles = StyleSheet.create({ container: { flex: 1, padding: 12 }, account: { marginBottom: 16 }, txn: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 6 } });