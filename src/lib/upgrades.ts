export type UpgradeId =
  | "second-chance"
  | "lucky-7"
  | "dealer-panic"
  | "soft-shield"
  | "peek"
  | "burn-card"
  | "double-ghost"
  | "ace-magnet";

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
