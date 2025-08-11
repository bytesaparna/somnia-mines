'use client'

import { getGameHistory } from "../lib/history";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useEffect, useState } from "react";

export default function GameHistory() {
  const [history, setHistory] = useState(() => getGameHistory());
  useEffect(() => {
    const interval = setInterval(() => setHistory(getGameHistory()), 1000);
    return () => clearInterval(interval);
  }, []);
  return (
    <div className="flex flex-col items-center gap-6 p-10 justify-center">
      <h2 className="font-bold text-4xl">Recent Plays</h2>
      <div className="w-full flex justify-between mt-6 text-gray-300 text-lg border border-teal-900 rounded-lg py-6 px-10 mb-10">
        <div>
          Total Wins <b> 👍🏻 {history.reduce((sum, h) => (h.result === "win" ? sum + 1 : sum), 0)}</b>
        </div>
        <div>
          Total Lose <b>👎🏻 {history.reduce((sum, h) => (h.result === "lose" ? sum + 1 : sum), 0)}</b>
        </div>
        <div>
          Total Won <b>SURVIVOR</b> tokens <b>{history.reduce((sum, h) => (sum = sum + h.amount), 0)} 🎉</b>
        </div>
      </div>
      <Card className="mt-4 w-3/4">
        <CardHeader className="flex px-10 justify-between font-semibold">
          <div className="flex gap-4">
            <p>Result</p>
            <p>Amount</p>
          </div>
          <p>Date</p>
        </CardHeader>
        <CardContent>
          <ScrollArea className="max-h-[300px] overflow-auto px-4">
            <ul className="space-y-5">
              {history.map((h, i) => (
                <li
                  key={i}
                  className="flex items-center justify-between border-b pb-2 last:border-0"
                >
                  <div className="flex items-center gap-4">
                    <Badge
                      variant={h.result === "win" ? "default" : "destructive"}
                      className={h.result === "win" ? "bg-green-600 hover:bg-green-700" : ""}
                    >
                      {h.result.toUpperCase()}
                    </Badge>
                    <span>{h.amount} SOM</span>
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {new Date(h.time).toLocaleString()}
                  </span>
                </li>
              ))}
            </ul>
          </ScrollArea>
        </CardContent>
      </Card>

    </div>
  );
}