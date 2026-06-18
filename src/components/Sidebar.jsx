import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { HiOutlineFolder, HiOutlineFolderOpen, HiOutlineLogout, HiOutlineMenu } from 'react-icons/hi';
import { motion, AnimatePresence } from 'framer-motion';

export default function Sidebar({ topics, user, onLogout, isMobileOpen, onToggleMobile }) {
  const location = useLocation();
  const [openTopics, setOpenTopics] = useState({});

  const toggleTopic = (topic) => {
    setOpenTopics((prev) => ({ ...prev, [topic]: !prev[topic] }));
  };

  return (
    <aside className={`fixed inset-y-0 left-0 z-30 w-72 transform bg-background/90 p-4 glass-card transition-all duration-300 lg:static lg:translate-x-0 ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'} shadow-2xl lg:shadow-none`}>
      <div className="flex items-center justify-between gap-3 pb-6">
        <div>
          <Link to="/" className="text-2xl font-semibold tracking-tight text-text">CODEBASE</Link>
          <p className="text-sm text-secondary">DSA knowledge hub</p>
        </div>
        <button type="button" className="lg:hidden rounded-xl border border-white/10 bg-white/5 p-2 text-text hover:border-primary" onClick={onToggleMobile}>
          <HiOutlineMenu className="h-5 w-5" />
        </button>
      </div>

      <nav className="space-y-4">
        {topics.length === 0 ? (
          <div className="rounded-3xl bg-white/5 p-4 text-sm text-secondary">No saved topics yet. Start analyzing code to populate your library.</div>
        ) : (
          topics.map((topic) => {
            const isOpen = openTopics[topic.name];
            return (
              <div key={topic.name} className="rounded-3xl border border-white/10 bg-white/5">
                <button
                  type="button"
                  className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left text-sm text-text"
                  onClick={() => toggleTopic(topic.name)}
                >
                  <span className="flex items-center gap-2">
                    {isOpen ? <HiOutlineFolderOpen className="h-5 w-5 text-primary" /> : <HiOutlineFolder className="h-5 w-5 text-secondary" />}
                    {topic.name}
                  </span>
                  <span className="rounded-full bg-white/10 px-2 py-1 text-xs text-secondary">{topic.count}</span>
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="space-y-2 px-4 pb-4">
                        {topic.problems.map((problem) => {
                          const active = location.pathname.includes(problem.id);
                          return (
                            <Link
                              key={problem.id}
                              to={`/problem/${problem.id}`}
                              className={`block rounded-2xl border-l-4 px-3 py-2 text-sm transition ${active ? 'border-primary bg-white/10 text-text' : 'border-transparent text-secondary hover:border-primary/70 hover:bg-white/5 hover:text-text'}`}
                            >
                              {problem.problem_name}
                            </Link>
                          );
                        })}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })
        )}
      </nav>

      <div className="absolute bottom-4 left-4 right-4 rounded-3xl border border-white/10 bg-white/5 p-4 text-sm text-secondary">
        <div className="mb-3 text-xs uppercase tracking-[0.2em] text-secondary/80">Signed in as</div>
        <div className="font-medium text-text">{user?.email || 'Unknown user'}</div>
        <button
          type="button"
          onClick={onLogout}
          className="mt-3 flex w-full items-center justify-center gap-2 rounded-2xl bg-white/5 px-4 py-2 text-sm text-text hover:bg-accent/10"
        >
          <HiOutlineLogout className="h-4 w-4" /> Logout
        </button>
      </div>
    </aside>
  );
}
