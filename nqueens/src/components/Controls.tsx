import { motion } from 'framer-motion';
import { Play, Pause, SkipBack, SkipForward, ChevronLeft, ChevronRight, RotateCcw, Zap } from 'lucide-react';
import { SolverState, Mode } from '../types';

interface ControlsProps {
  state: SolverState;
  onSetN: (n: number) => void;
  onSolve: () => void;
  onPrev: () => void;
  onNext: () => void;
  onReset: () => void;
  onSetMode: (mode: Mode) => void;
  onInitStep: () => void;
  onStepForward: () => void;
  onStepBack: () => void;
  onTogglePlay: () => void;
  onSetSpeed: (speed: number) => void;
}

function NeonButton({
  onClick, children, disabled, color = 'blue', size = 'md', active
}: {
  onClick: () => void;
  children: React.ReactNode;
  disabled?: boolean;
  color?: 'blue' | 'red' | 'purple' | 'green' | 'yellow';
  size?: 'sm' | 'md' | 'lg';
  active?: boolean;
}) {
  const colors = {
    blue: { base: '#00f0ff', shadow: 'rgba(0,240,255,0.4)' },
    red: { base: '#ff003c', shadow: 'rgba(255,0,60,0.4)' },
    purple: { base: '#bf00ff', shadow: 'rgba(191,0,255,0.4)' },
    green: { base: '#00ff88', shadow: 'rgba(0,255,136,0.4)' },
    yellow: { base: '#ffaa00', shadow: 'rgba(255,170,0,0.4)' },
  };
  const c = colors[color];
  const sizes = { sm: 'px-2 py-1 text-xs', md: 'px-3 py-2 text-sm', lg: 'px-5 py-2.5 text-base' };

  return (
    <motion.button
      whileHover={!disabled ? { scale: 1.05 } : {}}
      whileTap={!disabled ? { scale: 0.95 } : {}}
      onClick={onClick}
      disabled={disabled}
      className={`font-mono font-bold tracking-widest uppercase rounded transition-all duration-200 flex items-center gap-1.5 ${sizes[size]}`}
      style={{
        color: disabled ? 'rgba(255,255,255,0.2)' : c.base,
        border: `1px solid ${disabled ? 'rgba(255,255,255,0.1)' : active ? c.base : `rgba(${c.base.replace('#', '').match(/.{2}/g)?.map(h => parseInt(h, 16)).join(',')}, 0.4)`}`,
        background: active
          ? `rgba(${c.base.replace('#', '').match(/.{2}/g)?.map(h => parseInt(h, 16)).join(',')}, 0.15)`
          : 'rgba(0,0,0,0.4)',
        boxShadow: disabled ? 'none' : active ? `0 0 15px ${c.shadow}, inset 0 0 10px ${c.shadow}` : `0 0 8px ${c.shadow}`,
        cursor: disabled ? 'not-allowed' : 'pointer',
      }}
    >
      {children}
    </motion.button>
  );
}

