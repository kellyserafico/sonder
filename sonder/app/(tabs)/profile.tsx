import { StyleSheet, Text, View, Image, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { SafeAreaView } from 'react-native-safe-area-context';
import Post from "../../components/feed/Post"

const posts = [
  { id: '1', username: 'sjdklf', text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit...' },
  { id: '2', username: 'sjdklf', text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit...' },
];

export default function ProfileScreen() {
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
            <Text style={styles.username}>@username</Text>
            <TouchableOpacity style={styles.editButton}>
              <Text style={styles.editButtonText}>Edit Profile</Text>
            </TouchableOpacity>
          </View>

          {/* Posts */}
          <View style={{ gap: 20 }}>
            {posts.map((post) => (
              <Post key={post.id} username={post.username} text={post.text} />
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
