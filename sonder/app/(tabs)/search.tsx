import { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TextInput, FlatList, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';

// Mock user data
const mockUsers = [
  { id: '1', username: 'asuh10282', profileImage: 'https://via.placeholder.com/50' },
  { id: '2', username: 'HarryPotter10', profileImage: 'https://via.placeholder.com/50' },
  { id: '3', username: 'testuser', profileImage: 'https://via.placeholder.com/50' },
  { id: '4', username: 'CoolGuy123', profileImage: 'https://via.placeholder.com/50' },
];

// Define the user type (TypeScript)
interface User {
  id: string;  // ID is a string for mock data
  username: string;
  profileImage?: string;  // optional in case not all users have one
}

export default function Search() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filteredUsers, setFilteredUsers] = useState<User[]>(mockUsers); // Initially use mockUsers
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchUsers = async () => {
      if (searchQuery.trim() === '') {
        setFilteredUsers(mockUsers);  // Show all users if input is empty
        return;
      }
      try {
        setLoading(true);
        // Mock fetching users by filtering based on search query
        const filtered = mockUsers.filter((user) =>
          user.username.toLowerCase().includes(searchQuery.toLowerCase())
        );
        setFilteredUsers(filtered);
      } catch (error) {
        console.error('Error fetching users:', error);
        setFilteredUsers([]);
      } finally {
        setLoading(false);
      }
    };

    const delayDebounceFn = setTimeout(() => {
      fetchUsers();
    }, 500); // Debounce typing input (wait 500ms)

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

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

          {/* Loading or Results */}
          {loading ? (
            <ActivityIndicator size="large" color="#fff" style={{ marginTop: 20 }} />
          ) : (
            <FlatList
              data={filteredUsers}
              keyExtractor={(item) => item.id.toString()}
              keyboardShouldPersistTaps="handled"
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.userItem}
                  onPress={() => router.push({ pathname: '/viewprofile', params: { username: item.username } })}
                >
                  <Image
                    source={{ uri: item.profileImage || 'https://via.placeholder.com/50' }}
                    style={styles.profileImage}
                  />
                  <Text style={styles.username}>@{item.username}</Text>
                </TouchableOpacity>
              )}
              ListEmptyComponent={
                searchQuery.trim() !== '' && !loading ? (
                  <Text style={styles.noResults}>No users found.</Text>
                ) : null
              }
              contentContainerStyle={{ marginTop: 20 }}
            />
          )}
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
