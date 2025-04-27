import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState, useEffect } from 'react';
import { useLocalSearchParams } from 'expo-router';
import Post from '../../components/feed/Post';

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

export default function ViewProfile() {
  const [isFollowing, setIsFollowing] = useState(false);
  const [user, setUser] = useState<User>({
    username: 'username',
    email: '',
    id: 0,
    password: ''
  });
  const [responses, setResponses] = useState<Response[]>([]);

  // If you passed params (username, etc.)
  const { username: rawUsername = 'username' } = useLocalSearchParams();
  const username = Array.isArray(rawUsername) ? rawUsername[0] : rawUsername;


  useEffect(() => {
    async function fetchUserData() {
      try {
        // Fetch user data
        const res = await fetch(`http://localhost:8000/user/username/${username}`)
        const userData: User = await res.json()
        console.log(userData)
        setUser(userData)

        // Fetch user's responses
        const responsesRes = await fetch(`http://localhost:8000/response/${userData.id}`)
        const responsesData = await responsesRes.json()
        
        const responsesArray = Array.isArray(responsesData) ? responsesData : []
        console.log(responsesArray)
        setResponses(responsesArray)
        
      } catch (error) {
        console.error("Failed to fetch user data:", error)
      }
    }

    fetchUserData()
  }, [username])

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
        <Text style={styles.title}>sonder</Text>

        {/* Profile Info */}
        <View style={styles.profileContainer}>
          <Image
            source={{ uri: 'https://via.placeholder.com/120' }}
            style={styles.profileImage}
          />
          <Text style={styles.username}>@{user.username}</Text>
          <TouchableOpacity
            style={[styles.followButton, isFollowing && styles.followingButton]}
            onPress={() => setIsFollowing(!isFollowing)}
          >
            <Text style={[styles.followButtonText, isFollowing && styles.followingButtonText]}>
              {isFollowing ? 'following' : 'follow'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Posts */}
        <View style={{ gap: 20, marginTop: 20 }}>
          {responses.map((response) => (
            <Post 
              key={response.id} 
              responseId={response.id}
              username={user.username} 
              text={response.content} 
              postImage={response.image}
              date={new Date().toISOString()}
              likes={response.likes}
            />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
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
    marginBottom: 20,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#ccc',
    marginBottom: 12,
  },
  username: {
    fontFamily: 'JosefinSans-Regular',
    fontSize: 20,
    color: '#ffffff',
    marginBottom: 12,
  },
  followButton: {
    borderColor: '#ffffff',
    borderWidth: 1,
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 30,
  },
  followButtonText: {
    color: '#ffffff',
    fontFamily: 'JosefinSans-Regular',
    fontSize: 16,
  },
  followingButton: {
    backgroundColor: '#6D28D9', // purple
    borderColor: '#6D28D9',
  },
  followingButtonText: {
    color: '#ffffff',
  },
});