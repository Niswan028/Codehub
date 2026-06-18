import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HiOutlineTrash } from 'react-icons/hi';
import CodeEditor from '../components/CodeEditor';
import ConfirmModal from '../components/ConfirmModal';
import { supabase } from '../lib/supabase';

export default function Problem({ user }) {
  const { id } = useParams();
  const [problem, setProblem] = useState(null);
  const [activeTab, setActiveTab] = useState('flashcard');
  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) return;

    async function loadProblem() {
      const { data, error } = await supabase.from('solutions').select('*').eq('id', id).single();
      setLoading(false);
      if (error || !data) return;
      setProblem(data);
    }

    loadProblem();
  }, [id, user]);

  const handleDelete = async () => {
    await supabase.from('solutions').delete().eq('id', id);
    setModalOpen(false);
    navigate('/');
  };

  const difficultyColor = {
    Easy: 'bg-emerald-500/15 text-emerald-300',
    Medium: 'bg-primary/15 text-primary',
    Hard: 'bg-rose-500/15 text-rose-300',
  };

  if (loading) {
    return <div className="mt-10 text-secondary">Loading problem...</div>;
  }

  if (!problem) {
    return <div className="mt-10 text-secondary">Problem not found.</div>;
  }

  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="space-y-8 pb-16">
      <div className="glass-card rounded-3xl border border-white/10 p-8 shadow-glow">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-semibold text-text">{problem.problem_name}</h1>
            <p className="mt-2 text-sm text-secondary">Your saved analysis and code snapshot for this problem.</p>
          </div>
          <div className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm ${difficultyColor[problem.difficulty] || 'bg-white/5 text-secondary'}`}>
            {problem.difficulty}
          </div>
        </div>
      </div>

      <div className="glass-card rounded-3xl border border-white/10 p-6 shadow-glow">
        <div className="flex flex-wrap gap-3 border-b border-white/10 pb-4 text-sm text-secondary">
          <button type="button" onClick={() => setActiveTab('flashcard')} className={`rounded-3xl px-4 py-2 ${activeTab === 'flashcard' ? 'bg-primary/15 text-text' : 'bg-white/5 text-secondary hover:bg-white/10'}`}>
            Flashcard
          </button>
          <button type="button" onClick={() => setActiveTab('code')} className={`rounded-3xl px-4 py-2 ${activeTab === 'code' ? 'bg-primary/15 text-text' : 'bg-white/5 text-secondary hover:bg-white/10'}`}>
            Code
          </button>
        </div>

        {activeTab === 'flashcard' ? (
          <div className="grid gap-6 py-8 lg:grid-cols-[1fr_1fr]">
            <div className="glass-card rounded-3xl border border-white/10 bg-white/5 p-6">
              <h2 className="text-lg font-semibold text-text">Pattern</h2>
              <p className="mt-3 text-sm text-secondary">{problem.pattern}</p>
            </div>
            <div className="grid gap-4">
              <div className="glass-card rounded-3xl border border-white/10 bg-white/5 p-6">
                <h3 className="text-sm uppercase tracking-[0.2em] text-secondary">Time Complexity</h3>
                <p className="mt-2 text-lg font-semibold text-text">{problem.time_complexity}</p>
              </div>
              <div className="glass-card rounded-3xl border border-white/10 bg-white/5 p-6">
                <h3 className="text-sm uppercase tracking-[0.2em] text-secondary">Space Complexity</h3>
                <p className="mt-2 text-lg font-semibold text-text">{problem.space_complexity}</p>
              </div>
            </div>
            <div className="glass-card rounded-3xl border border-white/10 bg-white/5 p-6 lg:col-span-2">
              <h3 className="text-lg font-semibold text-text">Key Points</h3>
              <ol className="mt-4 space-y-3 text-sm text-secondary">
                {problem.key_points?.map((point, index) => (
                  <li key={index} className="rounded-3xl border border-white/10 bg-background/80 p-4">
                    <span className="font-semibold text-text">{index + 1}.</span> {point}
                  </li>
                ))}
              </ol>
            </div>
            <div className="glass-card rounded-3xl border border-white/10 bg-white/5 p-6">
              <h3 className="text-lg font-semibold text-text">Your Trick</h3>
              <p className="mt-3 rounded-3xl bg-emerald-500/10 p-4 text-sm text-accent">{problem.user_trick}</p>
            </div>
            <div className="glass-card rounded-3xl border border-white/10 bg-white/5 p-6">
              <h3 className="text-lg font-semibold text-text">Approach Summary</h3>
              <p className="mt-3 text-sm leading-7 text-secondary">{problem.approach_summary}</p>
            </div>
          </div>
        ) : (
          <div className="py-8">
            <CodeEditor value={problem.code} readOnly label="Saved Solution" />
          </div>
        )}

        <div className="mt-6 flex justify-end">
          <button
            type="button"
            onClick={() => setModalOpen(true)}
            className="inline-flex items-center gap-2 rounded-3xl bg-rose-500/10 px-5 py-3 text-sm font-semibold text-rose-300 hover:bg-rose-500/20"
          >
            <HiOutlineTrash className="h-5 w-5" /> Delete
          </button>
        </div>
      </div>

      <ConfirmModal
        open={modalOpen}
        title="Delete this problem?"
        description="This action cannot be undone. Your saved analysis and code will be removed permanently."
        onConfirm={handleDelete}
        onClose={() => setModalOpen(false)}
      />
    </motion.div>
  );
}
