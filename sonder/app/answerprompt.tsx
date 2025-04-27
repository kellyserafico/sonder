<<<<<<< HEAD
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
} from "react-native";
import { useState, useEffect } from "react";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
=======
import { View, Text, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import { useState } from 'react';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Alert, Platform, ToastAndroid } from 'react-native';
>>>>>>> 0ee4eb9ced5eb85de9af29c6a7a840c0947058e6

interface Prompt {
  id: number;
  content: string;
  created_at: string;
  scheduled_for?: string;
  is_active: boolean;
}
export default function AnswerPrompt() {
  const [response, setResponse] = useState("");
  const router = useRouter();

  const today = new Date();
  const formattedDate = today.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  const [prompt, setPrompt] = useState<Prompt | null>(null);

  //get the prompts
  useEffect(() => {
    async function getCurrentPrompt() {
      try {
        const res = await fetch("http://localhost:8000/prompt/current");
        const data = await res.json();
        setPrompt(data[0]);
      } catch (error) {
        console.error("Failed to fetch prompts:", error);
      }
    }
    getCurrentPrompt();
  }, []);

  const handleSubmit = () => {
<<<<<<< HEAD
    console.log("Submitted response:", response);
    // You can add code to post this to your database
    router.back(); // go back to previous page after submit
=======
    if (response.trim() === '') return;
  
    if (Platform.OS === 'android') {
      ToastAndroid.show('response submitted!', ToastAndroid.SHORT);
    } else {
      Alert.alert('response submitted!');
    }
  
    router.replace('/');
>>>>>>> 0ee4eb9ced5eb85de9af29c6a7a840c0947058e6
  };
  

  const handleClose = () => {
    router.replace('/home');
  };

  return (
    <LinearGradient
      colors={['#000000', '#221C2D']}
      style={styles.container}
    >
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.closeButton} onPress={handleClose}>
          <Ionicons name="close" size={28} color="#ffffff" />
        </TouchableOpacity>

        <Text style={styles.title}>sonder</Text>
      </View>

      {/* Date */}
      <Text style={styles.dateText}>{formattedDate}</Text>

      {/* Prompt */}
      <Text style={styles.prompt}>
        {prompt?.content || "Loading prompt..."}
      </Text>

      {/* Text input */}
      <TextInput
        style={styles.textArea}
        placeholder="type your response..."
        placeholderTextColor="#ccc"
        multiline
        value={response}
        onChangeText={setResponse}
      />

      {/* Spacer */}
      <View style={{ flex: 1 }} />

      {/* Submit button */}
      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
        <Text style={styles.submitButtonText}>submit</Text>
      </TouchableOpacity>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
<<<<<<< HEAD
    backgroundColor: "#000000",
=======
>>>>>>> 0ee4eb9ced5eb85de9af29c6a7a840c0947058e6
    padding: 24,
    paddingTop: 48,
  },
  header: {
    marginBottom: 24,
    position: "relative",
    alignItems: "center",
  },
  title: {
    fontFamily: "JosefinSans-Bold",
    fontSize: 32,
    color: "#ffffff",
    fontWeight: "700",
    textAlign: "center",
  },
  closeButton: {
    position: "absolute",
    right: 0,
    top: 0,
  },
<<<<<<< HEAD

=======
>>>>>>> 0ee4eb9ced5eb85de9af29c6a7a840c0947058e6
  dateText: {
    fontFamily: "JosefinSans-Regular",
    fontSize: 18,
    color: "#6F31EC",
    textAlign: "center",
    marginBottom: 24,
  },
  prompt: {
    fontFamily: "JosefinSans-Bold",
    fontSize: 24,
    color: "#ffffff",
    textAlign: "center",
    marginBottom: 24,
  },
  textArea: {
    borderWidth: 1,
    borderColor: "#ffffff",
    borderRadius: 20,
    padding: 16,
    fontFamily: "JosefinSans-Regular",
    fontSize: 16,
<<<<<<< HEAD
    color: "#ffffff",
    height: 200,
    textAlignVertical: "top", // ensure text starts at top
=======
    color: '#ffffff',
    height: 300,
    textAlignVertical: 'top',
>>>>>>> 0ee4eb9ced5eb85de9af29c6a7a840c0947058e6
    marginBottom: 24,
  },
  submitButton: {
    borderWidth: 1,
    borderColor: "#ffffff",
    borderRadius: 25,
    paddingVertical: 12,
<<<<<<< HEAD
    alignItems: "center",
    width: "70%",
    alignSelf: "center",
=======
    alignItems: 'center',
    width: '70%',
    alignSelf: 'center',
    marginBottom: 24,
>>>>>>> 0ee4eb9ced5eb85de9af29c6a7a840c0947058e6
  },
  submitButtonText: {
    color: "#ffffff",
    fontFamily: "JosefinSans-Regular",
    fontSize: 20,
    textTransform: "lowercase",
  },
});
