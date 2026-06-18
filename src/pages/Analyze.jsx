import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import CodeEditor from '../components/CodeEditor';
import ScanAnimation from '../components/ScanAnimation';
import { analyzeCode } from '../lib/groqApi';
import { supabase } from '../lib/supabase';

export default function Analyze({ user }) {
  const [problemName, setProblemName] = useState('');
  const [difficulty, setDifficulty] = useState('Medium');
  const [code, setCode] = useState('// Paste your JavaScript solution here');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showScan, setShowScan] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleKeyDown = (event) => {
      if ((event.ctrlKey || event.metaKey) && event.key === 'Enter') {
        event.preventDefault();
        handleAnalyze();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [problemName, difficulty, code]);

  const handleAnalyze = async () => {
    setError('');
    if (!problemName.trim()) {
      setError('Enter a problem name.');
      return;
    }
    setLoading(true);
    setShowScan(true);

    try {
      const aiResult = await analyzeCode(problemName, code);
      const { data, error: insertError } = await supabase.from('solutions').insert([
        {
          user_id: user.id,
          problem_name: problemName,
          difficulty,
          topic: aiResult.topic || 'General',
          pattern: aiResult.pattern || 'Unknown',
          time_complexity: aiResult.timeComplexity || 'N/A',
          space_complexity: aiResult.spaceComplexity || 'N/A',
          key_points: aiResult.keyPoints || [],
          user_trick: aiResult.userTrick || 'None',
          approach_summary: aiResult.approachSummary || 'No summary',
          code,
        },
      ]);

      if (insertError) {
        throw insertError;
      }

      const newProblem = data?.[0];
      toast.success('Solution analyzed and saved.');
      navigate(`/problem/${newProblem.id}`);
    } catch (err) {
      setError(err.message || 'Analysis failed.');
      toast.error('Analysis failed.');
    } finally {
      setLoading(false);
      setShowScan(false);
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="space-y-8 pb-16">
      <div className="glass-card rounded-3xl border border-white/10 p-8 shadow-glow">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-secondary">Analyze new solution</p>
            <h1 className="mt-3 text-3xl font-semibold text-text">Paste your code and let AI surface the pattern.</h1>
            <p className="mt-2 max-w-2xl text-sm text-secondary">Collect AI-powered explanations for every DSA problem you solve.</p>
          </div>
          <div className="rounded-3xl bg-white/5 px-4 py-3 text-sm text-secondary">Shortcut: Ctrl+Enter</div>
        </div>
      </div>

      <div className="glass-card rounded-3xl border border-white/10 p-8 shadow-glow">
        <div className="grid gap-6 lg:grid-cols-[1fr_1fr]">
          <label className="block text-sm text-secondary">
            Problem Name
            <input
              type="text"
              value={problemName}
              onChange={(e) => setProblemName(e.target.value)}
              placeholder="Two Sum"
              className="mt-2 w-full rounded-3xl border border-white/10 bg-background/80 px-4 py-3 text-text focus:border-primary"
            />
          </label>
          <label className="block text-sm text-secondary">
            Difficulty
            <select
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
              className="mt-2 w-full rounded-3xl border border-white/10 bg-background/80 px-4 py-3 text-text focus:border-primary"
            >
              <option>Easy</option>
              <option>Medium</option>
              <option>Hard</option>
            </select>
          </label>
        </div>
      </div>

      <div className="relative">
        <CodeEditor value={code} onChange={setCode} label="Solution Code" />
        <ScanAnimation visible={showScan} />
      </div>

      {error && <p className="text-sm text-rose-400">{error}</p>}
      <div className="flex justify-end">
        <button
          type="button"
          onClick={handleAnalyze}
          disabled={loading}
          className="rounded-3xl bg-gradient-to-r from-primary to-accent px-6 py-3 text-sm font-semibold text-background disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? 'Analyzing…' : 'Analyze with AI'}
        </button>
      </div>
    </motion.div>
  );
}
