import { PlayingCard, suitSymbol } from "@/lib/cards";

type CardViewProps = {
  card?: PlayingCard;
  hidden?: boolean;
  compact?: boolean;
};

export function CardView({ card, hidden = false, compact = false }: CardViewProps) {
  const red = card?.suit === "hearts" || card?.suit === "diamonds";

  if (hidden || !card) {
    return (
      <div
        className={`relative grid shrink-0 place-items-center overflow-hidden rounded-xl border border-red-300/25 bg-[#120506] shadow-card ${
          compact ? "h-20 w-14" : "h-28 w-20"
        }`}
        aria-label="Hidden card"
      >
        <div className="absolute inset-1 rounded-lg border border-red-200/20" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(248,113,113,0.18),transparent_34%),linear-gradient(135deg,transparent_44%,rgba(255,255,255,0.07)_45%,rgba(255,255,255,0.07)_55%,transparent_56%)]" />
        <div className="relative text-center">
          <div
            className={`font-black leading-none text-red-100 drop-shadow ${
              compact ? "text-3xl" : "text-5xl"
            }`}
            aria-hidden="true"
          >
            ☠
          </div>
          <div className="mt-1 h-1 rounded-full bg-red-400/55" />
        </div>
      </div>
    );
  }

  return (
    <div
      className={`relative shrink-0 rounded-xl border border-white/70 bg-amber-50 p-2 text-slate-950 shadow-card ${
        compact ? "h-20 w-14" : "h-28 w-20"
      }`}
      aria-label={`${card.rank} of ${card.suit}`}
    >
      <div className={`font-black leading-none ${red ? "text-red-600" : "text-slate-950"}`}>
        <div className={compact ? "text-base" : "text-xl"}>{card.rank}</div>
        <div className={compact ? "text-sm" : "text-lg"}>{suitSymbol(card.suit)}</div>
      </div>
      <div
        className={`absolute inset-x-0 top-1/2 -translate-y-1/2 text-center font-black ${
          compact ? "text-2xl" : "text-4xl"
        } ${red ? "text-red-500" : "text-slate-900"}`}
      >
        {suitSymbol(card.suit)}
      </div>
      {card.temporary ? (
        <div className="absolute bottom-1 right-1 rounded bg-emerald-700 px-1 text-[9px] font-black text-white">
          ACE+
        </div>
      ) : null}
    </div>
  );
}
