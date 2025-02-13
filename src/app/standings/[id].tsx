import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Dimensions, Image, Platform, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ThemedText, ThemedView } from '@/components';
import { getLeagueStandings } from '@/services/footballApi';
import { StandingsResponse } from '@/models';
import { Standing } from '@/models';
import { useTheme } from '@/contexts/ThemeContext';
import { useTranslation } from 'react-i18next';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const isIPad = Platform.OS === 'ios' && SCREEN_WIDTH >= 768;

export default function StandingsScreen() {
    const { id, homeTeamId, awayTeamId } = useLocalSearchParams();
    const [standings, setStandings] = useState<Standing[]>([]);
    const [competition, setCompetition] = useState<StandingsResponse['competition'] | null>(null);
    const [loading, setLoading] = useState(true);
    const { colors } = useTheme();
    const { t } = useTranslation();

    useEffect(() => {
        loadStandings();
    }, [id]);

    async function loadStandings() {
        try {
            setLoading(true);
            const data = await getLeagueStandings(Number(id));
            setStandings(data.standings[0].table);
            setCompetition(data.competition);
        } catch (error) {
            console.error('Error fetching standings:', error);
        } finally {
            setLoading(false);
        }
    }

    if (loading) {
        return (
            <SafeAreaView style={styles.safeArea}>
                <ThemedView style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color={colors.primary} />
                    <ThemedText style={[styles.loadingText, { color: colors.text }]}>
                        {t('common.loading')}
                    </ThemedText>
                </ThemedView>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.border }]}>
            <ScrollView style={[styles.scrollView, { backgroundColor: colors.border }]}>
                <ThemedView style={[styles.container, { backgroundColor: colors.border }]}>
                    {/* Header */}
                    <ThemedView style={[styles.header, { backgroundColor: colors.border }]}>
                        <TouchableOpacity
                            style={styles.backButton}
                            onPress={() => router.back()}>
                            <Ionicons name="chevron-back" size={isIPad ? 32 : 24} color={colors.primary} />
                            <ThemedText style={[styles.backText, { color: colors.primary }]}>
                                {t('common.back')}
                            </ThemedText>
                        </TouchableOpacity>
                    </ThemedView>

                    {/* Competition Info */}
                    {competition && (
                        <ThemedView style={[styles.competitionInfo, { backgroundColor: colors.border }]}>
                            <Image
                                source={{ uri: competition.emblem }}
                                style={styles.competitionLogo}
                                resizeMode="contain"
                            />
                            <ThemedText style={[styles.competitionName, { color: colors.text }]}>
                                {competition.name}
                            </ThemedText>
                        </ThemedView>
                    )}

                    {/* Standings Table */}
                    <ThemedView style={[styles.tableContainer, { backgroundColor: colors.inputBackground }]}>
                        {/* Table Header */}
                        <ThemedView style={[styles.tableHeader, { backgroundColor: colors.primary }]}>
                            <ThemedText style={[styles.headerCell, styles.positionCell, { color: colors.buttonText }]}>
                                {t('standings.headers.position')}
                            </ThemedText>
                            <ThemedText style={[styles.headerCell, styles.teamCell, { color: colors.buttonText }]}>
                                {t('standings.headers.team')}
                            </ThemedText>
                            <ThemedText style={[styles.headerCell, styles.statsCell, { color: colors.buttonText }]}>
                                {t('standings.headers.played')}
                            </ThemedText>
                            <ThemedText style={[styles.headerCell, styles.statsCell, { color: colors.buttonText }]}>
                                {t('standings.headers.won')}
                            </ThemedText>
                            <ThemedText style={[styles.headerCell, styles.statsCell, { color: colors.buttonText }]}>
                                {t('standings.headers.draw')}
                            </ThemedText>
                            <ThemedText style={[styles.headerCell, styles.statsCell, { color: colors.buttonText }]}>
                                {t('standings.headers.lost')}
                            </ThemedText>
                            <ThemedText style={[styles.headerCell, styles.statsCell, { color: colors.buttonText }]}>
                                {t('standings.headers.goalsFor')}
                            </ThemedText>
                            <ThemedText style={[styles.headerCell, styles.statsCell, { color: colors.buttonText }]}>
                                {t('standings.headers.goalsAgainst')}
                            </ThemedText>
                            <ThemedText style={[styles.headerCell, styles.statsCell, { color: colors.buttonText }]}>
                                {t('standings.headers.goalDifference')}
                            </ThemedText>
                            <ThemedText style={[styles.headerCell, styles.pointsCell, { color: colors.buttonText }]}>
                                {t('standings.headers.points')}
                            </ThemedText>
                        </ThemedView>

                        {/* Table Rows */}
                        {standings.map((standing, index) => {
                            const isHighlighted = standing.team.id === Number(homeTeamId) || standing.team.id === Number(awayTeamId);
                            const isEvenRow = index % 2 === 0;
                            return (
                                <ThemedView
                                    key={`${standing.team.id}-${standing.position}`}
                                    style={[
                                        styles.tableRow,
                                        isHighlighted && { backgroundColor: colors.highlight },
                                        !isHighlighted && { 
                                            backgroundColor: isEvenRow ? colors.inputBackground : colors.background,
                                            borderColor: colors.border
                                        }
                                    ]}>
                                    <ThemedText style={[styles.cell, styles.positionCell, isHighlighted && styles.whiteText, { color: colors.text }]}>
                                        {standing.position}
                                    </ThemedText>
                                    <ThemedView style={[styles.teamInfo, { backgroundColor: 'transparent' }]}>
                                        <Image
                                            source={{ uri: standing.team.crest }}
                                            style={styles.teamLogo}
                                            resizeMode="contain"
                                        />
                                        <ThemedText style={[styles.teamName, isHighlighted && styles.whiteText, { color: colors.text }]} numberOfLines={1}>
                                            {standing.team.shortName || standing.team.name}
                                        </ThemedText>
                                    </ThemedView>
                                    <ThemedText style={[styles.cell, styles.statsCell, isHighlighted && styles.whiteText, { color: colors.text }]}>
                                        {standing.playedGames}
                                    </ThemedText>
                                    <ThemedText style={[styles.cell, styles.statsCell, isHighlighted && styles.whiteText, { color: colors.text }]}>
                                        {standing.won}
                                    </ThemedText>
                                    <ThemedText style={[styles.cell, styles.statsCell, isHighlighted && styles.whiteText, { color: colors.text }]}>
                                        {standing.draw}
                                    </ThemedText>
                                    <ThemedText style={[styles.cell, styles.statsCell, isHighlighted && styles.whiteText, { color: colors.text }]}>
                                        {standing.lost}
                                    </ThemedText>
                                    <ThemedText style={[styles.cell, styles.statsCell, isHighlighted && styles.whiteText, { color: colors.text }]}>
                                        {standing.goalsFor}
                                    </ThemedText>
                                    <ThemedText style={[styles.cell, styles.statsCell, isHighlighted && styles.whiteText, { color: colors.text }]}>
                                        {standing.goalsAgainst}
                                    </ThemedText>
                                    <ThemedText style={[styles.cell, styles.statsCell, isHighlighted && styles.whiteText, { color: colors.text }]}>
                                        {standing.goalDifference}
                                    </ThemedText>
                                    <ThemedText style={[styles.cell, styles.pointsCell, isHighlighted && styles.whiteText, { color: colors.text }]}>
                                        {standing.points}
                                    </ThemedText>
                                </ThemedView>
                            );
                        })}
                    </ThemedView>
                </ThemedView>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: 'white',
    },
    scrollView: {
        flex: 1,
    },
    container: {
        flex: 1,
        paddingBottom: 32,
    },
    loadingContainer: {
        flex: 1,
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
        fontSize: isIPad ? 32 : 16,
        marginLeft: 4,
        color: '#1282A2',
    },
    competitionInfo: {
        padding: 20,
        alignItems: 'center',
        marginBottom: 20,
    },
    competitionLogo: {
        width: isIPad ? 120 : 48,
        height: isIPad ? 120 : 48,
        marginBottom: 12,
    },
    competitionName: {
        fontSize: isIPad ? 32 : 20,
        fontWeight: '600',
        color: '#0f172a',
        textAlign: 'center',
        marginHorizontal: 24,
    },
    tableContainer: {
        backgroundColor: '#fff',
        marginHorizontal: 16,
        borderRadius: 16,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
    },
    tableHeader: {
        flexDirection: 'row',
        backgroundColor: '#1282A2',
        paddingVertical: 14,
        paddingHorizontal: 12,
    },
    headerCell: {
        color: '#fff',
        fontSize: 12,
        fontWeight: '600',
        textAlign: 'center',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    tableRow: {
        flexDirection: 'row',
        paddingVertical: 12,
        paddingHorizontal: 12,
        backgroundColor: '#fff',
        alignItems: 'center',
    },
    cell: {
        fontSize: isIPad ? 18 : 13,
        color: '#475569',
        textAlign: 'center',
    },
    positionCell: {
        width: isIPad ? 48 : 28,
        fontWeight: '600',
        color: '#0f172a',
    },
    teamCell: {
        flex: 1,
        textAlign: 'left',
        paddingLeft: 8,
    },
    statsCell: {
        width: isIPad ? 48 : 28,
        textAlign: 'center',
    },
    pointsCell: {
        width: isIPad ? 48 : 28,
        textAlign: 'center',
        fontWeight: 'bold',
    },
    teamInfo: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    teamLogo: {
        width: isIPad ? 48 : 20,
        height: isIPad ? 48 : 20,
    },
    teamName: {
        flex: 1,
        fontSize: isIPad ? 18 : 13,
        color: '#475569',
    },
    teamInfoBackground: {
        backgroundColor: '#fff',
        borderRadius: 4,
    },
    whiteText: {
        color: '#1282A2',
        fontWeight: '500',
    },
    loadingText: {
        fontSize: isIPad ? 32 : 16,
        marginTop: 16,
        color: '#475569',
    },
});