export function Controls({
  state, onSetN, onSolve, onPrev, onNext, onReset,
  onSetMode, onInitStep, onStepForward, onStepBack, onTogglePlay, onSetSpeed
}: ControlsProps) {
  const { n, mode, status, isPlaying, speed, solutions, currentStepIndex, steps } = state;

  const speedToLabel = (s: number) => {
    if (s <= 30) return 'LUDICROUS';
    if (s <= 80) return 'FAST';
    if (s <= 200) return 'MEDIUM';
    if (s <= 500) return 'SLOW';
    return 'CRAWL';
  };

  return (
    <div className="flex flex-col gap-4">
      {/* N selector */}
      <div className="panel-box">
        <div className="flex items-center justify-between mb-2">
          <span className="label-text">BOARD SIZE (N)</span>
          <span className="text-2xl font-display font-black" style={{ color: '#00f0ff' }}>{n}</span>
        </div>
        <input
          type="range"
          min={4}
          max={12}
          value={n}
          onChange={e => onSetN(Number(e.target.value))}
          className="neon-slider w-full"
        />
        <div className="flex justify-between text-[10px] font-mono opacity-30 mt-1">
          <span>4</span><span>8</span><span>12</span>
        </div>
      </div>

      {/* Mode tabs */}
      <div className="panel-box">
        <span className="label-text mb-2 block">MODE</span>
        <div className="flex gap-2">
          {(['solution', 'step', 'manual'] as Mode[]).map(m => (
            <NeonButton
              key={m}
              onClick={() => m === 'step' ? onInitStep() : onSetMode(m)}
              color={m === 'solution' ? 'blue' : m === 'step' ? 'purple' : 'yellow'}
              size="sm"
              active={mode === m}
            >
              {m}
            </NeonButton>
          ))}
        </div>
      </div>

      {/* Solution mode controls */}
      {mode === 'solution' && (
        <div className="panel-box flex flex-col gap-3">
          <div className="flex gap-2">
            <NeonButton onClick={onSolve} color="blue" size="md">
              <Zap size={14} /> SOLVE
            </NeonButton>
            <NeonButton onClick={onReset} color="red" size="md">
              <RotateCcw size={14} /> RESET
            </NeonButton>
          </div>
          {solutions.length > 0 && (
            <div className="flex items-center gap-2">
              <NeonButton onClick={onPrev} color="purple" size="sm" disabled={solutions.length <= 1}>
                <ChevronLeft size={14} />
              </NeonButton>
              <div className="flex-1 text-center text-xs font-mono opacity-60">
                {state.currentSolutionIndex + 1} / {solutions.length}
              </div>
              <NeonButton onClick={onNext} color="purple" size="sm" disabled={solutions.length <= 1}>
                <ChevronRight size={14} />
              </NeonButton>
            </div>
          )}
        </div>
      )}

      {/* Step mode controls */}
      {mode === 'step' && (
        <div className="panel-box flex flex-col gap-3">
          {/* Playback */}
          <div className="flex gap-2 flex-wrap">
            <NeonButton onClick={onStepBack} color="purple" size="sm" disabled={currentStepIndex < 0}>
              <SkipBack size={14} />
            </NeonButton>
            <NeonButton
              onClick={onTogglePlay}
              color={isPlaying ? 'red' : 'green'}
              size="sm"
              disabled={steps.length === 0}
            >
              {isPlaying ? <Pause size={14} /> : <Play size={14} />}
              {isPlaying ? 'PAUSE' : 'PLAY'}
            </NeonButton>
            <NeonButton onClick={onStepForward} color="blue" size="sm" disabled={currentStepIndex >= steps.length - 1}>
              <SkipForward size={14} />
            </NeonButton>
            <NeonButton onClick={onReset} color="red" size="sm">
              <RotateCcw size={14} />
            </NeonButton>
          </div>

          {/* Speed */}
          <div>
            <div className="flex justify-between mb-1">
              <span className="label-text">SPEED</span>
              <span className="text-xs font-mono" style={{ color: '#bf00ff' }}>{speedToLabel(speed)}</span>
            </div>
            <input
              type="range"
              min={20}
              max={800}
              step={10}
              value={speed}
              onChange={e => onSetSpeed(Number(e.target.value))}
              className="neon-slider neon-slider-purple w-full"
              style={{ direction: 'rtl' }} // inverted so right = fast
            />
          </div>
        </div>
      )}

      {/* Manual mode controls */}
      {mode === 'manual' && (
        <div className="panel-box flex flex-col gap-3">
          <p className="text-xs font-mono opacity-60 leading-relaxed">
            CLICK SQUARES TO PLACE / REMOVE QUEENS.<br />
            CONFLICTS HIGHLIGHTED IN <span style={{ color: '#ff003c' }}>RED</span>.
          </p>
          <NeonButton onClick={onReset} color="red" size="sm">
            <RotateCcw size={14} /> CLEAR BOARD
          </NeonButton>
        </div>
      )}
    </div>
  );
}
