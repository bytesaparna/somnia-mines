import { Input } from "@/components/ui/input";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { toast } from "sonner";

type Props = {
  value: number;
  setValue: (val: number) => void;
  min?: number;
  max?: number;
};

export default function BetSelector({ value, setValue, min, max }: Props) {
  return (

    <div className="w-lg mb-8 flex flex-col justify-center  items-center mt-8 border border-teal-900 rounded-xl px-4 py-8 gap-4">
      <label className="mr-2 font-medium">Bet <b>SURVIVOR</b> token to make the game more interesting</label>
      <p>If you dont already have SURVIVOR token click
        <Link href={'https://testnet.euclidswap.io/swap'} target="blank" className="text-blue-600 px-1">here</Link>
        to swap</p>
      <div className="flex w-full items-start justify-between px-15">
        <Input
          type="number"
          placeholder="5"
          min={min}
          max={max}
          step="1"
          value={value}
          onChange={(e) => {
            const next = Number(e.target.value);
            if (typeof min === "number" && next < min) {
              toast.error(`Minimum bet is ${min} SURVIVOR`);
              return;
            }
            setValue(next);
          }}
          className="border rounded px-4 py-6 w-40 mt-10"
        />
        <div>
          <Image src={'/survivor.png'} alt="survivor img" width={150} height={150} className="rounded-full"></Image>
        </div>
      </div>
      <div className="flex flex-col text-sm items-start w-full px-8">
        <p>Bet Amount</p>
        <div className="flex flex-col w-1/2 py-2">
          <div className="flex justify-between  text-gray-500 text-sm items-center">
            <span className="">
              Minimum
            </span>
            <span>
              {min} SURVIVOR
            </span>
          </div>
          <div className="flex justify-between text-gray-500 text-sm items-center">
            <span className="">
              Maximum
            </span>
            <span>
              {max} SURVIVOR
            </span>
          </div>
        </div>
      </div>
    </div>

  );
}