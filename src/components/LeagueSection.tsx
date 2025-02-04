import { StyleSheet, Image, TouchableOpacity, Platform, Dimensions } from 'react-native';
import { router } from 'expo-router';
import { ThemedText } from './themed/ThemedText';
import { ThemedView } from './themed/ThemedView';
import { MatchCard } from './MatchCard';
import { Match } from '@/models';
import { useTheme } from '@/contexts/ThemeContext';
import { Colors } from '@/constants/Colors';
import { RefObject } from 'react';

interface LeagueSectionProps {
  matches: Match[];
  firstMatchRef?: RefObject<any>;
}

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const isIPad = Platform.OS === 'ios' && SCREEN_WIDTH >= 768;

export function LeagueSection({ matches, firstMatchRef }: LeagueSectionProps) {
  const { colors } = useTheme();
  if (!matches || matches.length === 0) return null;

  const competition = matches[0].competition;

  const handleHeaderPress = () => {
    router.push(`/standings/${competition.id}`);
  };

  return (
    <ThemedView style={[
      styles.container, 
      { backgroundColor: colors.border },
      isIPad && styles.containerTablet
    ]}>
      <TouchableOpacity onPress={handleHeaderPress}>
        <ThemedView style={[
          styles.header, 
          { backgroundColor: colors.primary },
          isIPad && styles.headerTablet
        ]}>
          <Image
            source={{ uri: competition.emblem }}
            style={[styles.logo, isIPad && styles.logoTablet]}
            resizeMode="contain"
          />
          <ThemedText style={[
            styles.title, 
            { color: colors.inputBackground },
            isIPad && styles.titleTablet
          ]}>
            {competition.name}
          </ThemedText>
        </ThemedView>
      </TouchableOpacity>
      <ThemedView style={styles.matchList}>
        {matches.map((match, index) => (
          <MatchCard 
            key={match.id}
            match={match} 
            ref={index === 0 ? firstMatchRef : undefined}
          />
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
  containerTablet: {
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  headerTablet: {
    padding: 16,
    gap: 16,
    borderTopEndRadius: 16,
    borderTopStartRadius: 16,
  },
  logoTablet: {
    width: 32,
    height: 32,
  },
  titleTablet: {
    fontSize: 18,
  },
}); 