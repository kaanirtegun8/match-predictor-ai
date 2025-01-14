import { StyleSheet, Image, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { ThemedText } from './themed/ThemedText';
import { ThemedView } from './themed/ThemedView';
import { MatchCard } from './MatchCard';
import { Match } from '@/models';

interface LeagueSectionProps {
  matches: Match[];
}

export function LeagueSection({ matches }: LeagueSectionProps) {
  if (!matches || matches.length === 0) return null;

  const competition = matches[0].competition;

  const handleHeaderPress = () => {
    router.push(`/standings/${competition.id}`);
  };

  return (
    <ThemedView style={styles.container}>
      <TouchableOpacity onPress={handleHeaderPress}>
        <ThemedView style={styles.header}>
          <Image
            source={{ uri: competition.emblem }}
            style={styles.logo}
            resizeMode="contain"
          />
          <ThemedText style={styles.title}>{competition.name}</ThemedText>
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
    backgroundColor: '#f5f5f5',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 3,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#65a30d',
    gap: 12,
    borderTopEndRadius: 12,
    borderTopStartRadius: 12,
  },
  logo: {
    width: 24,
    height: 24,
  },
  premierLeagueLogo: {
    width: 28,
    height: 28,
  },
  title: {
    fontSize: 13,
    fontWeight: '600',
    color: '#fff',
  },
  matchList: {
    backgroundColor: '#fff',
  },
  leagueLogo: {
    width: 24,
    height: 24,
  },
  leagueName: {
    fontSize: 13,
    fontWeight: '600',
    color: '#fff',
  },
  matchesContainer: {
    backgroundColor: '#fff',
  },
}); 