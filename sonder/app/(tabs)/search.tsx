import { useState } from 'react';
import { StyleSheet, View, Text, TextInput, FlatList, TouchableOpacity, Image } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';

const mockUsers = [
  { id: '1', username: 'sonderdreams', profileImage: 'https://via.placeholder.com/50' },
  { id: '2', username: 'wanderer', profileImage: 'https://via.placeholder.com/50' },
  { id: '3', username: 'lostandfound', profileImage: 'https://via.placeholder.com/50' },
  { id: '4', username: 'johndoe', profileImage: 'https://via.placeholder.com/50' },
];

export default function Search() {
  const [searchQuery, setSearchQuery] = useState('');

  // Filter users based on search input
  const filteredUsers = mockUsers.filter(user =>
    user.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <SafeAreaProvider>
      <LinearGradient colors={['#000000', '#221C2D']} style={styles.gradient}>
        <SafeAreaView style={styles.container}>
          {/* Search Input */}
          <TextInput
            style={styles.searchInput}
            placeholder="Search users..."
            placeholderTextColor="#aaa"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />

          {/* Results */}
          <FlatList
            data={filteredUsers}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity style={styles.userItem}>
                <Image source={{ uri: item.profileImage }} style={styles.profileImage} />
                <Text style={styles.username}>@{item.username}</Text>
              </TouchableOpacity>
            )}
            ListEmptyComponent={
              <Text style={styles.noResults}>No users found.</Text>
            }
            contentContainerStyle={{ marginTop: 20 }}
          />
        </SafeAreaView>
      </LinearGradient>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 24,
  },
  searchInput: {
    backgroundColor: '#e0e0e0',
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 16,
    fontSize: 16,
    fontFamily: 'JosefinSans-Regular',
    color: '#000',
  },
  userItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomColor: '#444',
    borderBottomWidth: 1,
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  username: {
    color: '#fff',
    fontSize: 18,
    fontFamily: 'JosefinSans-Regular',
  },
  noResults: {
    marginTop: 32,
    textAlign: 'center',
    color: '#aaa',
    fontFamily: 'JosefinSans-Regular',
    fontSize: 16,
  },
});
