"use client"

import { View, Text, StyleSheet, Image, TouchableOpacity, FlatList, Platform } from "react-native"
import { SafeAreaProvider } from "react-native-safe-area-context"
import { SafeAreaView } from "react-native-safe-area-context"
import { useState, useEffect } from "react"
import { Ionicons } from "@expo/vector-icons"
import Post from "../../components/feed/Post"
import { Link } from "expo-router"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { LinearGradient } from "expo-linear-gradient"

interface Prompt {
  id: number
  content: string
  created_at: string
  scheduled_for?: string
  is_active: boolean
}

interface Response {
  id: number
  content: string
  image: string | null
  likes: number
  prompt_id: number
  user_id: number
  username: string
  date: string
}

export default function FeedScreen() {
  const [selectedTab, setSelectedTab] = useState("trending")
  const [prompt, setPrompt] = useState<Prompt | null>(null)
  const [responses, setResponses] = useState<Response[]>([])

  // // Fetch AsyncStorage data
  // useEffect(() => {
  //   async function fetchTasks() {
  //     try {
  //       const value = await AsyncStorage.getItem("userId")
  //       setStoredTasks(value)
  //       console.log("ASYNC:", value)
  //     } catch (error) {
  //       console.error("Error retrieving tasks from AsyncStorage", error)
  //     }
  //   }

  //   fetchTasks()
  // }, [])

  //get the prompts
  useEffect(() => {
    async function getCurrentPrompt() {
      try {
        const res = await fetch("http://localhost:8000/prompt/current")
        const data = await res.json()
        setPrompt(data[0])
        console.log("DATA", data)
      } catch (error) {
        console.error("Failed to fetch prompts:", error)
      }
    }

    getCurrentPrompt()
  }, [])

  useEffect(() => {
    async function getAllResponses() {
      if (!prompt) return

      try {
        const res = await fetch(`http://localhost:8000/response/prompt/${prompt.id}`)
        const responseData: Response[] = await res.json()

        const enhancedResponses = await Promise.all(
          responseData.map(async (response: Response) => {
            try {
              const userRes = await fetch(`http://localhost:8000/user/${response.user_id}`)
              const userData = await userRes.json()

              return {
                ...response,
                username: userData.username ?? "Unknown User",
              }
            } catch (error) {
              console.error(`Failed to fetch user ${response.user_id}:`, error)
              return {
                ...response,
                username: "Unknown User",
                date: response.date,
              }
            }
          }),
        )

        setResponses(enhancedResponses)
      } catch (error) {
        console.error("Failed to fetch responses:", error)
      }
    }

    getAllResponses()
  }, [prompt])

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>sonder</Text>
          <Image source={{ uri: "https://via.placeholder.com/80" }} style={styles.profilePic} />
        </View>

        {/* Prompt */}
        <View style={styles.promptContainer}>
          <LinearGradient
            colors={["#2D0A5F", "#3B0F7D", "#4A1D9E"]}
            style={styles.gradientBackground}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          />
          <View style={styles.wavyOverlay} />
          <Text style={styles.prompt}>{prompt?.content || "Loading prompt..."}</Text>
        </View>

        {/* Tabs */}
        <View style={styles.tabs}>
          <TouchableOpacity onPress={() => setSelectedTab("trending")}>
            <Text style={[styles.tabText, selectedTab === "trending" && styles.activeTab]}>trending</Text>
          </TouchableOpacity>

          {/* <TouchableOpacity onPress={() => setSelectedTab("following")}>
            <Text style={[styles.tabText, selectedTab === "following" && styles.activeTab]}>following</Text>
          </TouchableOpacity> */}
        </View>

        {/* Post List */}
        <FlatList
          data={responses}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <Post
              responseId={item.id}
              username={item.username || `user_${item.user_id}`}
              text={item.content}
              likes={item.likes}
              date={new Date().toISOString()}
            />
          )}
          contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 12 }}
        />

        {/* Floating Add Button */}
        <TouchableOpacity style={styles.floatingButton}>
          <Link href="/answerprompt">
            <Ionicons name="add" size={32} color="white" />
          </Link>
        </TouchableOpacity>
      </SafeAreaView>
    </SafeAreaProvider>
  )
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
  promptContainer: {
    position: "relative",
    marginVertical: 24,
    marginHorizontal: 20,
    height: 180,
    borderRadius: 16,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#2D0A5F",
    shadowColor: "#2D0A5F",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 5,
  },
  gradientBackground: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  wavyOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.2)",
    opacity: 0.7,
    ...Platform.select({
      web: {
        backgroundImage: `
        linear-gradient(30deg, rgba(74, 29, 158, 0.7) 12%, transparent 12.5%, transparent 87%, rgba(74, 29, 158, 0.7) 87.5%, rgba(74, 29, 158, 0.7)),
        linear-gradient(150deg, rgba(74, 29, 158, 0.7) 12%, transparent 12.5%, transparent 87%, rgba(74, 29, 158, 0.7) 87.5%, rgba(74, 29, 158, 0.7)),
        linear-gradient(30deg, rgba(74, 29, 158, 0.7) 12%, transparent 12.5%, transparent 87%, rgba(74, 29, 158, 0.7) 87.5%, rgba(74, 29, 158, 0.7)),
        linear-gradient(150deg, rgba(74, 29, 158, 0.7) 12%, transparent 12.5%, transparent 87%, rgba(74, 29, 158, 0.7) 87.5%, rgba(74, 29, 158, 0.7)),
        linear-gradient(60deg, rgba(59, 15, 125, 0.6) 25%, transparent 25.5%, transparent 75%, rgba(59, 15, 125, 0.6) 75%, rgba(59, 15, 125, 0.6)),
        linear-gradient(60deg, rgba(66, 17, 139, 0.6) 25%, transparent 25.5%, transparent 75%, rgba(59, 15, 125, 0.6) 75%, rgba(59, 15, 125, 0.6))
      `,
        backgroundSize: "80px 140px",
        backgroundPosition: "0 0, 0 0, 40px 70px, 40px 70px, 0 0, 40px 70px",
      },
      default: {},
    }),
  },
  prompt: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    textAlign: "center",
    color: "#ffffff",
    fontSize: 26,
    fontFamily: "JosefinSans-Bold",
    paddingHorizontal: 24,
    paddingVertical: 20,
    letterSpacing: 0.5,
    lineHeight: 34,
    textShadowColor: "rgba(0, 0, 0, 0.7)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
    zIndex: 10,
    justifyContent: "center",
    alignItems: "center",
    display: "flex",
  },
  tabs: {
    flexDirection: "row",
    justifyContent: "center",
    paddingBottom: 12,
    marginBottom: 8,
    marginHorizontal: 40,
  },
  tabText: {
    color: "#9ca3af",
    fontSize: 18,
    fontFamily: "JosefinSans-Regular",
    paddingHorizontal: 24,
    paddingVertical: 8,
  },
  activeTab: {
    color: "#ffffff",
    borderBottomWidth: 2,
    borderBottomColor: "#4A1D9E",
  },
  floatingButton: {
    position: "absolute",
    bottom: 24,
    right: 24,
    backgroundColor: "#2D0A5F",
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    elevation: 8,
    shadowColor: "#2D0A5F",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 8,
  },
})
