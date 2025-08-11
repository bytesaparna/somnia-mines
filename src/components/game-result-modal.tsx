"use client";

import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  getProvider,
  getCurrentAddress,
  sendSom,
} from "../lib/wallet";
import {
  incrementStreak,
  resetStreak,
  checkBonus,
  getBonusMultiplier,
} from "../lib/streak";
import { addGameHistory } from "../lib/history";
import { updateLeaderboard } from "../lib/leaderboard";
import { sendSurvivorToken } from "../lib/token";
import Confetti from "react-confetti";

const DECIMALS = Number(process.env.NEXT_PUBLIC_SURVIVOR_DECIMALS);

type Props = {
  show: boolean;
  result: "win" | "lose" | null;
  betAmount: number;
  onClose: () => void;
};

export default function GameResultModal({
  show,
  result,
  betAmount,
  onClose,
}: Props) {
  if (!result) return null;
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    if (show && result === "win") {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 6000)
    }
  }, [open, result]);

  async function handlePayout() {
    try {
      console.log("Step 1: Getting provider...");
      const provider = await getProvider();
      console.log("Step 2: Getting user address...");
      const userAddress = await getCurrentAddress(provider);
      console.log(userAddress, "USER ADDRESS");

      let survivorAmount = betAmount;
      let bonus = false;

      if (result === "win") {
        console.log("Step 3: Processing win...");
        const streak = incrementStreak();
        if (checkBonus(streak)) {
          console.log(getBonusMultiplier(), "BONUS MuLTIPLIER")
          survivorAmount = survivorAmount * getBonusMultiplier();
          bonus = true;
        }

        console.log("Step 4: Sending SURVIVOR tokens...");
        await sendSurvivorToken({
          provider,
          to: userAddress,
          amount: (survivorAmount * Math.pow(10, DECIMALS - 1)).toString(),
        });
        console.log((survivorAmount * Math.pow(10, DECIMALS - 1)), "AMOUNT")
        console.log("Step 5: Tokens sent successfully");
        toast.success(
          `You received ${survivorAmount} SURVIVOR tokens${bonus ? " (Bonus!)" : ""
          }`
        );
        updateLeaderboard({
          address: userAddress,
          wins: 1,
          totalWon: survivorAmount,
        });
      } else if (result === "lose") {
        console.log("Step 3: Processing loss...");
        resetStreak();
        alert("You lost! No tokens this time.");
      }

      console.log("Step 6: Adding to game history...");
      addGameHistory({
        result: result!,
        amount: survivorAmount,
        time: new Date().toISOString(),
      });
      toast.success("Transaction successful!", {
        style: { background: "#0c4a46", color: "#fff" },
      });
    } catch (e) {
      console.log("ERROR DETAILS:", e);
      toast.error("Transaction failed: " + (e as Error).message, {
        style: { background: "#b91c1c", color: "#fff" },
      });
    }
    onClose();
  }

  return (
    <Dialog open={show} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md overflow-hidden">
        {showConfetti &&
          <Confetti
            width={600}
            height={200}
            numberOfPieces={300}
            recycle={false}
            wind={0.01}
            gravity={0.2}
            colors={["#0c4a46", "#ffffff"]}
          />
        }

        <DialogHeader>
          <DialogTitle className="text-2xl">
            {result === "win" ? "You Won!" : "You Lost!"}
          </DialogTitle>
          <DialogDescription>
            {result === "win"
              ? `You won ${betAmount} SURVIVOR${betAmount > 1 ? " (including bonus!)" : ""
              }`
              : `You lost ${betAmount} SURVIVOR`}
          </DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <Button
            className="bg-teal-950 text-white hover:bg-teal-700"
            onClick={handlePayout}
          >
            {result === "win" ? "Claim Reward" : "Pay Owner"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog >
  );
}
