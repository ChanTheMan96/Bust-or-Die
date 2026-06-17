import { calculateBestHandValue, PlayingCard } from "@/lib/cards";
import { CardView } from "./CardView";

type HandViewProps = {
  title: string;
  cards: PlayingCard[];
  hideFirstCard?: boolean;
  luckySeven?: boolean;
  valueOverride?: number | null;
};

export function HandView({
  title,
  cards,
  hideFirstCard = false,
  luckySeven = false,
  valueOverride = null,
}: HandViewProps) {
  const visibleCards = hideFirstCard ? cards.slice(1) : cards;
  const value = calculateBestHandValue(visibleCards, luckySeven);
  const displayValue = valueOverride ? String(valueOverride) : value.display;

  return (
    <section className="rounded-2xl border border-white/10 bg-black/18 p-3 shadow-card backdrop-blur">
      <div className="mb-3 flex items-center justify-between gap-3">
        <h2 className="text-sm font-black uppercase tracking-[0.16em] text-amber-100">
          {title}
        </h2>
        <div className="rounded-full bg-black/30 px-3 py-1 text-sm font-black text-white">
          {hideFirstCard ? "?" : displayValue}
        </div>
      </div>
      <div className="flex min-h-28 gap-2 overflow-x-auto pb-1">
        {cards.map((card, index) => (
          <CardView
            key={`${card.id}-${index}`}
            card={card}
            hidden={hideFirstCard && index === 0}
          />
        ))}
      </div>
    </section>
  );
}
