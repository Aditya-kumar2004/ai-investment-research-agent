import { motion } from "framer-motion";
import { AlertTriangle, RotateCcw, Play } from "lucide-react";
export function ErrorState({ error, company, onRetry, onReset }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="mx-auto max-w-2xl px-4 py-16 sm:px-6"
    >
      <div className="glass-strong relative overflow-hidden rounded-3xl p-8 sm:p-10">
        <div className="pointer-events-none absolute -top-24 left-1/2 h-64 w-64 -translate-x-1/2 rounded-full bg-destructive/25 blur-[100px]" />
        <div className="relative flex flex-col items-center text-center">
          <div className="grid h-14 w-14 place-items-center rounded-2xl bg-destructive/15 text-destructive ring-1 ring-destructive/30">
            <AlertTriangle className="h-6 w-6" />
          </div>

          <h3 className="mt-5 text-xl font-semibold sm:text-2xl">Analysis couldn't complete</h3>
          <p className="mt-2 max-w-md text-sm text-muted-foreground">{error.message}</p>

          {(error.status || error.code) && (
            <div className="mt-3 inline-flex items-center gap-2 rounded-full border border-border bg-surface/60 px-3 py-1 font-mono text-[11px] text-muted-foreground">
              {error.status && <span>HTTP {error.status}</span>}
              {error.status && error.code && <span>·</span>}
              {error.code && <span>{error.code}</span>}
            </div>
          )}

          <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
            {error.retryable && (
              <button
                onClick={onRetry}
                className="inline-flex items-center gap-2 rounded-xl bg-[image:var(--gradient-primary)] px-4 py-2.5 text-sm font-medium text-white shadow-[var(--shadow-glow)] transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                <RotateCcw className="h-4 w-4" /> Retry analysis
              </button>
            )}
            <button
              onClick={onReset}
              className="inline-flex items-center gap-2 rounded-xl border border-border bg-surface/60 px-4 py-2.5 text-sm text-muted-foreground transition-all hover:border-primary/40 hover:text-foreground"
            >
              Try a different company
            </button>
          </div>

          {company && (
            <p className="mt-5 text-xs text-muted-foreground">
              Failed while analyzing <span className="font-medium text-foreground">{company}</span>
            </p>
          )}
        </div>
      </div>
    </motion.div>
  );
}
