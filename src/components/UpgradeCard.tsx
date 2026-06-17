import { Upgrade } from "@/lib/upgrades";

type UpgradeCardProps = {
  upgrade: Upgrade;
  onChoose: (upgrade: Upgrade) => void;
};

export function UpgradeCard({ upgrade, onChoose }: UpgradeCardProps) {
  return (
    <article className="flex min-h-52 flex-col justify-between rounded-2xl border border-red-200/18 bg-[#100607] p-4 text-amber-50 shadow-card">
      <div>
        <div className="mb-2 text-[10px] font-black uppercase tracking-[0.18em] text-red-300">
          Upgrade
        </div>
        <h3 className="text-2xl font-black leading-tight">{upgrade.name}</h3>
        <p className="mt-3 text-sm font-semibold leading-6 text-amber-50/72">
          {upgrade.description}
        </p>
      </div>
      <button
        className="mt-5 min-h-12 rounded-xl bg-red-700 px-4 py-3 text-base font-black text-white shadow-glow transition active:scale-[0.98]"
        onClick={() => onChoose(upgrade)}
      >
        Choose
      </button>
    </article>
  );
}
