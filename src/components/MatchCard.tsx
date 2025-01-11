import { StyleSheet, TouchableOpacity, Image } from 'react-native';
import { router } from 'expo-router';

import { Match } from '../services/footballApi';
import { ThemedText } from './themed/ThemedText';
import { ThemedView } from './themed/ThemedView';

interface MatchCardProps {
  match: Match;
}

export function MatchCard({ match }: MatchCardProps) {
  const matchDate = new Date(match.utcDate);
  const formattedDate = matchDate.toLocaleDateString('en-GB', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  const isLive = match.status === 'IN_PLAY' || match.status === 'PAUSED';
  const isFinished = match.status === 'FINISHED';

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => router.push(`/match/${match.id}`)}>
      <ThemedView style={styles.content}>
        {/* Date and Status */}
        <ThemedView style={styles.dateContainer}>
          <ThemedText style={styles.date}>{formattedDate}</ThemedText>
          {isLive && (
            <ThemedView style={styles.liveContainer}>
              <ThemedText style={styles.liveIndicator}>LIVE</ThemedText>
            </ThemedView>
          )}
        </ThemedView>

        {/* Teams and Score */}
        <ThemedView style={styles.matchInfo}>
          {/* Home Team */}
          <ThemedView style={styles.teamContainer}>
            <Image
              source={{ uri: match.homeTeam.crest }}
              style={styles.teamLogo}
              resizeMode="contain"
            />
            <ThemedText style={styles.teamName} numberOfLines={1}>
              {match.homeTeam.shortName || match.homeTeam.name}
            </ThemedText>
          </ThemedView>

          {/* Score */}
          <ThemedView style={styles.scoreContainer}>
            <ThemedText style={[
              styles.score,
              isLive && styles.liveScore
            ]}>
              {isFinished || isLive
                ? `${match.score.fullTime.home} - ${match.score.fullTime.away}`
                : 'vs'}
            </ThemedText>
          </ThemedView>

          {/* Away Team */}
          <ThemedView style={[styles.teamContainer, styles.awayTeam]}>
            <ThemedText style={[styles.teamName, styles.awayTeamName]} numberOfLines={1}>
              {match.awayTeam.shortName || match.awayTeam.name}
            </ThemedText>
            <Image
              source={{ uri: match.awayTeam.crest }}
              style={styles.teamLogo}
              resizeMode="contain"
            />
          </ThemedView>
        </ThemedView>
      </ThemedView>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#e0e0e0',
  },
  content: {
    gap: 4,
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  date: {
    fontSize: 12,
    color: '#666',
  },
  liveContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  liveIndicator: {
    fontSize: 12,
    color: '#ff4444',
    fontWeight: '600',
  },
  liveMinute: {
    fontSize: 12,
    color: '#ff4444',
    fontWeight: '600',
  },
  matchInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  teamContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  awayTeam: {
    justifyContent: 'flex-end',
  },
  teamLogo: {
    width: 24,
    height: 24,
  },
  teamName: {
    fontSize: 14,
    color: '#333',
  },
  awayTeamName: {
    textAlign: 'right',
  },
  scoreContainer: {
    paddingHorizontal: 12,
  },
  score: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  liveScore: {
    color: '#ff4444',
  },
}); 