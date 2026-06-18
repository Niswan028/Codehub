import { useEffect, useState } from 'react';
import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { supabase, getCurrentUser } from './lib/supabase';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import Analyze from './pages/Analyze';
import Problem from './pages/Problem';

function App() {
  const [user, setUser] = useState(null);
  const [topics, setTopics] = useState([]);
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
      if (!session?.user && location.pathname !== '/login' && location.pathname !== '/signup') {
        navigate('/login');
      }
    });

    getCurrentUser().then((userData) => {
      if (userData) {
        setUser(userData);
      }
    });
  }, []);

  useEffect(() => {
    if (!user) return;

    async function fetchTopics() {
      const { data, error } = await supabase
        .from('solutions')
        .select('id, problem_name, topic, difficulty, created_at')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) return;

      const grouped = data.reduce((acc, item) => {
        const topicKey = item.topic || 'Uncategorized';
        if (!acc[topicKey]) acc[topicKey] = [];
        acc[topicKey].push(item);
        return acc;
      }, {});

      setTopics(
        Object.entries(grouped).map(([name, items]) => ({
          name,
          count: items.length,
          problems: items,
        }))
      );
    }

    fetchTopics();
  }, [user]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    navigate('/login');
  };

  const guard = (component) => {
    if (!user) return <Navigate to="/login" />;
    return component;
  };

  return (
    <div className="min-h-screen bg-background text-text">
      <Toaster position="top-right" />
      <div className="lg:flex">
        <Sidebar topics={topics} user={user} onLogout={handleLogout} isMobileOpen={mobileOpen} onToggleMobile={() => setMobileOpen(!mobileOpen)} />
        <div className="lg:ml-72 w-full px-4 py-6 lg:px-8">
          {user && <Navbar problemCount={topics.reduce((sum, topic) => sum + topic.count, 0)} />}
          <Routes>
            <Route path="/login" element={<Login user={user} />} />
            <Route path="/signup" element={<Signup user={user} />} />
            <Route path="/" element={guard(<Dashboard user={user} />)} />
            <Route path="/analyze" element={guard(<Analyze user={user} />)} />
            <Route path="/problem/:id" element={guard(<Problem user={user} />)} />
            <Route path="*" element={<Navigate to={user ? '/' : '/login'} />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}

export default App;
