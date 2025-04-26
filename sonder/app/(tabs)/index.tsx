import { StyleSheet, TouchableOpacity, Text, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';

export default function HomeScreen() {
  return (
    <SafeAreaProvider>
      <LinearGradient
        colors={['#000000', '#221C2D']} // black to purple
        style={styles.gradient}
      >
        <SafeAreaView style={styles.container}>
          <View style={styles.titleContainer}>
            <Text style={styles.titleText}>sonder</Text>
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.button}>
              <Text style={styles.buttonText}>log in</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.button}>
              <Text style={styles.buttonText}>sign up</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </LinearGradient>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  titleContainer: {
    marginBottom: 80,
  },
  titleText: {
    fontFamily: 'JosefinSans-Bold',
    fontSize: 64,
    fontWeight: '700',
    color: '#ffffff',
    backgroundColor: 'transparent',
  },
  buttonContainer: {
    gap: 20,
  },
  button: {
    borderColor: '#ffffff',
    borderWidth: 1,
    borderRadius: 25,
    paddingVertical: 12,
    paddingHorizontal: 50,
    alignItems: 'center',
  },
  buttonText: {
    color: '#ffffff',
    fontFamily: 'JosefinSans-Regular',
    fontSize: 36,
    textTransform: 'lowercase',
  },
});
