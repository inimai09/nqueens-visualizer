import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronUp } from 'lucide-react';

export function ExplainerPanel() {
  const [open, setOpen] = useState(false);

  return (
    <div
      className="rounded-lg overflow-hidden"
      style={{ border: '1px solid rgba(191,0,255,0.25)', background: 'rgba(0,0,0,0.5)' }}
    >
      <button
        className="w-full flex items-center justify-between px-4 py-3 text-left"
        onClick={() => setOpen(o => !o)}
      >
        <span className="text-sm font-display tracking-widest" style={{ color: '#bf00ff' }}>
          ◈ ALGORITHM EXPLAINED
        </span>
        {open ? <ChevronUp size={16} style={{ color: '#bf00ff' }} /> : <ChevronDown size={16} style={{ color: '#bf00ff' }} />}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 text-xs font-mono leading-relaxed space-y-3"
              style={{ color: 'rgba(255,255,255,0.65)' }}>
              <div>
                <span style={{ color: '#00f0ff' }}>► THE PROBLEM</span>
                <p className="mt-1">Place N chess queens on an N×N board so no two queens attack each other — no shared row, column, or diagonal.</p>
              </div>
              <div>
                <span style={{ color: '#ff003c' }}>► BACKTRACKING</span>
                <p className="mt-1">
                  We place queens column by column. For each column, try every row. If placing causes a conflict — backtrack and try the next row. This prunes the search tree dramatically.
                </p>
              </div>
              <div>
                <span style={{ color: '#bf00ff' }}>► COMPLEXITY</span>
                <p className="mt-1">
                  Naive brute force: O(n!) possibilities.<br />
                  Backtracking: O(n!) worst case but prunes most branches.<br />
                  N=8 has 92 solutions out of 16.7M placements.
                </p>
              </div>
              <div>
                <span style={{ color: '#00ff88' }}>► LEGEND</span>
                <div className="grid grid-cols-2 gap-1 mt-1">
                  <div><span style={{ color: '#00f0ff' }}>♛ Cyan</span> — Valid queen</div>
                  <div><span style={{ color: '#ff003c' }}>♛ Red</span> — Conflict</div>
                  <div><span style={{ color: 'rgba(0,240,255,0.4)' }}>· Dot</span> — Attacked sq.</div>
                  <div><span style={{ color: '#ffaa00' }}>■ Amber</span> — Being tried</div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
