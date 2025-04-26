import { StyleSheet, Button, View } from 'react-native';


import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { SafeAreaView } from 'react-native-safe-area-context';


export default function HomeScreen() {
  return (
<SafeAreaProvider>
  <SafeAreaView>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title" style={{ fontFamily: "JosefinSans", fontWeight: "bold" }}>sonder</ThemedText>
      </ThemedView>
<View style={styles.button}>
  <Button title="login" onPress={() => {}} />
</View>
<View style={styles.button}>
<Button title="sign up"></Button>
</View>


      </SafeAreaView>
      </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  button: {
    width: 290,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
});
