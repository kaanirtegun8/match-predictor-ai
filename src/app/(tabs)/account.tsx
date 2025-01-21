import { View, StyleSheet } from 'react-native';
import { AuthButton } from '@/components/auth';
import { useAuth } from '@/hooks/useAuth';
import { SubscriptionInfo } from '@/components/SubscriptionInfo';
import { ThemeToggle } from '@/components/ThemeToggle';
import { ThemedView } from '@/components/themed/ThemedView';
import { ThemedText } from '@/components/themed/ThemedText';
import { useTheme } from '@/contexts/ThemeContext';

export default function AccountScreen() {
  const { signOut, user } = useAuth();
  const { isDark } = useTheme();

  return (
    <ThemedView style={styles.container}>
      <ThemedText style={styles.title}>My Profile</ThemedText>
      <ThemedText style={styles.email}>{user?.email}</ThemedText>
      
      <SubscriptionInfo />
      
      <ThemeToggle />
      
      <View style={styles.buttonContainer}>
        <AuthButton
          title="Sign Out"
          onPress={signOut}
        />
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  email: {
    fontSize: 16,
    marginBottom: 30,
  },
  buttonContainer: {
    marginTop: 'auto',
  },
}); 