import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const SpearDashboard = () => {
    const [isLoading] = useState(true);
    const textLetters = Array.from("THE CODE CONSORTIUM");

    useEffect(() => {
        window.scrollTo(0, 0);
        document.title = "Spear - All-in-One Hospitality Management Software";
    }, []);

    useEffect(() => {
        const timer = setTimeout(() => {
            window.location.replace('https://spear.thecodeconsortium.com/');
        }, 1500);
        return () => clearTimeout(timer);
    }, []);

    return (
        <div className="font-sans text-slate-800 overflow-x-hidden bg-[#1A1513] min-h-screen relative">
            <AnimatePresence>
                {isLoading && (
                    <motion.div
                        initial={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.5 }}
                        className="fixed inset-0 z-[100] bg-[#1A1513] flex items-center justify-center font-mono select-none"
                    >
                        <div className="flex gap-1 overflow-hidden">
                            {textLetters.map((letter, i) => (
                                <motion.span
                                    key={i}
                                    initial={{ y: "100%", opacity: 0 }}
                                    animate={{ y: 0, opacity: [0.2, 1, 0.2] }}
                                    transition={{
                                        y: { duration: 0.5, ease: "easeOut" },
                                        opacity: {
                                            duration: 1.5,
                                            repeat: Infinity,
                                            ease: "easeInOut",
                                            delay: i * 0.05
                                        }
                                    }}
                                    className="text-[#CAA052] text-xs md:text-sm tracking-widest font-black font-sans"
                                >
                                    {letter === " " ? "\u00A0" : letter}
                                </motion.span>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default SpearDashboard;
