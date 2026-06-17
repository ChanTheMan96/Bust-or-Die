import { rankTitle } from "@/lib/game";

type GameOverScreenProps = {
  finalScore: number;
  roundsSurvived: number;
  bestScore: number;
  copied: boolean;
  onRestart: () => void;
  onShare: () => void;
};

export function GameOverScreen({
  finalScore,
  roundsSurvived,
  bestScore,
  copied,
  onRestart,
  onShare,
}: GameOverScreenProps) {
  return (
    <main className="table-felt flex min-h-dvh items-center justify-center px-4 py-8">
      <div className="w-full max-w-md rounded-3xl border border-red-200/12 bg-black/45 p-5 text-center shadow-card backdrop-blur">
        <p className="text-xs font-black uppercase tracking-[0.24em] text-red-300">
          Run Over
        </p>
        <h1 className="mt-3 text-4xl font-black text-amber-50">
          {rankTitle(finalScore)}
        </h1>
        <p className="mt-3 text-base font-semibold text-amber-50/75">
          The table remembers every brave mistake.
        </p>
        <div className="mt-6 grid grid-cols-3 gap-2">
          <div className="rounded-2xl border border-white/10 bg-black/30 p-3">
            <div className="text-[10px] font-black uppercase tracking-[0.14em] text-amber-100/65">
              Score
            </div>
            <div className="text-2xl font-black">{finalScore}</div>
          </div>
          <div className="rounded-2xl border border-white/10 bg-black/30 p-3">
            <div className="text-[10px] font-black uppercase tracking-[0.14em] text-amber-100/65">
              Rounds
            </div>
            <div className="text-2xl font-black">{roundsSurvived}</div>
          </div>
          <div className="rounded-2xl border border-white/10 bg-black/30 p-3">
            <div className="text-[10px] font-black uppercase tracking-[0.14em] text-amber-100/65">
              Best
            </div>
            <div className="text-2xl font-black">{bestScore}</div>
          </div>
        </div>
        <div className="mt-6 grid gap-3">
          <button
            className="min-h-14 rounded-2xl bg-red-600 px-4 py-3 text-lg font-black text-white shadow-glow transition active:scale-[0.98]"
            onClick={onRestart}
          >
            Restart
          </button>
          <button
            className="min-h-12 rounded-xl border border-red-200/15 bg-black/28 px-4 py-3 text-sm font-black text-white transition active:scale-[0.98]"
            onClick={onShare}
          >
            {copied ? "Copied" : "Share Text"}
          </button>
        </div>
      </div>
    </main>
  );
}
