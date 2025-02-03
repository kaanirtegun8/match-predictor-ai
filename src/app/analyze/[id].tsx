import { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { Image } from 'react-native';
import { useTranslation } from 'react-i18next';

import { ThemedText } from '../../components/themed/ThemedText';
import { ThemedView } from '../../components/themed/ThemedView';
import { AnalyzeResponseModel, RiskLevel, Prediction } from '../../models/AnalyzeResponseModel';
import { analyzeMatch } from '../../services/openaiApi';
import { Match } from '@/models';
import { getMatchDetails, saveMatchAnalysis, getMatchAnalysis, saveMatchAnalysisToUser } from '@/services/matchService';
import { RichText } from '@/components/RichText';
import { useTheme } from '@/contexts/ThemeContext';
import { BilingualAnalysis } from '@/models/BilingualAnalysis';

const kebabToCamelCase = (str: string): string => {
  return str.replace(/-([a-z])/g, (g) => g[1].toUpperCase());
};

const getRiskStyles = (risk: RiskLevel) => {
  switch (risk) {
    case 'RISKY':
      return styles.riskyBadge;
    case 'MODERATE':
      return styles.moderateBadge;
    case 'SAFE':
      return styles.safeBadge;
    default:
      return {};
  }
};

const calculateRiskLevel = (probability: number): RiskLevel => {
  if (probability >= 0.75) return 'SAFE';
  if (probability >= 0.60) return 'MODERATE';
  return 'RISKY';
};

export default function AnalyzeScreen() {
  const { t, i18n } = useTranslation();
  const { id } = useLocalSearchParams();
  const [match, setMatch] = useState<Match | null>(null);
  const [analysis, setAnalysis] = useState<BilingualAnalysis | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingStep, setLoadingStep] = useState<number>(1);
  const [loadingMessage, setLoadingMessage] = useState<string>('Retrieving match statistics...');
  const [expandedPredictions, setExpandedPredictions] = useState<number[]>([]);
  const { colors } = useTheme();
  const togglePrediction = (index: number) => {
    setExpandedPredictions(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
  };

  // Get current language
  const currentLanguage = i18n.language;

  useEffect(() => {
    const loadMatch = async () => {
      try {
        setLoadingStep(1);
        setLoadingMessage('Retrieving match statistics...');
        const matchData = await getMatchDetails(id as string);
        
        if (matchData) {
          setMatch(matchData.details);
          
          // Check if analysis exists in Firestore
          const existingAnalysis = await getMatchAnalysis(id as string);
          if (existingAnalysis) {
            console.log('✅ Match analysis found in Firestore, using cached data');
            setLoadingStep(2);
            setLoadingMessage('Loading cached analysis...');
            await new Promise(resolve => setTimeout(resolve, 800));
            
            setLoadingStep(3);
            setLoadingMessage('Processing insights...');
            await new Promise(resolve => setTimeout(resolve, 600));
            
            setLoadingStep(4);
            setLoadingMessage('Finalizing match insights...');
            await new Promise(resolve => setTimeout(resolve, 400));
            
            setAnalysis(existingAnalysis);
            saveMatchAnalysisToUser(id as string, existingAnalysis);
          } else {
            console.log('⚠️ No analysis found in Firestore, generating new analysis...');
            setLoadingStep(2);
            setLoadingMessage('Analyzing team performances...');
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            setLoadingStep(3);
            setLoadingMessage('Generating AI predictions...');
            const result = await analyzeMatch({
                details: matchData.details,
                h2h: matchData.h2h,
                homeRecentMatches: matchData.homeRecentMatches,
                awayRecentMatches: matchData.awayRecentMatches,
                standings: matchData.standings
            });
            
            // Save analysis to database
            const saved = await saveMatchAnalysis(id as string, result);
            if (!saved) {
              console.error('❌ Failed to save match analysis');
            }
            
            setLoadingStep(4);
            setLoadingMessage('Finalizing match insights...');
            await new Promise(resolve => setTimeout(resolve, 800));
            
            setAnalysis(result);
          }
        }
      } catch (error) {
        console.error('Failed to load match:', error);
      } finally {
        setLoading(false);
      }
    };

    loadMatch();
  }, [id]);

  const LoadingSteps = () => (
    <ThemedView style={[styles.loadingContainer, { backgroundColor: colors.background }]}>
      {[
        t('matches.analysis.loadingSteps.stats'),
        t('matches.analysis.loadingSteps.performance'),
        t('matches.analysis.loadingSteps.predictions'),
        t('matches.analysis.loadingSteps.finalizing')
      ].map((step, index) => (
        <ThemedView key={index} style={[styles.loadingStep, { backgroundColor: colors.border }]}>
          <ThemedView style={[styles.stepIndicator, { backgroundColor: colors.border }]}>
            {index + 1 === loadingStep && (
              <ActivityIndicator size="small" color="#007AFF" />
            )}
            {index + 1 < loadingStep && (
              <Ionicons name="checkmark-circle" size={20} color="#4CAF50" />
            )}
            {index + 1 > loadingStep && (
              <ThemedView style={styles.emptyStep} />
            )}
          </ThemedView>
          <ThemedText style={[
            styles.loadingText,
            index + 1 === loadingStep && styles.activeStep,
            index + 1 < loadingStep && styles.completedStep
          ]}>
            {step}
          </ThemedText>
        </ThemedView>
      ))}
    </ThemedView>
  );

  if (loading && !match) {
    return (
      <SafeAreaView style={[styles.container, { display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: colors.border }]}>
        <ActivityIndicator size="large" color={colors.primary} />
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
    <SafeAreaView style={[styles.container, { backgroundColor: colors.border }]}>
      <ScrollView style={[styles.scrollView, { backgroundColor: colors.border }]}>
        <ThemedView style={[styles.content, { backgroundColor: colors.border }]}>
          {/* Header */}
          <ThemedView style={[styles.header, { backgroundColor: colors.border }]}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => router.back()}>
              <Ionicons name="chevron-back" size={24} color={colors.primary} />
              <ThemedText style={[styles.backText, { color: colors.primary }]}>{t('common.back')}</ThemedText>
            </TouchableOpacity>
          </ThemedView>

          {/* Match Info */}
          <ThemedView style={[styles.matchInfo, { backgroundColor: colors.border, paddingVertical: 10 }]}>
            <Image
              source={{ uri: match.competition.emblem }}
              style={styles.competitionLogo}
              resizeMode="contain"
            />
            
            <ThemedView style={[styles.teamsContainer, { backgroundColor: colors.border }]}>
              <ThemedText style={[styles.teamName, { color: colors.text }]}>
                {match.homeTeam.name}
              </ThemedText>
              <ThemedText style={[styles.vsText, { color: colors.text }]}>vs</ThemedText>
              <ThemedText style={[styles.teamName, { color: colors.text }]}>
                {match.awayTeam.name}
              </ThemedText>
            </ThemedView>

            <ThemedView style={[styles.matchDetails, { backgroundColor: colors.border }]}>
              <ThemedText style={[styles.competitionName, { color: colors.text }]}>
                {match.competition.name}
              </ThemedText>
              
              <ThemedView style={[styles.metadataContainer, { backgroundColor: colors.border }]}>
                <ThemedView style={[styles.badge, { backgroundColor: colors.background }]}>
                  <ThemedText style={[styles.badgeText, { color: colors.text }]}>
                    {t('matches.matchday')} {match.matchday}
                  </ThemedText>
                </ThemedView>
                
                {match.utcDate && (
                  <ThemedView style={[styles.badge, { backgroundColor: colors.background }]}>
                    <ThemedText style={[styles.badgeText, { color: colors.text }]}>
                      {new Date(match.utcDate).toLocaleDateString(currentLanguage === 'tr' ? 'tr-TR' : 'en-US', {
                        day: 'numeric',
                        month: 'long',
                      })} • {new Date(match.utcDate).toLocaleTimeString(currentLanguage === 'tr' ? 'tr-TR' : 'en-US', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </ThemedText>
                  </ThemedView>
                )}
              </ThemedView>
            </ThemedView>
          </ThemedView>

          {/* Analysis Content */}
          {!analysis ? (
            <LoadingSteps />
          ) : (
            <ThemedView style={[styles.analysisContent, { backgroundColor: colors.border }]}>
              {/* Match Analysis Section */}
              <ThemedView style={[styles.analysisSection, { backgroundColor: colors.border }]}>
                <ThemedView style={[styles.sectionHeader, { backgroundColor: colors.border }]}>
                  <Ionicons name="analytics-outline" size={24} color={colors.primary} />
                  <ThemedText style={[styles.sectionTitle, { color: colors.primary }]}>{t('matches.analysis.title')}</ThemedText>
                </ThemedView>
                <ThemedView style={[styles.analysisCard, { backgroundColor: colors.background, borderColor: colors.border }]}>
                  <ThemedText style={[styles.analysisText, { color: colors.text }]}>
                    {analysis && analysis[currentLanguage === 'tr' ? 'tr' : 'en']?.description || t('matches.analysis.noEvidence')}
                  </ThemedText>
                </ThemedView>
              </ThemedView>

              {/* Predictions Section */}
              <ThemedView style={[styles.predictionsSection, { backgroundColor: colors.border }]}>
                <ThemedView style={[styles.sectionHeader, { backgroundColor: colors.border }]}>
                  <Ionicons name="podium-outline" size={24} color={colors.primary} />
                  <ThemedText style={[styles.sectionTitle, { color: colors.primary }]}>{t('matches.predictions.title')}</ThemedText>
                </ThemedView>
                
                {(currentLanguage === 'tr' ? analysis.tr.predicts : analysis.en.predicts).map((predict: Prediction, index: number) => (
                  <ThemedView key={index} style={[styles.predictionCard, { backgroundColor: colors.background, borderColor: colors.border }]}>
                    <ThemedView style={styles.predictionHeader}>
                      <ThemedView style={styles.predictionMain}>
                        <ThemedText style={[styles.predictionType, { color: colors.primary }]}>
                          {t(`matches.predictions.types.${kebabToCamelCase(predict.id)}`)}
                        </ThemedText>
                        
                        <ThemedView style={[
                          styles.riskBadge,
                          getRiskStyles(calculateRiskLevel(predict.probability))
                        ]}>
                          <ThemedText style={[styles.riskBadgeText]}>
                            {t(`matches.predictions.risk.${calculateRiskLevel(predict.probability)}`)}
                          </ThemedText>
                        </ThemedView>
                      </ThemedView>

                      <ThemedText style={[styles.predictionValue, { color: colors.text }]}>
                        {predict.prediction}
                      </ThemedText>

                      <ThemedText style={[styles.probabilityText, { color: colors.textSecondary }]}>
                        {t('matches.predictions.confidence', { percent: Math.round(predict.probability * 100) })}
                      </ThemedText>
                    </ThemedView>

                    <TouchableOpacity 
                      style={styles.evidenceToggle}
                      onPress={() => togglePrediction(index)}>
                      <ThemedText style={[styles.evidenceToggleText, { color: colors.primary }]}>
                        {expandedPredictions.includes(index) ? t('matches.analysis.hideDetails') : t('matches.analysis.showDetails')}
                      </ThemedText>
                      <Ionicons 
                        name={expandedPredictions.includes(index) ? "chevron-up" : "chevron-down"} 
                        size={16} 
                        color="#666" 
                      />
                    </TouchableOpacity>

                    {expandedPredictions.includes(index) && (
                      <ThemedView style={styles.evidenceContainer}>
                        {predict.evidence ? (
                          <RichText text={predict.evidence} style={styles.evidenceText} />
                        ) : (
                          <ThemedText style={[styles.evidenceText, { color: colors.textSecondary }]}>
                            {t('matches.analysis.noEvidence')}
                          </ThemedText>
                        )}
                      </ThemedView>
                    )}
                  </ThemedView>
                ))}
              </ThemedView>
            </ThemedView>
          )}
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
    color: '#1282A2',
  },
  matchInfo: {
    width: '100%',
    marginBottom: 4,
    alignItems: 'center',
    borderRadius: 12,
  },
  competitionLogo: {
    width: 44,
    height: 44,
    marginBottom: 16,
  },
  teamsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    paddingHorizontal: 20,
  },
  teamName: {
    fontSize: 20,
    fontWeight: '600',
    color: '#000',
    flex: 1,
    textAlign: 'center',
  },
  vsText: {
    fontSize: 16,
    color: '#666',
    marginHorizontal: 16,
  },
  matchDetails: {
    alignItems: 'center',
  },
  competitionName: {
    fontSize: 15,
    color: '#666',
    marginBottom: 12,
  },
  metadataContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  badge: {
    backgroundColor: '#f1f5f9',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  badgeText: {
    fontSize: 13,
    color: '#475569',
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
    marginTop: 24,
  },
  analysisSection: {
    marginBottom: 32,
  },
  predictionsSection: {
    marginBottom: 32,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1e40af',
    marginLeft: 8,
  },
  analysisCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  analysisText: {
    fontSize: 16,
    lineHeight: 24,
    color: '#334155',
  },
  predictionCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  predictionHeader: {
    marginBottom: 12,
  },
  predictionMain: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  predictionType: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
  },
  predictionValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#0f172a',
    marginVertical: 8,
  },
  probabilityText: {
    fontSize: 14,
    color: '#64748b',
  },
  riskBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 6,
  },
  riskyBadge: {
    backgroundColor: '#fee2e2',
  },
  moderateBadge: {
    backgroundColor: '#fef3c7',
  },
  safeBadge: {
    backgroundColor: '#dcfce7',
  },
  riskBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1e293b',
  },
  evidenceToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
    marginTop: 8,
  },
  evidenceToggleText: {
    fontSize: 14,
    color: '#666',
    marginRight: 4,
  },
  evidenceContainer: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
  },
  evidenceText: {
    fontSize: 14,
    lineHeight: 20,
    color: '#64748b',
  },
  loadingContainer: {
    padding: 20,
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    marginTop: 20,
  },
  loadingStep: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  stepIndicator: {
    width: 24,
    height: 24,
    marginRight: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyStep: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#ddd',
  },
  loadingText: {
    fontSize: 16,
    color: '#666',
  },
  activeStep: {
    color: '#007AFF',
    fontWeight: '600',
  },
  completedStep: {
    color: '#4CAF50',
    textDecorationLine: 'line-through',
  },
}); 