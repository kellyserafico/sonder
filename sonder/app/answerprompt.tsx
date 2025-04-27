import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ActivityIndicator,
  Alert,
  Platform,
} from 'react-native';

const API_BASE_URL = 'http://localhost:8000'; // Update this with your actual backend URL

const PromptScreen = () => {
  const [response, setResponse] = useState('');
  const [prompt, setPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchDailyPrompt();
  }, []);

  const fetchDailyPrompt = async () => {
    try {
      setIsLoading(true);
      const apiResponse = await fetch(`${API_BASE_URL}/today-prompt`);
      const data = await apiResponse.json();
      setPrompt(data.prompt);
    } catch (error) {
      Alert.alert('Error', 'Failed to fetch today\'s prompt');
      console.error('Error fetching prompt:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!response.trim()) {
      Alert.alert('Error', 'Please enter your response');
      return;
    }

    try {
      setIsSubmitting(true);
      const apiResponse = await fetch(`${API_BASE_URL}/submit-response`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ response: response }),
      });

      if (!apiResponse.ok) {
        throw new Error('Failed to submit response');
      }

      Alert.alert('Success', 'Your response has been submitted');
      setResponse('');
    } catch (error) {
      Alert.alert('Error', 'Failed to submit response');
      console.error('Error submitting response:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const Container = Platform.OS === 'web' ? View : SafeAreaView;

  if (isLoading) {
    return (
      <Container style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#E4E4E4" />
        </View>
      </Container>
    );
  }

  return (
    <Container style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Sonder</Text>
        <Text style={styles.date}>{today}</Text>
        <Text style={styles.prompt}>{prompt}</Text>
        
        <TextInput
          style={styles.input}
          multiline
          placeholder="Type your thoughts here..."
          placeholderTextColor="#888"
          value={response}
          onChangeText={setResponse}
        />

        <TouchableOpacity
          style={[styles.button, isSubmitting && styles.buttonDisabled]}
          onPress={handleSubmit}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Submit</Text>
          )}
        </TouchableOpacity>
      </View>
    </Container>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
    ...(Platform.OS === 'web' && {
      maxWidth: 800,
      marginHorizontal: 'auto',
      width: '100%',
    }),
  },
  content: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    ...(Platform.OS === 'web' && {
      maxWidth: 600,
      marginHorizontal: 'auto',
    }),
  },
  title: {
    fontSize: 42,
    fontWeight: 'bold',
    color: '#E4E4E4',
    marginBottom: 40,
    letterSpacing: 2,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  date: {
    fontSize: 18,
    color: '#888',
    marginBottom: 20,
  },
  prompt: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 30,
    color: '#E4E4E4',
    lineHeight: 32,
  },
  input: {
    width: '100%',
    minHeight: 150,
    borderWidth: 1,
    borderColor: '#333',
    borderRadius: 10,
    padding: 15,
    fontSize: 16,
    marginBottom: 20,
    textAlignVertical: 'top',
    backgroundColor: '#222',
    color: '#E4E4E4',
    ...(Platform.OS === 'web' && {
      resize: 'vertical',
      outline: 'none',
    }),
  },
  button: {
    backgroundColor: '#4A90E2',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 25,
    ...(Platform.OS === 'web' && {
      cursor: 'pointer',
    }),
  },
  buttonDisabled: {
    backgroundColor: '#333',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default PromptScreen; 