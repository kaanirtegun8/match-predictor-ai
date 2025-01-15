import React from 'react';
import { ScrollView, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { ThemedText } from './themed/ThemedText';
import { ThemedView } from './themed/ThemedView';

interface Competition {
  id: number;
  name: string;
  emblem: string;
}

interface FilterBarProps {
  competitions: Competition[];
  selectedCompetitionId: string | null;
  onCompetitionSelect: (competitionId: string | null) => void;
}

export function FilterBar({ competitions, selectedCompetitionId, onCompetitionSelect }: FilterBarProps) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}
    >
      <TouchableOpacity
        style={[
          styles.filterItem,
          !selectedCompetitionId && styles.selectedItem,
        ]}
        onPress={() => onCompetitionSelect(null)}
      >
        <ThemedText style={[
          styles.filterText,
          !selectedCompetitionId && styles.selectedText,
        ]}>
          All
        </ThemedText>
      </TouchableOpacity>
      {competitions.map((competition) => (
        <TouchableOpacity
          key={competition.id}
          style={[
            styles.filterItem,
            selectedCompetitionId === competition.id.toString() && styles.selectedItem,
          ]}
          onPress={() => onCompetitionSelect(competition.id.toString())}
        >
          <Image
            source={{ uri: competition.emblem }}
            style={styles.logo}
            resizeMode="contain"
          />
          <ThemedText style={[
            styles.filterText,
            selectedCompetitionId === competition.id.toString() && styles.selectedText,
          ]}>
            {competition.name}
          </ThemedText>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 12,
    gap: 8,
  },
  filterItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#fff',
    gap: 8,
  },
  selectedItem: {
    backgroundColor: '#65a30d',
  },
  filterText: {
    fontSize: 13,
    color: '#666',
  },
  selectedText: {
    color: '#fff',
    fontWeight: '600',
  },
  logo: {
    width: 20,
    height: 20,
  },
}); 