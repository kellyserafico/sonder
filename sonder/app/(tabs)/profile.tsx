import { StyleSheet, Text, View, Image, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { SafeAreaView } from 'react-native-safe-area-context';
import Post from "../../components/feed/Post"
import { useEffect, useState } from 'react';
import AsyncStorage from "@react-native-async-storage/async-storage"

export interface User {
  username: string;
  email: string;
  id: number;
  password: string;
}

export interface Response {
  content: string;
  image: string | null;
  id: number;
  user_id: number;
  prompt_id: number;
  likes: number;
}

export default function ProfileScreen() {
  const [userId, setUserId] = useState("trending")
  const [user, setUser] = useState<User>({
    username: 'username',
    email: '',
    id: 0,
    password: ''
  })
  const [responses, setResponses] = useState<Response[]>([])

  useEffect(() => {
    async function fetchTasks() {
      try {
        const value = await AsyncStorage.getItem("userId")
        setUserId(value || "trending")
        console.log("ASYNC:", value)
      } catch (error) {
        console.error("Error retrieving tasks from AsyncStorage", error)
      }
    }

    fetchTasks()
  }, [])

  useEffect(() => {
    async function getCurrentPrompt() {
      try {
        const res = await fetch(`http://localhost:8000/response/${userId}`)
        const data = await res.json()
        
        const responsesArray = Array.isArray(data) ? data : []
        setResponses(responsesArray)
        console.log("RESPONSES", responsesArray)

        const res2 = await fetch(`http://localhost:8000/user/${userId}`)
        const data2: User = await res2.json()
        setUser(data2)
        console.log("USER", data2)

      } catch (error) {
        console.error("Failed to fetch prompts:", error)
        setResponses([])
      }
    }
  
    if (userId) {
      getCurrentPrompt()
    }
  }, [userId])
    
  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
          {/* Title */}
          <Text style={styles.title}>sonder</Text>

          {/* Profile Info */}
          <View style={styles.profileContainer}>
            <Image
              source={{ uri: 'https://via.placeholder.com/100' }}
              style={styles.profileImage}
            />
            <Text style={styles.username}>@{user.username}</Text>
            <TouchableOpacity style={styles.editButton}>
              <Text style={styles.editButtonText}>Edit Profile</Text>
            </TouchableOpacity>
          </View>

          {/* Responses */}
          <View style={{ gap: 20 }}>
            {responses.map((response) => (
              <Post 
                key={response.id} 
                responseId={response.id}
                username={user.username} 
                text={response.content} 
                postImage={response.image}
                date={new Date().toISOString()} // You might want to add a date field to the Response interface
                likes={response.likes}
              />
            ))}
          </View>
        </ScrollView>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    paddingHorizontal: 16,
    paddingTop: 24,
  },
  title: {
    fontFamily: 'JosefinSans-Bold',
    fontSize: 36,
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 24,
    fontWeight: '700',
  },
  profileContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#ccc',
    marginBottom: 12,
  },
  username: {
    fontFamily: 'JosefinSans-Regular',
    fontSize: 20,
    color: '#ffffff',
    marginBottom: 12,
  },
  editButton: {
    borderColor: '#ffffff',
    borderWidth: 1,
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 20,
  },
  editButtonText: {
    color: '#ffffff',
    fontFamily: 'JosefinSans-Regular',
    fontSize: 16,
  },
});