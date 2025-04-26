import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';

export default function SignUp() {
  return (
    <SafeAreaProvider>
      <LinearGradient
        colors={['#000000', '#221C2D']} // black to purple gradient
        style={styles.gradient}
      >
        <SafeAreaView style={styles.container}>
          {/* Title */}
          <Text style={styles.title}>sonder</Text>

          {/* Form */}
          <View style={styles.form}>
            <Text style={styles.label}>username</Text>
            <TextInput style={styles.input} placeholder="" placeholderTextColor="#aaa" />

            <Text style={styles.label}>email</Text>
            <TextInput style={styles.input} placeholder="" placeholderTextColor="#aaa" keyboardType="email-address" />

            <Text style={styles.label}>password</Text>
            <TextInput style={styles.input} placeholder="" placeholderTextColor="#aaa" secureTextEntry />

            <Text style={styles.label}>confirm password</Text>
            <TextInput style={styles.input} placeholder="" placeholderTextColor="#aaa" secureTextEntry />
          </View>

          {/* Link to login */}
          <TouchableOpacity onPress={() => router.push('./login')}>
            <Text style={styles.link}>already registered?</Text>
          </TouchableOpacity>

          {/* Sign Up Button */}
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>sign up</Text>
          </TouchableOpacity>
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
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 80,
  },
  title: {
    fontFamily: 'JosefinSans-Bold',
    fontSize: 36,
    color: '#ffffff',
    marginBottom: 40,
    fontWeight: '700',
  },
  form: {
    width: '100%',
  },
  label: {
    fontFamily: 'JosefinSans-Regular',
    fontSize: 14,
    color: '#ffffff',
    marginBottom: 4,
    marginTop: 12,
  },
  input: {
    borderBottomWidth: 1,
    borderBottomColor: '#aaa',
    fontFamily: 'JosefinSans-Regular',
    fontSize: 16,
    color: '#ffffff',
    paddingVertical: 8,
    marginBottom: 12,
  },
  link: {
    color: '#ffffff',
    textDecorationLine: 'underline',
    fontFamily: 'JosefinSans-Regular',
    fontSize: 14,
    marginTop: 16,
  },
  button: {
    borderColor: '#ffffff',
    borderWidth: 1,
    borderRadius: 25,
    paddingVertical: 12,
    paddingHorizontal: 50,
    marginTop: 24,
    alignItems: 'center',
  },
  buttonText: {
    color: '#ffffff',
    fontFamily: 'JosefinSans-Regular',
    fontSize: 20,
    textTransform: 'lowercase',
  },
});
