// sonder/app/login.tsx
import { useState } from 'react';
import { StyleSheet, TouchableOpacity, Text, TextInput, View, Alert } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useAuth } from '../contexts/AuthContext';
import LoadingOverlay from '../components/LoadingOverlay';

export default function LoginScreen() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();

  const handleLogin = async () => {
    if (!username.trim() || !password.trim()) {
      Alert.alert('Error', 'Please enter both username and password');
      return;
    }

    setIsLoading(true);
    
    try {
      await login(username, password);
    } catch (error: any) {
      const errorMessage = error.detail || 'Login failed. Please try again.';
      Alert.alert('Login Error', errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaProvider>
      <LinearGradient
        colors={['#000000', '#221C2D']}
        style={styles.gradient}
      >
        <SafeAreaView style={styles.container}>
          {/* Title */}
          <Text style={styles.title}>sonder</Text>

          {/* Form */}
          <View style={styles.form}>
            <Text style={styles.label}>username/email</Text>
            <TextInput
              style={styles.input}
              placeholder=""
              placeholderTextColor="#aaa"
              value={username}
              onChangeText={setUsername}
              autoCapitalize="none"
            />

            <Text style={styles.label}>password</Text>
            <TextInput
              style={styles.input}
              placeholder=""
              placeholderTextColor="#aaa"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
            />
          </View>

          {/* Link to signup */}
          <TouchableOpacity onPress={() => router.push('./signup')}>
            <Text style={styles.link}>new user?</Text>
          </TouchableOpacity>

          {/* Log In Button */}
          <TouchableOpacity 
            style={[styles.button, isLoading ? styles.buttonDisabled : null]} 
            onPress={handleLogin}
            disabled={isLoading}
          >
            <Text style={styles.buttonText}>log in</Text>
          </TouchableOpacity>

          {/* Loading Overlay */}
          <LoadingOverlay visible={isLoading} message="Logging in..." />
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
    fontSize: 64,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 60,
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
    marginTop: 24,
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
  buttonDisabled: {
    opacity: 0.6,
    borderColor: '#aaaaaa',
  },
  buttonText: {
    color: '#ffffff',
    fontFamily: 'JosefinSans-Regular',
    fontSize: 24,
    textTransform: 'lowercase',
  },
});