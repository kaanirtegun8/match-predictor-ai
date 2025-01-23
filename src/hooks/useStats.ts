import { useState, useEffect } from 'react';
import { collection, query, where, onSnapshot, serverTimestamp } from 'firebase/firestore';
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
    if (!user) return;

    setLoading(true);
    const analysesRef = collection(db, 'users', user.uid, 'analyses');
    
    // Get monthly matches query
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);
    
    const monthlyQuery = query(
      analysesRef,
      where('analyzedAt', '>=', startOfMonth)
    );

    // Real-time listener for all analyses
    const unsubscribe = onSnapshot(analysesRef, (snapshot) => {
      const total = snapshot.size;
      const leagueCounts: { [key: string]: number } = {};
      
      snapshot.forEach(doc => {
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

      // Real-time listener for monthly matches
      const monthlyUnsubscribe = onSnapshot(monthlyQuery, (monthlySnapshot) => {
        setStats({
          totalMatches: total,
          monthlyMatches: monthlySnapshot.size,
          mostActiveLeague: mostActive,
        });
        setLoading(false);
      });

      return () => monthlyUnsubscribe();
    });

    // Cleanup function
    return () => unsubscribe();
  }, [user]);

  return { stats, loading };
}; 