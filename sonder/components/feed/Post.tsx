import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

interface PostProps {
  username: string;
  text: string;
  postImage?: any;
}

export default function Post({ username, text, postImage }: PostProps) {
  const router = useRouter();

  const handleProfilePress = () => {
    console.log('Profile pic clicked!');
    router.push({
      pathname: '/viewprofile',
      params: { username },
    });
  };

  const handlePostPress = () => {
    console.log('Post clicked!');
    router.push({
      pathname: '/postdetail',
      params: {
        username,
        text,
        date: '5:11PM 4/26/25', // example placeholder
        likes: 16, // example placeholder
        comments: 2, // example placeholder
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
          source={require('../../assets/images/icon.png')}
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
            source={postImage}
            style={styles.postImage}
            resizeMode="cover"
          />
        )}
        
        {/* Post actions */}
        <View style={styles.actions}>
          <TouchableOpacity style={styles.iconButton}>
            <Feather name="heart" size={20} color="#ffffff" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton}>
            <Feather name="message-circle" size={20} color="#ffffff" />
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
    marginBottom: 4,
  },
  postText: {
    fontFamily: 'JosefinSans-Regular',
    fontSize: 14,
    color: '#ffffff',
    marginBottom: 8,
  },
  postImage: {
    width: '100%',
    height: 200,
    borderRadius: 12,
    backgroundColor: '#444',
    marginTop: 8,
    marginBottom: 8,
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  iconButton: {
    padding: 4,
  },
});
