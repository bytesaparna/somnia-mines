import { motion } from "framer-motion"
import { BONUS_THRESHOLD } from "../lib/streak"

export const Bonus = () => {
    return (
        <motion.div
            className="text-2xl font-extrabold mb-8"
            animate={{ scale: [1, 1.5, 1] }}
            transition={{
                duration: 1,
                repeat: Infinity,
                repeatDelay: 1,
                ease: "easeInOut",
            }}
        >
            Get Bonus every <span className="font-bold">{BONUS_THRESHOLD}</span> wins! 🎉
        </motion.div>
    )
}