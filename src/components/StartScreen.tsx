type StartScreenProps = {
  bestScore: number;
  onStart: () => void;
};

export function StartScreen({ bestScore, onStart }: StartScreenProps) {
  return (
    <main className="table-felt flex min-h-dvh items-center justify-center px-4 py-8">
      <div className="enter-pop w-full max-w-md">
        <section className="game-panel overflow-hidden rounded-[2rem] p-5 text-center">
          <div className="mx-auto grid h-20 w-20 place-items-center rounded-3xl border border-red-200/20 bg-red-950/70 text-5xl shadow-glow">
            ☠
          </div>
          <p className="mt-5 text-xs font-black uppercase tracking-[0.28em] text-red-300">
            No cash. No mercy.
          </p>
          <h1 className="mt-2 text-6xl font-black leading-[0.9] text-amber-50 drop-shadow">
            Bust or Die
          </h1>
          <p className="mx-auto mt-4 max-w-xs text-lg font-semibold leading-7 text-amber-50/82">
            Blackjack, but every hand could end your run.
          </p>
          <div className="mt-5 grid grid-cols-3 gap-2">
            <div className="rounded-2xl border border-white/10 bg-black/45 p-3">
              <div className="text-[10px] font-black uppercase tracking-[0.14em] text-amber-100/60">
                Hearts
              </div>
              <div className="text-xl text-red-400">♥♥♥♥♥</div>
            </div>
            <div className="rounded-2xl border border-white/10 bg-black/45 p-3">
              <div className="text-[10px] font-black uppercase tracking-[0.14em] text-amber-100/60">
                Mode
              </div>
              <div className="text-sm font-black">Run</div>
            </div>
            <div className="rounded-2xl border border-white/10 bg-black/45 p-3">
              <div className="text-[10px] font-black uppercase tracking-[0.14em] text-amber-100/60">
                Best
              </div>
              <div className="text-xl font-black">{bestScore}</div>
            </div>
          </div>
        </section>
        <button
          className="game-button mt-4 min-h-16 w-full rounded-[1.4rem] bg-red-600 px-6 py-4 text-xl font-black text-white shadow-glow transition active:scale-[0.98]"
          onClick={onStart}
        >
          Start Run
        </button>
        <section className="game-panel mt-4 rounded-[1.4rem] p-4">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-lg font-black">How to Play</h2>
            <span className="rounded-full border border-red-200/20 bg-red-950/70 px-3 py-1 text-xs font-black text-red-100">
              Roguelite
            </span>
          </div>
          <ul className="space-y-2 text-sm font-semibold leading-6 text-amber-50/80">
            <li>Start with 5 hearts and survive round after round.</li>
            <li>Double Down and Split require at least 2 hearts.</li>
            <li>Hit toward 21, stand when your nerve says stop.</li>
            <li>Win hands to collect upgrades that last all run.</li>
            <li>Lose or bust and hearts vanish. Reach zero and the run ends.</li>
          </ul>
        </section>
      </div>
    </main>
  );
}
