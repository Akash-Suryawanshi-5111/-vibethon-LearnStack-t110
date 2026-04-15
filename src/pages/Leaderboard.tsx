import { useEffect, useState } from 'react';
import { collection, query, orderBy, limit, getDocs } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Trophy, Medal, Flame } from 'lucide-react';
import { motion } from 'framer-motion';

interface LeaderboardUser {
  uid: string;
  displayName: string;
  xp: number;
  streak: number;
}

export default function Leaderboard() {
  const [users, setUsers] = useState<LeaderboardUser[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const q = query(collection(db, 'users'), orderBy('xp', 'desc'), limit(10));
        const snapshot = await getDocs(q);
        const data = snapshot.docs.map(doc => ({
          uid: doc.id,
          ...doc.data()
        })) as LeaderboardUser[];
        setUsers(data);
      } catch (error) {
        console.error('Error fetching leaderboard:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, []);

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <header className="text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-amber-50 text-amber-500 mb-4">
          <Trophy size={32} />
        </div>
        <h1 className="text-3xl font-bold text-slate-900">Global Leaderboard</h1>
        <p className="text-slate-500 mt-2">Compete with learners worldwide and climb the ranks.</p>
      </header>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 bg-slate-50 border-b border-slate-200 grid grid-cols-12 gap-4 text-sm font-medium text-slate-500">
          <div className="col-span-2 text-center">Rank</div>
          <div className="col-span-6">Learner</div>
          <div className="col-span-2 text-center">Streak</div>
          <div className="col-span-2 text-right">XP</div>
        </div>

        {loading ? (
          <div className="p-12 flex justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-maroon-600"></div>
          </div>
        ) : users.length === 0 ? (
          <div className="p-12 text-center text-slate-500">
            No learners found. Be the first to earn XP!
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {users.map((user, index) => (
              <motion.div
                key={user.uid}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="p-6 grid grid-cols-12 gap-4 items-center hover:bg-slate-50 transition-colors"
              >
                <div className="col-span-2 flex justify-center">
                  {index === 0 ? (
                    <Medal className="text-amber-400" size={28} />
                  ) : index === 1 ? (
                    <Medal className="text-slate-400" size={28} />
                  ) : index === 2 ? (
                    <Medal className="text-amber-700" size={28} />
                  ) : (
                    <span className="text-lg font-bold text-slate-400">#{index + 1}</span>
                  )}
                </div>
                <div className="col-span-6 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-maroon-100 text-maroon-700 flex items-center justify-center font-bold text-lg">
                    {user.displayName.charAt(0).toUpperCase()}
                  </div>
                  <span className="font-bold text-slate-900">{user.displayName}</span>
                </div>
                <div className="col-span-2 flex justify-center items-center gap-1.5 text-orange-500 font-medium">
                  <Flame size={18} />
                  {user.streak}
                </div>
                <div className="col-span-2 text-right font-bold text-maroon-600">
                  {user.xp} XP
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
