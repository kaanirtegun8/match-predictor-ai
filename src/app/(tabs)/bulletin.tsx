import { useCallback, useEffect, useState } from 'react';
import { RefreshControl, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';

import { FilterBar, LeagueSection, ThemedText, ThemedView } from '../../components';
import { Competition, Match } from '../../models';
import { getWeeklyMatches } from '../../services/footballApi';

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
  const [allMatches, setAllMatches] = useState<Match[]>([]);
  const [matches, setMatches] = useState<Match[]>([]);
  const [competitions, setCompetitions] = useState<Competition[]>([]);
  const [selectedCompetition, setSelectedCompetition] = useState<Competition | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (selectedCompetition) {
      setMatches(allMatches.filter(match => match.competition.id === selectedCompetition.id));
    } else {
      setMatches(allMatches);
    }
  }, [selectedCompetition, allMatches]);

  const loadMatches = useCallback(async () => {
    try {
      setLoading(true);
      const today = new Date();
      const nextWeek = new Date(today);
      nextWeek.setDate(today.getDate() + 7);

      const dateFrom = today.toISOString().split('T')[0];
      const dateTo = nextWeek.toISOString().split('T')[0];

      const weeklyMatches = await getWeeklyMatches(dateFrom, dateTo);

      // Filter matches to only show TIMED matches
      const timedMatches = weeklyMatches.matches.filter(match =>
        match.status === 'TIMED' || match.status === 'SCHEDULED'
      );

      // Extract unique competitions from TIMED matches only
      const uniqueCompetitions = Array.from(
        new Map(timedMatches.map((match: Match) => [match.competition.id, match.competition])).values()
      ) as Competition[];
      setCompetitions(uniqueCompetitions);

      setAllMatches(timedMatches);
      setMatches(timedMatches);
    } catch (error) {
      console.error('Error loading matches:', error);
      setAllMatches([]);
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

  const groupedMatches = groupMatchesByLeague(matches);

  if (loading) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <ThemedView style={styles.loadingContainer}>
          <ThemedText>Loading matches...</ThemedText>
        </ThemedView>
      </SafeAreaView>
    );
  }

  return (
    <ScrollView
      style={styles.content}
      contentContainerStyle={styles.scrollContent}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }>
      <FilterBar
        competitions={competitions}
        selectedCompetition={selectedCompetition}
        onCompetitionSelect={setSelectedCompetition}
      />
      {Object.entries(groupedMatches).map(([leagueId, leagueMatches]) => (
        <LeagueSection
          key={leagueId}
          matches={leagueMatches}
        />
      ))}
      {matches.length === 0 && (
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
    backgroundColor: '#f5f5f5',
  },
  content: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollContent: {
    paddingBottom: 20,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
  },
}); 