import {
  calculateBestHandValue,
  createDeck,
  drawCard,
  isBlackjack,
  PlayingCard,
  shuffleDeck,
} from "./cards";
import { hasUpgrade, UpgradeId } from "./upgrades";

export type RoundResult = "player-win" | "dealer-win" | "push";

export type RoundResolution = {
  result: RoundResult;
  scoreAwarded: number;
  lostHearts: number;
  dealerBusted: boolean;
  playerBlackjack: boolean;
  note: string;
};

export type SplitHandResult = {
  hand: PlayingCard[];
  playerValueOverride: number | null;
  doubledDown: boolean;
};

export type RoundState = {
  deck: PlayingCard[];
  dealerHand: PlayingCard[];
  playerHand: PlayingCard[];
  splitHands: [PlayingCard[], PlayingCard[]] | null;
  activeSplitHandIndex: number;
  completedSplitHands: SplitHandResult[];
  playerValueOverride: number | null;
  stood: boolean;
  resolved: boolean;
  lastHitCard: PlayingCard | null;
  canUndo: boolean;
  canBurn: boolean;
  shieldUsedThisRound: boolean;
  doubleGhostActive: boolean;
  doubledDown: boolean;
};

export function startNewRound(upgrades: UpgradeId[]): RoundState {
  let deck = shuffleDeck(createDeck(hasUpgrade(upgrades, "ace-magnet")));
  const playerHand: PlayingCard[] = [];
  const dealerHand: PlayingCard[] = [];

  for (let drawIndex = 0; drawIndex < 2; drawIndex += 1) {
    const playerDraw = drawCard(deck);
    playerHand.push(playerDraw.card);
    deck = playerDraw.deck;

    const dealerDraw = drawCard(deck);
    dealerHand.push(dealerDraw.card);
    deck = dealerDraw.deck;
  }

  return {
    deck,
    dealerHand,
    playerHand,
    splitHands: null,
    activeSplitHandIndex: 0,
    completedSplitHands: [],
    playerValueOverride: null,
    stood: false,
    resolved: false,
    lastHitCard: null,
    canUndo: hasUpgrade(upgrades, "second-chance"),
    canBurn: hasUpgrade(upgrades, "burn-card"),
    shieldUsedThisRound: false,
    doubleGhostActive: hasUpgrade(upgrades, "double-ghost"),
    doubledDown: false,
  };
}

export function drawForDealer(
  deck: PlayingCard[],
  dealerHand: PlayingCard[],
  upgrades: UpgradeId[],
): { deck: PlayingCard[]; dealerHand: PlayingCard[] } {
  let nextDeck = deck;
  const nextHand = [...dealerHand];
  const standValue = hasUpgrade(upgrades, "dealer-panic") ? 18 : 17;

  while (calculateBestHandValue(nextHand).best < standValue) {
    const draw = drawCard(nextDeck);
    nextHand.push(draw.card);
    nextDeck = draw.deck;
  }

  return { deck: nextDeck, dealerHand: nextHand };
}

export function resolveRound(
  playerHand: PlayingCard[],
  dealerHand: PlayingCard[],
  upgrades: UpgradeId[],
  playerValueOverride: number | null = null,
  doubledDown = false,
): RoundResolution {
  const luckySeven = hasUpgrade(upgrades, "lucky-7");
  const calculatedPlayerValue = calculateBestHandValue(playerHand, luckySeven);
  const playerValue = playerValueOverride
    ? {
        ...calculatedPlayerValue,
        best: playerValueOverride,
        isBust: false,
        display: String(playerValueOverride),
      }
    : calculatedPlayerValue;
  const dealerValue = calculateBestHandValue(dealerHand);
  const playerBlackjack = isBlackjack(playerHand, luckySeven);
  const dealerBusted = dealerValue.isBust;

  let result: RoundResult = "push";
  let note = "You tied the dealer. No heart lost, no glory gained.";

  if (playerValue.isBust) {
    result = "dealer-win";
    note = "You busted. The table bites back.";
  } else if (dealerBusted) {
    result = "player-win";
    note = "Dealer busts. You live to chase another hand.";
  } else if (playerValue.best > dealerValue.best) {
    result = "player-win";
    note = "You beat the dealer. Take the win.";
  } else if (playerValue.best < dealerValue.best) {
    result = "dealer-win";
    note = "Dealer takes the hand. That one stings.";
  }

  const doubleGhost = hasUpgrade(upgrades, "double-ghost");
  const scoreMultiplier = (doubleGhost ? 2 : 1) * (doubledDown ? 2 : 1);
  const heartLoss =
    result === "dealer-win"
      ? 1 + (doubleGhost ? 1 : 0) + (doubledDown ? 1 : 0)
      : 0;
  const baseScore =
    result === "player-win"
      ? 100 + (playerBlackjack ? 25 : 0) + (dealerBusted ? 10 : 0)
      : 0;

  const modifierNotes = [
    doubleGhost && result === "player-win" ? "Double Ghost doubles the score." : "",
    doubleGhost && result === "dealer-win"
      ? "Double Ghost takes an extra heart."
      : "",
    doubledDown && result === "player-win" ? "Double Down doubles the score." : "",
    doubledDown && result === "dealer-win" ? "Double Down costs an extra heart." : "",
  ].filter(Boolean);

  return {
    result,
    scoreAwarded: baseScore * scoreMultiplier,
    lostHearts: heartLoss,
    dealerBusted,
    playerBlackjack,
    note: modifierNotes.length > 0 ? `${note} ${modifierNotes.join(" ")}` : note,
  };
}

export function rankTitle(score: number): string {
  if (score >= 2000) {
    return "Blackjack Menace";
  }
  if (score >= 1000) {
    return "Dealer's Problem";
  }
  if (score >= 500) {
    return "Risk Taker";
  }
  return "Table Rookie";
}
