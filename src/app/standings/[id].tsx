import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Image, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ThemedText, ThemedView } from '@/components';
import { getLeagueStandings } from '@/services/footballApi';
import { StandingsResponse } from '@/models';
import { Standing } from '@/models';
import { useTheme } from '@/contexts/ThemeContext';


export default function StandingsScreen() {
    const { id, homeTeamId, awayTeamId } = useLocalSearchParams();
    const [standings, setStandings] = useState<Standing[]>([]);
    const [competition, setCompetition] = useState<StandingsResponse['competition'] | null>(null);
    const [loading, setLoading] = useState(true);
    const { colors } = useTheme();

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
                </ThemedView>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
            <ScrollView style={[styles.scrollView, { backgroundColor: colors.background }]}>
                <ThemedView style={[styles.container, { backgroundColor: colors.background }]}>
                    {/* Header */}
                    <ThemedView style={[styles.header, { backgroundColor: colors.background }]}>
                        <TouchableOpacity
                            style={styles.backButton}
                            onPress={() => router.back()}>
                            <Ionicons name="chevron-back" size={24} color={colors.primary} />
                            <ThemedText style={[styles.backText, { color: colors.primary }]}>Back</ThemedText>
                        </TouchableOpacity>
                    </ThemedView>

                    {/* Competition Info */}
                    {competition && (
                        <ThemedView style={styles.competitionInfo}>
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
                            <ThemedText style={[styles.headerCell, styles.positionCell, { color: colors.buttonText }]}>#</ThemedText>
                            <ThemedText style={[styles.headerCell, styles.teamCell, { color: colors.buttonText }]}>Team</ThemedText>
                            <ThemedText style={[styles.headerCell, styles.statsCell, { color: colors.buttonText }]}>MP</ThemedText>
                            <ThemedText style={[styles.headerCell, styles.statsCell, { color: colors.buttonText }]}>W</ThemedText>
                            <ThemedText style={[styles.headerCell, styles.statsCell, { color: colors.buttonText }]}>D</ThemedText>
                            <ThemedText style={[styles.headerCell, styles.statsCell, { color: colors.buttonText }]}>L</ThemedText>
                            <ThemedText style={[styles.headerCell, styles.statsCell, { color: colors.buttonText }]}>GF</ThemedText>
                            <ThemedText style={[styles.headerCell, styles.statsCell, { color: colors.buttonText }]}>GA</ThemedText>
                            <ThemedText style={[styles.headerCell, styles.statsCell, { color: colors.buttonText }]}>GD</ThemedText>
                            <ThemedText style={[styles.headerCell, styles.pointsCell, { color: colors.buttonText }  ]}>Pts</ThemedText>
                        </ThemedView>

                        {/* Table Rows */}
                        {standings.map((standing) => {
                            const isHighlighted = standing.team.id === Number(homeTeamId) || standing.team.id === Number(awayTeamId);
                            return (
                                <ThemedView
                                    key={`${standing.team.id}-${standing.position}`}
                                    style={[styles.tableRow, isHighlighted && styles.highlightedRow, { backgroundColor: colors.inputBackground, borderColor: colors.border}]}>
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
        borderBottomWidth: StyleSheet.hairlineWidth,
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
    competitionInfo: {
        padding: 20,
        alignItems: 'center',
        marginBottom: 20,
    },
    competitionLogo: {
        width: 48,
        height: 48,
        marginBottom: 12,
    },
    competitionName: {
        fontSize: 20,
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
        borderBottomWidth: 1,
        borderLeftWidth: 1,
        borderRightWidth: 1,
    },
    cell: {
        fontSize: 13,
        color: '#475569',
        textAlign: 'center',
    },
    positionCell: {
        width: 28,
        fontWeight: '600',
        color: '#0f172a',
    },
    teamCell: {
        flex: 1,
        textAlign: 'left',
        paddingLeft: 8,
    },
    statsCell: {
        width: 28,
        textAlign: 'center',
    },
    pointsCell: {
        width: 32,
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
        width: 20,
        height: 20,
    },
    teamName: {
        flex: 1,
        fontSize: 13,
        color: '#475569',
    },
    teamInfoBackground: {
        backgroundColor: '#fff',
        borderRadius: 4,
    },
    highlightedRow: {
        backgroundColor: '#E3F2FD',
    },
    whiteText: {
        color: '#1282A2',
        fontWeight: '500',
    },
});