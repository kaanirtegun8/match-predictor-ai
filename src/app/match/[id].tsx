import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState, useRef } from 'react';
import { ScrollView, StyleSheet, TouchableOpacity, ActivityIndicator, Image, RefreshControl, Animated, Easing } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '../../components/themed/ThemedText';
import { ThemedView } from '../../components/themed/ThemedView';
import dateUtils from '../../utils/date';
import { Match } from '@/models/Match';
import { getMatchDetails } from '../../services/matchService';
import { useTheme } from '@/contexts/ThemeContext';

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
  const { colors } = useTheme();
  // Border animation
  const borderAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animate = () => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(borderAnim, {
            toValue: 1,
            duration: 3000,
            easing: Easing.linear,
            useNativeDriver: false,
          }),
          Animated.timing(borderAnim, {
            toValue: 0,
            duration: 3000,
            easing: Easing.linear,
            useNativeDriver: false,
          })
        ])
      ).start();
    };

    animate();
  }, []);

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
      <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.border }]}>
        <ThemedView style={[styles.container, styles.centerContent, { backgroundColor: colors.border }]}>
          <ActivityIndicator size="large" color={colors.primary} />
          <ThemedText style={[styles.loadingText, { color: colors.text }]}>Loading match details...</ThemedText>
        </ThemedView>
      </SafeAreaView>
    );
  }

  if (!match) {
    return (
      <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.border }]}>
        <ThemedView style={[styles.container, styles.centerContent, { backgroundColor: colors.border }]}>
          <ThemedText style={[styles.errorText, { color: colors.text }]}>Match not found</ThemedText>
          <TouchableOpacity 
            style={[styles.retryButton, { backgroundColor: colors.primary }]}
            onPress={() => router.push(`/match/${id}`)}>
            <ThemedText style={styles.retryButtonText}>Retry</ThemedText>
          </TouchableOpacity>
        </ThemedView>
      </SafeAreaView>
    );
  }

  const matchDate = new Date(match.utcDate);
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
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.border }]}>
      <ScrollView 
        style={[styles.scrollView, { backgroundColor: colors.border }]}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
          />
        }>
        <ThemedView style={[styles.container, { backgroundColor: colors.border }]}>
          {/* Header */}
          <ThemedView style={[styles.header, { backgroundColor: colors.border }]}>
            <TouchableOpacity 
              style={[styles.backButton, { }]} 
              onPress={() => router.back()}>
              <Ionicons name="chevron-back" size={24} color={colors.primary} />
              <ThemedText style={[styles.backText, { color: colors.primary }]}>Back</ThemedText>
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
            <ThemedText style={[styles.competitionName, { color: colors.text }]}>
              {match.competition.name} {match.matchday ? `- Matchday ${match.matchday}` : ''}
            </ThemedText>
          </TouchableOpacity>

          {/* Match Status */}
          <ThemedView style={[styles.statusContainerSimple, { backgroundColor: colors.border }]}>
            <ThemedText style={[styles.date, { color: colors.text }]}>{formattedDate}</ThemedText>
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
          <ThemedView style={[styles.matchContainer, { backgroundColor: colors.background }]}>
            <ThemedView style={[styles.matchBadge, { backgroundColor: colors.primary }]}>
              <ThemedText style={[styles.matchBadgeText, { color: colors.buttonText }]}>
                {dateUtils.getMatchDateLabel(matchDate)}
              </ThemedText>
            </ThemedView>
            <ThemedView style={[styles.teamsRow, { backgroundColor: colors.background }]}>
              <ThemedView style={[styles.teamContainer, { backgroundColor: colors.background }]}>
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
                <ThemedText style={[styles.teamName, { color: colors.text }]}>{match.homeTeam.name}</ThemedText>
              </ThemedView>

              {isFinished || isLive ? (
                <ThemedView style={styles.scoreContainer}>
                  <ThemedText style={[styles.score, { color: colors.text }]}>
                    {match.score?.fullTime.home}-{match.score?.fullTime.away}
                  </ThemedText>
                </ThemedView>
              ) : (
                <ThemedText style={[styles.vsText, { color: colors.primary }]}>VS</ThemedText>
              )}

              <ThemedView style={[styles.teamContainer, { backgroundColor: colors.background }]}>
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
                <ThemedText style={[styles.teamName, { color: colors.text }]}>{match.awayTeam.name}</ThemedText>
              </ThemedView>
            </ThemedView>   
          </ThemedView>

          {/* Analysis Request Section */}
          <ThemedView style={styles.analysisOuterContainer}>
            <Animated.View style={[
              styles.animatedBorder,
              {
                borderColor: borderAnim.interpolate({
                  inputRange: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1],
                  outputRange: [
                    '#FFD700', // Altın sarısı
                    '#FF6B6B', // Mercan kırmızısı
                    '#4CAF50', // Yeşil
                    '#2196F3', // Mavi
                    '#9C27B0', // Mor
                    '#FF9800', // Turuncu
                    '#00BCD4', // Cyan
                    '#F44336', // Kırmızı
                    '#8BC34A', // Açık yeşil
                    '#E91E63', // Pembe
                    '#FFD700'  // Tekrar sarı (smooth geçiş için)
                  ]
                })
              }
            ]}>
              <ThemedView style={styles.analysisContent}>
                <ThemedView style={styles.analysisLeft}>
                  <Ionicons name="trending-up" size={24} color="#FFD700" />
                  <ThemedView style={styles.textContainer}>
                    <ThemedText style={styles.analysisTitle}>Match Analysis</ThemedText>
                    <ThemedText style={styles.analysisSubtitle}>AI-Powered insights and predictions</ThemedText>
                  </ThemedView>
                </ThemedView>
                <TouchableOpacity 
                  style={[styles.analysisButton, { backgroundColor: '#FFD700' }]}
                  onPress={() => router.push(`/analyze/${match.id}`)}>
                  <ThemedText style={[styles.analysisButtonText, { color: '#000' }]}>Analyze</ThemedText>
                  <Ionicons name="arrow-forward" size={18} color="#000" />
                </TouchableOpacity>
              </ThemedView>
            </Animated.View>
          </ThemedView>

          {/* Recent Matches */}
          {h2h.length > 0 && (
            <ThemedView style={[styles.recentMatchesContainer, { backgroundColor: colors.background }]}>
              <ThemedView style={[styles.sectionHeader, { backgroundColor: colors.border }]}>
                <Ionicons name="time-outline" size={18} color={colors.primary} />
                <ThemedText style={[styles.sectionTitle, { color: colors.primary }]}>Head to Head</ThemedText>
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
                    <ThemedView key={match.id} style={[styles.recentMatch, { backgroundColor: colors.background }]}>
                      <ThemedView style={[styles.recentMatchTeam, { backgroundColor: colors.background }]}>
                        <Image
                          source={{ uri: match.homeTeam.crest }}
                          style={styles.recentMatchLogo}
                          resizeMode="contain"
                        />
                        <ThemedText style={[styles.recentMatchTeamName, { color: match.score.winner === 'HOME_TEAM' ? colors.primary : colors.text, fontWeight: match.score.winner === 'HOME_TEAM' ? 'bold' : 'normal' }]} numberOfLines={1}>
                          {match.homeTeam.shortName || match.homeTeam.name}
                        </ThemedText>
                      </ThemedView>
                      
                      <ThemedText style={[styles.recentMatchScore, { color: colors.text }]}>
                        {match.score?.fullTime.home}-{match.score?.fullTime.away}
                      </ThemedText>
                      
                      <ThemedView style={[styles.recentMatchTeam, { backgroundColor: colors.background }]}>
                        <Image
                          source={{ uri: match.awayTeam.crest }}
                          style={styles.recentMatchLogo}
                          resizeMode="contain"
                        />
                        <ThemedText style={[styles.recentMatchTeamName, { color: match.score.winner === 'AWAY_TEAM' ? colors.primary : colors.text, fontWeight: match.score.winner === 'AWAY_TEAM' ? 'bold' : 'normal' }]} numberOfLines={1}>
                          {match.awayTeam.shortName || match.awayTeam.name}
                        </ThemedText>
                      </ThemedView>
                      
                      <ThemedText style={[styles.recentMatchDate, { color: colors.text }]}>
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
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
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
    position: 'relative',
    paddingTop: 32,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  teamsRow: {
    flexDirection: 'row',
    padding: 24,
    paddingTop: 16,
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 12,
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
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
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
  analysisOuterContainer: {
    marginHorizontal: 16,
    marginBottom: 24,
  },
  animatedBorder: {
    borderWidth: 1,
    borderRadius: 12,
    backgroundColor: '#fff',
    shadowColor: '#1282A2',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  analysisContent: {
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 16,
  },
  analysisLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  textContainer: {
    flex: 1,
    flexShrink: 1,
  },
  analysisTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFD700',
  },
  analysisSubtitle: {
    fontSize: 13,
    color: '#666',
    flexShrink: 1,
  },
  analysisButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#FFD700',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  analysisButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000',
  },
});