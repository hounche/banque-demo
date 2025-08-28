import React, { useState, createContext } from 'react';
import { Provider as PaperProvider } from 'react-native-paper';
import { NavigationContainer } from '@react-navigation/native';
import RootNavigator from './src/navigation';
import { User } from './src/types';

type AuthContextType = {
  user: User | null;
  setUser: (u: User | null) => void;
};

export const AuthContext = createContext<AuthContextType>({ user: null, setUser: () => {} });

export default function App() {
  const [user, setUser] = useState<User | null>(null);

  return (
    <PaperProvider>
      <AuthContext.Provider value={{ user, setUser }}>
        <NavigationContainer>
          <RootNavigator />
        </NavigationContainer>
      </AuthContext.Provider>
    </PaperProvider>
  );
}