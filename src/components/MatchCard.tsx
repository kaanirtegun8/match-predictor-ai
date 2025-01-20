import { StyleSheet, TouchableOpacity, Image } from 'react-native';
import { router } from 'expo-router';
import { ThemedText } from './themed/ThemedText';
import { ThemedView } from './themed/ThemedView';
import { Match } from '@/models';
import { useTheme } from '@/contexts/ThemeContext';
import { Colors } from '@/constants/Colors';

interface MatchCardProps {
  match: Match;
}

export function MatchCard({ match }: MatchCardProps) {
  const { isDark } = useTheme();
  const colors = isDark ? Colors.dark : Colors.light;
  
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
      style={[styles.container, { borderBottomColor: colors.border }]}
      onPress={() => router.push(`/match/${match.id}`)}>
      <ThemedView style={styles.content}>
        {/* Date and Status */}
        <ThemedView style={styles.dateContainer}>
          <ThemedText style={[styles.date, { color: colors.textSecondary }]}>
            {formattedDate}
          </ThemedText>
          {isLive && (
            <ThemedView style={styles.liveContainer}>
              <ThemedText style={[styles.liveIndicator, { color: colors.error }]}>
                LIVE
              </ThemedText>
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
            <ThemedText style={[styles.teamName, { color: colors.text }]} numberOfLines={1}>
              {match.homeTeam.shortName || match.homeTeam.name}
            </ThemedText>
          </ThemedView>

          {/* Score */}
          <ThemedView style={styles.scoreContainer}>
            <ThemedText style={[
              styles.score,
              { color: colors.text },
              isLive && { color: colors.error }
            ]}>
              {isFinished || isLive
                ? `${match.score.fullTime.home} - ${match.score.fullTime.away}`
                : 'vs'}
            </ThemedText>
          </ThemedView>

          {/* Away Team */}
          <ThemedView style={[styles.teamContainer, styles.awayTeam]}>
            <ThemedText style={[styles.teamName, styles.awayTeamName, { color: colors.text }]} numberOfLines={1}>
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
  },
  liveContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  liveIndicator: {
    fontSize: 12,
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
  },
}); 