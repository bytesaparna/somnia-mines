export type LeaderboardEntry = {
    address: string;
    wins: number;
    totalWon: number;
  };
  const LEADERBOARD_KEY = "mines_leaderboard";
  export function getLeaderboard(): LeaderboardEntry[] {
    if (typeof window === "undefined") return [];
    const raw = localStorage.getItem(LEADERBOARD_KEY);
    return raw ? JSON.parse(raw) : [];
  }
  export function updateLeaderboard(entry: LeaderboardEntry) {
    const board = getLeaderboard();
    const idx = board.findIndex(e => e.address === entry.address);
    if (idx >= 0) {
      board[idx] = {
        ...board[idx],
        wins: board[idx].wins + entry.wins,
        totalWon: board[idx].totalWon + entry.totalWon,
      };
    } else {
      board.push(entry);
    }
    localStorage.setItem(LEADERBOARD_KEY, JSON.stringify(board));
  }