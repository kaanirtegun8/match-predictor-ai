import { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { Image } from 'react-native';

import { ThemedText } from '../../components/themed/ThemedText';
import { ThemedView } from '../../components/themed/ThemedView';
import { GetMatchDetail } from '../../services/footballApi';
import { AnalyzeResponseModel } from '../../models/AnalyzeResponseModel';
import { analyzeMatch } from '../../services/openaiApi';
import { RichText } from '../../components/RichText';
import { Match } from '@/models';

export default function AnalyzeScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [match, setMatch] = useState<Match | null>(null);
  const [analysis, setAnalysis] = useState<AnalyzeResponseModel | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    loadMatchDetails();
  }, [id]);

  async function loadMatchDetails() {
    try {
      setLoading(true);
      setError(null);
      const matchData = await GetMatchDetail(Number(id));
      setMatch(matchData);
      const result = await analyzeMatch(matchData);
      setAnalysis(result);
    } catch (error) {
      console.error('Error:', error);
      setError('Failed to load match analysis');
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <ThemedView style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#65a30d" />
          <ThemedText style={styles.loadingText}>Analyzing match...</ThemedText>
        </ThemedView>
      </SafeAreaView>
    );
  }

  if (!match) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <ThemedView style={styles.errorContainer}>
          <ThemedText style={styles.errorText}>Match not found</ThemedText>
        </ThemedView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <ThemedView style={styles.container}>
          {/* Header */}
          <ThemedView style={styles.header}>
            <TouchableOpacity 
              style={styles.backButton} 
              onPress={() => router.back()}>
              <Ionicons name="chevron-back" size={24} color="#65a30d" />
              <ThemedText style={styles.backText}>Back</ThemedText>
            </TouchableOpacity>
          </ThemedView>

          {/* Competition Info */}
          <TouchableOpacity 
            style={styles.competitionInfo}
            onPress={() => router.push(`/standings/${match.competition.id}?homeTeamId=${match.homeTeam.id}&awayTeamId=${match.awayTeam.id}`)}>
            <Image
              source={{ uri: match.competition.emblem }}
              style={styles.competitionLogo}
              resizeMode="contain"
            />
            <ThemedText style={styles.competitionName}>
              {match.competition.name} - Matchday {match.matchday}
            </ThemedText>
          </TouchableOpacity>

          {/* Match Info */}
          <ThemedView style={styles.matchContainer}>
            <ThemedView style={styles.teamsRow}>
              <ThemedView style={styles.teamContainer}>
                <Image
                  source={{ uri: match.homeTeam.crest }}
                  style={styles.teamLogo}
                  resizeMode="contain"
                />
                <ThemedText style={styles.teamName} numberOfLines={2}>
                  {match.homeTeam.name}
                </ThemedText>
              </ThemedView>
              <ThemedView style={styles.scoreContainer}>
                <ThemedText style={styles.vsText}>vs</ThemedText>
              </ThemedView>
              <ThemedView style={styles.teamContainer}>
                <Image
                  source={{ uri: match.awayTeam.crest }}
                  style={styles.teamLogo}
                  resizeMode="contain"
                />
                <ThemedText style={styles.teamName} numberOfLines={2}>
                  {match.awayTeam.name}
                </ThemedText>
              </ThemedView>
            </ThemedView>
          </ThemedView>

          {/* Analysis Section */}
          <ThemedView style={styles.analysisSection}>
            {analysis ? (
              <ThemedView style={styles.analysisContent}>
                {/* Description */}
                <ThemedView style={styles.descriptionCard}>
                  <RichText style={styles.descriptionText} text={analysis.description} />
                </ThemedView>

                {/* Predictions */}
                <ThemedView style={styles.predictionsContainer}>
                  {analysis.predicts.map((predict) => (
                    <ThemedView key={predict.id} style={[
                      styles.predictionCard,
                      predict.isRisky && styles.riskyCard
                    ]}>
                      <ThemedView style={styles.predictionHeader}>
                        <ThemedText style={styles.predictionType}>{predict.type}</ThemedText>
                        <ThemedView style={[
                          styles.probabilityBadge,
                          { backgroundColor: getProbabilityColor(predict.probability) }
                        ]}>
                          <ThemedText style={styles.probabilityText}>
                            {Math.round(predict.probability * 100)}%
                          </ThemedText>
                        </ThemedView>
                      </ThemedView>

                      <ThemedText style={styles.predictionValue}>
                        {predict.prediction}
                      </ThemedText>

                      <ThemedView style={styles.evidenceContainer}>
                        <RichText style={styles.evidenceText} text={predict.evidence} />
                      </ThemedView>

                      {predict.isRisky && (
                        <ThemedView style={styles.riskyBadge}>
                          <Ionicons name="warning" size={16} color="#f59e0b" />
                          <ThemedText style={styles.riskyText}>Risky Prediction</ThemedText>
                        </ThemedView>
                      )}
                    </ThemedView>
                  ))}
                </ThemedView>
              </ThemedView>
            ) : error ? (
              <ThemedText style={styles.errorText}>{error}</ThemedText>
            ) : null}
          </ThemedView>
        </ThemedView>
      </ScrollView>
    </SafeAreaView>
  );
}

const getProbabilityColor = (probability: number) => {
  if (probability >= 0.7) return '#65a30d';
  if (probability >= 0.5) return '#f59e0b';
  return '#ef4444';
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  scrollView: {
    flex: 1,
  },
  container: {
    flex: 1,
    paddingBottom: 24,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#64748b',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  header: {
    padding: 16,
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f1f5f9',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  backText: {
    fontSize: 15,
    marginLeft: 4,
    color: '#65a30d',
    fontWeight: '500',
  },
  competitionInfo: {
    padding: 20,
    alignItems: 'center',
  },
  competitionLogo: {
    width: 40,
    height: 40,
    marginBottom: 8,
  },
  competitionName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0f172a',
    textAlign: 'center',
  },
  matchContainer: {
    marginVertical: 16,
    marginHorizontal: 16,
    backgroundColor: '#fff',
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  teamsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
  },
  teamContainer: {
    flex: 1,
    alignItems: 'center',
  },
  scoreContainer: {
    paddingHorizontal: 20,
  },
  teamLogo: {
    width: 64,
    height: 64,
    marginBottom: 12,
  },
  teamName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0f172a',
    textAlign: 'center',
  },
  vsText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#64748b',
  },
  analysisSection: {
    marginHorizontal: 16,
  },
  analysisContent: {
    gap: 16,
  },
  descriptionCard: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  descriptionText: {
    fontSize: 15,
    lineHeight: 24,
    color: '#334155',
  },
  predictionsContainer: {
    gap: 16,
  },
  predictionCard: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  riskyCard: {
    borderWidth: 1,
    borderColor: '#f59e0b33',
  },
  predictionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  predictionType: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0f172a',
  },
  probabilityBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  probabilityText: {
    fontSize: 14,
    color: '#fff',
    fontWeight: '500',
  },
  predictionValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#65a30d',
    marginBottom: 12,
  },
  evidenceContainer: {
    backgroundColor: '#f8fafc',
    padding: 12,
    borderRadius: 8,
  },
  evidenceText: {
    fontSize: 14,
    lineHeight: 20,
    color: '#475569',
  },
  riskyBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
    padding: 8,
    backgroundColor: '#f59e0b11',
    borderRadius: 8,
  },
  riskyText: {
    color: '#f59e0b',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 6,
  },
  errorText: {
    color: '#ef4444',
    fontSize: 14,
    textAlign: 'center',
    marginTop: 16,
  },
}); 