import { motion } from 'framer-motion';
import { HiSparkles, HiLightningBolt, HiFingerPrint } from 'react-icons/hi';

export default function Flashcard({ problem, onClick }) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      whileHover={{ scale: 1.02 }}
      className="group relative h-64 w-full overflow-hidden rounded-[28px] border border-white/10 bg-gradient-to-br from-white/5 via-white/10 to-white/5 p-6 text-left shadow-glow"
    >
      <div className="absolute inset-0 rounded-[28px] bg-white/5 backdrop-blur-md transition duration-300 group-hover:bg-white/10" />
      <div className="relative flex h-full flex-col justify-between text-left text-text">
        <div>
          <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs uppercase tracking-[0.24em] text-primary">
            {problem.difficulty}
          </div>
          <h3 className="text-lg font-semibold">{problem.problem_name}</h3>
          <p className="mt-2 text-sm text-secondary">{problem.topic}</p>
        </div>

        <div className="grid gap-2 text-sm">
          <div className="flex items-center gap-2 rounded-3xl bg-white/5 px-4 py-3">
            <HiSparkles className="h-4 w-4 text-accent" />
            <span>{problem.pattern}</span>
          </div>
          <div className="flex items-center gap-2 rounded-3xl bg-white/5 px-4 py-3">
            <HiLightningBolt className="h-4 w-4 text-primary" />
            <span>{problem.time_complexity} / {problem.space_complexity}</span>
          </div>
          <div className="flex items-center gap-2 rounded-3xl bg-white/5 px-4 py-3">
            <HiFingerPrint className="h-4 w-4 text-secondary" />
            <span>{problem.user_trick}</span>
          </div>
        </div>
      </div>
    </motion.button>
  );
}
