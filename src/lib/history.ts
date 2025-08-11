export type GameHistoryEntry = {
    result: "win" | "lose";
    amount: number;
    time: string;
  };
  const HISTORY_KEY = "mines_history";
  export function getGameHistory(): GameHistoryEntry[] {
    if (typeof window === "undefined") return [];
    const raw = localStorage.getItem(HISTORY_KEY);
    return raw ? JSON.parse(raw) : [];
  }
  export function addGameHistory(entry: GameHistoryEntry) {
    const history = getGameHistory();
    history.unshift(entry);
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history.slice(0, 20)));
  }