import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HiPlus, HiSparkles } from 'react-icons/hi';
import StatsCard from '../components/StatsCard';
import TopicChart from '../components/TopicChart';
import Flashcard from '../components/Flashcard';
import { supabase } from '../lib/supabase';

export default function Dashboard({ user }) {
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProblem, setSelectedProblem] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) return;

    async function loadProblems() {
      setLoading(true);
      const { data, error } = await supabase
        .from('solutions')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      setLoading(false);
      if (error) return;
      setProblems(data || []);
    }

    loadProblems();
  }, [user]);

  const topics = useMemo(() => {
    const counts = {};
    problems.forEach((problem) => {
      counts[problem.topic] = (counts[problem.topic] || 0) + 1;
    });
    return Object.entries(counts).map(([topic, count]) => ({ topic, count }));
  }, [problems]);

  const recent = problems.slice(0, 5);
  const streak = recent.length > 0 ? Math.min(problems.length, 7) : 0;

  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="space-y-8 pb-16">
      <div className="grid gap-4 md:grid-cols-[1.8fr_1fr]">
        <div className="glass-card rounded-3xl border border-white/10 p-8 shadow-glow">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm uppercase tracking-[0.2em] text-secondary">Welcome back</p>
              <h1 className="mt-3 text-4xl font-semibold text-text">{user?.email?.split('@')[0] || 'Coder'}</h1>
              <p className="mt-2 max-w-xl text-sm text-secondary">Your personal DSA knowledge base is ready. Review your strongest topics, latest solutions, and AI insights.</p>
            </div>
            <button
              type="button"
              onClick={() => navigate('/analyze')}
              className="rounded-3xl bg-gradient-to-r from-primary to-accent px-5 py-3 text-sm font-semibold text-background hover:opacity-95"
            >
              <HiPlus className="mr-2 inline h-5 w-5" /> Analyze New Solution
            </button>
          </div>
        </div>
        <div className="grid gap-4">
          <StatsCard label="Total Problems" value={problems.length} accent="text-primary" />
          <StatsCard label="Topics Covered" value={topics.length} accent="text-accent" />
          <StatsCard label="This Week" value={recent.length} accent="text-white" />
          <StatsCard label="Streak" value={`${streak} days`} accent="text-primary" />
        </div>
      </div>

      <TopicChart data={topics.length ? topics : [{ topic: 'No data', count: 0 }]} />

      <div className="grid gap-6 lg:grid-cols-[1.4fr_0.8fr]">
        <div className="glass-card rounded-3xl border border-white/10 p-6 shadow-glow">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-text">Recently added</h2>
              <p className="text-sm text-secondary">Latest problems from your library.</p>
            </div>
            <span className="rounded-full bg-white/5 px-3 py-2 text-xs uppercase tracking-[0.24em] text-secondary">Latest 5</span>
          </div>

          <div className="space-y-3">
            {loading ? (
              Array.from({ length: 5 }).map((_, idx) => (
                <div key={idx} className="rounded-3xl border border-white/10 bg-white/5 p-5">
                  <div className="h-4 w-32 rounded-full skeleton" />
                  <div className="mt-3 h-3 w-24 rounded-full skeleton" />
                </div>
              ))
            ) : recent.length === 0 ? (
              <div className="rounded-3xl border border-white/10 bg-white/5 p-8 text-center text-sm text-secondary">
                No problems yet. Use the analyzer to add your first solution and build your knowledge base.
              </div>
            ) : (
              recent.map((problem) => (
                <button
                  key={problem.id}
                  type="button"
                  onClick={() => navigate(`/problem/${problem.id}`)}
                  className="w-full rounded-3xl border border-white/10 bg-white/5 p-5 text-left hover:border-primary/50 hover:bg-white/10"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <h3 className="text-lg font-semibold text-text">{problem.problem_name}</h3>
                      <p className="mt-1 text-sm text-secondary">{problem.topic}</p>
                    </div>
                    <span className="rounded-full bg-primary/10 px-3 py-1 text-xs text-primary">{problem.difficulty}</span>
                  </div>
                  <p className="mt-4 text-sm text-secondary">{new Date(problem.created_at).toLocaleDateString()}</p>
                </button>
              ))
            )}
          </div>
        </div>

        <div className="space-y-6">
          <div className="glass-card rounded-3xl border border-white/10 p-6 shadow-glow">
            <h2 className="text-lg font-semibold text-text">Quick insight</h2>
            <p className="mt-3 text-sm leading-7 text-secondary">Click any flashcard to review patterns, complexity, and your personal tricks. Your CODEBASE grows smarter with every analysis.</p>
          </div>
          <div className="glass-card rounded-3xl border border-white/10 p-6 shadow-glow">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-text">Recent flashcard</h3>
              <span className="rounded-full bg-white/5 px-3 py-1 text-xs text-secondary">Interactive</span>
            </div>
            {recent[0] ? (
              <Flashcard problem={recent[0]} onClick={() => navigate(`/problem/${recent[0].id}`)} />
            ) : (
              <div className="rounded-3xl border border-white/10 bg-white/5 p-8 text-center text-sm text-secondary">
                Analyze a new solution to unlock the flashcard view.
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
