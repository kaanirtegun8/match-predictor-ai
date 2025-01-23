import { StyleSheet, TouchableOpacity, Alert, Switch, ScrollView, ActivityIndicator, TextInput } from 'react-native';
import { AuthButton } from '@/components/auth';
import { useAuth } from '@/hooks/useAuth';
import { SubscriptionInfo } from '@/components/SubscriptionInfo';
import { ThemeToggle } from '@/components/ThemeToggle';
import { ThemedView } from '@/components/themed/ThemedView';
import { ThemedText } from '@/components/themed/ThemedText';
import { useTheme } from '@/contexts/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import { useSubscription } from '@/hooks/useSubscription';
import { useStats } from '@/hooks/useStats';
import { auth } from '@/config/firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';

export default function AccountScreen() {
  const { signOut, user, deleteAccount } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const { isSubscribed } = useSubscription();
  const { stats, loading } = useStats();

  // Format creation date
  const memberSince = user?.metadata.creationTime 
    ? new Date(user.metadata.creationTime).toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      })
    : 'N/A';

  const handleDeleteAccount = () => {
    Alert.alert(
      "Delete Account",
      "This action cannot be undone. Please enter your password to confirm.",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Continue",
          style: "destructive",
          onPress: () => {
            // Show password prompt
            Alert.prompt(
              "Confirm Password",
              "Please enter your password to delete your account",
              [
                {
                  text: "Cancel",
                  style: "cancel"
                },
                {
                  text: "Delete Account",
                  style: "destructive",
                  onPress: async (password) => {
                    if (!password) {
                      Alert.alert("Error", "Password is required");
                      return;
                    }
                    try {
                      // Re-authenticate and delete
                      if (user?.email) {
                        await signInWithEmailAndPassword(auth, user.email, password);
                        await deleteAccount();
                      }
                    } catch (error) {
                      Alert.alert("Error", "Invalid password or something went wrong. Please try again.");
                    }
                  }
                }
              ],
              "secure-text"
            );
          }
        }
      ]
    );
  };

  return (
    <ScrollView style={styles.container}>
      {/* User Info Section */}
      <ThemedView style={styles.section}>
        <Ionicons name="person-circle-outline" size={80} color="#1282A2" />
        <ThemedText style={styles.email}>{user?.email}</ThemedText>
        <ThemedText style={styles.memberSince}>Member since {memberSince}</ThemedText>
        <ThemedView style={[
          styles.badge, 
          { backgroundColor: isSubscribed ? '#FFD700' : '#6b7280' }
        ]}>
          <ThemedText style={styles.badgeText}>
            {isSubscribed ? 'Premium' : 'Free'}
          </ThemedText>
        </ThemedView>
      </ThemedView>

      {/* Statistics Section */}
      <ThemedView style={styles.section}>
        <ThemedText style={styles.sectionTitle}>Statistics</ThemedText>
        <ThemedView style={styles.statsGrid}>
          {loading ? (
            <ActivityIndicator size="large" color="#FFD700" />
          ) : (
            <>
              {/* Total Analyses */}
              <ThemedView style={styles.statCard}>
                <Ionicons name="analytics-outline" size={24} color="#FFD700" />
                <ThemedText style={styles.statNumber}>{stats.totalMatches}</ThemedText>
                <ThemedText style={styles.statLabel}>Total Analyses</ThemedText>
              </ThemedView>

              {/* Monthly Analyses */}
              <ThemedView style={styles.statCard}>
                <Ionicons name="calendar-outline" size={24} color="#FFD700" />
                <ThemedText style={styles.statNumber}>{stats.monthlyMatches}</ThemedText>
                <ThemedText style={styles.statLabel}>This Month</ThemedText>
              </ThemedView>

              {/* Most Active League */}
              <ThemedView style={styles.statCard}>
                <Ionicons name="trophy-outline" size={24} color="#FFD700" />
                <ThemedText style={styles.statNumber}>{stats.mostActiveLeague}</ThemedText>
                <ThemedText style={styles.statLabel}>Most Active</ThemedText>
              </ThemedView>
            </>
          )}
        </ThemedView>
      </ThemedView>

      {/* Subscription Section */}
      <ThemedView style={styles.section}>
        <ThemedText style={styles.sectionTitle}>Subscription</ThemedText>
        <SubscriptionInfo />
      </ThemedView>

      {/* Preferences Section */}
      <ThemedView style={styles.section}>
        <ThemedText style={styles.sectionTitle}>Preferences</ThemedText>
        
        {/* Theme Toggle */}
        <TouchableOpacity 
          style={styles.themeToggle} 
          onPress={toggleTheme}
          activeOpacity={0.7}>
          <ThemedView style={styles.themeInfo}>
            <Ionicons 
              name={isDark ? "moon" : "sunny"} 
              size={24} 
              color={isDark ? "#fbbf24" : "#f59e0b"} 
            />
            <ThemedText style={styles.themeText}>
              {isDark ? 'Dark Mode' : 'Light Mode'}
            </ThemedText>
          </ThemedView>
          <Switch
            value={isDark}
            onValueChange={toggleTheme}
            trackColor={{ false: '#d1d5db', true: '#3b82f6' }}
            thumbColor={isDark ? '#1d4ed8' : '#9ca3af'}
          />
        </TouchableOpacity>
      </ThemedView>

      {/* Account Management Section */}
      <ThemedView style={styles.section}>
        <ThemedText style={styles.sectionTitle}>Account Management</ThemedText>
        
        {/* Sign Out Button */}
        <TouchableOpacity 
          style={styles.button} 
          onPress={signOut}>
          <Ionicons name="log-out-outline" size={24} color="#666" />
          <ThemedText style={styles.buttonText}>Sign Out</ThemedText>
        </TouchableOpacity>

        {/* Delete Account Button */}
        <TouchableOpacity 
          style={[styles.button, styles.deleteButton]} 
          onPress={handleDeleteAccount}>
          <Ionicons name="trash-outline" size={24} color="#fff" />
          <ThemedText style={[styles.buttonText, styles.deleteButtonText]}>
            Delete Account
          </ThemedText>
        </TouchableOpacity>
      </ThemedView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  section: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  email: {
    fontSize: 16,
    marginTop: 8,
    marginBottom: 8,
    color: '#666',
  },
  memberSince: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
    marginBottom: 8,
  },
  badge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
    color: '#1282A2',
    alignSelf: 'flex-start',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    width: '100%',
  },
  statCard: {
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    width: '31%',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  statNumber: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1f2937',
    marginTop: 8,
    marginBottom: 4,
    textAlign: 'center',
  },
  statLabel: {
    fontSize: 12,
    color: '#6b7280',
    textAlign: 'center',
  },
  themeToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#f5f5f5',
    padding: 12,
    borderRadius: 8,
    width: '100%',
  },
  themeInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  themeText: {
    marginLeft: 8,
    fontSize: 16,
    color: '#666',
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    padding: 12,
    borderRadius: 8,
    width: '100%',
    marginBottom: 8,
  },
  buttonText: {
    marginLeft: 8,
    fontSize: 16,
    color: '#666',
  },
  deleteButton: {
    backgroundColor: '#dc2626',
    marginTop: 16,
  },
  deleteButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
}); 