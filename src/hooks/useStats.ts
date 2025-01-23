import { useState, useEffect } from 'react';
import { collection, query, where, getDocs, orderBy, limit } from 'firebase/firestore';
import { db } from '@/config/firebase';
import { useAuth } from './useAuth';

export interface UserStats {
  totalMatches: number;
  monthlyMatches: number;
  mostActiveLeague: string;
}

export const useStats = () => {
  const [stats, setStats] = useState<UserStats>({
    totalMatches: 0,
    monthlyMatches: 0,
    mostActiveLeague: '',
  });
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchStats = async () => {
      if (!user) return;

      try {
        setLoading(true);
        const analysesRef = collection(db, 'users', user.uid, 'analyses');
        
        // Get total matches
        const totalSnapshot = await getDocs(analysesRef);
        const total = totalSnapshot.size;

        // Get monthly matches
        const startOfMonth = new Date();
        startOfMonth.setDate(1);
        startOfMonth.setHours(0, 0, 0, 0);
        
        const monthlyQuery = query(
          analysesRef,
          where('analyzedAt', '>=', startOfMonth)
        );
        const monthlySnapshot = await getDocs(monthlyQuery);
        const monthly = monthlySnapshot.size;

        // Get most active league
        const leagueCounts: { [key: string]: number } = {};
        totalSnapshot.forEach(doc => {
          const data = doc.data();
          const leagueName = data.leagueName;
          leagueCounts[leagueName] = (leagueCounts[leagueName] || 0) + 1;
        });

        let mostActive = 'No matches yet';
        if (Object.keys(leagueCounts).length > 0) {
          mostActive = Object.entries(leagueCounts).reduce((a, b) => 
            (a[1] > b[1] ? a : b)
          )[0];
        }

        setStats({
          totalMatches: total,
          monthlyMatches: monthly,
          mostActiveLeague: mostActive,
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [user]);

  return { stats, loading };
}; 