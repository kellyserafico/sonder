import { View, Text, StyleSheet, Image, TouchableOpacity, FlatList } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState, useEffect } from 'react';
import { Ionicons } from '@expo/vector-icons';
import Post from "../../components/feed/Post"

const posts = [
  { id: '1', username: 'sjdklf', text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.' },
  { id: '2', username: 'sjdklf', text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.' },
  { id: '3', username: 'sjdklf', text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.' },
  { id: '4', username: 'sjdklf', text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.' },
];





export default function FeedScreen() {
  const [selectedTab, setSelectedTab] = useState('trending');
  const [prompt, setPrompt] = useState('trending');


  //get the prompts
  useEffect(()=>{
    async function getCurrentPrompt() {
      try {
        const res = await fetch('http://localhost:8000/prompt/current');
        const data = await res.json();
        setPrompt(data[0].content);
        console.log("DATA",data);
      } catch (error) {
        console.error('Failed to fetch prompts:', error);
      }

    }

    getCurrentPrompt();

  },[])

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>sonder</Text>
          <Image
            source={{ uri: 'https://via.placeholder.com/80' }}
            style={styles.profilePic}
          />
        </View>

        {/* Prompt */}
        <TouchableOpacity>
          <Text style={styles.prompt}>{prompt}</Text>
        </TouchableOpacity>

        {/* Tabs */}
        <View style={styles.tabs}>
          <TouchableOpacity onPress={() => setSelectedTab('trending')}>
            <Text style={[styles.tabText, selectedTab === 'trending' && styles.activeTab]}>
              trending
            </Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => setSelectedTab('following')}>
            <Text style={[styles.tabText, selectedTab === 'following' && styles.activeTab]}>
              following
            </Text>
          </TouchableOpacity>
        </View>

        {/* Post List */}
        <FlatList
          data={posts}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <Post username={item.username} text={item.text} />}
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
    backgroundColor: '#000000',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginTop: 8,
  },
  title: {
    fontFamily: 'JosefinSans-Bold',
    fontSize: 32,
    color: '#ffffff',
    fontWeight: '700',
  },
  profilePic: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#ccc',
  },
  prompt: {
    textAlign: 'center',
    color: '#ffffff',
    fontSize: 18,
    fontFamily: 'JosefinSans-Regular',
    marginTop: 16,
    marginBottom: 16,
    textDecorationLine: 'underline',
  },
  tabs: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderBottomColor: '#ffffff',
    borderBottomWidth: 1,
    paddingBottom: 8,
  },
  tabText: {
    color: '#ffffff',
    fontSize: 18,
    fontFamily: 'JosefinSans-Regular',
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#C084FC',
  },
  floatingButton: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    backgroundColor: '#6F31EC',
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
  },
});
