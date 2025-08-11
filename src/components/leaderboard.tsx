'use client'
import React from "react";
import { getLeaderboard } from "../lib/leaderboard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function Leaderboard() {
  const [entries, setEntries] = React.useState(() => getLeaderboard());
  React.useEffect(() => {
    const interval = setInterval(() => setEntries(getLeaderboard()), 1000);
    return () => clearInterval(interval);
  }, []);
  return (
    <div className="flex flex-col items-center gap-6 p-10 justify-center">
      <h2 className="font-bold text-4xl">Leaderboard</h2>
      <Card className="mt-6 w-1/2">
        <CardContent>
          <ScrollArea className="max-h-[300px] overflow-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="font-semibold">Player</TableHead>
                  <TableHead className="font-semibold">Wins</TableHead>
                  <TableHead className="font-semibold">Total Won <b>SURVIVOR</b></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className="text-gray-400">
                {entries
                  .sort((a, b) => b.totalWon - a.totalWon)
                  .slice(0, 10)
                  .map((entry) => (
                    <TableRow key={entry.address}>
                      <TableCell className="truncate max-w-[120px] py-4">
                        {entry.address.slice(0, 6)}...{entry.address.slice(-4)}
                      </TableCell>
                      <TableCell>{entry.wins}</TableCell>
                      <TableCell>{entry.totalWon}</TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}