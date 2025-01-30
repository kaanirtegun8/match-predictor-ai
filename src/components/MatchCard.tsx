import { StyleSheet, TouchableOpacity, Image, View } from 'react-native';
import { router } from 'expo-router';
import { ThemedText } from './themed/ThemedText';
import { ThemedView } from './themed/ThemedView';
import { Match } from '@/models';
import { useTheme } from '@/contexts/ThemeContext';
import { Colors } from '@/constants/Colors';
import { forwardRef } from 'react';

interface MatchCardProps {
  match: Match;
}

const formatMatchDate = (utcDate: string | undefined): string => {
  if (!utcDate) return 'Date not available';
  
  const date = new Date(utcDate);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

const getScore = (match: Match): string => {
  if (!match.score) return 'vs';
  if (match.status === 'FINISHED') {
    return `${match.score.fullTime.home} - ${match.score.fullTime.away}`;
  }
  if (match.status === 'IN_PLAY' || match.status === 'PAUSED') {
    return `${match.score.fullTime.home ?? 0} - ${match.score.fullTime.away ?? 0}`;
  }
  return 'vs';
};

export const MatchCard = forwardRef<View, MatchCardProps>(({ match }, ref) => {
  const { isDark } = useTheme();
  const colors = isDark ? Colors.dark : Colors.light;
  
  const formattedDate = formatMatchDate(match.utcDate);
  const score = getScore(match);
  const isLive = match.status === 'IN_PLAY' || match.status === 'PAUSED';

  return (
    <View ref={ref}>
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
              {score}
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
    </View>
  );
});

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