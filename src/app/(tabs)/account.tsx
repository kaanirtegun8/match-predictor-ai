import React, { useEffect } from 'react';
import { StyleSheet, TouchableOpacity, Alert, Switch, ScrollView, ActivityIndicator, TextInput, Linking } from 'react-native';
import { AuthButton } from '@/components/auth';
import { useAuth } from '@/hooks/useAuth';
import { SubscriptionInfo } from '@/components/SubscriptionInfo';
import { ThemeToggle } from '@/components/ThemeToggle';
import { ThemedView } from '@/components/themed/ThemedView';
import { ThemedText } from '@/components/themed/ThemedText';
import { useTheme } from '@/contexts/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import { useSubscription } from '@/contexts/SubscriptionContext';
import { useStats } from '@/hooks/useStats';
import { auth } from '@/config/firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { LanguageSelector } from '@/components/LanguageSelector';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'expo-router';
import { Dimensions, Platform } from 'react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const isIPad = Platform.OS === 'ios' && SCREEN_WIDTH >= 768;

export default function AccountScreen() {
  const { signOut, user, deleteAccount } = useAuth();
  const { isDark, toggleTheme, isPremiumTheme, togglePremiumTheme } = useTheme();
  const { isSubscribed, checkStatus } = useSubscription();
  const { stats, loading } = useStats();
  const { colors } = useTheme();
  const { t, i18n } = useTranslation();
  const router = useRouter();

  // Format creation date based on current language
  const memberSince = user?.metadata.creationTime 
    ? new Date(user.metadata.creationTime).toLocaleDateString(
        i18n.language === 'tr' ? 'tr-TR' : 'en-GB', 
        {
          day: 'numeric',
          month: 'long',
          year: 'numeric'
        }
      )
    : t('common.notAvailable');

  const handleDeleteAccount = () => {
    Alert.alert(
      t('accountManagement.deleteAccount'),
      t('accountManagement.deleteConfirmation'),
      [
        {
          text: t('common.cancel'),
          style: "cancel"
        },
        {
          text: t('accountManagement.continue'),
          style: "destructive",
          onPress: () => {
            // Show password prompt
            Alert.prompt(
              t('accountManagement.confirmPassword'),
              t('accountManagement.enterPassword'),
              [
                {
                  text: t('common.cancel'),
                  style: "cancel"
                },
                {
                  text: t('accountManagement.deleteAccount'),
                  style: "destructive",
                  onPress: async (password) => {
                    if (!password) {
                      Alert.alert(t('common.error'), t('accountManagement.passwordRequired'));
                      return;
                    }
                    try {
                      // Re-authenticate and delete
                      if (user?.email) {
                        await signInWithEmailAndPassword(auth, user.email, password);
                        await deleteAccount();
                      }
                    } catch (error) {
                      Alert.alert(t('common.error'), t('accountManagement.invalidPassword'));
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
    <ScrollView style={[styles.container, { backgroundColor: colors.border }]}>
      {/* User Info Section */}
      <ThemedView style={[styles.section, { backgroundColor: colors.background }]}>
        <Ionicons name="person-circle-outline" size={isIPad ? 160 : 80} color={colors.primary} />
        <ThemedText style={[styles.email, { color: colors.text }]}>{user?.email}</ThemedText>
        <ThemedText style={[styles.memberSince, { color: colors.textSecondary }]}>
          {t('settings.memberSince')} {memberSince}
        </ThemedText>
        <ThemedView style={[
          styles.badge, 
          { backgroundColor: isSubscribed ? colors.primary : colors.textSecondary }
        ]}>
          <ThemedText style={styles.badgeText}>
            {isSubscribed ? t('settings.accountType.premium') : t('settings.accountType.free')}
          </ThemedText>
        </ThemedView>
      </ThemedView>

      {/* Statistics Section */}
      <ThemedView style={[styles.section, { backgroundColor: colors.background }]}>
        <ThemedText style={[styles.sectionTitle, { color: colors.primary }]}>
          {t('navigation.titles.myProfile')}
        </ThemedText>
        <ThemedView style={[styles.statsGrid, { backgroundColor: colors.background }]}>
          {loading ? (
            <ActivityIndicator size="large" color={colors.primary} />
          ) : (
            <>
              {/* Total Analyses */}
              <ThemedView style={[styles.statCard, { backgroundColor: colors.border }]}>
                <Ionicons name="analytics-outline" size={isIPad ? 48 : 24} color={colors.primary} />
                <ThemedText style={[styles.statNumber, { color: colors.text }]}>{stats.totalMatches}</ThemedText>
                <ThemedText style={[styles.statLabel, { color: colors.textSecondary }]}>{t('stats.totalAnalyses')}</ThemedText>
              </ThemedView>

              {/* Monthly Analyses */}
              <ThemedView style={[styles.statCard, { backgroundColor: colors.border }]}>
                <Ionicons name="calendar-outline" size={isIPad ? 48 : 24} color={colors.primary} />
                <ThemedText style={[styles.statNumber, { color: colors.text }]}>{stats.monthlyMatches}</ThemedText>
                <ThemedText style={[styles.statLabel, { color: colors.textSecondary }]}>{t('stats.thisMonth')}</ThemedText>
              </ThemedView>

              {/* Most Active League */}
              <ThemedView style={[styles.statCard, { backgroundColor: colors.border }]}>
                <Ionicons name="trophy-outline" size={isIPad ? 48 : 24} color={colors.primary} />
                <ThemedText style={[styles.statNumber, { color: colors.text }]}>{stats.mostActiveLeague}</ThemedText>
                <ThemedText style={[styles.statLabel, { color: colors.textSecondary }]}>{t('stats.mostActive')}</ThemedText>
              </ThemedView>
            </>
          )}
        </ThemedView>
      </ThemedView>

      {/* Subscription Section */}
      <ThemedView style={styles.section}>
        <ThemedText style={[styles.sectionTitle, { color: colors.primary }]}>{t('settings.subscription')}</ThemedText>
        <SubscriptionInfo />
      </ThemedView>

      {/* Preferences Section */}
      <ThemedView style={[styles.section, {backgroundColor: colors.background}]}>
        <ThemedText style={[styles.sectionTitle, {color: colors.primary}]}>{t('settings.title')}</ThemedText>
        
        {/* Language Selector */}
        <LanguageSelector />

        {/* Theme Toggle */}
        <TouchableOpacity 
          style={[styles.themeToggle, {backgroundColor: colors.border}]} 
          onPress={toggleTheme}
          activeOpacity={0.7}>
          <ThemedView style={styles.themeInfo}>
            <Ionicons 
              name={isDark ? "moon" : "sunny"} 
              size={isIPad ? 48 : 24} 
              color={isDark ? "#fbbf24" : "#f59e0b"} 
            />
            <ThemedText style={[styles.themeText, {color: colors.text}]}>
              {t('settings.theme')}
            </ThemedText>
          </ThemedView>
          <Switch
            value={isDark}
            onValueChange={toggleTheme}
            trackColor={{ false: '#d1d5db', true: colors.background }}
            thumbColor={colors.primary}
          />
        </TouchableOpacity>

        {/* Premium Theme Toggle */}
        <TouchableOpacity 
          style={[
            styles.themeToggle, 
            {
              backgroundColor: colors.border, 
              marginTop: 8,
              opacity: isSubscribed ? 1 : 0.8
            }
          ]} 
          onPress={() => {
            if (isSubscribed) {
              togglePremiumTheme();
            } else {
              router.push('/premium');
            }
          }}
          activeOpacity={0.7}>
          <ThemedView style={styles.themeInfo}>
            <Ionicons 
              name="star" 
              size={isIPad ? 48 : 24} 
              color="#FFD700" 
            />
            <ThemedText style={[styles.themeText, {color: colors.text}]}>
              {t('premium.premiumToggleText')}
            </ThemedText>
            {!isSubscribed && (
              <ThemedView style={styles.premiumBadge}>
                <ThemedText style={styles.premiumBadgeText}>PRO</ThemedText>
              </ThemedView>
            )}
          </ThemedView>
          <Switch
            value={isSubscribed && isPremiumTheme}
            onValueChange={() => {
              if (isSubscribed) {
                togglePremiumTheme();
              } else {
                router.push('/premium');
              }
            }}
            trackColor={{ false: '#d1d5db', true: colors.background }}
            thumbColor="#FFD700"
          />
        </TouchableOpacity>
        
        {/* Terms of Use */}
        <TouchableOpacity 
          style={[styles.themeToggle, {backgroundColor: colors.border, marginTop: 8}]} 
          onPress={() => Linking.openURL('https://furkandursun947.github.io/match-predictor-legal/terms')}
          activeOpacity={0.7}>
          <ThemedView style={styles.themeInfo}>
            <Ionicons 
              name="document-text-outline" 
              size={isIPad ? 48 : 24} 
              color={colors.primary} 
            />
            <ThemedText style={[styles.themeText, {color: colors.text}]}>
              {t('settings.termsOfUse') || 'Terms of Use'}
            </ThemedText>
          </ThemedView>
          <Ionicons name="chevron-forward" size={isIPad ? 32 : 20} color={colors.textSecondary} />
        </TouchableOpacity>
        
        {/* Privacy Policy */}
        <TouchableOpacity 
          style={[styles.themeToggle, {backgroundColor: colors.border, marginTop: 8}]} 
          onPress={() => Linking.openURL('https://furkandursun947.github.io/match-predictor-legal/privacy')}
          activeOpacity={0.7}>
          <ThemedView style={styles.themeInfo}>
            <Ionicons 
              name="shield-outline" 
              size={isIPad ? 48 : 24} 
              color={colors.primary} 
            />
            <ThemedText style={[styles.themeText, {color: colors.text}]}>
              {t('settings.privacyPolicy') || 'Privacy Policy'}
            </ThemedText>
          </ThemedView>
          <Ionicons name="chevron-forward" size={isIPad ? 32 : 20} color={colors.textSecondary} />
        </TouchableOpacity>
      </ThemedView>

      {/* Account Management Section */}
      <ThemedView style={[styles.section, {backgroundColor: colors.background}]}>
        <ThemedText style={[styles.sectionTitle, {color: colors.primary}]}>{t('accountManagement.title')}</ThemedText>
        
        {/* Delete Account Button */}
        <TouchableOpacity 
          style={[styles.button, styles.deleteButton, {backgroundColor: colors.error}]} 
          onPress={handleDeleteAccount}>
          <Ionicons name="trash-outline" size={isIPad ? 48 : 24} color="#fff" />
          <ThemedText style={[styles.buttonText, styles.deleteButtonText]}>
            {t('accountManagement.deleteAccount')}
          </ThemedText>
        </TouchableOpacity>

        {/* Sign Out Button */}
        <TouchableOpacity 
          style={[styles.button, {backgroundColor: colors.border}]} 
          onPress={signOut}>
          <Ionicons name="log-out-outline" size={isIPad ? 48 : 24} color={colors.text}/>
          <ThemedText style={[styles.buttonText, {color: colors.text}]}>{t('auth.signOut')}</ThemedText>
        </TouchableOpacity>
      </ThemedView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: isIPad ? 20 : 16,
  },
  section: {
    borderRadius: 12,
    padding: isIPad ? 32 : 16,
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
    fontSize: isIPad ? 32 : 16,
    marginTop: 8,
    marginBottom: 8,
    color: '#666',
  },
  memberSince: {
    fontSize: isIPad ? 24 : 16,
    color: '#666',
    marginTop: 4,
    marginBottom: 8,
    opacity: 0.6,
  },
  badge: {
    paddingHorizontal: isIPad ? 16 : 12,
    paddingVertical: isIPad ? 8 : 4,
    borderRadius: 12,
  },
  badgeText: {
    color: '#fff',
    fontSize: isIPad ? 24 : 12,
    fontWeight: '600',
  },
  sectionTitle: {
    fontSize: isIPad ? 32 : 18,
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
    padding: isIPad ? 32 : 16,
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
    fontSize: isIPad ? 32 : 16,
    fontWeight: '700',
    color: '#1f2937',
    marginTop: 8,
    marginBottom: 4,
    textAlign: 'center',
  },
  statLabel: {
    fontSize: isIPad ? 24 : 12,
    color: '#6b7280',
    textAlign: 'center',
  },
  themeToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#f5f5f5',
    padding: isIPad ? 16 : 12,
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
    fontSize: isIPad ? 32 : 16,
    color: '#666',
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    padding: isIPad ? 16 : 12,
    borderRadius: 8,
    width: '100%',
    marginBottom: isIPad ? 16 : 8,
  },
  buttonText: {
    marginLeft: 8,
    fontSize: isIPad ? 32 : 16,
    color: '#666',
  },
  deleteButton: {
    marginTop: 8,
  },
  deleteButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  premiumBadge: {
    backgroundColor: '#FFD700',
    paddingHorizontal: isIPad ? 16 : 6,
    paddingVertical: isIPad ? 8 : 2,
    borderRadius: 4,
    marginLeft: 8,
  },
  premiumBadgeText: {
    color: '#000',
    fontSize: isIPad ? 24 :   10,
    fontWeight: '600',
  },
}); 