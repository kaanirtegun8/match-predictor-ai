import { useCallback, useEffect, useState } from 'react';
import { RefreshControl, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FilterBar, LeagueSection, ThemedText, ThemedView } from '../../components';
import { Match } from '../../models/Match';
import { getDailyBulletin } from '../../services/bulletinService';
import { useTheme } from '@/contexts/ThemeContext';
import { Colors } from '@/constants/Colors';

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
  const { isDark } = useTheme();
  const colors = isDark ? Colors.dark : Colors.light;
  const [matches, setMatches] = useState<Match[]>([]);
  const [selectedCompetition, setSelectedCompetition] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

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
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
        <ThemedView style={styles.loadingContainer}>
          <ThemedText>Loading matches...</ThemedText>
        </ThemedView>
      </SafeAreaView>
    );
  }

  return (
    <ScrollView
      style={[styles.content, { backgroundColor: colors.background }]}
      contentContainerStyle={[styles.scrollContent, { backgroundColor: colors.background }]}
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
      {Object.entries(groupedMatches).map(([leagueId, leagueMatches]) => (
        <LeagueSection
          key={leagueId}
          matches={leagueMatches}
        />
      ))}
      {filteredMatches.length === 0 && (
        <ThemedView style={styles.emptyContainer}>
          <ThemedText style={styles.emptyText}>
            No matches found
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