import { UpgradeId } from "@/lib/upgrades";

type GameHUDProps = {
  hearts: number;
  maxHearts: number;
  round: number;
  score: number;
  bestScore: number;
  upgrades: UpgradeId[];
};

export function GameHUD({
  hearts,
  maxHearts,
  round,
  score,
  bestScore,
  upgrades,
}: GameHUDProps) {
  return (
    <header className="game-panel sticky top-0 z-10 -mx-4 rounded-b-[1.6rem] border-x-0 border-t-0 px-4 pb-3 pt-[calc(env(safe-area-inset-top)+0.75rem)] md:static md:mx-0 md:rounded-[1.6rem] md:border">
      <div className="mb-3 flex items-center justify-between">
        <div>
          <div className="text-[10px] font-black uppercase tracking-[0.2em] text-red-300">
            Bust or Die
          </div>
          <div className="text-sm font-bold text-amber-50/70">Survival blackjack</div>
        </div>
        <div className="rounded-full border border-red-200/20 bg-red-950/60 px-3 py-1 text-xs font-black text-red-100">
          Run {round}
        </div>
      </div>
      <div className="grid grid-cols-3 gap-2 text-center">
        <div>
          <div className="text-[10px] font-bold uppercase tracking-[0.14em] text-amber-100/70">
            Hearts
          </div>
          <div className="text-xl text-red-400" aria-label={`${hearts} hearts remaining`}>
            {"♥".repeat(Math.max(hearts, 0))}
            <span className="text-white/20">
              {"♥".repeat(Math.max(maxHearts - hearts, 0))}
            </span>
          </div>
        </div>
        <div>
          <div className="text-[10px] font-bold uppercase tracking-[0.14em] text-amber-100/70">
            Round
          </div>
          <div className="text-xl font-black">{round}</div>
        </div>
        <div>
          <div className="text-[10px] font-bold uppercase tracking-[0.14em] text-amber-100/70">
            Score
          </div>
          <div className="text-xl font-black">{score}</div>
        </div>
      </div>
      <div className="mt-2 flex items-center justify-between gap-3 text-xs text-amber-50/70">
        <span>Best {bestScore}</span>
        <span>{upgrades.length} upgrades</span>
      </div>
    </header>
  );
}
