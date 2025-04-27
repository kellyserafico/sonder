import {
  View,
  Text,
  StyleSheet,
  Image,
  TextInput,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Feather } from "@expo/vector-icons";
import { useEffect, useState } from "react";

type Response = {
  id: number;
  content: string;
  created_at: string;
  user_id: number;
  response_id: number;
  username?: string; // now optional
};
async function getUsername(userId: number): Promise<string> {
  try {
    const res = await fetch(`http://localhost:8000/user/${userId}`);
    const data = await res.json();
    return data.username || `user${userId}`; // fallback if backend doesn't return username
  } catch (error) {
    console.error("Failed to fetch username for user", userId, error);
    return `user${userId}`;
  }
}

export default function PostDetail() {
  const { username, text, date, likes, comments, response_id } =
    useLocalSearchParams();
  const router = useRouter();
  const [commentList, setCommentList] = useState<Response[]>([]);

  console.log(response_id);
  useEffect(() => {
    async function getAllResponses() {
      if (!response_id) return;
      try {
        const res = await fetch(
          `http://localhost:8000/comment/response/${response_id}`
        );
        const responseData: Response[] = await res.json();
  
        // Fetch usernames for each comment
        const commentsWithUsernames = await Promise.all(
          responseData.map(async (comment) => {
            const username = await getUsername(comment.user_id);
            return { ...comment, username };
          })
        );
  
        setCommentList(commentsWithUsernames);
      } catch (error) {
        console.error("Failed to fetch responses:", error);
      }
    }
  
    getAllResponses();
  }, [response_id]);
  

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
          source={require("../assets/images/sonder_icon2.png")}
          style={styles.profilePic}
        />
        <View style={styles.postContent}>
          <Text style={styles.username}>@{username}</Text>
          <Text style={styles.postText}>{text}</Text>
          <Text style={styles.dateText}>{date}</Text>

          <View style={styles.actions}>
            <Feather name="heart" size={16} color="#fff" />
            <Text style={styles.actionText}>{likes}</Text>
            <Feather
              name="message-circle"
              size={16}
              color="#fff"
              style={{ marginLeft: 12 }}
            />
            <Text style={styles.actionText}>{commentList.length}</Text>
          </View>
        </View>
      </View>

      {/* Divider */}
      <View style={styles.divider} />

      {/* Comments */}
      <FlatList
        data={commentList}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.commentContainer}>
            <Image
              source={require("../assets/images/icon.png")}
              style={styles.commentPic}
            />
            <View>
              {/* You don't have username field coming from backend, so show user_id or hardcode for now */}
              <Text style={styles.username}>@{item.username}</Text>
              <Text style={styles.commentText}>{item.content}</Text>
              <Text style={styles.dateText}>
                {new Date(item.created_at).toLocaleString()}
              </Text>
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
  container: { flex: 1, backgroundColor: "#000" },
  header: { flexDirection: "row", alignItems: "center", padding: 16 },
  title: {
    color: "#fff",
    fontFamily: "JosefinSans-Bold",
    fontSize: 28, // Increased from 24
    marginLeft: 16,
  },
  postContainer: { flexDirection: "row", paddingHorizontal: 16 },
  profilePic: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
    backgroundColor: "#ccc",
  },
  postContent: { flex: 1 },
  username: { 
    color: "#fff", 
    fontFamily: "JosefinSans-Bold", 
    fontSize: 18 // Increased from 16
  },
  postText: { 
    color: "#fff", 
    fontFamily: "JosefinSans-Regular", 
    marginTop: 4,
    fontSize: 16 // Added font size
  },
  dateText: {
    color: "#aaa",
    fontFamily: "JosefinSans-Regular",
    marginTop: 8,
    fontSize: 14 // Increased from 12
  },
  actions: { flexDirection: "row", alignItems: "center", marginTop: 8 },
  actionText: {
    color: "#fff",
    marginLeft: 4,
    fontFamily: "JosefinSans-Regular",
    fontSize: 16 // Added font size
  },
  divider: { height: 2, backgroundColor: "#C084FC", marginVertical: 12 },
  commentContainer: { 
    flexDirection: "row", 
    marginBottom: 16, 
    paddingVertical: 12 
  },
  commentPic: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#ccc",
    marginRight: 16,
  },
  commentText: {
    color: "#fff",
    fontFamily: "JosefinSans-Regular",
    marginTop: 2,
    fontSize: 16,
  },
  commentInputContainer: {
    padding: 12,
    borderTopWidth: 1,
    borderTopColor: "#333",
  },
  commentInput: {
    backgroundColor: "#000",
    borderColor: "#fff",
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 16,
    color: "#fff",
    height: 40,
  },
 });