type StartScreenProps = {
  bestScore: number;
  onStart: () => void;
};

export function StartScreen({ bestScore, onStart }: StartScreenProps) {
  return (
    <main className="table-felt flex min-h-dvh items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        <p className="mb-3 text-center text-xs font-black uppercase tracking-[0.28em] text-red-300">
          No cash. No mercy.
        </p>
        <h1 className="text-center text-6xl font-black leading-[0.9] text-amber-50 drop-shadow">
          Bust or Die
        </h1>
        <p className="mx-auto mt-4 max-w-xs text-center text-lg font-semibold leading-7 text-amber-50/82">
          Blackjack, but every hand could end your run.
        </p>
        <button
          className="mt-8 min-h-16 w-full rounded-2xl bg-red-600 px-6 py-4 text-xl font-black text-white shadow-glow transition active:scale-[0.98]"
          onClick={onStart}
        >
          Start Run
        </button>
        <section className="mt-5 rounded-2xl border border-white/10 bg-black/22 p-4 shadow-card backdrop-blur">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-lg font-black">How to Play</h2>
            <span className="rounded-full bg-amber-300 px-3 py-1 text-xs font-black text-emerald-950">
              Best {bestScore}
            </span>
          </div>
          <ul className="space-y-2 text-sm font-semibold leading-6 text-amber-50/80">
            <li>Start with 3 hearts and survive round after round.</li>
            <li>Hit toward 21, stand when your nerve says stop.</li>
            <li>Win hands to collect upgrades that last all run.</li>
            <li>Lose or bust and hearts vanish. Reach zero and the run ends.</li>
          </ul>
        </section>
      </div>
    </main>
  );
}
