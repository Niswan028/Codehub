import { motion } from 'framer-motion';

export default function ConfirmModal({ open, title, description, onConfirm, onClose }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.92 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass-card w-full max-w-lg rounded-3xl border border-white/10 p-6"
      >
        <h2 className="text-xl font-semibold text-text">{title}</h2>
        <p className="mt-3 text-sm text-secondary">{description}</p>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
          <button type="button" onClick={onClose} className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-secondary hover:bg-white/10">
            Cancel
          </button>
          <button type="button" onClick={onConfirm} className="rounded-2xl bg-gradient-to-r from-primary to-accent px-4 py-3 text-sm font-semibold text-background hover:opacity-90">
            Delete
          </button>
        </div>
      </motion.div>
    </div>
  );
}
