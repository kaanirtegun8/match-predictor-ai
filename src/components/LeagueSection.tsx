import { StyleSheet, Image, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { ThemedText } from './themed/ThemedText';
import { ThemedView } from './themed/ThemedView';
import { MatchCard } from './MatchCard';
import { Match } from '@/models';
import { useTheme } from '@/contexts/ThemeContext';
import { Colors } from '@/constants/Colors';

interface LeagueSectionProps {
  matches: Match[];
}

export function LeagueSection({ matches }: LeagueSectionProps) {
  const { colors } = useTheme();

  if (!matches || matches.length === 0) return null;

  const competition = matches[0].competition;

  const handleHeaderPress = () => {
    router.push(`/standings/${competition.id}`);
  };

  return (
    <ThemedView style={[styles.container, { backgroundColor: colors.border }]}>
      <TouchableOpacity onPress={handleHeaderPress}>
        <ThemedView style={[styles.header, { backgroundColor: colors.primary }]}>
          <Image
            source={{ uri: competition.emblem }}
            style={styles.logo}
            resizeMode="contain"
          />
          <ThemedText style={[styles.title, { color: colors.buttonText }]}>
            {competition.name}
          </ThemedText>
        </ThemedView>
      </TouchableOpacity>
      <ThemedView style={styles.matchList}>
        {matches.map((match) => (
          <MatchCard key={match.id} match={match} />
        ))}
      </ThemedView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    gap: 12,
    borderTopEndRadius: 12,
    borderTopStartRadius: 12,
  },
  logo: {
    width: 24,
    height: 24,
  },
  title: {
    fontSize: 13,
    fontWeight: '600',
  },
  matchList: {
    borderBottomEndRadius: 12,
    borderBottomStartRadius: 12,
    overflow: 'hidden',
  },
}); 