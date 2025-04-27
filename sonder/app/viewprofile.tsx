import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState } from 'react';
import { useLocalSearchParams } from 'expo-router'; // or use useRoute() if you're using react-navigation
import Post from '../components/feed/Post'; // Adjust the import path as necessary
export default function ViewProfile() {
  const [isFollowing, setIsFollowing] = useState(false);

  // If you passed params (username, etc.)
  const { username: rawUsername = 'username' } = useLocalSearchParams();
  const username = Array.isArray(rawUsername) ? rawUsername[0] : rawUsername;

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
          <Text style={styles.username}>@{username}</Text>
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
          {/* Example posts */}
          <Post username={username} text="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua." />
          <Post username={username} text="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."  />
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
  postContainer: {
    flexDirection: 'row',
    marginBottom: 24,
  },
  postProfilePic: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#ccc',
    marginRight: 12,
    marginTop: 6,
  },
  postContent: {
    flex: 1,
  },
  postUsername: {
    fontFamily: 'JosefinSans-Bold',
    fontSize: 16,
    color: '#ffffff',
    marginBottom: 4,
  },
  postText: {
    fontFamily: 'JosefinSans-Regular',
    fontSize: 14,
    color: '#ffffff',
    marginBottom: 8,
  },
  imagePlaceholder: {
    backgroundColor: '#ccc',
    height: 120,
    borderRadius: 16,
    marginVertical: 8,
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  iconButton: {
    padding: 4,
  },
  icon: {
    color: '#ffffff',
    fontSize: 18,
  },
});
