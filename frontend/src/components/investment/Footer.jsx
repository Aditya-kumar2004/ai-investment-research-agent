import { ArrowRight, Check, Github, Linkedin, Mail, Twitter, Cpu } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { z } from "zod";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { subscribeToNewsletter } from "@/services/api";

const emailSchema = z
  .string()
  .trim()
  .min(1, { message: "Enter your email to subscribe" })
  .max(255, { message: "Email is too long" })
  .email({ message: "Enter a valid email address" });

function NewsletterCta() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState(null);
  const [status, setStatus] = useState("idle");
  const [isSuccessOpen, setSuccessOpen] = useState(false);
  const [subscriberEmail, setSubscriberEmail] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    if (status === "loading") return;
    const result = emailSchema.safeParse(email);
    if (!result.success) {
      const msg = result.error.issues[0]?.message ?? "Invalid email";
      setError(msg);
      toast.error(msg);
      return;
    }
    setError(null);
    setStatus("loading");
    try {
      const response = await subscribeToNewsletter(result.data);
      setSubscriberEmail(result.data);
      setStatus("success");
      setSuccessOpen(true);
      setEmail("");
      setTimeout(() => setStatus("idle"), 3200);
    } catch (err) {
      setStatus("idle");
      const errMsg = err.message || "Subscription failed. Please try again.";
      setError(errMsg);
      toast.error(errMsg);
    }
  };

  return (
    <div className="relative mb-14 overflow-hidden rounded-2xl border border-border/60 bg-surface/40 p-6 sm:p-8">
      <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-primary/20 blur-[80px]" />
      <div className="pointer-events-none absolute -bottom-20 -left-10 h-56 w-56 rounded-full bg-primary-glow/15 blur-[80px]" />

      <div className="relative grid grid-cols-1 items-center gap-6 md:grid-cols-[minmax(0,1fr)_auto]">
        <div className="min-w-0">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-[11px] uppercase tracking-widest text-primary">
            <Mail className="h-3 w-3" /> Weekly digest
          </div>
          <h3 className="mt-3 text-xl font-semibold tracking-tight sm:text-2xl">
            Institutional investment research, delivered every Monday
          </h3>
          <p className="mt-1.5 max-w-lg text-sm text-muted-foreground">
            Curated company deep-dives, risk signals, and analyst-grade thesis breakdowns. No spam,
            unsubscribe anytime.
          </p>
        </div>

        <form onSubmit={submit} noValidate className="w-full md:w-auto">
          <div className="flex w-full flex-col gap-2 md:w-[420px]">
            <div
              className={`group relative flex items-center gap-2 rounded-xl border bg-background/60 p-1.5 backdrop-blur transition-all focus-within:border-primary/60 focus-within:shadow-[0_0_25px_-8px_var(--color-primary)] ${error ? "border-destructive/60" : "border-border"}`}
            >
              <Mail className="ml-2 h-4 w-4 shrink-0 text-muted-foreground" />
              <input
                type="email"
                inputMode="email"
                autoComplete="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (error) setError(null);
                }}
                maxLength={255}
                disabled={status === "loading" || status === "success"}
                placeholder="you@company.com"
                aria-invalid={error ? true : undefined}
                aria-describedby={error ? "newsletter-error" : undefined}
                className="min-w-0 flex-1 bg-transparent py-1.5 text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none disabled:opacity-60"
              />
              <button
                type="submit"
                disabled={status === "loading" || status === "success"}
                className="inline-flex shrink-0 items-center gap-1.5 rounded-lg bg-[image:var(--gradient-primary)] px-3.5 py-2 text-sm font-medium text-white shadow-[var(--shadow-glow)] transition-all hover:scale-[1.02] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-70"
              >
                {status === "loading" ? (
                  <>
                    <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                    <span className="hidden sm:inline">Subscribing</span>
                  </>
                ) : status === "success" ? (
                  <>
                    <Check className="h-3.5 w-3.5" />
                    <span className="hidden sm:inline">Subscribed</span>
                  </>
                ) : (
                  <>
                    <span className="hidden sm:inline">Subscribe</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </>
                )}
              </button>
            </div>
            {error ? (
              <p id="newsletter-error" className="pl-1 text-xs text-destructive">
                {error}
              </p>
            ) : (
              <p className="pl-1 text-[11px] text-muted-foreground">
                By subscribing you agree to our Privacy Policy.
              </p>
            )}
          </div>
        </form>
      </div>

      {/* Success Greeting Modal Popup */}
      <Dialog open={isSuccessOpen} onOpenChange={setSuccessOpen}>
        <DialogContent className="max-w-[420px] border border-emerald-500/30 bg-slate-950/95 p-6 shadow-[0_0_50px_-12px_rgba(16,185,129,0.2)] backdrop-blur-md rounded-2xl">
          <DialogHeader className="flex flex-col items-center justify-center text-center pb-2">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-400 mb-4 ring-8 ring-emerald-500/5 shadow-[0_0_20px_rgba(16,185,129,0.2)]">
              <Check className="h-7 w-7" />
            </div>
            <DialogTitle className="text-xl font-bold tracking-tight text-white">
              Welcome to the Team!
            </DialogTitle>
            <span className="text-[11px] font-bold tracking-wider text-emerald-400 uppercase bg-emerald-500/10 px-2 py-0.5 rounded-full mt-1.5">
              Subscription Confirmed
            </span>
          </DialogHeader>
          
          <div className="py-3 text-center space-y-3">
            <p className="text-sm text-slate-300 leading-relaxed">
              We are so excited to have you on board! We just sent a confirmation email to <span className="font-semibold text-white underline">{subscriberEmail}</span>.
            </p>
            <p className="text-xs text-slate-400 leading-relaxed">
              Get ready to receive premium, analyst-grade stock market insights directly in your inbox every Monday morning.
            </p>
          </div>

          <div className="flex justify-center pt-4">
            <Button
              onClick={() => setSuccessOpen(false)}
              className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:opacity-90 text-white cursor-pointer shadow-[0_0_20px_-3px_rgba(16,185,129,0.4)] font-semibold border-none rounded-xl"
            >
              Let's Explore
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

