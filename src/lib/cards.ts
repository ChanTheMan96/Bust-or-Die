export type Suit = "hearts" | "diamonds" | "clubs" | "spades";
export type Rank =
  | "A"
  | "2"
  | "3"
  | "4"
  | "5"
  | "6"
  | "7"
  | "8"
  | "9"
  | "10"
  | "J"
  | "Q"
  | "K";

export type PlayingCard = {
  id: string;
  suit: Suit;
  rank: Rank;
  temporary?: boolean;
};

export type HandValue = {
  best: number;
  isBust: boolean;
  isSoft: boolean;
  display: string;
};

const suits: Suit[] = ["hearts", "diamonds", "clubs", "spades"];
const ranks: Rank[] = [
  "A",
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "10",
  "J",
  "Q",
  "K",
];

export function createDeck(includeAceMagnet = false): PlayingCard[] {
  const deck: PlayingCard[] = suits.flatMap((suit) =>
    ranks.map((rank) => ({
      id: `${suit}-${rank}`,
      suit,
      rank,
    })),
  );

  if (includeAceMagnet) {
    deck.push({
      id: `magnet-ace-${crypto.randomUUID()}`,
      suit: "hearts",
      rank: "A",
      temporary: true,
    });
  }

  return deck;
}

export function shuffleDeck(deck: PlayingCard[]): PlayingCard[] {
  const shuffled = [...deck];
  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1));
    [shuffled[index], shuffled[randomIndex]] = [
      shuffled[randomIndex],
      shuffled[index],
    ];
  }
  return shuffled;
}

export function drawCard(deck: PlayingCard[]): {
  card: PlayingCard;
  deck: PlayingCard[];
} {
  if (deck.length === 0) {
    throw new Error("Cannot draw from an empty deck.");
  }

  const [card, ...remainingDeck] = deck;
  return { card, deck: remainingDeck };
}

function rankValues(rank: Rank, luckySeven: boolean): number[] {
  if (rank === "A") {
    return [1, 11];
  }

  if (rank === "7" && luckySeven) {
    return [1, 7, 11];
  }

  if (["J", "Q", "K"].includes(rank)) {
    return [10];
  }

  return [Number(rank)];
}

export function cardBaseValue(card: PlayingCard): number {
  if (card.rank === "A") {
    return 11;
  }

  if (["J", "Q", "K"].includes(card.rank)) {
    return 10;
  }

  return Number(card.rank);
}

export function calculateBestHandValue(
  hand: PlayingCard[],
  luckySeven = false,
): HandValue {
  const totals = hand.reduce<number[]>(
    (runningTotals, card) =>
      runningTotals.flatMap((total) =>
        rankValues(card.rank, luckySeven).map((value) => total + value),
      ),
    [0],
  );

  const uniqueTotals = [...new Set(totals)].sort((a, b) => a - b);
  const safeTotals = uniqueTotals.filter((total) => total <= 21);
  const best = safeTotals.at(-1) ?? uniqueTotals[0] ?? 0;
  const isBust = safeTotals.length === 0;
  const isSoft = hand.some((card) => card.rank === "A") && safeTotals.length > 0;
  const display = isBust
    ? `${uniqueTotals[0]} bust`
    : safeTotals.length > 1
      ? `${safeTotals[0]} / ${best}`
      : `${best}`;

  return { best, isBust, isSoft, display };
}

export function isBlackjack(hand: PlayingCard[], luckySeven = false): boolean {
  if (hand.length !== 2) {
    return false;
  }

  const hasAce = hand.some((card) => card.rank === "A");
  const hasTenValue = hand.some((card) => ["10", "J", "Q", "K"].includes(card.rank));

  return hasAce && hasTenValue && calculateBestHandValue(hand, luckySeven).best === 21;
}

export function suitSymbol(suit: Suit): string {
  return {
    hearts: "♥",
    diamonds: "♦",
    clubs: "♣",
    spades: "♠",
  }[suit];
}
