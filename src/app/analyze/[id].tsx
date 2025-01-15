import { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { Image } from 'react-native';

import { ThemedText } from '../../components/themed/ThemedText';
import { ThemedView } from '../../components/themed/ThemedView';
import { AnalyzeResponseModel } from '../../models/AnalyzeResponseModel';
import { analyzeMatch } from '../../services/openaiApi';
import { Match } from '@/models';
import { PremiumFeature } from '@/components/PremiumFeature';
import { getMatchDetails } from '@/services/matchService';
import { RichText } from '@/components/RichText';

export default function AnalyzeScreen() {
  const { id } = useLocalSearchParams();
  const [match, setMatch] = useState<Match | null>(null);
  const [analysis, setAnalysis] = useState<AnalyzeResponseModel | null>(null);
  const [loading, setLoading] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);

  useEffect(() => {
    const loadMatch = async () => {
      try {
        const matchData = await getMatchDetails(id as string);
        if (matchData) {
          setMatch(matchData.details);
        }
      } catch (error) {
        console.error('Failed to load match:', error);
      } finally {
        setLoading(false);
      }
    };

    loadMatch();
  }, [id]);

  const handleAnalyze = async () => {
    if (!match) return;

    setAnalyzing(true);
    try {
      const result = await analyzeMatch(match);
      setAnalysis(result);
    } catch (error) {
      console.error('Failed to analyze match:', error);
    } finally {
      setAnalyzing(false);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
      </SafeAreaView>
    );
  }

  if (!match) {
    return (
      <SafeAreaView style={styles.container}>
        <ThemedText>Match not found</ThemedText>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <ThemedView style={styles.content}>
          {/* Header */}
          <ThemedView style={styles.header}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => router.back()}>
              <Ionicons name="chevron-back" size={24} color="#000" />
              <ThemedText style={styles.backText}>Back</ThemedText>
            </TouchableOpacity>
          </ThemedView>

          {/* Match Info */}
          <ThemedView style={styles.matchInfo}>
            <Image
              source={{ uri: match.competition.emblem }}
              style={styles.competitionLogo}
              resizeMode="contain"
            />
            <ThemedText style={styles.matchTitle}>
              {match.homeTeam.name} vs {match.awayTeam.name}
            </ThemedText>
            <ThemedText style={styles.matchSubtitle}>
              {match.competition.name} - Matchday {match.matchday}
            </ThemedText>
          </ThemedView>

          {/* Analysis Content */}
          <PremiumFeature
            featureId="advanced_analysis"
            fallback={
              <ThemedView style={styles.basicAnalysis}>
                <ThemedText style={styles.basicAnalysisText}>
                  Basic match statistics are available in the match details.
                  Upgrade to Premium for AI-powered analysis and predictions.
                </ThemedText>
              </ThemedView>
            }
          >
            {!analysis ? (
              <TouchableOpacity
                style={styles.analyzeButton}
                onPress={handleAnalyze}
                disabled={analyzing}
              >
                {analyzing ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <>
                    <Ionicons name="analytics" size={20} color="#fff" style={styles.buttonIcon} />
                    <ThemedText style={styles.buttonText}>Analyze Match</ThemedText>
                  </>
                )}
              </TouchableOpacity>
            ) : (
              <ThemedView style={styles.analysisContent}>
                <ThemedView style={styles.section}>
                  <ThemedText style={styles.sectionTitle}>Match Analysis</ThemedText>
                  <RichText text={analysis.description} style={styles.analysisText} />
                </ThemedView>

                <ThemedView style={styles.section}>
                  <ThemedText style={styles.sectionTitle}>Predictions</ThemedText>
                  {analysis.predicts.map((predict, index) => (
                    <ThemedView key={index} style={styles.predictionItem}>
                      <ThemedText style={styles.predictionType}>{predict.type}</ThemedText>
                      <ThemedText style={styles.predictionValue}>{predict.prediction}</ThemedText>
                      <RichText text={predict.evidence} style={styles.evidenceText} />
                    </ThemedView>
                  ))}
                </ThemedView>
              </ThemedView>
            )}
          </PremiumFeature>
        </ThemedView>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 20,
  },
  header: {
    marginBottom: 20,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backText: {
    fontSize: 16,
    marginLeft: 4,
  },
  matchInfo: {
    alignItems: 'center',
    marginBottom: 30,
  },
  competitionLogo: {
    width: 60,
    height: 60,
    marginBottom: 16,
  },
  matchTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  matchSubtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  basicAnalysis: {
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
  },
  basicAnalysisText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 24,
  },
  analyzeButton: {
    backgroundColor: '#007AFF',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  buttonIcon: {
    marginRight: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  analysisContent: {
    marginTop: 20,
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  analysisText: {
    fontSize: 16,
    lineHeight: 24,
    color: '#333',
  },
  predictionItem: {
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  predictionType: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  predictionValue: {
    fontSize: 18,
    color: '#007AFF',
    marginBottom: 12,
  },
  evidenceText: {
    fontSize: 14,
    lineHeight: 20,
    color: '#666',
  },
}); 