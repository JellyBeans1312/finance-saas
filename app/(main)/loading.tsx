'use client';

import { motion } from "framer-motion";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";
import Image from "next/image";
import logo from '@/public/logo.svg';
import logoDark from '@/public/logo-dark.svg';

const LoadingPage = () => {
    const { theme } = useTheme();
    const isDark = theme === 'dark';

    return (
        <div className="h-screen flex flex-col items-center justify-center bg-background">
            <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="mb-8"
            >
                <Image src={isDark ? logoDark : logo} alt="CoreLedger" width={48} height={48} className="size-12 rounded-lg bg-primary/10" />
            </motion.div>

            {/* Loading Dots */}
            <div className="flex space-x-2">
                {[...Array(3)].map((_, i) => (
                    <motion.div
                        key={i}
                        initial={{ y: 0 }}
                        animate={{ 
                            y: [0, -8, 0],
                            opacity: [0.5, 1, 0.5],
                        }}
                        transition={{
                            duration: 0.8,
                            repeat: Infinity,
                            delay: i * 0.2,
                            ease: "easeInOut"
                        }}
                        className={cn(
                            "size-3 rounded-full",
                            isDark ? "bg-primary/80" : "bg-primary/60"
                        )}
                    />
                ))}
            </div>

            {/* Loading Text */}
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
                className="mt-4 text-sm text-muted-foreground"
            >
                <motion.span
                    animate={{ opacity: [1, 0.5, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                >
                    Loading your data...
                </motion.span>
            </motion.div>

            {/* Progress Bar */}
            <motion.div
                className="mt-8 h-1 w-48 bg-muted overflow-hidden rounded-full"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
            >
                <motion.div
                    className="h-full bg-primary"
                    initial={{ width: "0%" }}
                    animate={{ 
                        width: ["0%", "100%"],
                        x: ["-100%", "0%"]
                    }}
                    transition={{ 
                        duration: 1.5,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                />
            </motion.div>
        </div>
    );
};

export default LoadingPage;