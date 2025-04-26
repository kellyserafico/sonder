import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';
import PromptScreen from './src/screens/PromptScreen';

export default function App() {
  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <PromptScreen />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
