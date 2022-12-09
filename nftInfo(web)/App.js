import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import Home from './pages/Home';
import { Web3ReactProvider } from '@web3-react/core';
import Web3 from 'web3';

function getLibrary(provider) {
  return new Web3(provider)
}

export default function App() {
  return (
    <Web3ReactProvider getLibrary={getLibrary}>
      <View style={styles.container}>
        <Home />
        <StatusBar style="auto" />
      </View>
    </Web3ReactProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
