export type UpgradeId =
  | "second-chance"
  | "lucky-7"
  | "dealer-panic"
  | "soft-shield"
  | "peek"
  | "burn-card"
  | "double-ghost"
  | "ace-magnet"
  | "perfect-20"
  | "underdog-18"
  | "dealer-tax"
  | "blackjack-bounty"
  | "red-seven-rite"
  | "grave-bloom"
  | "safe-push"
  | "split-spark"
  | "double-edge"
  | "long-hand";

export type Upgrade = {
  id: UpgradeId;
  name: string;
  description: string;
};

export const upgrades: Upgrade[] = [
  {
    id: "second-chance",
    name: "Second Chance",
    description: "Once per round, undo your last hit and breathe again.",
  },
  {
    id: "lucky-7",
    name: "Lucky 7",
    description: "Your 7s can count as 1, 7, or 11 for the best hand.",
  },
  {
    id: "dealer-panic",
    name: "Dealer Panic",
    description: "Dealer must hit until 18 instead of 17.",
  },
  {
    id: "soft-shield",
    name: "Soft Shield",
    description: "Once per run, busting by 1 saves you and sets you to 21.",
  },
  {
    id: "peek",
    name: "Peek",
    description: "See the next card in the deck before you commit.",
  },
  {
    id: "burn-card",
    name: "Burn Card",
    description: "Once per round, discard the next card from the deck.",
  },
  {
    id: "double-ghost",
    name: "Double Ghost",
    description: "Double round score, but a loss this round costs 2 hearts.",
  },
  {
    id: "ace-magnet",
    name: "Ace Magnet",
    description: "Add one temporary extra Ace to each new round deck.",
  },
  {
    id: "perfect-20",
    name: "Perfect 20",
    description: "Winning with exactly 20 grants +40 score.",
  },
  {
    id: "underdog-18",
    name: "Underdog 18",
    description: "Winning with 18 or less grants +60 score.",
  },
  {
    id: "dealer-tax",
    name: "Dealer Tax",
    description: "If the dealer lands on exactly 17 and you win, gain +35 score.",
  },
  {
    id: "blackjack-bounty",
    name: "Blackjack Bounty",
    description: "Your blackjack bonus becomes +75 instead of +25.",
  },
  {
    id: "red-seven-rite",
    name: "Red Seven Rite",
    description: "Winning with a red 7 in hand grants +35 score.",
  },
  {
    id: "grave-bloom",
    name: "Grave Bloom",
    description: "Wins grant +15 score for each missing heart.",
  },
  {
    id: "safe-push",
    name: "Safe Push",
    description: "Tied hands grant +25 score instead of nothing.",
  },
  {
    id: "split-spark",
    name: "Split Spark",
    description: "Each winning split hand grants +30 score.",
  },
  {
    id: "double-edge",
    name: "Double Edge",
    description: "Winning after Double Down grants +50 extra score.",
  },
  {
    id: "long-hand",
    name: "Long Hand",
    description: "Winning with 5 or more cards grants +50 score.",
  },
];

export function hasUpgrade(owned: UpgradeId[], id: UpgradeId): boolean {
  return owned.includes(id);
}

export function getRandomUpgradeChoices(
  owned: UpgradeId[],
  count = 3,
): Upgrade[] {
  const available = upgrades.filter((upgrade) => !owned.includes(upgrade.id));
  const pool = available.length >= count ? available : upgrades;
  return [...pool].sort(() => Math.random() - 0.5).slice(0, count);
}
