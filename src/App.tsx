import { useEffect, ReactNode } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './lib/firebase';
import { useAuthStore } from './store/useAuthStore';

// Layouts
import MainLayout from './layouts/MainLayout';

// Pages
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import Dashboard from './pages/Dashboard';
import ModulesList from './pages/ModulesList';
import ModuleDetail from './pages/ModuleDetail';
import Playground from './pages/Playground';
import GamesList from './pages/GamesList';
import DecisionTreeGame from './pages/games/DecisionTreeGame';
import ClassificationGame from './pages/games/ClassificationGame';
import NeuralNetworkGame from './pages/games/NeuralNetworkGame';
import Leaderboard from './pages/Leaderboard';

function ProtectedRoute({ children }: { children: ReactNode }) {
  const { user, loading } = useAuthStore();
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-maroon-600"></div>
      </div>
    );
  }
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
}

export default function App() {
  const { setUser } = useAuthStore();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });
    return () => unsubscribe();
  }, [setUser]);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        
        <Route element={<ProtectedRoute><MainLayout /></ProtectedRoute>}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/modules" element={<ModulesList />} />
          <Route path="/modules/:id" element={<ModuleDetail />} />
          <Route path="/playground" element={<Playground />} />
          <Route path="/games" element={<GamesList />} />
          <Route path="/games/decision-tree" element={<DecisionTreeGame />} />
          <Route path="/games/classification" element={<ClassificationGame />} />
          <Route path="/games/neural-network" element={<NeuralNetworkGame />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
        </Route>
      </Routes>
    </Router>
  );
}
