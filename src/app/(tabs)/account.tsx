import { View, Text, StyleSheet } from 'react-native';
import { AuthButton } from '@/components/auth';
import { useAuth } from '@/hooks/useAuth';

export default function AccountScreen() {
  const { signOut, user } = useAuth();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>My Profile</Text>
      <Text style={styles.email}>{user?.email}</Text>
      
      <View style={styles.buttonContainer}>
        <AuthButton
          title="Sign Out"
          onPress={signOut}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  email: {
    fontSize: 16,
    color: '#666',
    marginBottom: 30,
  },
  buttonContainer: {
    marginTop: 'auto',
  },
}); 