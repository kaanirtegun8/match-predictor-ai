import { useState, useEffect } from 'react';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { db } from '@/config/firebase';
import { useAuth } from './useAuth';

export interface UserStats {
  totalMatches: number;
  monthlyMatches: number;
  mostActiveLeague: string;
}

const defaultStats = {
  totalMatches: 0,
  monthlyMatches: 0,
  mostActiveLeague: '',
};

export const useStats = () => {
  const [stats, setStats] = useState<UserStats>(defaultStats);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (!user) {
      setStats(defaultStats);
      setLoading(false);
      return;
    }

    let monthlyUnsubscribe: (() => void) | null = null;
    setLoading(true);

    const analysesRef = collection(db, 'users', user.uid, 'analyses');
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);
    
    const monthlyQuery = query(
      analysesRef,
      where('analyzedAt', '>=', startOfMonth)
    );

    const unsubscribe = onSnapshot(
      analysesRef,
      {
        next: (snapshot) => {
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

          if (monthlyUnsubscribe) {
            monthlyUnsubscribe();
          }

          monthlyUnsubscribe = onSnapshot(
            monthlyQuery,
            {
              next: (monthlySnapshot) => {
                setStats({
                  totalMatches: total,
                  monthlyMatches: monthlySnapshot.size,
                  mostActiveLeague: mostActive,
                });
                setLoading(false);
              },
              error: (error) => {
                console.log('Monthly stats error:', error);
                setLoading(false);
              }
            }
          );
        },
        error: (error) => {
          console.log('Total stats error:', error);
          setLoading(false);
        }
      }
    );

    return () => {
      unsubscribe();
      if (monthlyUnsubscribe) {
        monthlyUnsubscribe();
      }
    };
  }, [user]);

  return { stats, loading };
}; 