import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  FlatList,
} from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState, useEffect } from "react";
import { Ionicons } from "@expo/vector-icons";
import Post from "../../components/feed/Post";
import responses from "../../responses.json";

const posts = [
  {
    id: "1",
    username: "sjdklf",
    text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
  },
  {
    id: "2",
    username: "sjdklf",
    text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
  },
  {
    id: "3",
    username: "sjdklf",
    text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
  },
  {
    id: "4",
    username: "sjdklf",
    text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
  },
];

interface Prompt {
  id: number;
  content: string;
  created_at: string;
  scheduled_for?: string;
  is_active: boolean;
}

interface Response {
  id: number;
  content: string;
  image: string | null;
  likes: number;
  prompt_id: number;
  user_id: number;
  username: string;
  date: string;
}

export default function FeedScreen() {
  const [selectedTab, setSelectedTab] = useState("trending");
  const [prompt, setPrompt] = useState<Prompt | null>(null);
  const [responses, setResponses] = useState<Response[]>([]);

  //get the prompts
  useEffect(() => {
    async function getCurrentPrompt() {
      try {
        const res = await fetch("http://localhost:8000/prompt/current");
        const data = await res.json();
        setPrompt(data[0]);
        console.log("DATA", data);
      } catch (error) {
        console.error("Failed to fetch prompts:", error);
      }
    }

    getCurrentPrompt();
  }, []);

  useEffect(() => {
    async function getAllResponses() {
      if (!prompt) return;

      try {
        const res = await fetch(
          `http://localhost:8000/response/prompt/${prompt.id}`
        );
        const responseData: Response[] = await res.json();

        const enhancedResponses = await Promise.all(
          responseData.map(async (response: Response) => {
            try {
              const userRes = await fetch(
                `http://localhost:8000/user/${response.user_id}`
              );
              const userData = await userRes.json(); // Make sure this line executes correctly

              return {
                ...response,
                username: userData.username ?? "Unknown User",
              };
            } catch (error) {
              console.error(`Failed to fetch user ${response.user_id}:`, error);
              return {
                ...response,
                username: "Unknown User",
                date: response.date,
              };
            }
          })
        );

        setResponses(enhancedResponses);
      } catch (error) {
        console.error("Failed to fetch responses:", error);
      }
    }

    getAllResponses();
  }, [prompt]);

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>sonder</Text>
          <Image
            source={{ uri: "https://via.placeholder.com/80" }}
            style={styles.profilePic}
          />
        </View>

        {/* Prompt */}
        <TouchableOpacity>
          <Text style={styles.prompt}>
            {prompt?.content || "Loading prompt..."}
          </Text>
        </TouchableOpacity>

        {/* Tabs */}
        <View style={styles.tabs}>
          <TouchableOpacity onPress={() => setSelectedTab("trending")}>
            <Text
              style={[
                styles.tabText,
                selectedTab === "trending" && styles.activeTab,
              ]}
            >
              trending
            </Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => setSelectedTab("following")}>
            <Text
              style={[
                styles.tabText,
                selectedTab === "following" && styles.activeTab,
              ]}
            >
              following
            </Text>
          </TouchableOpacity>
        </View>

        {/* Post List */}
        <FlatList
          data={responses}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <Post
              username={item.username || `user_${item.user_id}`}
              text={item.content}
              likes={item.likes}
              date={new Date().toISOString()}
            />
          )}
          contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 8 }}
        />

        {/* Floating Add Button */}
        <TouchableOpacity style={styles.floatingButton}>
          <Ionicons name="add" size={32} color="white" />
        </TouchableOpacity>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000000",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    marginTop: 8,
  },
  title: {
    fontFamily: "JosefinSans-Bold",
    fontSize: 32,
    color: "#ffffff",
    fontWeight: "700",
  },
  profilePic: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#ccc",
  },
  prompt: {
    textAlign: "center",
    color: "#ffffff",
    fontSize: 24,
    fontFamily: "JosefinSans-SemiBold", 
    marginVertical: 24,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    paddingBottom: 8,
    letterSpacing: 0.5,
    lineHeight: 30,
  },
  tabs: {
    flexDirection: "row",
    justifyContent: "space-around",
    borderBottomColor: "#ffffff",
    borderBottomWidth: 1,
    paddingBottom: 8,
  },
  tabText: {
    color: "#ffffff",
    fontSize: 18,
    fontFamily: "JosefinSans-Regular",
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: "#C084FC",
  },
  floatingButton: {
    position: "absolute",
    bottom: 24,
    right: 24,
    backgroundColor: "#6F31EC",
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
  },
});
