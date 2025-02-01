import { useState, useEffect } from 'react';
import { UserStats } from '@/models/UserStats';
import { getUserStats } from '@/services/statsService';
import { useAuth } from './useAuth';

export function useStats() {
  const [stats, setStats] = useState<UserStats>({
    totalMatches: 0,
    monthlyMatches: 0,
    mostActiveLeague: 'None',
    remainingAnalyses: 3
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { user } = useAuth();

  const loadStats = async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const userStats = await getUserStats();
      setStats(userStats);
    } catch (err) {
      console.error('Error loading stats:', err);
      setError(err instanceof Error ? err : new Error('Failed to load stats'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStats();
  }, [user]);

  return {
    stats,
    loading,
    error,
    refresh: loadStats
  };
} 