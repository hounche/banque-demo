import React, { useState, useContext } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { TextInput, Button, Title } from 'react-native-paper';
import { AuthContext } from '../../../App';
import { login } from '../services/api';

export default function LoginScreen({ navigation }: any) {
  const [email, setEmail] = useState('demo@banque.test');
  const [password, setPassword] = useState('password');
  const { setUser } = useContext(AuthContext);

  const onLogin = async () => {
    try {
      const u = await login(email, password);
      setUser(u);
      navigation.replace('Dashboard');
    } catch (e: any) {
      Alert.alert('Erreur', e.message || 'Échec de la connexion');
    }
  };

  return (
    <View style={styles.container}>
      <Title style={{ marginBottom: 16 }}>Banque Demo</Title>
      <TextInput label="Email" value={email} onChangeText={setEmail} style={styles.input} />
      <TextInput label="Mot de passe" value={password} onChangeText={setPassword} secureTextEntry style={styles.input} />
      <Button mode="contained" onPress={onLogin}>Se connecter</Button>
    </View>
  );
}

const styles = StyleSheet.create({ container: { flex: 1, padding: 20, justifyContent: 'center' }, input: { marginBottom: 12 } });