import React, { useState } from "react";
import {
  StyleSheet,
  TouchableOpacity,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import AsyncStorage from '@react-native-async-storage/async-storage';


export default function LoginScreen() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  // Log In Handler
  const handleLogIn = async () => {
    if (!username || !password) {
      alert("Please fill in both fields");
      return;
    }

    try {
      // Fetch the user data (replace with your actual API)
      const response = await fetch("http://localhost:8000/user");
      const data = await response.json();

      // Find the user by username
      const user = data.find((user: any) => user.username === username);
      console.log("User", user);

      if (!user) {
        alert("User not found");
        return;
      }

      const [storedSalt, storedHashedPassword] = user.password.split(":");

      if (!storedSalt || !storedHashedPassword) {
        alert("Invalid password format");
        return;
      }
      console.log("HASHPASS BEFORE CHECK:", storedHashedPassword);

      // Send password and stored hash/salt to the backend for validation
      const isPasswordValid = await verifyPassword(
        password,
        storedHashedPassword,
        storedSalt
      );

      if (isPasswordValid) {
        await AsyncStorage.setItem("userId", user.id.toString());
        router.push("./(tabs)/home");
      } else {
        alert("Invalid password");
      }
    } catch (error) {
      console.error("Error during login:", error);
      alert("An error occurred. Please try again later.");
    }
  };

  // Compare password with stored hash on the backend
  const verifyPassword = async (
    password: string,
    storedHash: string,
    storedSalt: string
  ) => {
    try {
      const response = await fetch("http://localhost:8000/password/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          password,
          stored_hash: storedHash,
          stored_salt: storedSalt,
        }),
      });

      // Check if the response was successful (status code 200)
      if (!response.ok) {
        throw new Error("Password verification failed");
      }

      const data = await response.json();
      // Return true if the password is correct
      console.log("DATA RESPONSE:", data);
      return data.message === "Password is correct";
    } catch (error) {
      console.error("Error verifying password:", error);
      return false; // Return false if there's an error
    }
  };

  return (
    <SafeAreaProvider>
      <LinearGradient colors={["#000000", "#221C2D"]} style={styles.gradient}>
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
              onChangeText={(text) => setUsername(text)} // Correct way to update state
            />

            <Text style={styles.label}>password</Text>
            <TextInput
              style={styles.input}
              placeholder=""
              placeholderTextColor="#aaa"
              secureTextEntry
              onChangeText={(text) => setPassword(text)} // Correct way to update state
            />
          </View>

          {/* Link to signup */}
          <TouchableOpacity onPress={() => router.push("./signup")}>
            <Text style={styles.link}>new user?</Text>
          </TouchableOpacity>

          {/* Log In Button */}
          <TouchableOpacity style={styles.button} onPress={handleLogIn}>
            <Text style={styles.buttonText}>log in</Text>
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
    alignItems: "center",
    paddingHorizontal: 24,
    paddingTop: 80,
  },
  title: {
    fontFamily: "JosefinSans-Bold",
    fontSize: 64,
    fontWeight: "700",
    color: "#ffffff",
    marginBottom: 60,
  },
  form: {
    width: "100%",
  },
  label: {
    fontFamily: "JosefinSans-Regular",
    fontSize: 14,
    color: "#ffffff",
    marginBottom: 4,
    marginTop: 12,
  },
  input: {
    borderBottomWidth: 1,
    borderBottomColor: "#aaa",
    fontFamily: "JosefinSans-Regular",
    fontSize: 16,
    color: "#ffffff",
    paddingVertical: 8,
    marginBottom: 12,
  },
  link: {
    color: "#ffffff",
    textDecorationLine: "underline",
    fontFamily: "JosefinSans-Regular",
    fontSize: 14,
    marginTop: 24,
  },
  button: {
    borderColor: "#ffffff",
    borderWidth: 1,
    borderRadius: 25,
    paddingVertical: 12,
    paddingHorizontal: 50,
    marginTop: 24,
    alignItems: "center",
  },
  buttonText: {
    color: "#ffffff",
    fontFamily: "JosefinSans-Regular",
    fontSize: 24,
    textTransform: "lowercase",
  },
});
