import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, TouchableOpacity, ActivityIndicator, Image, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '../../components/themed/ThemedText';
import { ThemedView } from '../../components/themed/ThemedView';
import dateUtils from '../../utils/date';
import { Match } from '@/models/Match';
import { getMatchDetails } from '../../services/matchService';

function getTeamForm(matches: Match[], teamId: number): string[] {
  return matches
    .map(match => {
      const isHomeTeam = match.homeTeam.id === teamId;
      const homeScore = match.score?.fullTime.home ?? 0;
      const awayScore = match.score?.fullTime.away ?? 0;
      
      if (homeScore === awayScore) return 'D';
      if (isHomeTeam) {
        return homeScore > awayScore ? 'W' : 'L';
      }
      return awayScore > homeScore ? 'W' : 'L';
    })
    .reverse();
}

export default function MatchDetailScreen() {
  const { id } = useLocalSearchParams();
  const [match, setMatch] = useState<Match | null>(null);
  const [h2h, setH2h] = useState<Match[]>([]);
  const [homeTeamMatches, setHomeTeamMatches] = useState<Match[]>([]);
  const [awayTeamMatches, setAwayTeamMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  async function loadMatchData() {
    try {
      setLoading(true);
      const matchDetails = await getMatchDetails(id as string);
      
      if (matchDetails) {
        setMatch(matchDetails.details);
        setH2h(matchDetails.h2h);
        setHomeTeamMatches(matchDetails.homeRecentMatches);
        setAwayTeamMatches(matchDetails.awayRecentMatches);
      }
    } catch (error) {
      console.error('Error loading match data:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  useEffect(() => {
    if (id) {
      loadMatchData();
    }
  }, [id]);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    loadMatchData();
  }, [id]);

  const homeTeamForm = getTeamForm(homeTeamMatches, match?.homeTeam.id ?? 0);
  const awayTeamForm = getTeamForm(awayTeamMatches, match?.awayTeam.id ?? 0);

  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <ThemedView style={[styles.container, styles.centerContent]}>
          <ActivityIndicator size="large" color="#1282A2" />
          <ThemedText style={styles.loadingText}>Loading match details...</ThemedText>
        </ThemedView>
      </SafeAreaView>
    );
  }

  if (!match) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <ThemedView style={[styles.container, styles.centerContent]}>
          <ThemedText style={styles.errorText}>Match not found</ThemedText>
          <TouchableOpacity 
            style={styles.retryButton}
            onPress={() => router.push(`/match/${id}`)}>
            <ThemedText style={styles.retryButtonText}>Retry</ThemedText>
          </TouchableOpacity>
        </ThemedView>
      </SafeAreaView>
    );
  }

  const matchDate = new Date(match.utcDate ?? match.kickoff);
  const formattedDate = matchDate.toLocaleDateString('en-GB', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  const isLive = match.status === 'IN_PLAY' || match.status === 'PAUSED';
  const isFinished = match.status === 'FINISHED';

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView 
        style={styles.scrollView}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
          />
        }>
        <ThemedView style={styles.container}>
          {/* Header */}
          <ThemedView style={styles.header}>
            <TouchableOpacity 
              style={styles.backButton} 
              onPress={() => router.back()}>
              <Ionicons name="chevron-back" size={24} color="#000" />
              <ThemedText style={styles.backText}>Back</ThemedText>
            </TouchableOpacity>
          </ThemedView>

          {/* Competition Info */}
          <TouchableOpacity 
            style={styles.competitionInfoSimple}
            onPress={() => router.push(`/standings/${match.competition.id}?homeTeamId=${match.homeTeam.id}&awayTeamId=${match.awayTeam.id}`)}>
            <Image
              source={{ uri: match.competition.emblem }}
              style={styles.competitionLogo}
              resizeMode="contain"
            />
            <ThemedText style={styles.competitionName}>
              {match.competition.name} {match.matchday ? `- Matchday ${match.matchday}` : ''}
            </ThemedText>
          </TouchableOpacity>

          {/* Match Status */}
          <ThemedView style={styles.statusContainerSimple}>
            <ThemedText style={styles.date}>{formattedDate}</ThemedText>
            {isLive && (
              <ThemedView style={styles.liveContainer}>
                <ThemedText style={styles.liveIndicator}>LIVE</ThemedText>
              </ThemedView>
            )}
            {match.venue && (
              <ThemedText style={styles.venue}>{match.venue}</ThemedText>
            )}
          </ThemedView>

          {/* Teams and Score */}
          <ThemedView style={styles.matchContainer}>
            <ThemedView style={styles.matchBadge}>
              <ThemedText style={styles.matchBadgeText}>
                {dateUtils.getMatchDateLabel(matchDate)}
              </ThemedText>
            </ThemedView>
            <ThemedView style={styles.teamsRow}>
              <ThemedView style={styles.teamContainer}>
                <Image
                  source={{ uri: match.homeTeam.crest }}
                  style={styles.teamLogo}
                  resizeMode="contain"
                />
                <ThemedView style={styles.formRow}>
                  {homeTeamForm.map((result, index) => (
                    <ThemedView 
                      key={index} 
                      style={[
                        styles.formIndicator,
                        result === 'W' && styles.winIndicator,
                        result === 'L' && styles.lossIndicator,
                        result === 'D' && styles.drawIndicator,
                      ]}>
                      <ThemedText style={styles.formText}>{result}</ThemedText>
                    </ThemedView>
                  ))}
                </ThemedView>
                <ThemedText style={styles.teamName}>{match.homeTeam.name}</ThemedText>
              </ThemedView>

              {isFinished || isLive ? (
                <ThemedView style={styles.scoreContainer}>
                  <ThemedText style={styles.score}>
                    {match.score?.fullTime.home}-{match.score?.fullTime.away}
                  </ThemedText>
                </ThemedView>
              ) : (
                <ThemedText style={styles.vsText}>VS</ThemedText>
              )}

              <ThemedView style={styles.teamContainer}>
                <Image
                  source={{ uri: match.awayTeam.crest }}
                  style={styles.teamLogo}
                  resizeMode="contain"
                />
                <ThemedView style={styles.formRow}>
                  {awayTeamForm.map((result, index) => (
                    <ThemedView 
                      key={index} 
                      style={[
                        styles.formIndicator,
                        result === 'W' && styles.winIndicator,
                        result === 'L' && styles.lossIndicator,
                        result === 'D' && styles.drawIndicator,
                      ]}>
                      <ThemedText style={styles.formText}>{result}</ThemedText>
                    </ThemedView>
                  ))}
                </ThemedView>
                <ThemedText style={styles.teamName}>{match.awayTeam.name}</ThemedText>
              </ThemedView>
            </ThemedView>
          </ThemedView>

          {/* Analysis Request Section */}
          <ThemedView style={styles.analysisContainer}>
            <ThemedView style={styles.analysisContent}>
              <ThemedView style={styles.analysisLeft}>
                <Ionicons name="trending-up" size={20} color="#FFD700" />
                <ThemedView>
                  <ThemedText style={styles.analysisTitle}>Match Analysis</ThemedText>
                  <ThemedText style={styles.analysisSubtitle}>AI-Powered insights and predictions</ThemedText>
                </ThemedView>
              </ThemedView>
              <TouchableOpacity 
                style={styles.analysisButton}
                onPress={() => router.push(`/analyze/${match.id}`)}>
                <ThemedText style={styles.analysisButtonText}>Analyze</ThemedText>
                <Ionicons name="arrow-forward" size={18} color="#000" />
              </TouchableOpacity>
            </ThemedView>
          </ThemedView>

          {/* Recent Matches */}
          {h2h.length > 0 && (
            <ThemedView style={styles.recentMatchesContainer}>
              <ThemedView style={styles.sectionHeader}>
                <Ionicons name="time-outline" size={18} color="#2E7D32" />
                <ThemedText style={styles.sectionTitle}>Head to Head</ThemedText>
              </ThemedView>
              <ThemedView style={styles.recentMatches}>
                {h2h.slice(0, 5).map((match) => {
                  const matchDate = new Date(match.utcDate ?? match.kickoff);
                  const formattedDate = matchDate.toLocaleDateString('en-GB', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                  });
                  
                  return (
                    <ThemedView key={match.id} style={styles.recentMatch}>
                      <ThemedView style={styles.recentMatchTeam}>
                        <Image
                          source={{ uri: match.homeTeam.crest }}
                          style={styles.recentMatchLogo}
                          resizeMode="contain"
                        />
                        <ThemedText style={styles.recentMatchTeamName} numberOfLines={1}>
                          {match.homeTeam.shortName || match.homeTeam.name}
                        </ThemedText>
                      </ThemedView>
                      
                      <ThemedText style={styles.recentMatchScore}>
                        {match.score?.fullTime.home}-{match.score?.fullTime.away}
                      </ThemedText>
                      
                      <ThemedView style={styles.recentMatchTeam}>
                        <Image
                          source={{ uri: match.awayTeam.crest }}
                          style={styles.recentMatchLogo}
                          resizeMode="contain"
                        />
                        <ThemedText style={styles.recentMatchTeamName} numberOfLines={1}>
                          {match.awayTeam.shortName || match.awayTeam.name}
                        </ThemedText>
                      </ThemedView>
                      
                      <ThemedText style={styles.recentMatchDate}>
                        {formattedDate}
                      </ThemedText>
                    </ThemedView>
                  );
                })}
              </ThemedView>
            </ThemedView>
          )}
        </ThemedView>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollView: {
    flex: 1,
  },
  container: {
    flex: 1,
    paddingBottom: 24,
  },
  centerContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    padding: 16,
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#e0e0e0',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backText: {
    fontSize: 16,
    marginLeft: 4,
    color: '#1282A2',
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 8,
    paddingVertical: 12,
    paddingHorizontal: 12,
    backgroundColor: '#E8F5E9',
    borderRadius: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2E7D32',
  },
  competitionInfoSimple: {
    padding: 16,
    alignItems: 'center',
    marginBottom: 8,
    marginHorizontal: 16,
  },
  competitionLogo: {
    width: 40,
    height: 40,
    marginBottom: 8,
  },
  competitionName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  statusContainerSimple: {
    padding: 16,
    alignItems: 'center',
    marginBottom: 16,
    marginHorizontal: 16,
  },
  date: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  liveContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 4,
  },
  liveIndicator: {
    fontSize: 14,
    color: '#E74C3C',
    fontWeight: 'bold',
  },
  venue: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  matchContainer: {
    marginBottom: 24,
    marginHorizontal: 16,
    borderRadius: 12,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#e0e0e0',
    position: 'relative',
    paddingTop: 32,
  },
  teamsRow: {
    flexDirection: 'row',
    padding: 24,
    paddingTop: 16,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  teamContainer: {
    flex: 1,
    alignItems: 'center',
    maxWidth: '35%',
  },
  teamLogo: {
    width: 64,
    height: 64,
    marginBottom: 12,
  },
  teamName: {
    fontSize: 15,
    fontWeight: '500',
    textAlign: 'center',
    color: '#333',
  },
  scoreContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1282A2',
    width: 100,
    height: 48,
    borderRadius: 8,
  },
  score: {
    fontSize: 24,
    fontWeight: '600',
    color: '#fff',
  },
  vsText: {
    fontSize: 24,
    fontWeight: '600',
    color: '#1282A2',
  },
  recentMatchesContainer: {
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 12,
    padding: 16,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#e0e0e0',
  },
  recentMatches: {
    gap: 2,
  },
  recentMatch: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#f0f0f0',
  },
  recentMatchTeam: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  recentMatchLogo: {
    width: 20,
    height: 20,
  },
  recentMatchTeamName: {
    fontSize: 13,
    color: '#333',
    flex: 1,
  },
  recentMatchScore: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1282A2',
    minWidth: 40,
    textAlign: 'center',
  },
  recentMatchDate: {
    fontSize: 12,
    color: '#666',
    minWidth: 90,
    textAlign: 'right',
  },
  matchBadge: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: '#4169E1',
    paddingHorizontal: 16,
    paddingVertical: 4,
    borderTopRightRadius: 12,
    borderBottomLeftRadius: 12,
    zIndex: 1,
  },
  matchBadgeText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  formRow: {
    flexDirection: 'row',
    gap: 4,
    marginBottom: 8,
  },
  formIndicator: {
    width: 20,
    height: 20,
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  formText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#fff',
  },
  winIndicator: {
    backgroundColor: '#4CAF50',
  },
  lossIndicator: {
    backgroundColor: '#F44336',
  },
  drawIndicator: {
    backgroundColor: '#FFA726',
  },
  loadingText: {
    marginTop: 8,
    fontSize: 16,
    color: '#666',
  },
  errorText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 16,
  },
  retryButton: {
    backgroundColor: '#1282A2',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  analysisContainer: {
    marginHorizontal: 16,
    marginBottom: 24,
    borderRadius: 12,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#e0e0e0',
    padding: 16,
  },
  analysisContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  analysisLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  analysisTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  analysisSubtitle: {
    fontSize: 13,
    color: '#666',
  },
  analysisButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#FFD700',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  analysisButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000',
  },
});