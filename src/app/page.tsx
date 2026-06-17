"use client";

import { useMemo, useState } from "react";
import { ActionButtons } from "@/components/ActionButtons";
import { CardView } from "@/components/CardView";
import { GameHUD } from "@/components/GameHUD";
import { GameOverScreen } from "@/components/GameOverScreen";
import { HandView } from "@/components/HandView";
import { StartScreen } from "@/components/StartScreen";
import { UpgradeCard } from "@/components/UpgradeCard";
import {
  calculateBestHandValue,
  cardBaseValue,
  drawCard,
  PlayingCard,
} from "@/lib/cards";
import {
  drawForDealer,
  resolveRound,
  RoundResolution,
  RoundState,
  SplitHandResult,
  startNewRound,
} from "@/lib/game";
import { getRandomUpgradeChoices, hasUpgrade, Upgrade, UpgradeId } from "@/lib/upgrades";

type Screen = "start" | "game" | "upgrade" | "game-over";

const startingHearts = 5;

export default function Home() {
  const [screen, setScreen] = useState<Screen>("start");
  const [round, setRound] = useState(1);
  const [hearts, setHearts] = useState(startingHearts);
  const [score, setScore] = useState(0);
  const [bestScore, setBestScore] = useState(0);
  const [upgrades, setUpgrades] = useState<UpgradeId[]>([]);
  const [roundState, setRoundState] = useState<RoundState | null>(null);
  const [lastResolution, setLastResolution] = useState<RoundResolution | null>(null);
  const [upgradeChoices, setUpgradeChoices] = useState<Upgrade[]>([]);
  const [softShieldUsed, setSoftShieldUsed] = useState(false);
  const [roundsSurvived, setRoundsSurvived] = useState(0);
  const [copied, setCopied] = useState(false);

  const luckySeven = hasUpgrade(upgrades, "lucky-7");
  const canAct = Boolean(roundState && !roundState.stood && !roundState.resolved);
  const activePlayerHand = roundState?.splitHands
    ? roundState.splitHands[roundState.activeSplitHandIndex]
    : roundState?.playerHand;
  const canDoubleDown = Boolean(
    canAct && hearts >= 2 && activePlayerHand?.length === 2 && !roundState?.lastHitCard,
  );
  const canSplit = Boolean(
    canAct &&
      hearts >= 2 &&
      !roundState?.splitHands &&
      roundState?.playerHand.length === 2 &&
      !roundState.lastHitCard &&
      cardBaseValue(roundState.playerHand[0]) === cardBaseValue(roundState.playerHand[1]),
  );
  const playerValue = useMemo(
    () =>
      roundState && activePlayerHand
        ? roundState.playerValueOverride
          ? {
              ...calculateBestHandValue(activePlayerHand, luckySeven),
              best: roundState.playerValueOverride,
              isBust: false,
              display: String(roundState.playerValueOverride),
            }
          : calculateBestHandValue(activePlayerHand, luckySeven)
        : null,
    [roundState, activePlayerHand, luckySeven],
  );

  function updateActiveHand(state: RoundState, nextHand: PlayingCard[]): RoundState {
    if (!state.splitHands) {
      return {
        ...state,
        playerHand: nextHand,
      };
    }

    const nextSplitHands: [PlayingCard[], PlayingCard[]] = [
      state.splitHands[0],
      state.splitHands[1],
    ];
    nextSplitHands[state.activeSplitHandIndex] = nextHand;

    return {
      ...state,
      playerHand: nextHand,
      splitHands: nextSplitHands,
    };
  }

  function startRun() {
    const firstRound = startNewRound([]);
    setScreen("game");
    setRound(1);
    setHearts(startingHearts);
    setScore(0);
    setUpgrades([]);
    setRoundState(firstRound);
    setLastResolution(null);
    setUpgradeChoices([]);
    setSoftShieldUsed(false);
    setRoundsSurvived(0);
    setCopied(false);
  }

  function retryCurrentRound(nextHearts: number) {
    if (nextHearts <= 0) {
      setBestScore((best) => Math.max(best, score));
      setScreen("game-over");
      return;
    }

    setRoundState(startNewRound(upgrades));
    setLastResolution(null);
  }

  function finishRound(
    playerHand: PlayingCard[],
    dealerHand: PlayingCard[],
    deck: PlayingCard[],
    playerValueOverride: number | null = null,
    doubledDown = false,
  ) {
    const resolution = resolveRound(
      playerHand,
      dealerHand,
      upgrades,
      playerValueOverride,
      doubledDown,
      {
        currentHearts: hearts,
        maxHearts: startingHearts,
      },
    );
    const nextScore = score + resolution.scoreAwarded;
    const nextHearts = Math.max(0, hearts - resolution.lostHearts);

    setRoundState((state) =>
      state
        ? {
            ...state,
            deck,
            playerHand,
            dealerHand,
            playerValueOverride,
            stood: true,
            resolved: true,
            doubledDown,
          }
        : state,
    );
    setLastResolution(resolution);
    setScore(nextScore);
    setBestScore((best) => Math.max(best, nextScore));

    if (resolution.result === "player-win") {
      setRoundsSurvived((survived) => survived + 1);
      window.setTimeout(() => {
        setUpgradeChoices(getRandomUpgradeChoices(upgrades));
        setScreen("upgrade");
      }, 900);
      return;
    }

    setHearts(nextHearts);
    window.setTimeout(() => retryCurrentRound(nextHearts), 1100);
  }

  function finishSplitRound(
    splitResults: SplitHandResult[],
    dealerHand: PlayingCard[],
    deck: PlayingCard[],
  ) {
    const resolutions = splitResults.map((splitResult) =>
      resolveRound(
        splitResult.hand,
        dealerHand,
        upgrades,
        splitResult.playerValueOverride,
        splitResult.doubledDown,
        {
          currentHearts: hearts,
          maxHearts: startingHearts,
          isSplitHand: true,
        },
      ),
    );
    const scoreAwarded = resolutions.reduce(
      (total, resolution) => total + resolution.scoreAwarded,
      0,
    );
    const lostHearts = resolutions.reduce(
      (total, resolution) => total + resolution.lostHearts,
      0,
    );
    const wins = resolutions.filter(
      (resolution) => resolution.result === "player-win",
    ).length;
    const losses = resolutions.filter(
      (resolution) => resolution.result === "dealer-win",
    ).length;
    const pushes = resolutions.length - wins - losses;
    const nextScore = score + scoreAwarded;
    const nextHearts = Math.max(0, hearts - lostHearts);
    const aggregateResult =
      wins > 0 ? "player-win" : losses > 0 ? "dealer-win" : "push";

    setRoundState((state) =>
      state
        ? {
            ...state,
            deck,
            dealerHand,
            splitHands:
              splitResults.length === 2
                ? [splitResults[0].hand, splitResults[1].hand]
                : state.splitHands,
            completedSplitHands: splitResults,
            stood: true,
            resolved: true,
          }
        : state,
    );
    setLastResolution({
      result: aggregateResult,
      scoreAwarded,
      lostHearts,
      dealerBusted: resolutions.some((resolution) => resolution.dealerBusted),
      playerBlackjack: resolutions.some((resolution) => resolution.playerBlackjack),
      note: `Split resolved: ${wins} won, ${losses} lost, ${pushes} pushed.`,
    });
    setScore(nextScore);
    setBestScore((best) => Math.max(best, nextScore));
    setHearts(nextHearts);

    if (nextHearts <= 0) {
      window.setTimeout(() => setScreen("game-over"), 1100);
      return;
    }

    if (wins > 0) {
      setRoundsSurvived((survived) => survived + 1);
      window.setTimeout(() => {
        setUpgradeChoices(getRandomUpgradeChoices(upgrades));
        setScreen("upgrade");
      }, 1100);
      return;
    }

    window.setTimeout(() => retryCurrentRound(nextHearts), 1100);
  }

  function completeActiveSplitHand(
    hand: PlayingCard[],
    deck: PlayingCard[],
    playerValueOverride: number | null = null,
    doubledDown = false,
  ) {
    if (!roundState?.splitHands) {
      return;
    }

    const splitResult: SplitHandResult = {
      hand,
      playerValueOverride,
      doubledDown,
    };
    const nextCompletedSplitHands = [
      ...roundState.completedSplitHands,
      splitResult,
    ];

    if (roundState.activeSplitHandIndex === 0) {
      const nextSplitHands: [PlayingCard[], PlayingCard[]] = [
        hand,
        roundState.splitHands[1],
      ];

      setRoundState({
        ...roundState,
        deck,
        playerHand: nextSplitHands[1],
        splitHands: nextSplitHands,
        activeSplitHandIndex: 1,
        completedSplitHands: nextCompletedSplitHands,
        playerValueOverride: null,
        lastHitCard: null,
      });
      setLastResolution({
        result: "push",
        scoreAwarded: 0,
        lostHearts: 0,
        dealerBusted: false,
        playerBlackjack: false,
        note: "First split hand locked. Play the second hand.",
      });
      return;
    }

    const dealerResult = drawForDealer(deck, roundState.dealerHand, upgrades);
    finishSplitRound(
      nextCompletedSplitHands,
      dealerResult.dealerHand,
      dealerResult.deck,
    );
  }

  function hit() {
    if (!roundState || !canAct) {
      return;
    }

    const currentHand = activePlayerHand ?? roundState.playerHand;
    const draw = drawCard(roundState.deck);
    const nextHand = [...currentHand, draw.card];
    const nextValue = calculateBestHandValue(nextHand, luckySeven);

    if (
      hasUpgrade(upgrades, "soft-shield") &&
      !softShieldUsed &&
      nextValue.isBust &&
      nextValue.best === 22
    ) {
      setSoftShieldUsed(true);
      if (roundState.splitHands) {
        completeActiveSplitHand(nextHand, draw.deck, 21);
        return;
      }

      const dealerResult = drawForDealer(draw.deck, roundState.dealerHand, upgrades);
      finishRound(nextHand, dealerResult.dealerHand, dealerResult.deck, 21);
      return;
    }

    setRoundState({
      ...updateActiveHand(roundState, nextHand),
      deck: draw.deck,
      playerValueOverride: null,
      lastHitCard: draw.card,
    });

    if (nextValue.isBust) {
      if (roundState.splitHands) {
        completeActiveSplitHand(nextHand, draw.deck);
        return;
      }

      finishRound(nextHand, roundState.dealerHand, draw.deck);
    }
  }

  function stand() {
    if (!roundState || !canAct) {
      return;
    }

    if (roundState.splitHands) {
      completeActiveSplitHand(activePlayerHand ?? roundState.playerHand, roundState.deck);
      return;
    }

    const dealerResult = drawForDealer(roundState.deck, roundState.dealerHand, upgrades);
    finishRound(roundState.playerHand, dealerResult.dealerHand, dealerResult.deck);
  }

  function doubleDown() {
    if (!roundState || !canDoubleDown) {
      return;
    }

    const currentHand = activePlayerHand ?? roundState.playerHand;
    const draw = drawCard(roundState.deck);
    const nextHand = [...currentHand, draw.card];
    const nextValue = calculateBestHandValue(nextHand, luckySeven);

    if (
      hasUpgrade(upgrades, "soft-shield") &&
      !softShieldUsed &&
      nextValue.isBust &&
      nextValue.best === 22
    ) {
      setSoftShieldUsed(true);
      if (roundState.splitHands) {
        completeActiveSplitHand(nextHand, draw.deck, 21, true);
        return;
      }

      const dealerResult = drawForDealer(draw.deck, roundState.dealerHand, upgrades);
      finishRound(nextHand, dealerResult.dealerHand, dealerResult.deck, 21, true);
      return;
    }

    if (nextValue.isBust) {
      if (roundState.splitHands) {
        completeActiveSplitHand(nextHand, draw.deck, null, true);
        return;
      }

      finishRound(nextHand, roundState.dealerHand, draw.deck, null, true);
      return;
    }

    if (roundState.splitHands) {
      completeActiveSplitHand(nextHand, draw.deck, null, true);
      return;
    }

    const dealerResult = drawForDealer(draw.deck, roundState.dealerHand, upgrades);
    finishRound(nextHand, dealerResult.dealerHand, dealerResult.deck, null, true);
  }

  function splitHand() {
    if (!roundState || !canSplit) {
      return;
    }

    const firstDraw = drawCard(roundState.deck);
    const secondDraw = drawCard(firstDraw.deck);
    const firstHand = [roundState.playerHand[0], firstDraw.card];
    const secondHand = [roundState.playerHand[1], secondDraw.card];

    setRoundState({
      ...roundState,
      deck: secondDraw.deck,
      playerHand: firstHand,
      splitHands: [firstHand, secondHand],
      activeSplitHandIndex: 0,
      completedSplitHands: [],
      playerValueOverride: null,
      lastHitCard: null,
    });
    setLastResolution({
      result: "push",
      scoreAwarded: 0,
      lostHearts: 0,
      dealerBusted: false,
      playerBlackjack: false,
      note: "Split opened. Play hand 1, then hand 2.",
    });
  }

  function undo() {
    if (!roundState || !canAct || !roundState.canUndo || !roundState.lastHitCard) {
      return;
    }

    const nextState = updateActiveHand(
      roundState,
      (activePlayerHand ?? roundState.playerHand).slice(0, -1),
    );

    setRoundState({
      ...nextState,
      deck: [roundState.lastHitCard, ...roundState.deck],
      playerValueOverride: null,
      lastHitCard: null,
      canUndo: false,
    });
  }

  function burnCard() {
    if (!roundState || !canAct || !roundState.canBurn || roundState.deck.length === 0) {
      return;
    }

    const [, ...remainingDeck] = roundState.deck;
    setRoundState({
      ...roundState,
      deck: remainingDeck,
      canBurn: false,
    });
  }

  function chooseUpgrade(upgrade: Upgrade) {
    const nextUpgrades = upgrades.includes(upgrade.id)
      ? upgrades
      : [...upgrades, upgrade.id];

    setUpgrades(nextUpgrades);
    setRound((currentRound) => currentRound + 1);
    setRoundState(startNewRound(nextUpgrades));
    setLastResolution(null);
    setScreen("game");
  }

  async function shareResult() {
    const text = `I scored ${score} in Bust or Die and survived ${roundsSurvived} rounds. Can you beat the table?`;

    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
    } catch {
      setCopied(false);
    }
  }

  if (screen === "start") {
    return <StartScreen bestScore={bestScore} onStart={startRun} />;
  }

  if (screen === "game-over") {
    return (
      <GameOverScreen
        finalScore={score}
        roundsSurvived={roundsSurvived}
        bestScore={bestScore}
        copied={copied}
        onRestart={startRun}
        onShare={shareResult}
      />
    );
  }

  if (screen === "upgrade") {
    return (
      <main className="table-felt min-h-dvh px-4 py-6">
        <div className="enter-pop mx-auto w-full max-w-md">
          <section className="game-panel rounded-[1.6rem] p-5">
            <p className="text-xs font-black uppercase tracking-[0.22em] text-red-300">
              Round won
            </p>
            <h1 className="mt-2 text-4xl font-black leading-tight text-amber-50">
              Pick your poison.
            </h1>
            <p className="mt-2 text-sm font-semibold leading-6 text-amber-50/75">
              One upgrade joins the run. The dealer gets no vote.
            </p>
          </section>
          <div className="mt-5 grid gap-4">
            {upgradeChoices.map((upgrade) => (
              <UpgradeCard
                key={upgrade.id}
                upgrade={upgrade}
                onChoose={chooseUpgrade}
              />
            ))}
          </div>
        </div>
      </main>
    );
  }

  if (!roundState) {
    return null;
  }

  return (
    <main className="table-felt min-h-dvh px-4 pb-[calc(env(safe-area-inset-bottom)+1rem)]">
      <div className="mx-auto grid w-full max-w-md gap-4">
        <GameHUD
          hearts={hearts}
          maxHearts={startingHearts}
          round={round}
          score={score}
          bestScore={bestScore}
          upgrades={upgrades}
        />

        <div className="game-panel mt-1 flex items-center justify-between rounded-[1.25rem] p-3 text-sm font-bold text-amber-50/80">
          <span>
            {lastResolution?.note ??
              (roundState.doubleGhostActive
                ? "Double Ghost is live. Win big or bleed harder."
                : hearts < 2
                  ? "Low on hearts. Double Down and Split are locked."
                : canDoubleDown
                  ? "Double Down is open: one card, no retreat, double risk."
                  : canSplit
                    ? "Split is open: same value, two hands, one dealer."
                    : "Watch the count. Trust nothing.")}
          </span>
        </div>

        {hasUpgrade(upgrades, "peek") && roundState.deck[0] ? (
          <section className="game-panel flex items-center justify-between rounded-[1.25rem] p-3">
            <div>
              <div className="text-[10px] font-black uppercase tracking-[0.16em] text-amber-100/70">
                Peek
              </div>
              <div className="text-sm font-bold text-amber-50">Next card</div>
            </div>
            <CardView card={roundState.deck[0]} compact />
          </section>
        ) : null}

        <HandView
          title="Dealer"
          cards={roundState.dealerHand}
          hideFirstCard={!roundState.resolved && !roundState.stood}
        />
        {roundState.splitHands ? (
          <div className="grid gap-3">
            {roundState.splitHands.map((hand, index) => (
              <HandView
                key={`split-${index}`}
                title={`You ${index + 1}${
                  roundState.activeSplitHandIndex === index && !roundState.resolved
                    ? " - active"
                    : ""
                }`}
                cards={hand}
                luckySeven={luckySeven}
                valueOverride={
                  roundState.resolved
                    ? roundState.completedSplitHands[index]?.playerValueOverride
                    : null
                }
              />
            ))}
          </div>
        ) : (
          <HandView
            title="You"
            cards={roundState.playerHand}
            luckySeven={luckySeven}
            valueOverride={roundState.playerValueOverride}
          />
        )}

        <div className="game-panel sticky bottom-3 z-20 rounded-[1.5rem] p-3">
          <div className="mb-3 flex items-center justify-between text-sm font-bold text-amber-50/75">
            <span>Hand value</span>
            <span className={playerValue?.isBust ? "text-red-300" : "text-amber-200"}>
              {playerValue?.display}
            </span>
          </div>
          <ActionButtons
            canAct={canAct}
            canUndo={Boolean(roundState.canUndo && roundState.lastHitCard)}
            canBurn={roundState.canBurn}
            canDoubleDown={canDoubleDown}
            canSplit={canSplit}
            onHit={hit}
            onStand={stand}
            onDoubleDown={doubleDown}
            onSplit={splitHand}
            onUndo={undo}
            onBurn={burnCard}
          />
        </div>

        {upgrades.length > 0 ? (
          <section className="game-panel rounded-[1.25rem] p-3">
            <h2 className="text-xs font-black uppercase tracking-[0.16em] text-amber-100/70">
              Upgrades
            </h2>
            <div className="mt-2 flex flex-wrap gap-2">
              {upgrades.map((upgrade) => (
                <span
                  key={upgrade}
                  className="rounded-full bg-white/10 px-3 py-1 text-xs font-black text-white"
                >
                  {upgrade}
                </span>
              ))}
            </div>
          </section>
        ) : null}
      </div>
    </main>
  );
}
