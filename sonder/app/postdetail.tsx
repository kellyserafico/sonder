import { View, Text, StyleSheet, Image, TextInput, FlatList, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import responses from '../responses.json'; 

export default function PostDetail() {
  const { username, text, date, likes, comments } = useLocalSearchParams();
  const router = useRouter();

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Feather name="arrow-left" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.title}>sonder</Text>
      </View>

      {/* Post content */}
      <View style={styles.postContainer}>
        <Image
          source={require('../assets/images/icon.png')}
          style={styles.profilePic}
        />
        <View style={styles.postContent}>
          <Text style={styles.username}>@{username}</Text>
          <Text style={styles.postText}>{text}</Text>
          <Text style={styles.dateText}>{date}</Text>

          <View style={styles.actions}>
            <Feather name="heart" size={16} color="#fff" />
            <Text style={styles.actionText}>{likes}</Text>
            <Feather name="message-circle" size={16} color="#fff" style={{ marginLeft: 12 }} />
            <Text style={styles.actionText}>{comments}</Text>
          </View>
        </View>
      </View>

      {/* Divider */}
      <View style={styles.divider} />

      {/* Comments */}
      <FlatList
        data={[
          { id: '1', username: 'sjdklf', text: 'Lorem ipsum dolor sit amet...' },
          { id: '2', username: 'sjdklf', text: 'Lorem ipsum dolor sit amet...' }
        ]}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.commentContainer}>
            <Image
              source={require('../assets/images/icon.png')}
              style={styles.commentPic}
            />
            <View>
              <Text style={styles.username}>@{item.username}</Text>
              <Text style={styles.commentText}>{item.text}</Text>
            </View>
          </View>
        )}
        contentContainerStyle={{ paddingHorizontal: 16 }}
      />

      {/* Write comment input */}
      <View style={styles.commentInputContainer}>
        <TextInput
          style={styles.commentInput}
          placeholder="write a comment..."
          placeholderTextColor="#aaa"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  header: { flexDirection: 'row', alignItems: 'center', padding: 16 },
  title: { color: '#fff', fontFamily: 'JosefinSans-Bold', fontSize: 24, marginLeft: 16 },
  postContainer: { flexDirection: 'row', paddingHorizontal: 16 },
  profilePic: { width: 50, height: 50, borderRadius: 25, marginRight: 12, backgroundColor: '#ccc' },
  postContent: { flex: 1 },
  username: { color: '#fff', fontFamily: 'JosefinSans-Bold', fontSize: 16 },
  postText: { color: '#fff', fontFamily: 'JosefinSans-Regular', marginTop: 4 },
  dateText: { color: '#aaa', fontFamily: 'JosefinSans-Regular', marginTop: 8, fontSize: 12 },
  actions: { flexDirection: 'row', alignItems: 'center', marginTop: 8 },
  actionText: { color: '#fff', marginLeft: 4, fontFamily: 'JosefinSans-Regular' },
  divider: { height: 2, backgroundColor: '#C084FC', marginVertical: 12 },
  commentContainer: { flexDirection: 'row', marginBottom: 16 },
  commentPic: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#ccc', marginRight: 12 },
  commentText: { color: '#fff', fontFamily: 'JosefinSans-Regular', marginTop: 2 },
  commentInputContainer: { padding: 12, borderTopWidth: 1, borderTopColor: '#333' },
  commentInput: { backgroundColor: '#000', borderColor: '#fff', borderWidth: 1, borderRadius: 20, paddingHorizontal: 16, color: '#fff', height: 40 },
});
