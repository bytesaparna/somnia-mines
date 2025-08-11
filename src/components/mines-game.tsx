'use client'

import { Button } from "@/components/ui/button";
import React, { useState } from "react";

type Props = {
  onResult: (result: "win" | "lose") => void;
};

const GRID_SIZE = 3;

// Helper for random mine placement
function makeBlocks(): ("mine" | "tree")[] {
  const arr: ("mine" | "tree")[] = Array(GRID_SIZE * GRID_SIZE).fill("tree");
  const mineIndex = Math.floor(Math.random() * arr.length);
  arr[mineIndex] = "mine";
  return arr;
}

const GameContainer: React.FC<Props> = ({ onResult }: Props) => {
  const [blocks, setBlocks] = useState<("mine" | "tree")[]>(() => makeBlocks());
  const [clickedBlock, setClickedBlock] = useState<number | null>(null);
  const [loose, setLoose] = useState(false);

  function clickHandler(idx: number) {
    if (clickedBlock !== null) return;
    setClickedBlock(idx);
    if (blocks[idx] === "mine") {
      setLoose(true);
      setTimeout(() => onResult("lose"), 1200);
    } else {
      setLoose(false);
      setTimeout(() => onResult("win"), 1200);
    }
  }

  function resetHandler() {
    setBlocks(makeBlocks());
    setClickedBlock(null);
    setLoose(false);
  }

  return (
    <div className="flex flex-col gap-4 items-center">
      {/* Container */}
      <div
        className="flex flex-wrap justify-evenly items-center border-none"
        style={{
          height: "480px", // 3 * 90px
          width: "480px",
          backgroundColor: "#264653",
        }}
      >
        {blocks.map((block, index) => {
          const isMine = block === "mine";
          const isTree = block === "tree";
          const isSelected = clickedBlock === index;
          return (
            <Button
              onClick={() => clickHandler(index)}
              key={index}
              disabled={clickedBlock !== null}
              className={[
                // Size & shape
                "w-[140px] h-[140px] rounded-xl shadow-md border-none flex items-center justify-center text-4xl font-bold transition-opacity duration-300",
                // Default background
                "bg-[#2a9d8f]",
                // Mine or tree background after reveal
                clickedBlock !== null && isMine ? "opacity-40 bg-cover bg-center" : "",
                clickedBlock !== null && isTree ? "opacity-40 bg-cover bg-center" : "",
                clickedBlock !== null && isMine
                  ? "bg-[url('/mine.webp')]"
                  : "",
                clickedBlock !== null && isTree
                  ? "bg-[url('/tree.jpg')]"
                  : "",
                // Selected
                isSelected ? "opacity-100" : "",
              ].join(" ")}
            >
            </Button>
          );
        })}
      </div>
      {/* Reset button */}
      <Button
        onClick={resetHandler}
        className="mt-4 px-10 h-10 bg-[#e9c46a] border-black border font-bold rounded-md text-base">
        Click to reset
      </Button>
      {/* Result message */}
      {clickedBlock !== null ? (
        loose ? (
          <p className="text-red-600 text-xl font-semibold mt-2">You loose</p>
        ) : (
          <p className="text-green-600 text-xl font-semibold mt-2">You won 🎉 </p>
        )
      ) : null}
    </div>
  );
};

export default GameContainer;