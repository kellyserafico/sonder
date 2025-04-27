
import { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TextInput, FlatList, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';

// const mockUsers = [
//   { id: '1', username: 'sonderdreams', profileImage: 'https://via.placeholder.com/50' },
//   { id: '2', username: 'wanderer', profileImage: 'https://via.placeholder.com/50' },
//   { id: '3', username: 'lostandfound', profileImage: 'https://via.placeholder.com/50' },
//   { id: '4', username: 'johndoe', profileImage: 'https://via.placeholder.com/50' },
// ];

// Define the user type (TypeScript)
interface User {
  id: number;  // or string if your backend sends string
  username: string;
  profileImage?: string;  // optional in case not all users have one
}

export default function Search() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchUsers = async () => {
      if (searchQuery.trim() === '') {
        setFilteredUsers([]);  // Clear if input is empty
        return;
      }
      try {
        setLoading(true);
        const response = await fetch(`http://YOUR_BACKEND_URL/search/username/${searchQuery}`); 
        if (!response.ok) {
          throw new Error('Failed to fetch users');
        }
        const data: User[] = await response.json();
        setFilteredUsers(data);
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
