'use client'

import MinesGame from "@/src/components/mines-game";
import StreakInfo from "@/src/components/streak-info";
import { Button } from "@/components/ui/button";
import BetSelector from "@/src/components/bet-selector";
import GameResultModal from "@/src/components/game-result-modal";
import { useEffect, useState } from "react";
import { connectWallet, getCurrentAddress, getProvider } from "../lib/wallet";
import { shortenAddress } from "../utils/address";
import { Bonus } from "./bonus";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { WalletIcon } from "lucide-react";

export const GamePage = () => {
    const [betAmount, setBetAmount] = useState<number>(5);
    const [result, setResult] = useState<"win" | "lose" | null>(null);
    const [showModal, setShowModal] = useState(false);
    const [address, setAddress] = useState<string>("")
    const router = useRouter()
    const [connected, setConnected] = useState(false)

    function handleResult(r: "win" | "lose") {
        setResult(r);
        setShowModal(true);
    }

    const handleGameHistoy = () => {
        router.push('/history')
    }
    const handleLeaderBoardClick = () => {
        router.push('/leaderboard')
    }

    const connectAndListen = async () => {
        try {
            const provider = await connectWallet();
            const addr = await getCurrentAddress(provider);
            setAddress(addr);
            setConnected(true);

            const eth = (window as any).ethereum;
            if (!eth) return;

            eth.removeAllListeners('accountsChanged');
            eth.removeAllListeners('chainChanged');

            eth.on('accountsChanged', (accounts: string[]) => {
                setAddress(accounts.length ? accounts[0] : "");
            });

            eth.on('chainChanged', async () => {
                const provider = await getProvider();
                const addr = await getCurrentAddress(provider);
                setAddress(addr);
            });
        } catch (err) {
            setAddress("");
            setConnected(false);
        }
    };

    useEffect(() => {
        connectAndListen();
    }, []);

    const handleConnectWallet = async () => {
        await connectAndListen();
        toast.success("Wallet connected!", {
            style: { background: "#0c4a46", color: "#fff" }
        });
    };


    return (

        <div className="w-full h-full px-10 py-4">
            <div className="w-full flex mb-20 mt-10">
                <h1 className="text-5xl font-extrabold text-center bg-gradient-to-br from-teal-950 via-teal-200 to-white bg-clip-text text-transparent ml-auto">Somnia Mines</h1>
                <div className=" ml-auto">
                    <Button className="border-2 rounded-2xl border-teal-800 bg-transparent text-white p-6" onClick={handleConnectWallet}>
                        <WalletIcon size={10} className="text-teal-900" />
                        {address.length > 0 ? shortenAddress(address) : "Connect Wallet"}</Button>
                </div>
            </div>
            <div className="flex w-full items-center justify-between px-20">
                <div>
                    <MinesGame onResult={handleResult} />
                </div>
                <div className="flex flex-col justify-center items-center">
                    <Bonus />
                    <BetSelector value={betAmount} setValue={setBetAmount} min={5} max={1000000} />
                    <StreakInfo />
                    <div className="mt-20 flex gap-8">
                        <Button className="px-8 font-semibold" onClick={handleGameHistoy}>📰 Game History</Button>
                        <Button className="px-8 font-semibold" onClick={handleLeaderBoardClick}>🏅 Leaderboard</Button>
                    </div>
                </div>
            </div>
            <GameResultModal
                show={showModal}
                result={result}
                betAmount={betAmount}
                onClose={() => setShowModal(false)}
            />
        </div>

    )
}