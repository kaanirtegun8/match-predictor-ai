import { View, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ThemedText } from '@/components/themed/ThemedText';
import { ThemedView } from '@/components/themed/ThemedView';
import { useTheme } from '@/contexts/ThemeContext';
import { Colors } from '@/constants/Colors';
import { useSubscription } from '@/hooks/useSubscription';

export default function SubscriptionDetailsScreen() {
  const { isDark } = useTheme();
  const colors = isDark ? Colors.dark : Colors.light;
  const { customerInfo, cancelSubscription } = useSubscription();
  console.log(customerInfo)

  const handleCancelSubscription = () => {
    Alert.alert(
      'Cancel Auto-Renewal',
      'Your subscription will continue until the end of the current period. Would you like to turn off auto-renewal? You will navigate to the subscriptions management page to cancel.',
      [
        {
          text: 'No, Keep It',
          style: 'cancel',
        },
        {
          text: 'Yes, Turn Off',
          style: 'destructive',
          onPress: () => {
            cancelSubscription();
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]} edges={['top']}>
      <ThemedView style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.closeButton} 
            onPress={() => router.back()}>
            <Ionicons name="close" size={24} color={colors.text} />
          </TouchableOpacity>
          <ThemedText style={styles.headerTitle}>Subscription Details</ThemedText>
        </View>

        {/* Content */}
        <ThemedView style={[styles.content, { borderColor: colors.border }]}>
          <View style={styles.statusContainer}>
            <ThemedView style={[styles.badge, { backgroundColor: colors.primary + '20' }]}>
              <ThemedText style={[styles.badgeText, { color: colors.primary }]}>
                Active Subscription
              </ThemedText>
            </ThemedView>
          </View>

          <View style={styles.detailsContainer}>
            <DetailItem 
              label="Start Date" 
              value={new Date(customerInfo?.originalPurchaseDate || '').toLocaleDateString()}
              icon="calendar-outline"
            />
            <DetailItem 
              label="Next Billing Date" 
              value={new Date(customerInfo?.latestExpirationDate || '').toLocaleDateString()}
              icon="calendar"
            />
            <DetailItem 
              label="Subscription Plan" 
              value={'Premium'}
              icon="star"
            />
          </View>

          <TouchableOpacity
            style={[styles.cancelButton, { borderColor: colors.error }]}
            onPress={handleCancelSubscription}>
            <Ionicons name="close-circle-outline" size={20} color={colors.error} />
            <ThemedText style={[styles.cancelButtonText, { color: colors.error }]}>
              Cancel Auto-Renewal
            </ThemedText>
          </TouchableOpacity>
        </ThemedView>
      </ThemedView>
    </SafeAreaView>
  );
}

function DetailItem({ label, value, icon }: { label: string; value: string; icon: string }) {
  const { isDark } = useTheme();
  const colors = isDark ? Colors.dark : Colors.light;

  return (
    <View style={[styles.detailItem, { borderBottomColor: colors.border }]}>
      <View style={styles.detailIcon}>
        <Ionicons name={icon as any} size={20} color={colors.primary} />
      </View>
      <View style={styles.detailText}>
        <ThemedText style={styles.detailLabel}>{label}</ThemedText>
        <ThemedText style={[styles.detailValue, { color: colors.textSecondary }]}>
          {value}
        </ThemedText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  closeButton: {
    position: 'absolute',
    left: 16,
    padding: 8,
  },
  content: {
    flex: 1,
    margin: 16,
    borderRadius: 12,
    borderWidth: 1,
    overflow: 'hidden',
  },
  statusContainer: {
    padding: 16,
    alignItems: 'center',
  },
  badge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  badgeText: {
    fontSize: 14,
    fontWeight: '600',
  },
  detailsContainer: {
    paddingHorizontal: 16,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  detailIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  detailText: {
    flex: 1,
    marginLeft: 12,
  },
  detailLabel: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  detailValue: {
    fontSize: 14,
  },
  cancelButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    marginTop: 24,
    marginHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1,
    gap: 8,
  },
  cancelButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
}); 