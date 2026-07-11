import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Settings, User, Bell, Cpu } from "lucide-react";
import { SettingsModal } from "./SettingsModal";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const TICKER_ITEMS = [
  { symbol: "AAPL", price: "240.25", change: "+1.25%", positive: true },
  { symbol: "MSFT", price: "415.10", change: "+0.48%", positive: true },
  { symbol: "NVDA", price: "128.50", change: "+3.42%", positive: true },
  { symbol: "TSLA", price: "195.80", change: "-0.78%", positive: false },
  { symbol: "AMZN", price: "185.30", change: "+2.11%", positive: true },
  { symbol: "META", price: "502.40", change: "-1.15%", positive: false },
  { symbol: "GOOGL", price: "178.60", change: "+0.92%", positive: true },
  { symbol: "NFLX", price: "680.15", change: "+1.65%", positive: true },
  { symbol: "INFY", price: "22.40", change: "-0.35%", positive: false },
  { symbol: "TCS", price: "48.20", change: "+0.80%", positive: true },
];

export function Navbar() {
  const [isSettingsOpen, setSettingsOpen] = useState(false);
  const [isComingSoonOpen, setComingSoonOpen] = useState(false);
  const [comingSoonFeature, setComingSoonFeature] = useState("");
  const [hasCustomKey, setHasCustomKey] = useState(false);
  const [activeTab, setActiveTab] = useState("terminal");

  useEffect(() => {
    setHasCustomKey(!!localStorage.getItem("groq_api_key"));
  }, [isSettingsOpen]);

  const navItems = [
    { id: "terminal", label: "Research Terminal" },
    { id: "market", label: "Market Analytics" },
    { id: "watchlists", label: "Watchlists" },
    { id: "intelligence", label: "Institutional Insights" },
  ];

  const handleNavClick = (id, label) => {
    if (id === "terminal") {
      setActiveTab(id);
    } else {
      setComingSoonFeature(label);
      setComingSoonOpen(true);
    }
  };

  return (
    <motion.header
      initial={{ y: -30, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="sticky top-0 z-50 bg-background/80 border-b border-b-border/40 backdrop-blur-md shadow-[0_1px_3px_oklch(0_0_0_/_0.02)]"
    >
      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 35s linear infinite;
        }
      `}</style>

      {/* Live Stock Ticker Marquee */}
      <div className="w-full bg-slate-950/95 text-white text-[10px] font-mono border-b border-border/10 py-1 overflow-hidden select-none">
        <div className="flex w-max animate-marquee whitespace-nowrap">
          {Array(3).fill(TICKER_ITEMS).flat().map((item, idx) => (
            <span key={idx} className="mx-6 flex items-center gap-1.5">
              <span className="font-semibold text-slate-300">{item.symbol}</span>
              <span className="text-slate-100">${item.price}</span>
              <span className={item.positive ? "text-emerald-400 font-medium" : "text-rose-400 font-medium"}>
                {item.change}
              </span>
            </span>
          ))}
        </div>
      </div>

      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        {/* Logo & Brand */}
        <div className="flex items-center gap-3">
          <div className="relative flex h-9.5 w-9.5 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-border bg-card shadow-[0_2px_8px_oklch(0_0_0_/_0.04)]">
            <img src="/logo.png" alt="Vortex Logo" className="h-5 w-5 object-contain" />
            <div className="absolute inset-0 bg-gradient-to-tr from-primary/10 to-transparent opacity-50" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-extrabold tracking-wider text-foreground leading-none flex items-center gap-1">
              VORTEX{" "}
              <span className="text-primary font-bold text-[10px] bg-primary/10 px-1.5 py-0.2 rounded font-mono">
                RESEARCH
              </span>
            </span>
            <span className="text-[10px] font-medium text-muted-foreground/80 tracking-normal mt-0.5">
              Institutional Terminal
            </span>
          </div>
        </div>

        {/* Navigation Links - Centered & Premium */}
        <nav className="hidden lg:flex items-center gap-1 rounded-full border border-border/60 bg-surface/30 p-1">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id, item.label)}
              suppressHydrationWarning={true}
              className={`px-4 py-1.5 text-xs font-semibold rounded-full transition-all cursor-pointer ${
                activeTab === item.id
                  ? "text-primary bg-card border border-border/80 shadow-[0_1px_2px_oklch(0_0_0_/_0.02)]"
                  : "text-muted-foreground hover:text-foreground hover:bg-surface/50"
              }`}
            >
              {item.label}
            </button>
          ))}
        </nav>

        {/* Right Area: Status, Tools, Profile */}
        <div className="flex items-center gap-3">
          {/* Real-time Status Badge */}
          <div className="hidden md:flex items-center gap-2 rounded-full border border-border/60 bg-surface/50 px-3 py-1.5">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success opacity-40" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-success" />
            </span>
            <span className="text-[11px] font-medium text-muted-foreground flex items-center gap-1.5">
              Terminal Engine: <span className="text-foreground font-semibold">Online</span>
              {hasCustomKey && <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground/40" />}
              {hasCustomKey && (
                <span className="text-[9px] font-bold text-primary tracking-wide uppercase">
                  Custom Key
                </span>
              )}
            </span>
          </div>

          {/* Action Buttons */}
          <IconButton label="Notifications" onClick={() => toast.success("No new system alerts.")}>
            <Bell className="h-4 w-4" />
          </IconButton>
          <IconButton onClick={() => setSettingsOpen(true)} label="Settings">
            <Settings className="h-4 w-4" />
          </IconButton>

          {/* User Profile Info Pill */}
          <div className="flex items-center gap-2 rounded-full border border-border/60 bg-surface/40 p-1 pl-3 hover:bg-surface/70 transition-all cursor-pointer">
            <span className="hidden sm:block text-xs font-semibold text-foreground/90 tracking-tight pr-1">
              A. Analyst
            </span>
            <div className="grid h-7 w-7 place-items-center rounded-full bg-gradient-to-br from-primary to-primary-glow text-white text-xs font-bold shadow-sm">
              <User className="h-3.5 w-3.5" />
            </div>
          </div>
        </div>
      </div>

      {/* Settings Modal */}
      <SettingsModal isOpen={isSettingsOpen} onClose={() => setSettingsOpen(false)} />

      {/* Coming Soon Modal Popup */}
      <Dialog open={isComingSoonOpen} onOpenChange={setComingSoonOpen}>
        <DialogContent className="max-w-[400px] border border-border/80 bg-background/95 p-6 shadow-2xl backdrop-blur-md rounded-2xl">
          <DialogHeader className="flex flex-col items-center justify-center text-center pb-2">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary mb-4 ring-8 ring-primary/5">
              <Cpu className="h-6 w-6" />
            </div>
            <DialogTitle className="text-lg font-bold tracking-tight text-foreground">
              Module Synchronizing
            </DialogTitle>
          </DialogHeader>
          
          <div className="py-2 text-center">
            <p className="text-sm text-muted-foreground leading-relaxed">
              The <span className="font-semibold text-foreground">{comingSoonFeature}</span> panel is currently offline for system upgrades. It will be available in the next terminal release.
            </p>
          </div>

          <div className="flex justify-center pt-4">
            <Button
              onClick={() => setComingSoonOpen(false)}
              className="w-full bg-gradient-to-r from-primary to-primary-glow hover:opacity-90 text-white cursor-pointer shadow-[0_0_15px_-3px_var(--color-primary)] font-semibold"
            >
              Acknowledge
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </motion.header>
  );
}

function IconButton({ children, label, onClick }) {
  return (
    <button
      onClick={onClick}
      aria-label={label}
      suppressHydrationWarning={true}
      className="grid h-9 w-9 place-items-center rounded-xl border border-border/60 bg-surface/40 text-muted-foreground transition-all hover:border-primary/30 hover:bg-surface hover:text-foreground hover:shadow-[0_2px_8px_oklch(0_0_0_/_0.02)] cursor-pointer"
    >
      {children}
    </button>
  );
}