const LINKS = [
  {
    heading: "Product",
    items: [
      { label: "Research Terminal", href: "#" },
      { label: "Financial Metrics", href: "#" },
      { label: "Risk Analysis", href: "#" },
      { label: "API Access", href: "#" },
    ],
  },
  {
    heading: "Data Sources",
    items: [
      { label: "SEC Filings", href: "#" },
      { label: "Yahoo Finance", href: "#" },
      { label: "Alpha Vantage", href: "#" },
      { label: "News Feed", href: "#" },
    ],
  },
  {
    heading: "Company",
    items: [
      { label: "About", href: "#" },
      { label: "Careers", href: "#" },
      { label: "Blog", href: "#" },
      { label: "Contact", href: "#" },
    ],
  },
  {
    heading: "Legal",
    items: [
      { label: "Privacy Policy", href: "#" },
      { label: "Terms of Service", href: "#" },
      { label: "Disclaimer", href: "#" },
      { label: "Security", href: "#" },
    ],
  },
];

export function Footer() {
  const [isComingSoonOpen, setComingSoonOpen] = useState(false);
  const [comingSoonFeature, setComingSoonFeature] = useState("");

  const handleLinkClick = (label) => {
    setComingSoonFeature(label);
    setComingSoonOpen(true);
  };

  const getDialogDetails = () => {
    switch (comingSoonFeature) {
      case "About":
        return {
          title: "About Vortex Research",
          content: (
            <div className="space-y-3 text-left">
              <p className="text-sm text-muted-foreground leading-relaxed">
                Vortex Research is a financial technology innovation lab dedicated to democratizing institutional-grade investment tools. We combine high-speed inference processing and robust server caching to provide real-time investment synthesis.
              </p>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Founded in 2025, our mission is to build highly accessible, secure, and data-rich terminals for quantitative analysts and individual investors alike.
              </p>
            </div>
          ),
          buttonText: "Close"
        };
      case "Careers":
        return {
          title: "Careers & Opportunities",
          content: (
            <div className="space-y-3 text-left">
              <p className="text-sm text-muted-foreground">
                We are actively looking for passionate engineering and research talent to join our team:
              </p>
              <ul className="space-y-2 text-xs text-muted-foreground list-disc pl-4">
                <li><strong>AI Product Engineer (Intern)</strong> - Mumbai / Remote (Full-time conversion option)</li>
                <li><strong>Quantitative Analyst Intern</strong> - Bengaluru / Remote</li>
                <li><strong>Full-Stack Software Engineer (Node.js/React)</strong> - Remote</li>
              </ul>
              <p className="text-[11px] text-primary font-medium mt-2 pt-2 border-t border-border/40">
                To apply, send your CV and portfolio to <span className="underline font-semibold">careers@vortexresearch.com</span>.
              </p>
            </div>
          ),
          buttonText: "Close"
        };
      case "Blog":
        return {
          title: "Vortex Engineering & Finance Blog",
          content: (
            <div className="space-y-3 text-left">
              <div className="border-b border-border/40 pb-2">
                <h4 className="text-xs font-bold text-foreground">1. Accelerating LLM Inference in Finance</h4>
                <p className="text-[11px] text-muted-foreground">How we leverage Groq to fetch structured company data sheets in under 2 seconds.</p>
              </div>
              <div className="border-b border-border/40 pb-2">
                <h4 className="text-xs font-bold text-foreground">2. Hybrid Caching in Fintech Apps</h4>
                <p className="text-[11px] text-muted-foreground">A deep dive into fallback strategies combining MongoDB TTL indexes and in-memory key-value maps.</p>
              </div>
              <div>
                <h4 className="text-xs font-bold text-foreground">3. Type-Safe Routing with TanStack Start</h4>
                <p className="text-[11px] text-muted-foreground">Why we chose React 19 and TanStack Router over standard Next.js for our SPA terminal.</p>
              </div>
            </div>
          ),
          buttonText: "Close"
        };
      case "Contact":
        return {
          title: "Contact & Support",
          content: (
            <div className="space-y-3 text-left text-sm text-muted-foreground leading-relaxed">
              <div className="flex flex-col gap-2 border-b border-border/40 pb-3">
                <span>✉️ <strong>Support & General:</strong> support@vortexresearch.com</span>
                <span>✉️ <strong>Partnerships & Sales:</strong> partner@vortexresearch.com</span>
                <span>📍 <strong>Headquarters:</strong> Altuni AI Labs, Tech Hub, Bengaluru, India</span>
              </div>
              <p className="text-[11px] text-muted-foreground pt-1">
                Our team responds to all inquiries within 12 business hours.
              </p>
            </div>
          ),
          buttonText: "Close"
        };
      case "Privacy Policy":
        return {
          title: "Privacy Policy",
          content: (
            <div className="space-y-3 text-left">
              <p className="text-sm text-muted-foreground leading-relaxed">
                Your privacy is highly important to us. Vortex Research does not sell, share, or trade your personal data with third parties.
              </p>
              <p className="text-sm text-muted-foreground leading-relaxed">
                We only collect minimal usage statistics to optimize search caching. Your custom API keys are saved locally in your browser and never transmitted to our servers.
              </p>
            </div>
          ),
          buttonText: "Close"
        };
      case "Terms of Service":
        return {
          title: "Terms of Service",
          content: (
            <div className="space-y-3 text-left">
              <p className="text-sm text-muted-foreground leading-relaxed">
                By using Vortex Research Terminal, you agree to use our platform solely for educational, analytical, and personal research purposes.
              </p>
              <p className="text-sm text-muted-foreground leading-relaxed">
                The automated analysis sheets are generated by AI models and should not be treated as professional financial or investment advice.
              </p>
            </div>
          ),
          buttonText: "Close"
        };
      case "Disclaimer":
        return {
          title: "Financial Disclaimer",
          content: (
            <div className="space-y-3 text-left">
              <p className="text-sm text-muted-foreground leading-relaxed">
                All financial info, metrics, and generated reports on this terminal are for information purposes only. They are not direct investment advice or buy/sell recommendations.
              </p>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Always perform your own research and consult a licensed financial advisor before making any investment decisions. Vortex is not liable for any financial losses.
              </p>
            </div>
          ),
          buttonText: "Close"
        };
      case "Security":
        return {
          title: "Security & Data Protection",
          content: (
            <div className="space-y-3 text-left">
              <p className="text-sm text-muted-foreground leading-relaxed">
                Vortex Terminal uses industry-standard encryption protocols (HTTPS/SSL) to protect all API communications.
              </p>
              <p className="text-sm text-muted-foreground leading-relaxed">
                We do not host or store your private credentials. Custom API keys are saved securely in your browser's local sandbox, keeping your access keys private to you.
              </p>
            </div>
          ),
          buttonText: "Close"
        };
      default:
        return {
          title: "Feature Under Construction",
          content: (
            <div className="py-2 text-center">
              <p className="text-sm text-muted-foreground leading-relaxed">
                The <span className="font-semibold text-foreground">{comingSoonFeature}</span> section is currently under development. It will be available very soon!
              </p>
            </div>
          ),
          buttonText: "Okay"
        };
    }
  };

  const dialogDetails = getDialogDetails();

  return (
    <footer className="relative mt-20 border-t border-border/60">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
      <div className="pointer-events-none absolute -top-24 left-1/2 h-48 w-[600px] -translate-x-1/2 rounded-full bg-primary/10 blur-[100px]" />

      <div className="relative mx-auto max-w-7xl px-4 py-14 sm:px-6">
        <NewsletterCta />
        <div className="grid grid-cols-1 gap-10 md:grid-cols-6">
          <div className="md:col-span-2">
            <div className="flex items-center gap-3">
              <div className="grid h-10 w-10 shrink-0 place-items-center overflow-hidden rounded-xl border border-border shadow-[var(--shadow-glow)]">
                <img
                  src="/logo.png"
                  alt="Vortex Logo"
                  className="h-full w-full object-cover"
                />
              </div>
              <div>
                <div className="text-sm font-semibold tracking-tight">Vortex Research Terminal</div>
                <div className="text-[11px] text-muted-foreground">
                  Enterprise financial intelligence
                </div>
              </div>
            </div>
            <p className="mt-5 max-w-sm text-sm leading-relaxed text-muted-foreground">
              Institutional-grade investment research for public companies. Quantitative reasoning across
              financials, news, risk and competitive positioning.
            </p>

            <div className="mt-5 inline-flex items-center gap-2 rounded-full border border-border bg-surface/60 px-3 py-1.5 text-[11px] text-muted-foreground">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success opacity-60" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-success" />
              </span>
              All systems operational
            </div>

            <div className="mt-6 flex items-center gap-2">
              <SocialLink label="GitHub" onClick={() => handleLinkClick("GitHub")}>
                <Github className="h-4 w-4" />
              </SocialLink>
              <SocialLink label="Twitter" onClick={() => handleLinkClick("Twitter")}>
                <Twitter className="h-4 w-4" />
              </SocialLink>
              <SocialLink label="LinkedIn" onClick={() => handleLinkClick("LinkedIn")}>
                <Linkedin className="h-4 w-4" />
              </SocialLink>
            </div>
          </div>

          {LINKS.map((col) => (
            <div key={col.heading} className="md:col-span-1">
              <h4 className="text-[11px] font-semibold uppercase tracking-widest text-foreground/90">
                {col.heading}
              </h4>
              <ul className="mt-4 space-y-2.5">
                {col.items.map((l) => (
                  <li key={l.label}>
                    <button
                      onClick={() => handleLinkClick(l.label)}
                      className="text-sm text-muted-foreground transition-colors hover:text-foreground cursor-pointer text-left font-sans"
                    >
                      {l.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 grid grid-cols-1 items-center gap-4 border-t border-border/60 pt-6 sm:grid-cols-[minmax(0,1fr)_auto]">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-muted-foreground">
            <span>© {new Date().getFullYear()} Vortex Research Terminal</span>
            <span className="hidden sm:inline">·</span>
            <span>
              Powered by <span className="text-foreground/80">Groq</span> +{" "}
              <span className="text-foreground/80">LangChain</span>
            </span>
          </div>
          <p className="text-[11px] leading-relaxed text-muted-foreground sm:text-right">
            For research and educational purposes only. Not investment advice.
          </p>
        </div>
      </div>

      {/* Dynamic Info / Coming Soon Modal Popup */}
      <Dialog open={isComingSoonOpen} onOpenChange={setComingSoonOpen}>
        <DialogContent className="max-w-[420px] border border-border/80 bg-background/95 p-6 shadow-2xl backdrop-blur-md rounded-2xl">
          <DialogHeader className="flex flex-col items-center justify-center text-center pb-2">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary mb-4 ring-8 ring-primary/5">
              <Cpu className="h-6 w-6" />
            </div>
            <DialogTitle className="text-lg font-bold tracking-tight text-foreground">
              {dialogDetails.title}
            </DialogTitle>
          </DialogHeader>
          
          <div className="py-2">
            {dialogDetails.content}
          </div>

          <div className="flex justify-center pt-4">
            <Button
              onClick={() => setComingSoonOpen(false)}
              className="w-full bg-gradient-to-r from-primary to-primary-glow hover:opacity-90 text-white cursor-pointer shadow-[0_0_15px_-3px_var(--color-primary)] font-semibold"
            >
              {dialogDetails.buttonText}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </footer>
  );
}

function SocialLink({ children, label, onClick }) {
  return (
    <button
      onClick={onClick}
      aria-label={label}
      className="grid h-9 w-9 place-items-center rounded-lg border border-border bg-surface/60 text-muted-foreground transition-all hover:border-primary/40 hover:bg-surface hover:text-foreground hover:shadow-[0_0_20px_-8px_var(--color-primary)] cursor-pointer"
    >
      {children}
    </button>
  );
}
