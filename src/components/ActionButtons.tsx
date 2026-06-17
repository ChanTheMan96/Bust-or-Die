type ActionButtonsProps = {
  canAct: boolean;
  canUndo: boolean;
  canBurn: boolean;
  canDoubleDown: boolean;
  canSplit: boolean;
  onHit: () => void;
  onStand: () => void;
  onDoubleDown: () => void;
  onSplit: () => void;
  onUndo: () => void;
  onBurn: () => void;
};

export function ActionButtons({
  canAct,
  canUndo,
  canBurn,
  canDoubleDown,
  canSplit,
  onHit,
  onStand,
  onDoubleDown,
  onSplit,
  onUndo,
  onBurn,
}: ActionButtonsProps) {
  return (
    <div className="grid gap-3">
      <div className="grid grid-cols-2 gap-3">
        <button
          className="game-button min-h-16 rounded-[1.25rem] bg-red-600 px-4 py-3 text-lg font-black text-white shadow-glow transition active:scale-[0.97] disabled:cursor-not-allowed disabled:bg-white/10 disabled:text-white/35"
          disabled={!canAct}
          onClick={onHit}
        >
          Hit
        </button>
        <button
          className="game-button min-h-16 rounded-[1.25rem] bg-amber-300 px-4 py-3 text-lg font-black text-black shadow-card transition active:scale-[0.97] disabled:cursor-not-allowed disabled:bg-white/10 disabled:text-white/35"
          disabled={!canAct}
          onClick={onStand}
        >
          Stand
        </button>
        <button
          className="game-button min-h-14 rounded-[1.15rem] bg-red-950 px-3 py-3 text-base font-black text-white shadow-card ring-1 ring-red-300/25 transition active:scale-[0.97] disabled:cursor-not-allowed disabled:bg-white/10 disabled:text-white/35 disabled:ring-0"
          disabled={!canAct || !canDoubleDown}
          onClick={onDoubleDown}
        >
          Double
        </button>
        <button
          className="game-button min-h-14 rounded-[1.15rem] bg-red-950 px-3 py-3 text-base font-black text-white shadow-card ring-1 ring-red-300/25 transition active:scale-[0.97] disabled:cursor-not-allowed disabled:bg-white/10 disabled:text-white/35 disabled:ring-0"
          disabled={!canAct || !canSplit}
          onClick={onSplit}
        >
          Split
        </button>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <button
          className="min-h-12 rounded-[1rem] border border-white/15 bg-white/10 px-4 py-3 text-sm font-black text-white transition active:scale-[0.97] disabled:cursor-not-allowed disabled:text-white/30"
          disabled={!canAct || !canUndo}
          onClick={onUndo}
        >
          Undo
        </button>
        <button
          className="min-h-12 rounded-[1rem] border border-white/15 bg-white/10 px-4 py-3 text-sm font-black text-white transition active:scale-[0.97] disabled:cursor-not-allowed disabled:text-white/30"
          disabled={!canAct || !canBurn}
          onClick={onBurn}
        >
          Burn Card
        </button>
      </div>
    </div>
  );
}
