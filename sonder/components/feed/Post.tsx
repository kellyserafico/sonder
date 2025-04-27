import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

interface PostProps {
  responseId: number
  username: string;
  text: string;
  postImage?: string | null; // external URL or null
  date: string;
  likes: number;
}

export default function Post({ responseId, username, text, postImage, date, likes }: PostProps) {
  const router = useRouter();

  const handleProfilePress = () => {
    router.push({
      pathname: '/viewprofile',
      params: { username },
    });
  };

  const handlePostPress = () => {
    router.push({
      pathname: '/postdetail',
      params: {
        username,
        text,
        date,
        likes,
        comments: 2,
        response_id: responseId,
      },
    });
  };

  return (
    <View style={styles.container}>
      {/* Profile picture click */}
      <TouchableOpacity
        onPress={handleProfilePress}
        style={{ borderRadius: 25 }}
        hitSlop={20}
      >
        <Image
          source={require('../../assets/images/sonder_icon2.png')}
          style={styles.profilePic}
        />
      </TouchableOpacity>

      {/* Post content click */}
      <TouchableOpacity onPress={handlePostPress} style={styles.content}>
        <Text style={styles.username}>@{username}</Text>
        <Text style={styles.postText}>{text}</Text>

        {/* Show post image if available */}
        {postImage && (
          <Image
            source={{ uri: postImage }}
            style={styles.postImage}
            resizeMode="cover"
          />
        )}

        {/* Date */}
        <Text style={styles.dateText}>{new Date(date).toLocaleString()}</Text>

        {/* Post actions */}
        <View style={styles.actions}>
          <TouchableOpacity style={styles.iconButton}>
            <Feather name="heart" size={20} color="#ffffff" />
            <Text style={styles.actionText}>{likes}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton}>
            <Feather name="message-circle" size={20} color="#ffffff" />
            <Text style={styles.actionText}>!</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
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
    borderRadius: 25,
    backgroundColor: '#ccc',
    marginRight: 12,
  },
  content: {
    flex: 1,
  },
  username: {
    fontFamily: 'JosefinSans-Bold',
    fontSize: 16,
    color: '#ffffff',
    marginBottom: 10, // Increased from 4
  },
  postText: {
    fontFamily: 'JosefinSans-Regular',
    fontSize: 14,
    color: '#ffffff',
    marginBottom: 12, // Increased from 8
  },
  postImage: {
    width: '100%',
    height: 200,
    borderRadius: 12,
    backgroundColor: '#444',
    marginTop: 12, // Increased from 8
    marginBottom: 12,
  },
  dateText: {
    color: '#aaaaaa',
    fontSize: 12,
    marginTop: 4, // Increased from 4
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 12, // Increased from 8
    alignItems: 'center',
  },
  iconButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  actionText: {
    color: '#ffffff',
    fontFamily: 'JosefinSans-Regular',
    fontSize: 14,
  },
});
