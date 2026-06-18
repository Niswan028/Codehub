import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HiHome, HiChevronRight, HiSparkles } from 'react-icons/hi';

export default function Navbar({ problemCount }) {
  const location = useLocation();
  const path = location.pathname.replace('/', '') || 'dashboard';

  return (
    <motion.header
      initial={{ opacity: 0, y: -16 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card border border-white/10 sticky top-0 z-20 backdrop-blur-xl p-4 mb-4"
    >
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-3 text-sm text-secondary">
          <HiHome className="h-5 w-5 text-primary" />
          <span>CODEBASE</span>
          <HiChevronRight className="h-5 w-5" />
          <span className="text-text font-semibold capitalize">{path.replace('-', ' ')}</span>
        </div>

        <div className="flex items-center gap-3">
          <div className="rounded-2xl bg-gradient-to-r from-primary/30 via-secondary/20 to-accent/20 px-3 py-2 text-sm text-text shadow-glow">
            {problemCount} problems tracked
          </div>
          <div className="rounded-full bg-white/5 border border-white/10 px-3 py-2 text-sm text-secondary">PRO</div>
        </div>
      </div>
    </motion.header>
  );
}
