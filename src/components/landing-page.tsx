'use client'

import { Button } from "@/components/ui/button"
import { Background } from "@/components/Background"
import { useRouter } from "next/navigation"
import Link from "next/link"

export function LandingPage() {
    const router = useRouter()
    const handlePlayNow = () => {
        router.push('/game')
    }
    const handleLeaderBoardClick = () => {
        router.push('/leaderboard')
    }
    return (
        <div className="flex flex-col items-center text-center overflow-hidden w-full h-full">
            <Background />
            <div className="relative z-10 space-y-4 md:space-y-5 lg:space-y-6 mb-6 md:mb-7 lg:mb-9 max-w-md md:max-w-[500px] lg:max-w-[588px] mt-16 md:mt-[120px] lg:mt-[160px] px-4">
                <h1 className="text-foreground text-3xl md:text-4xl lg:text-6xl font-semibold leading-tight">
                    Welcome to <b>Somnia Mines</b> 💣
                </h1>
                <p className="text-muted-foreground text-base md:text-base lg:text-lg font-medium leading-relaxed max-w-lg mx-auto">
                    Clear the field without hitting any mines and get exciting rewards in form of tokens. </p>
            </div>

            <div className="relative z-10 flex gap-4 mt-20">
                <Button
                    onClick={handlePlayNow}
                    className="bg-primary text-primary-foreground hover:bg-primary/90 px-8 py-3 rounded-full font-medium text-base shadow-lg ring-1 ring-white/10">
                    🎮  Play Now
                </Button>
                <Button variant="outline" className="border-border text-foreground hover:bg-accent px-8 py-3 rounded-full font-medium text-base"
                    onClick={handleLeaderBoardClick}
                >
                    📊 Leaderboard
                </Button>

            </div>
            <p className="mt-10"> Try out the new web3 based experience of the game and win exclusive rewards</p>
            <p className="z-10">You will need  SURVIVOR token to play or bet in this game. So if you dont already have it, click
                <Link href={'https://testnet.euclidswap.io/swap'} target="blank" className="text-blue-600 px-1 font-semibold">here</Link>
                to swap
            </p>
        </div>
    )
}
