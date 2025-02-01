import { UserStats } from '@/models/UserStats';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { auth } from '@/config/firebase';
import { getMonthlyAnalysisCount } from './userService';
import { db } from '@/config/firebase';

const FREE_MONTHLY_LIMIT = 3;

export async function getUserStats(): Promise<UserStats> {
  const userId = auth.currentUser?.uid;

  if (!userId) {
    throw new Error('User not authenticated');
  }

  try {
    // Get monthly analyses count
    const monthlyMatches = await getMonthlyAnalysisCount(userId);

    // Get total analyses from user's subcollection
    const analysesRef = collection(db, 'users', userId, 'analyses');
    const totalSnapshot = await getDocs(analysesRef);
    const totalMatches = totalSnapshot.size;

    // Calculate most active league
    const leagueCounts = new Map<string, number>();
    totalSnapshot.forEach(doc => {
      const data = doc.data();
      if (data.leagueName) {
        leagueCounts.set(data.leagueName, (leagueCounts.get(data.leagueName) || 0) + 1);
      }
    });

    let mostActiveLeague = 'None';
    let maxCount = 0;
    leagueCounts.forEach((count, league) => {
      if (count > maxCount) {
        maxCount = count;
        mostActiveLeague = league;
      }
    });

    // Calculate remaining analyses
    const remainingAnalyses = Math.max(0, FREE_MONTHLY_LIMIT - monthlyMatches);

    return {
      totalMatches,
      monthlyMatches,
      mostActiveLeague,
      remainingAnalyses
    };
  } catch (error) {
    console.error('Error getting user stats:', error);
    throw error;
  }
} 