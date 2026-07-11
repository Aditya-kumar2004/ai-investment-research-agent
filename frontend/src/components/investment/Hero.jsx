import { motion } from "framer-motion";
import { ArrowRight, Search, Clock, TrendingUp } from "lucide-react";
import { useState } from "react";
const RECENT = ["Apple", "Microsoft", "Google", "NVIDIA", "Amazon"];
const POPULAR = [
  "Tesla",
  "Apple",
  "Meta",
  "Microsoft",
  "Amazon",
  "Netflix",
  "OpenAI",
  "NVIDIA",
  "Reliance",
  "TCS",
  "Infosys",
  "ICICI Bank",
];
export function Hero({ onAnalyze, loading }) {
  const [value, setValue] = useState("");
  const submit = (v) => {
    const q = (v ?? value).trim();
    if (!q || loading) return;
    setValue(q);
    onAnalyze(q);
  };
  const handleKey = (e) => {
    if (e.key === "Enter") submit();
  };
  return (
    <section className="relative overflow-hidden">
      <div
        className="pointer-events-none absolute inset-0"
        style={{ background: "var(--gradient-hero)" }}
      />
      <div className="pointer-events-none absolute left-1/2 top-20 h-96 w-96 -translate-x-1/2 rounded-full bg-primary/20 blur-[120px]" />

      <div className="relative mx-auto max-w-5xl px-4 pb-16 pt-16 sm:px-6 sm:pt-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mx-auto mb-6 flex w-fit items-center gap-2 rounded-full border border-border bg-surface/60 px-4 py-1.5 text-xs text-muted-foreground backdrop-blur"
        >
          <TrendingUp className="h-3.5 w-3.5 text-primary" />
          Deep research across global financial databases & market indicators
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.05 }}
          className="text-center text-4xl font-bold leading-[1.05] tracking-tight sm:text-6xl md:text-7xl"
        >
          <span className="text-gradient">Vortex Investment</span>
          <br />
          <span className="text-foreground">Research Terminal</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="mx-auto mt-5 max-w-2xl text-center text-base text-muted-foreground sm:text-lg"
        >
          Analyze any company using quantitative financial reasoning, news intelligence, and
          institutional-grade investment insights.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.25 }}
          className="mx-auto mt-10 max-w-2xl"
        >
          <div className="group relative">
            <div className="absolute -inset-0.5 rounded-2xl bg-[image:var(--gradient-primary)] opacity-40 blur-md transition-opacity group-focus-within:opacity-70" />
            <div className="relative flex items-center gap-2 rounded-2xl border border-border bg-surface/80 p-2 backdrop-blur-xl">
              <div className="grid h-11 w-11 shrink-0 place-items-center text-muted-foreground">
                <Search className="h-5 w-5" />
              </div>
              <input
                value={value}
                onChange={(e) => setValue(e.target.value)}
                onKeyDown={handleKey}
                disabled={loading}
                placeholder="Enter company name... e.g. Apple, Tesla, NVIDIA, Infosys, Reliance"
                className="min-w-0 flex-1 bg-transparent text-base text-foreground placeholder:text-muted-foreground/60 focus:outline-none disabled:opacity-50"
              />
              <button
                onClick={() => submit()}
                disabled={loading || !value.trim()}
                className="group/btn inline-flex shrink-0 items-center gap-2 rounded-xl bg-[image:var(--gradient-primary)] px-4 py-2.5 text-sm font-medium text-white shadow-[var(--shadow-glow)] transition-all hover:scale-[1.02] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                    <span className="hidden sm:inline">Analyzing</span>
                  </>
                ) : (
                  <>
                    <span className="hidden sm:inline">Analyze</span>
                    <ArrowRight className="h-4 w-4 transition-transform group-hover/btn:translate-x-0.5" />
                  </>
                )}
              </button>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.35 }}
          className="mx-auto mt-8 max-w-3xl"
        >
          <div className="mb-3 flex items-center justify-center gap-2 text-xs uppercase tracking-widest text-muted-foreground">
            <Clock className="h-3 w-3" /> Recent Searches
          </div>
          <div className="flex flex-wrap items-center justify-center gap-2">
            {RECENT.map((c, i) => (
              <motion.button
                key={c}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + i * 0.05 }}
                onClick={() => {
                  setValue(c);
                  submit(c);
                }}
                className="glass rounded-xl px-4 py-2.5 text-sm text-foreground/90 transition-all hover:border-primary/40 hover:bg-primary/10 hover:text-foreground"
              >
                {c}
              </motion.button>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mx-auto mt-8 max-w-4xl"
        >
          <div className="mb-3 text-center text-xs uppercase tracking-widest text-muted-foreground">
            Popular Companies
          </div>
          <div className="flex flex-wrap items-center justify-center gap-2">
            {POPULAR.map((c, i) => (
              <motion.button
                key={c}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.55 + i * 0.03 }}
                onClick={() => {
                  setValue(c);
                  submit(c);
                }}
                className="rounded-full border border-border bg-surface/40 px-3.5 py-1.5 text-xs text-muted-foreground transition-all hover:border-primary/40 hover:bg-primary/10 hover:text-foreground"
              >
                {c}
              </motion.button>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
