import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import LoadingOverlay from '../components/LoadingOverlay';
import { registerUser } from '../api/auth';

type UserForm = {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
};

type FormErrors = {
  [K in keyof UserForm]?: string;
};

export default function SignUp() {
  const [form, setForm] = useState<UserForm>({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const [errors, setErrors] = useState<FormErrors>({});

  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (name: keyof UserForm, value: string) => {
    setForm(prev => ({ ...prev, [name]: value }));

    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!form.username.trim()) {
      newErrors.username = 'Username is required';
    } else if (form.username.length < 3) {
      newErrors.username = 'Username must be at least 3 characters';
    }

    if (!form.email.trim()) {
      newErrors.email = 'Email is required';
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(form.email)) {
        newErrors.email = 'Please enter a valid email address';
      }
    }

    if (!form.password) {
      newErrors.password = 'Password is required';
    } else if (form.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }

    if (!form.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (form.password !== form.confirmPassword) {
      newErrors.confirmPassword = "Passwords don't match";
    }
    
    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    
    setIsLoading(true);
    
    try {
      await registerUser({
        username: form.username,
        email: form.email,
        password: form.password
      });

      Alert.alert(
        "Success",
        "Your account has been created! Please log in.",
        [{ text: "OK", onPress: () => router.push('./login') }]
      );
      
    } catch (error) {
      console.error('Error:', error);

      const apiError = error as any;
      let errorMessage = "Please try again later";
      
      if (apiError?.detail) {
        errorMessage = apiError.detail;

        if (errorMessage.includes("Username") && errorMessage.includes("registered")) {
          setErrors(prev => ({ ...prev, username: "Username is already taken" }));
        } else if (errorMessage.includes("Email") && errorMessage.includes("registered")) {
          setErrors(prev => ({ ...prev, email: "Email is already registered" }));
        }
      }
      
      Alert.alert("Registration Failed", errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

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
            <TextInput 
              style={[styles.input, errors.username ? styles.inputError : null]} 
              placeholder="" 
              placeholderTextColor="#aaa"
              value={form.username}
              onChangeText={(text) => handleChange('username', text)}
              autoCapitalize="none"
            />
            {errors.username && <Text style={styles.errorText}>{errors.username}</Text>}

            <Text style={styles.label}>email</Text>
            <TextInput 
              style={[styles.input, errors.email ? styles.inputError : null]} 
              placeholder="" 
              placeholderTextColor="#aaa" 
              keyboardType="email-address"
              value={form.email}
              onChangeText={(text) => handleChange('email', text)}
              autoCapitalize="none"
            />
            {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}

            <Text style={styles.label}>password</Text>
            <TextInput 
              style={[styles.input, errors.password ? styles.inputError : null]} 
              placeholder="" 
              placeholderTextColor="#aaa" 
              secureTextEntry
              value={form.password}
              onChangeText={(text) => handleChange('password', text)}
            />
            {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}

            <Text style={styles.label}>confirm password</Text>
            <TextInput 
              style={[styles.input, errors.confirmPassword ? styles.inputError : null]} 
              placeholder="" 
              placeholderTextColor="#aaa" 
              secureTextEntry
              value={form.confirmPassword}
              onChangeText={(text) => handleChange('confirmPassword', text)}
            />
            {errors.confirmPassword && <Text style={styles.errorText}>{errors.confirmPassword}</Text>}
          </View>

          {/* Link to login */}
          <TouchableOpacity onPress={() => router.push('./login')}>
            <Text style={styles.link}>already registered?</Text>
          </TouchableOpacity>

          {/* Sign Up Button */}
          <TouchableOpacity 
            style={[styles.button, isLoading ? styles.buttonDisabled : null]}
            onPress={handleSubmit}
            disabled={isLoading}
          >
            <Text style={styles.buttonText}>sign up</Text>
          </TouchableOpacity>
          
          {/* Loading Overlay */}
          <LoadingOverlay visible={isLoading} message="Creating your account..." />
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
    marginBottom: 4,
  },
  inputError: {
    borderBottomColor: '#FF6B6B',
  },
  errorText: {
    color: '#FF6B6B',
    fontSize: 12,
    marginBottom: 8,
    fontFamily: 'JosefinSans-Regular',
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
    minWidth: 180,
  },
  buttonDisabled: {
    opacity: 0.6,
    borderColor: '#aaaaaa',
  },
  buttonText: {
    color: '#ffffff',
    fontFamily: 'JosefinSans-Regular',
    fontSize: 20,
    textTransform: 'lowercase',
  },
});