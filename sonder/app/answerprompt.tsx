import { View, Text, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import { useState } from 'react';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function AnswerPrompt() {
  const [response, setResponse] = useState('');
  const router = useRouter();
  
  const today = new Date();
  const formattedDate = today.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

  const handleSubmit = () => {
    console.log('Submitted response:', response);
    // You can add code to post this to your database
    router.back(); // go back to previous page after submit
  };

  const handleClose = () => {
    router.back(); // just go back
  };

  return (
    <View style={styles.container}>
      {/* Top Header */}
      <View style={styles.header}>
  <TouchableOpacity style={styles.closeButton} onPress={handleClose}>
    <Ionicons name="close" size={28} color="#ffffff" />
  </TouchableOpacity>

  <Text style={styles.title}>sonder</Text>
</View>


      {/* Date */}
      <Text style={styles.dateText}>{formattedDate}</Text>

      {/* Prompt */}
      <Text style={styles.prompt}>what’s on your mind?</Text>

      {/* Text input box */}
      <TextInput
        style={styles.textArea}
        placeholder="type your response..."
        placeholderTextColor="#ccc"
        multiline
        value={response}
        onChangeText={setResponse}
      />

      {/* Submit button */}
      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
        <Text style={styles.submitButtonText}>submit</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
    padding: 24,
    paddingTop: 48,
  },
  header: {
    marginBottom: 24,
    position: 'relative',
    alignItems: 'center',
  },
  title: {
    fontFamily: 'JosefinSans-Bold',
    fontSize: 32,
    color: '#ffffff',
    fontWeight: '700',
    textAlign: 'center',
  },
  closeButton: {
    position: 'absolute',
    right: 0,
    top: 0,
  },
  
  dateText: {
    fontFamily: 'JosefinSans-Regular',
    fontSize: 18,
    color: '#6F31EC',
    textAlign: 'center',
    marginBottom: 24,
  },
  prompt: {
    fontFamily: 'JosefinSans-Bold',
    fontSize: 24,
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 24,
  },
  textArea: {
    borderWidth: 1,
    borderColor: '#ffffff',
    borderRadius: 20,
    padding: 16,
    fontFamily: 'JosefinSans-Regular',
    fontSize: 16,
    color: '#ffffff',
    height: 200,
    textAlignVertical: 'top', // ensure text starts at top
    marginBottom: 24,
  },
  submitButton: {
    borderWidth: 1,
    borderColor: '#ffffff',
    borderRadius: 25,
    paddingVertical: 12,
    alignItems: 'center',
    width: '70%',
    alignSelf: 'center',
  },
  submitButtonText: {
    color: '#ffffff',
    fontFamily: 'JosefinSans-Regular',
    fontSize: 20,
    textTransform: 'lowercase',
  },
});
