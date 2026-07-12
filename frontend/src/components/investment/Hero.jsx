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
const COMPANY_LOGOS = {
  "Apple": (
    <svg className="h-3.5 w-3.5 fill-current text-[#A3AAAE] shrink-0" viewBox="0 0 24 24">
      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 4.17c.66-.81 1.11-1.93.99-3.06-1 .04-2.21.67-2.93 1.49-.62.69-1.16 1.84-1.01 2.96 1.12.09 2.27-.57 2.95-1.39z" />
    </svg>
  ),
  "Microsoft": (
    <svg className="h-3 w-3 shrink-0" viewBox="0 0 23 23">
      <path fill="#F25022" d="M0 0h11v11H0z" />
      <path fill="#7FBA00" d="M12 0h11v11H12z" />
      <path fill="#01A6F0" d="M0 12h11v11H0z" />
      <path fill="#FFB900" d="M12 12h11v11H12z" />
    </svg>
  ),
  "Google": (
    <svg className="h-3.5 w-3.5 shrink-0" viewBox="0 0 24 24">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22c-.1-.28-.19-.57-.25-.87z" />
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
    </svg>
  ),
  "NVIDIA": (
    <svg className="h-3.5 w-3.5 shrink-0 fill-current text-[#76B900]" viewBox="0 0 24 24">
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 14.5c-2.48 0-4.5-2.02-4.5-4.5s2.02-4.5 4.5-4.5c1.47 0 2.77.72 3.59 1.83l-1.42 1.42C14.52 10.28 13.83 10 13 10c-1.38 0-2.5 1.12-2.5 2.5s1.12 2.5 2.5 2.5c.83 0 1.52-.28 2.05-.75l1.42 1.42c-1 .92-2.18 1.33-3.47 1.33z" />
    </svg>
  ),
  "Amazon": (
    <svg className="h-3.5 w-3.5 shrink-0 fill-current text-[#FF9900]" viewBox="0 0 24 24">
      <path d="M18.7 18c-1.5 1.2-3.8 1.9-6.2 1.9-3.2 0-6.1-1.3-8.1-3.4-.3-.3-.1-.6.3-.5 2.4.9 5.2 1.4 8 1.4 2.2 0 4.5-.3 6.6-1 .5-.2.7.2.4.6zm.9-2.3c-.1-.3-.4-.2-.6-.1-.9.4-2 .7-3.1.9-.3.1-.4.3-.2.5.8.7 1.9 1 3 .6.3-.1.4-.4.3-.6.1-.2-.1-.9-.4-1.3zM12 4c-4.4 0-8 3.6-8 8s3.6 8 8 8 8-3.6 8-8-3.6-8-8-8zm0 13.5c-3 0-5.5-2.5-5.5-5.5S9 6.5 12 6.5s5.5 2.5 5.5 5.5-2.5 5.5-5.5 5.5z" />
    </svg>
  ),
  "Tesla": (
    <svg className="h-3.5 w-3.5 shrink-0 fill-current text-[#E82127]" viewBox="0 0 24 24">
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm3.8 8.8c.1-.1.1-.3 0-.4-.4-.3-.9-.6-1.5-.7-.1 0-.2.1-.2.2 0 .3.1.6.2.9.1.2.3.2.4.1.4-.2.8-.5 1.1-.1zm-5.4-.9c-.1-.1-.2-.2-.2-.2-.6 0-1.1.3-1.5.7.3-.4.8-.7 1.5-.7l.2.2zm1.6-1.9V6.5c0-.1-.1-.2-.2-.2h-1c-.1 0-.2.1-.2.2v1.5c0 .1.1.2.2.2h1c.1 0 .2-.1.2-.2z" />
    </svg>
  ),
  "Meta": (
    <svg className="h-3.5 w-3.5 shrink-0 fill-current text-[#0064E0]" viewBox="0 0 24 24">
      <path d="M16.5 6C14.36 6 12.63 7.23 12 9c-.63-1.77-2.36-3-4.5-3C4.46 6 2 8.46 2 11.5S4.46 17 7.5 17c2.14 0 3.87-1.23 4.5-3 .63 1.77 2.36 3 4.5 3 3.04 0 5.5-2.46 5.5-5.5S19.54 6 16.5 6zm-9 9.5C5.57 15.5 4 13.93 4 12s1.57-3.5 3.5-3.5S11 10.07 11 12s-1.57 3.5-3.5 3.5zm9 0c-1.93 0-3.5-1.57-3.5-3.5s1.57-3.5 3.5-3.5 3.5 1.57 3.5 3.5-1.57 3.5-3.5 3.5z" />
    </svg>
  ),
  "Netflix": (
    <svg className="h-3.5 w-3.5 shrink-0 fill-current text-[#E50914]" viewBox="0 0 24 24">
      <path d="M5.5 2h3l3.5 10V2h3v20h-3l-3.5-10v10h-3V2z" />
    </svg>
  ),
  "OpenAI": (
    <svg className="h-3.5 w-3.5 shrink-0 fill-current text-[#10A37F]" viewBox="0 0 24 24">
      <path d="M21.5 10.7a4.2 4.2 0 0 0-2.1-3.6 4.3 4.3 0 0 0-.2-4.9 4.3 4.3 0 0 0-4.4-1.5 4.3 4.3 0 0 0-3.8-2.2 4.3 4.3 0 0 0-3.8 2.2 4.3 4.3 0 0 0-4.4 1.5 4.3 4.3 0 0 0-.2 4.9 4.2 4.2 0 0 0-2.1 3.6 4.2 4.2 0 0 0 2.1 3.6c.1.5.3 1 .6 1.3a4.3 4.3 0 0 0 4 3.6 4.3 4.3 0 0 0 3.8 2.2 4.3 4.3 0 0 0 3.8-2.2 4.3 4.3 0 0 0 4.4-1.5 4.3 4.3 0 0 0 .2-4.9 4.3 4.3 0 0 0-2.1-3.6zm-11.8 7.3a2.8 2.8 0 0 1-1.4-.4l3.5-2 2 1.1v4a2.8 2.8 0 0 1-4.1-2.7zm-2.7-7.4a2.8 2.8 0 0 1 1.4-2.4l3.5 2v4l-3.5 2a2.8 2.8 0 0 1-1.4-5.6zm10.9-2.4A2.8 2.8 0 0 1 16.5 13l-3.5-2v-4l3.5-2a2.8 2.8 0 0 1 1.4 5.6zm-3.7 2.4l-3.5-2V4.6a2.8 2.8 0 0 1 4.1 2.7v6.3l-.6.4z" />
    </svg>
  ),
  "Reliance": (
    <svg className="h-3.5 w-3.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="#0F2C59" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 20V4h6a4 4 0 0 1 0 8H6" />
      <path d="M12 12l6 8" />
    </svg>
  ),
  "TCS": (
    <svg className="h-3.5 w-3.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="#007CC3" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 6h16M12 6v14" />
    </svg>
  ),
  "Infosys": (
    <svg className="h-3.5 w-3.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="#007CC3" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 16v-4M12 8h.01" />
      <circle cx="12" cy="12" r="10" />
    </svg>
  ),
  "ICICI Bank": (
    <svg className="h-3.5 w-3.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="#B02C2C" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 6v12M8 6h8M8 18h8" />
    </svg>
  )
};

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
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="mx-auto mt-6 max-w-2xl text-center text-base text-muted-foreground sm:text-lg"
        >
          Analyze any company using quantitative financial reasoning, news intelligence, and institutional-grade investment insights.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.15 }}
          className="mx-auto mt-10 max-w-2xl"
        >
          <div className="flex gap-2 rounded-2xl border border-border bg-surface/80 p-2 shadow-lg backdrop-blur focus-within:border-primary/50 transition-colors">
            <div className="flex flex-1 items-center gap-2 px-3">
              <Search className="h-5 w-5 text-muted-foreground" />
              <input
                type="text"
                placeholder="Enter company name... e.g. Apple, Tesla, NVIDIA"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                onKeyDown={handleKey}
                disabled={loading}
                className="w-full bg-transparent py-2 text-foreground placeholder-muted-foreground outline-none disabled:opacity-50"
              />
            </div>
            <button
              onClick={() => submit()}
              disabled={loading || !value.trim()}
              className="flex items-center gap-1.5 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-md hover:bg-primary/90 disabled:opacity-50 disabled:pointer-events-none transition-colors cursor-pointer"
            >
              {loading ? (
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
              ) : (
                <>
                  Analyze <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
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
                className="glass rounded-xl px-4 py-2.5 text-sm text-foreground/90 transition-all hover:border-primary/40 hover:bg-primary/10 hover:text-foreground flex items-center gap-2 cursor-pointer"
              >
                {COMPANY_LOGOS[c]}
                <span>{c}</span>
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
                className="rounded-full border border-border bg-surface/40 px-3.5 py-1.5 text-xs text-muted-foreground transition-all hover:border-primary/40 hover:bg-primary/10 hover:text-foreground flex items-center gap-1.5 cursor-pointer"
              >
                {COMPANY_LOGOS[c]}
                <span>{c}</span>
              </motion.button>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
