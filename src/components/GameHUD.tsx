import { UpgradeId } from "@/lib/upgrades";

type GameHUDProps = {
  hearts: number;
  round: number;
  score: number;
  bestScore: number;
  upgrades: UpgradeId[];
};

export function GameHUD({
  hearts,
  round,
  score,
  bestScore,
  upgrades,
}: GameHUDProps) {
  return (
    <header className="sticky top-0 z-10 -mx-4 border-b border-red-200/10 bg-[#020403]/92 px-4 py-3 backdrop-blur md:static md:mx-0 md:rounded-2xl md:border">
      <div className="grid grid-cols-3 gap-2 text-center">
        <div>
          <div className="text-[10px] font-bold uppercase tracking-[0.14em] text-amber-100/70">
            Hearts
          </div>
          <div className="text-xl" aria-label={`${hearts} hearts remaining`}>
            {"♥".repeat(Math.max(hearts, 0))}
            <span className="text-white/20">{"♥".repeat(Math.max(3 - hearts, 0))}</span>
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
