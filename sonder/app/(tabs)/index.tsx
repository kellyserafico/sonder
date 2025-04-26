import { Image, StyleSheet, Platform, Button } from 'react-native';

import { HelloWave } from '@/components/HelloWave';
import ParallaxScrollView from '@/components/ParallaxScrollView';
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
<Button title="login"></Button>
<Button title="sign up"></Button>

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
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
});
