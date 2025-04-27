import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

interface PostProps {
  username: string;
  text: string;
}

export default function Post({ username, text }: PostProps) {
  const router = useRouter();

  const handleProfilePress = () => {
    console.log('Profile pic clicked!'); 
    router.push({
      pathname: '/viewprofile',
      params: { username },
    });
  };

  return (
    <View style={styles.container}>
 <TouchableOpacity
  onPress={handleProfilePress}
  style={{ backgroundColor: '', borderRadius: 25 }}
  hitSlop={20}
>
  <Image
    source={require('../../assets/images/icon.png')}
    style={styles.profilePic}
  />
</TouchableOpacity>
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
  actions: {
    flexDirection: 'row',
    gap: 12,
  },
  iconButton: {
    padding: 4,
  },
});
