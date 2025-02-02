import React from 'react';
import { ScrollView, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { ThemedText } from './themed/ThemedText';
import { ThemedView } from './themed/ThemedView';
import { useTheme } from '@/contexts/ThemeContext';
import { useTranslation } from 'react-i18next';

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
  const { colors } = useTheme();
  const { t } = useTranslation();

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}
    >
      <TouchableOpacity
        style={[
          styles.filterItem,
          { backgroundColor: colors.background, borderColor: colors.border },
          !selectedCompetitionId && { backgroundColor: colors.primary },
        ]}
        onPress={() => onCompetitionSelect(null)}
      >
        <ThemedText style={[
          styles.filterText,
          selectedCompetitionId && { color: colors.text },
        ]}>
          {t('matches.filter.allLeagues')}
        </ThemedText>
      </TouchableOpacity>
      {competitions.map((competition) => (
        <TouchableOpacity
          key={competition.id}
          style={[
            styles.filterItem,
            { backgroundColor: colors.background, borderColor: colors.border },
            selectedCompetitionId === competition.id.toString() && { backgroundColor: colors.primary },
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
            { color: colors.text },
            selectedCompetitionId === competition.id.toString() && { color: colors.textTertiary },
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
    gap: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  filterText: {
    fontSize: 13,
    color: '#666',
  },
  logo: {
    width: 20,
    height: 20,
  },
});