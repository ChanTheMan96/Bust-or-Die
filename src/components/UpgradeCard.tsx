import { Upgrade } from "@/lib/upgrades";

type UpgradeCardProps = {
  upgrade: Upgrade;
  onChoose: (upgrade: Upgrade) => void;
};

export function UpgradeCard({ upgrade, onChoose }: UpgradeCardProps) {
  return (
    <article className="game-panel enter-pop flex min-h-52 flex-col justify-between rounded-[1.5rem] p-4 text-amber-50">
      <div>
        <div className="mb-3 flex items-center justify-between">
          <div className="text-[10px] font-black uppercase tracking-[0.18em] text-red-300">
            Upgrade
          </div>
          <div className="grid h-9 w-9 place-items-center rounded-xl border border-red-200/20 bg-red-950/70 text-lg">
            ✦
          </div>
        </div>
        <h3 className="text-2xl font-black leading-tight text-amber-50">
          {upgrade.name}
        </h3>
        <p className="mt-3 text-sm font-semibold leading-6 text-amber-50/72">
          {upgrade.description}
        </p>
      </div>
      <button
        className="game-button mt-5 min-h-12 rounded-[1rem] bg-red-700 px-4 py-3 text-base font-black text-white shadow-glow transition active:scale-[0.97]"
        onClick={() => onChoose(upgrade)}
      >
        Choose
      </button>
    </article>
  );
}
