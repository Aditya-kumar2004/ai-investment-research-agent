import { motion, AnimatePresence } from "framer-motion";
import { Cpu, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
const STEPS = [
  "Collecting Financial Data...",
  "Parsing News & Sentiments...",
  "Evaluating Risk Vectors...",
  "Comparing Competitors...",
  "Executing Quantitative Assessment...",
  "Compiling Final Verdict...",
];
export function LoadingScreen() {
  const [step, setStep] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setStep((s) => (s + 1) % STEPS.length), 900);
    return () => clearInterval(t);
  }, []);
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="mx-auto max-w-3xl px-4 py-16 sm:px-6"
    >
      <div className="glass-strong relative overflow-hidden rounded-3xl p-8 sm:p-12">
        <div className="pointer-events-none absolute -top-24 left-1/2 h-64 w-64 -translate-x-1/2 rounded-full bg-primary/30 blur-[100px]" />
        <div className="relative flex flex-col items-center gap-6">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
            className="relative grid h-20 w-20 place-items-center"
          >
            <div className="absolute inset-0 rounded-full border-2 border-primary/20" />
            <div className="absolute inset-0 rounded-full border-t-2 border-primary" />
            <Cpu className="h-8 w-8 text-primary" />
          </motion.div>

          <div className="text-center">
            <h3 className="text-xl font-semibold sm:text-2xl">Compiling Market Intelligence</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Executing multi-factor modeling across active databases
            </p>
          </div>

          <div className="h-8 w-full max-w-md overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.div
                key={step}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.35 }}
                className="flex items-center justify-center gap-2 text-sm text-muted-foreground"
              >
                <Loader2 className="h-4 w-4 animate-spin text-primary" />
                {STEPS[step]}
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="flex w-full max-w-md gap-1">
            {STEPS.map((_, i) => (
              <div key={i} className="h-1 flex-1 overflow-hidden rounded-full bg-white/5">
                <motion.div
                  className="h-full rounded-full bg-[image:var(--gradient-primary)]"
                  initial={{ width: "0%" }}
                  animate={{ width: i <= step ? "100%" : "0%" }}
                  transition={{ duration: 0.6 }}
                />
              </div>
            ))}
          </div>

          <div className="flex gap-1.5">
            {[0, 1, 2].map((i) => (
              <motion.span
                key={i}
                className="h-1.5 w-1.5 rounded-full bg-primary"
                animate={{ opacity: [0.3, 1, 0.3] }}
                transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.2 }}
              />
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
