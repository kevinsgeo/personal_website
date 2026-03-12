"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import Particles from "@/components/Particles";

const COLS = 20;
const ROWS = 15;
const TICK_MS_BASE = 260;
const TICK_MS_MIN = 120;
const TICK_MS_PER_POINT = 8;

function tickMs(score: number) {
  return Math.max(TICK_MS_MIN, TICK_MS_BASE - score * TICK_MS_PER_POINT);
}

type Dir = "up" | "down" | "left" | "right";
type GameState = "idle" | "playing" | "gameover";

function randomCell(): { x: number; y: number } {
  return { x: Math.floor(Math.random() * COLS), y: Math.floor(Math.random() * ROWS) };
}

function initialSnake(): { x: number; y: number }[] {
  const headX = Math.floor(COLS / 2);
  const headY = Math.floor(ROWS / 2);
  return [
    { x: headX, y: headY },
    { x: headX - 1, y: headY },
    { x: headX - 2, y: headY },
  ];
}

function spawnFood(snake: { x: number; y: number }[]): { x: number; y: number } {
  let food = randomCell();
  while (snake.some((s) => s.x === food.x && s.y === food.y)) {
    food = randomCell();
  }
  return food;
}

export default function GamePage() {
  const [gameState, setGameState] = useState<GameState>("idle");
  const [snake, setSnake] = useState<{ x: number; y: number }[]>(initialSnake);
  // Deterministic initial food so server and client render the same (avoids hydration mismatch)
  const [food, setFood] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [dir, setDir] = useState<Dir>("right");
  const [nextDir, setNextDir] = useState<Dir>("right");
  const [score, setScore] = useState(0);
  const tickRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const dirRef = useRef<Dir>("right");
  const nextDirRef = useRef<Dir>("right");
  const foodRef = useRef(food);
  const scoreRef = useRef(score);
  const lastTickRef = useRef(0);
  const tickInProgressRef = useRef(false);
  const scoreIncrementedThisTickRef = useRef(false);
  const gameOverSoundRef = useRef<HTMLAudioElement | null>(null);
  const gameStartSoundRef = useRef<HTMLAudioElement | null>(null);
  const eatSoundRef = useRef<HTMLAudioElement | null>(null);
  const gameOverPlayedRef = useRef(false);

  dirRef.current = dir;
  nextDirRef.current = nextDir;
  foodRef.current = food;
  scoreRef.current = score;

  // Randomize food only on client after mount so SSR and first client render match
  useEffect(() => {
    setFood(spawnFood(initialSnake()));
  }, []);

  useEffect(() => {
    gameOverSoundRef.current = new Audio("/sounds/gameover.wav");
    gameStartSoundRef.current = new Audio("/sounds/gamestart.wav");
    eatSoundRef.current = new Audio("/sounds/eat.wav");
    gameOverSoundRef.current.volume = 0.4;
    gameStartSoundRef.current.volume = 0.4;
    eatSoundRef.current.volume = 0.4;
  }, []);

  const startGame = useCallback(() => {
    gameOverPlayedRef.current = false;
    gameStartSoundRef.current?.play().catch(() => {});
    const init = initialSnake();
    setSnake(init);
    setFood(spawnFood(init));
    setDir("right");
    setNextDir("right");
    dirRef.current = "right";
    nextDirRef.current = "right";
    setScore(0);
    setGameState("playing");
  }, []);

  useEffect(() => {
    if (gameState !== "playing") return;

    lastTickRef.current = Date.now();
    const CHECK_MS = 50;

    tickRef.current = setInterval(() => {
      if (tickInProgressRef.current) return;
      const now = Date.now();
      const delay = tickMs(scoreRef.current);
      if (now - lastTickRef.current < delay) return;
      lastTickRef.current = now;
      tickInProgressRef.current = true;
      scoreIncrementedThisTickRef.current = false;

      setDir((d) => nextDirRef.current);
      setSnake((prev) => {
        const head = prev[0];
        const d = nextDirRef.current;
        let nx = head.x;
        let ny = head.y;
        if (d === "up") ny--;
        else if (d === "down") ny++;
        else if (d === "left") nx--;
        else nx++;

        if (nx < 0 || nx >= COLS || ny < 0 || ny >= ROWS) {
          setGameState("gameover");
          return prev;
        }
        if (prev.some((s) => s.x === nx && s.y === ny)) {
          setGameState("gameover");
          return prev;
        }

        const newHead = { x: nx, y: ny };
        const currentFood = foodRef.current;
        const ateFood =
          currentFood.x === newHead.x && currentFood.y === newHead.y;
        if (ateFood) {
          if (!scoreIncrementedThisTickRef.current) {
            scoreIncrementedThisTickRef.current = true;
            setScore((s) => s + 1);
            eatSoundRef.current?.play().catch(() => {});
          }
          const newSnake = [newHead, ...prev];
          setFood(spawnFood(newSnake));
          return newSnake;
        }
        return [newHead, ...prev.slice(0, -1)];
      });
      setTimeout(() => {
        tickInProgressRef.current = false;
      }, 0);
    }, CHECK_MS);

    return () => {
      if (tickRef.current) clearInterval(tickRef.current);
      tickRef.current = null;
    };
  }, [gameState]);

  useEffect(() => {
    if (gameState === "gameover" && !gameOverPlayedRef.current) {
      gameOverPlayedRef.current = true;
      gameOverSoundRef.current?.play().catch(() => {});
    }
  }, [gameState]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const d = dirRef.current;
      switch (e.key) {
        case "ArrowUp":
          e.preventDefault();
          if (d !== "down") setNextDir("up");
          break;
        case "ArrowDown":
          e.preventDefault();
          if (d !== "up") setNextDir("down");
          break;
        case "ArrowLeft":
          e.preventDefault();
          if (d !== "right") setNextDir("left");
          break;
        case "ArrowRight":
          e.preventDefault();
          if (d !== "left") setNextDir("right");
          break;
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const foodKey = `${food.x},${food.y}`;
  // Continuous snake path: polyline through segment centers (head to tail)
  const snakePath =
    snake.length > 0
      ? `M ${snake.map((s) => `${s.x + 0.5},${s.y + 0.5}`).join(" L ")}`
      : "";

  return (
    <div className="relative z-10 flex h-screen w-screen flex-col overflow-hidden bg-[#0a0a0a]">
      {/* Back button — outside the green boundary */}
      <header className="shrink-0 border-b-0 px-4 py-3">
        <Link
          href="/"
          className="text-xs tracking-[0.15em] text-green-dim transition-colors hover:text-green"
        >
          &lt; Back
        </Link>
      </header>

      {/* Game boundary: big green border only around the play area */}
      <div className="relative flex min-h-0 flex-1 flex-col border-[12px] border-[#00ff41] border-solid">
        {/* Score at top inside boundary */}
        <div
          className="shrink-0 py-2 text-center text-sm"
          style={{ color: "#00cc33" }}
        >
          {gameState !== "idle" && `Score: ${score}`}
        </div>

        {/* Idle: title and subtitle at top */}
        {gameState === "idle" && (
          <div className="absolute inset-0 z-20 flex flex-col pt-6">
            <h2
              className="text-glow text-center text-xl uppercase tracking-[0.2em] sm:text-2xl"
              style={{ color: "#00ff41" }}
            >
              Snake
            </h2>
            <p
              className="mt-2 text-center text-sm"
              style={{ color: "#00cc33" }}
            >
              Use arrow keys to move
            </p>
            <div className="mt-8 flex justify-center">
              <button
                type="button"
                className="nes-btn is-success"
                onClick={startGame}
              >
                Start
              </button>
            </div>
          </div>
        )}

        {gameState === "gameover" && (
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-4">
            <p className="text-lg" style={{ color: "#00cc33" }}>
              Game over
            </p>
            <p className="text-sm" style={{ color: "#00cc33" }}>
              Score: {score}
            </p>
            <button
              type="button"
              className="nes-btn is-success"
              onClick={startGame}
            >
              Play again
            </button>
          </div>
        )}

        {/* Grid + continuous snake overlay */}
        <div className="relative min-h-0 flex-1">
          <div
            className="absolute inset-0"
            style={{
              display: "grid",
              gridTemplateColumns: `repeat(${COLS}, 1fr)`,
              gridTemplateRows: `repeat(${ROWS}, 1fr)`,
              background: "#0a0a0a",
            }}
          >
            {Array.from({ length: ROWS }, (_, y) =>
              Array.from({ length: COLS }, (_, x) => {
                const key = `${x},${y}`;
                const isFood = key === foodKey;
                return (
                  <div
                    key={key}
                    className="flex min-h-0 min-w-0 items-center justify-center"
                  >
                    {isFood && (
                      <div
                        className="h-[26%] w-[26%] rounded-full bg-[#F5B041]"
                        style={{ minWidth: 2, minHeight: 2 }}
                      />
                    )}
                  </div>
                );
              })
            ).flat()}
          </div>
          {/* Snake as one continuous path (same coordinate system as grid) */}
          <svg
            className="absolute inset-0 h-full w-full"
            viewBox={`0 0 ${COLS} ${ROWS}`}
            preserveAspectRatio="none"
          >
            <path
              d={snakePath}
              fill="none"
              stroke="#00ff41"
              strokeWidth="0.32"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>

      <Particles count={60} />
    </div>
  );
}
