import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, TouchableOpacity, ScrollView, Image } from 'react-native';

import { ThemedText } from './themed/ThemedText';
import { ThemedView } from './themed/ThemedView';
import { Competition } from '../services/footballApi';

interface FilterBarProps {
  competitions: Competition[];
  selectedCompetition: Competition | null;
  onCompetitionSelect: (competition: Competition | null) => void;
}

export function FilterBar({
  competitions,
  selectedCompetition,
  onCompetitionSelect,
}: FilterBarProps) {
  return (
    <ThemedView style={styles.container}>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        style={styles.leagueScroll}
        contentContainerStyle={styles.leagueContent}>
        <TouchableOpacity
          style={[
            styles.leagueButton,
            !selectedCompetition && styles.selectedLeagueButton,
          ]}
          onPress={() => onCompetitionSelect(null)}>
          <Ionicons 
            name="football" 
            size={24} 
            color={!selectedCompetition ? '#fff' : '#666'} 
          />
          <ThemedText style={[
            styles.leagueText,
            !selectedCompetition && styles.selectedLeagueText,
          ]}>
            All Leagues
          </ThemedText>
        </TouchableOpacity>
        {competitions.map((competition) => (
          <TouchableOpacity
            key={competition.id}
            style={[
              styles.leagueButton,
              selectedCompetition?.id === competition.id && styles.selectedLeagueButton,
            ]}
            onPress={() => onCompetitionSelect(competition)}>
            <Image
              source={{ uri: competition.emblem }}
              style={styles.leagueLogo}
              resizeMode="contain"
            />
            <ThemedText style={[
              styles.leagueText,
              selectedCompetition?.id === competition.id && styles.selectedLeagueText,
            ]}>
              {competition.name}
            </ThemedText>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    paddingVertical: 12,
    gap: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  leagueScroll: {
  },
  leagueContent: {
    gap: 8,
    paddingHorizontal: 16,
    paddingEnd: 24,
  },
  leagueButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#f5f5f5',
  },
  selectedLeagueButton: {
    backgroundColor: '#1282A2',
  },
  leagueLogo: {
    width: 24,
    height: 24,
  },
  leagueText: {
    fontSize: 14,
    color: '#666',
  },
  selectedLeagueText: {
    color: '#fff',
    fontWeight: '600',
  },
}); 