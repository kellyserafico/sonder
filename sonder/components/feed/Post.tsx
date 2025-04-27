import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons'; // for heart and comment icons

interface PostProps {
  username: string;
  text: string;
}

export default function Post({ username, text }: PostProps) {
  return (
    <View style={styles.container}>
      <Image
        source={{ uri: 'https://via.placeholder.com/80' }} // Placeholder profile image
        style={styles.profilePic}
      />
      
      <View style={styles.content}>
        <Text style={styles.username}>@{username}</Text>
        <Text style={styles.postText}>{text}</Text>
        <View style={styles.actions}>
          <TouchableOpacity style={styles.iconButton}>
            <Feather name="heart" size={20} color="#ffffff" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton}>
            <Feather name="message-circle" size={20} color="#ffffff" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: 12,
    alignItems: 'flex-start',
  },
  profilePic: {
    width: 50,
    height: 50,
    borderRadius: 25, // Circle
    backgroundColor: '#ccc', // Light gray background if no image
    marginRight: 12,
  },
  content: {
    flex: 1,
  },
  username: {
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
  actions: {
    flexDirection: 'row',
    gap: 12,
  },
  iconButton: {
    padding: 4,
  },
});
