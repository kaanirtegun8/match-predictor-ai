import { useCallback, useEffect, useState, useRef } from 'react';
import { RefreshControl, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FilterBar, LeagueSection, ThemedText, ThemedView } from '../../components';
import { Match } from '../../models/Match';
import { getDailyBulletin } from '../../services/bulletinService';
import { useTheme } from '@/contexts/ThemeContext';
import { Colors } from '@/constants/Colors';
import { useTranslation } from 'react-i18next';
import { useTutorial } from '@/components/tutorial/TutorialProvider';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';

const TUTORIAL_KEY = 'has_seen_bulletin_tutorial';

function groupMatchesByLeague(matches: Match[]): Record<string, Match[]> {
  return matches.reduce<Record<string, Match[]>>((acc, match) => {
    const leagueId = match.competition.id.toString();
    if (!acc[leagueId]) {
      acc[leagueId] = [];
    }
    acc[leagueId].push(match);
    return acc;
  }, {});
}

export default function BulletinScreen() {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const [matches, setMatches] = useState<Match[]>([]);
  const [selectedCompetition, setSelectedCompetition] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const firstMatchRef = useRef(null);
  const { startTutorial, skipTutorial } = useTutorial();

  const loadMatches = useCallback(async () => {
    try {
      setLoading(true);
      const bulletin = await getDailyBulletin();
      
      if (bulletin) {
        setMatches(bulletin.matches);
      } else {
        setMatches([]);
      }
    } catch (error) {
      console.error('Error loading matches:', error);
      setMatches([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadMatches();
  }, [loadMatches]);

  useEffect(() => {
    const startIfReady = async () => {
        const hasSeenTutorial = await AsyncStorage.getItem(TUTORIAL_KEY);
        if (hasSeenTutorial) return; 
    
        if (loading) return;
        if (!matches || matches.length === 0) return;
    
        if (!firstMatchRef.current) return;
    
        startTutorial([
          {
            targetRef: firstMatchRef,
            title: "Günlük Maç Bülteni",
            message: "Burada günün önemli maçlarını görebilir, detaylı analizlere ulaşabilirsiniz. Her maç kartına tıklayarak detaylı bilgilere erişebilirsiniz.",
            position: "bottom",
            onNext: async () => {
                skipTutorial();
                router.push(`/match/${matches[0].id}`);
                await AsyncStorage.setItem(TUTORIAL_KEY, 'true');
            },
            hasNextButton: true,
            hasFinishButton: false
          }
        ]);
      };
    
      startIfReady();
  }, [loading, matches, firstMatchRef.current]);


  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadMatches();
    setRefreshing(false);
  }, [loadMatches]);

  const filteredMatches = selectedCompetition
    ? matches.filter(match => match.competition.id.toString() === selectedCompetition)
    : matches;

  const competitions = Array.from(
    new Map(matches.map(match => [match.competition.id, match.competition])).values()
  );

  const groupedMatches = groupMatchesByLeague(filteredMatches);

  if (loading) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.border }]} edges={['top']}>
        <ThemedView style={styles.loadingContainer}>
          <ThemedText>{t('common.loading')}</ThemedText>
        </ThemedView>
      </SafeAreaView>
    );
  }

  return (
    <ScrollView
      style={[styles.content, { backgroundColor: colors.border }]}
      contentContainerStyle={[styles.scrollContent, { backgroundColor: colors.border }]}
      refreshControl={
        <RefreshControl 
          refreshing={refreshing} 
          onRefresh={onRefresh}
          tintColor={colors.text}
        />
      }>
      <FilterBar
        competitions={competitions}
        selectedCompetitionId={selectedCompetition}
        onCompetitionSelect={setSelectedCompetition}
      />
      {Object.entries(groupedMatches).map(([leagueId, leagueMatches], index) => (
        <LeagueSection
          key={leagueId}
          matches={leagueMatches}
          firstMatchRef={index === 0 ? firstMatchRef : undefined}
        />
      ))}
      {filteredMatches.length === 0 && (
        <ThemedView style={styles.emptyContainer}>
          <ThemedText style={styles.emptyText}>
            {t('matches.filter.noResults')}
          </ThemedText>
        </ThemedView>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 16,
  },
}); 