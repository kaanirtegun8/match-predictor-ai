import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Image, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText, ThemedView } from '@/components';
import { Standing, StandingsResponse, getLeagueStandings } from '@/services/footballApi';

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#f5f5f5',
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
        shadowRadius: 3,
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
    competitionInfo: {
        padding: 16,
        alignItems: 'center',
        marginBottom: 16,
    },
    competitionLogo: {
        width: 40,
        height: 40,
        marginBottom: 8,
    },
    competitionName: {
        fontSize: 18,
        fontWeight: '600',
        color: '#333',
    },
    tableContainer: {
        backgroundColor: '#fff',
        marginHorizontal: 16,
        borderRadius: 12,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 3,
    },
    tableHeader: {
        flexDirection: 'row',
        backgroundColor: '#1282A2',
        paddingVertical: 12,
        paddingHorizontal: 8,
    },
    headerCell: {
        color: '#fff',
        fontSize: 11,
        fontWeight: '600',
        textAlign: 'center',
    },
    tableRow: {
        flexDirection: 'row',
        paddingVertical: 12,
        paddingHorizontal: 8,
        backgroundColor: '#fff',
        alignItems: 'center',
    },
    cell: {
        fontSize: 13,
        color: '#333',
        textAlign: 'center',
    },
    positionCell: {
        width: 25,
    },
    teamCell: {
        flex: 1,
        marginRight: 8,
    },
    teamInfo: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginRight: 8,
        maxWidth: '45%',
    },
    teamLogo: {
        width: 20,
        height: 20,
        minWidth: 20,
    },
    teamName: {
        fontSize: 12,
        color: '#333',
        flex: 1,
    },
    statsCell: {
        width: 28,
    },
    pointsCell: {
        width: 32,
        fontWeight: '600',
    },
    teamInfoBackground: {
        backgroundColor: '#fff',
        borderRadius: 4,
    },
    highlightedRow: {
        backgroundColor: '#1282A2',
    },
    whiteText: {
        color: '#fff',
    },
});

export default function StandingsScreen() {
    const { id, homeTeamId, awayTeamId } = useLocalSearchParams();
    const [standings, setStandings] = useState<Standing[]>([]);
    const [competition, setCompetition] = useState<StandingsResponse['competition'] | null>(null);
    const [loading, setLoading] = useState(true);

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
                    <ActivityIndicator size="large" color="#1282A2" />
                </ThemedView>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.safeArea}>
            <ScrollView style={styles.scrollView}>
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
                    {competition && (
                        <ThemedView style={styles.competitionInfo}>
                            <Image
                                source={{ uri: competition.emblem }}
                                style={styles.competitionLogo}
                                resizeMode="contain"
                            />
                            <ThemedText style={styles.competitionName}>
                                {competition.name}
                            </ThemedText>
                        </ThemedView>
                    )}

                    {/* Standings Table */}
                    <ThemedView style={styles.tableContainer}>
                        {/* Table Header */}
                        <ThemedView style={styles.tableHeader}>
                            <ThemedText style={[styles.headerCell, styles.positionCell]}>#</ThemedText>
                            <ThemedText style={[styles.headerCell, styles.teamCell]}>Team</ThemedText>
                            <ThemedText style={[styles.headerCell, styles.statsCell]}>MP</ThemedText>
                            <ThemedText style={[styles.headerCell, styles.statsCell]}>W</ThemedText>
                            <ThemedText style={[styles.headerCell, styles.statsCell]}>D</ThemedText>
                            <ThemedText style={[styles.headerCell, styles.statsCell]}>L</ThemedText>
                            <ThemedText style={[styles.headerCell, styles.statsCell]}>GF</ThemedText>
                            <ThemedText style={[styles.headerCell, styles.statsCell]}>GA</ThemedText>
                            <ThemedText style={[styles.headerCell, styles.statsCell]}>GD</ThemedText>
                            <ThemedText style={[styles.headerCell, styles.pointsCell]}>Pts</ThemedText>
                        </ThemedView>

                        {/* Table Rows */}
                        {standings.map((standing) => {
                            const isHighlighted = standing.team.id === Number(homeTeamId) || standing.team.id === Number(awayTeamId);
                            return (
                                <ThemedView
                                    key={`${standing.team.id}-${standing.position}`}
                                    style={[styles.tableRow, isHighlighted && styles.highlightedRow]}>
                                    <ThemedText style={[styles.cell, styles.positionCell, isHighlighted && styles.whiteText]}>
                                        {standing.position}
                                    </ThemedText>
                                    <ThemedView style={[styles.teamInfo, { backgroundColor: 'transparent' }]}>
                                        <Image
                                            source={{ uri: standing.team.crest }}
                                            style={styles.teamLogo}
                                            resizeMode="contain"
                                        />
                                        <ThemedText style={[styles.teamName, isHighlighted && styles.whiteText]} numberOfLines={1}>
                                            {standing.team.shortName || standing.team.name}
                                        </ThemedText>
                                    </ThemedView>
                                    <ThemedText style={[styles.cell, styles.statsCell, isHighlighted && styles.whiteText]}>
                                        {standing.playedGames}
                                    </ThemedText>
                                    <ThemedText style={[styles.cell, styles.statsCell, isHighlighted && styles.whiteText]}>
                                        {standing.won}
                                    </ThemedText>
                                    <ThemedText style={[styles.cell, styles.statsCell, isHighlighted && styles.whiteText]}>
                                        {standing.draw}
                                    </ThemedText>
                                    <ThemedText style={[styles.cell, styles.statsCell, isHighlighted && styles.whiteText]}>
                                        {standing.lost}
                                    </ThemedText>
                                    <ThemedText style={[styles.cell, styles.statsCell, isHighlighted && styles.whiteText]}>
                                        {standing.goalsFor}
                                    </ThemedText>
                                    <ThemedText style={[styles.cell, styles.statsCell, isHighlighted && styles.whiteText]}>
                                        {standing.goalsAgainst}
                                    </ThemedText>
                                    <ThemedText style={[styles.cell, styles.statsCell, isHighlighted && styles.whiteText]}>
                                        {standing.goalDifference}
                                    </ThemedText>
                                    <ThemedText style={[styles.cell, styles.pointsCell, isHighlighted && styles.whiteText]}>
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