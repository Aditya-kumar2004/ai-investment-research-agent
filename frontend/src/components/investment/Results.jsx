import { motion } from "framer-motion";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import React from "react";
import ReactMarkdown from "react-markdown";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Activity,
  AlertTriangle,
  ArrowUpRight,
  Bookmark,
  Brain,
  Building2,
  Check,
  CheckCircle2,
  ChevronDown,
  Copy,
  Cpu,
  Download,
  ExternalLink,
  FileText,
  Globe,
  Info,
  Lightbulb,
  MinusCircle,
  Newspaper,
  Radar,
  RotateCcw,
  Share2,
  Shield,
  TrendingDown,
  TrendingUp,
  Users,
  XCircle,
  Zap,
} from "lucide-react";

const fade = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-60px" },
  transition: { duration: 0.5 },
};

function ReportSubNavbar({ activeTab, setActiveTab }) {
  const sections = [
    { id: "overview", label: "Overview" },
    { id: "workflow", label: "Workflow" },
    { id: "financials", label: "Financials" },
    { id: "swot", label: "SWOT" },
    { id: "news", label: "News" },
    { id: "competitors", label: "Competitors" },
    { id: "thesis", label: "Thesis" },
    { id: "risk", label: "Risk" },
  ];

  return (
    <div className="sticky top-[83px] z-45 -mx-4 px-4 bg-background/80 border-b border-b-border/30 backdrop-blur-md py-2.5 sm:-mx-6 sm:px-6 md:-mx-8 md:px-8">
      <div className="mx-auto max-w-7xl flex items-center gap-1.5 overflow-x-auto scrollbar-thin pb-1.5 sm:pb-0 select-none">
        {sections.map((sec) => {
          const isActive = activeTab === sec.id;
          return (
            <button
              key={sec.id}
              onClick={() => setActiveTab(sec.id)}
              suppressHydrationWarning={true}
              className={`shrink-0 rounded-full px-4 py-1 text-xs font-semibold tracking-tight transition-all cursor-pointer ${
                isActive
                  ? "bg-primary text-white shadow-sm shadow-primary/20 scale-[1.02]"
                  : "text-muted-foreground hover:text-foreground hover:bg-surface/50"
              }`}
            >
              {sec.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export function Results({ report, onReset }) {
  const [activeTab, setActiveTab] = React.useState("overview");
  const [isComingSoonOpen, setComingSoonOpen] = React.useState(false);
  const [comingSoonFeature, setComingSoonFeature] = React.useState("");

  const handleActionClick = (featureName) => {
    setComingSoonFeature(featureName);
    setComingSoonOpen(true);
  };

  React.useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "instant",
    });
  }, [activeTab]);

  return (
    <div className="mx-auto max-w-7xl space-y-6 px-4 pb-8 sm:px-6">
      <ReportSubNavbar activeTab={activeTab} setActiveTab={setActiveTab} />
      <ActionBar onReset={onReset} onActionClick={handleActionClick} />

      {activeTab === "overview" && (
        <div className="space-y-6">
          <PremiumDecisionCard report={report} />
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <OverviewCard report={report} />
            </div>
            <div className="space-y-6">
              <SentimentDonut report={report} />
              <AnalystCard report={report} />
            </div>
          </div>
        </div>
      )}

      {activeTab === "workflow" && (
        <div className="space-y-6">
          <ResearchWorkflowTimeline report={report} />
          <InvestmentReasoningCards report={report} />
        </div>
      )}

      {activeTab === "financials" && (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-2">
            <FinancialMetrics report={report} />
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <RevenueChartCard report={report} />
              <ProfitChartCard report={report} />
            </div>
            <StockChartCard report={report} />
            <FinancialHealth report={report} />
          </div>
          <div>
            <ScoreGauge report={report} />
          </div>
        </div>
      )}

      {activeTab === "swot" && (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <SwotGrid report={report} />
          </div>
          <div>
            <ProsConsGrid report={report} />
          </div>
        </div>
      )}

      {activeTab === "news" && (
        <div className="max-w-4xl mx-auto w-full">
          <NewsTimeline report={report} />
        </div>
      )}

      {activeTab === "competitors" && (
        <div className="w-full">
          <CompetitorTable report={report} />
        </div>
      )}

      {activeTab === "thesis" && (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <ThesisCard report={report} />
          </div>
          <div>
            <SourcesGrid report={report} />
          </div>
        </div>
      )}

      {activeTab === "risk" && (
        <div className="max-w-3xl mx-auto w-full">
          <RiskCard report={report} />
        </div>
      )}

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
              The <span className="font-semibold text-foreground">{comingSoonFeature}</span> operation is currently offline for system upgrades. It will be available in the next terminal release.
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
    </div>
  );
}
function ActionBar({ onReset, onActionClick }) {
  const currentDate = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric"
  });
  return (
    <motion.div {...fade} className="flex flex-wrap items-center justify-between gap-3">
      <div className="flex flex-wrap items-center gap-3">
        <button
          onClick={onReset}
          className="inline-flex items-center gap-2 rounded-xl border border-border bg-surface/60 px-4 py-2 text-sm text-foreground transition-all hover:border-primary/40 hover:bg-primary/10 cursor-pointer"
        >
          <RotateCcw className="h-4 w-4" /> Analyze Another Company
        </button>
        <span className="inline-flex items-center gap-1.5 rounded-xl border border-border/40 bg-surface/30 px-3 py-2 text-xs text-muted-foreground select-none">
          <span className="h-1.5 w-1.5 rounded-full bg-success animate-pulse" />
          Data current as of: {currentDate}
        </span>
      </div>
      <div className="flex flex-wrap gap-2">
        <ActionBtn
          icon={<Download className="h-4 w-4" />}
          label="PDF"
          onClick={() => onActionClick("PDF Export")}
        />
        <ActionBtn
          icon={<Copy className="h-4 w-4" />}
          label="Copy"
          onClick={() => onActionClick("Copy Report")}
        />
        <ActionBtn
          icon={<Share2 className="h-4 w-4" />}
          label="Share"
          onClick={() => onActionClick("Share Report")}
        />
        <ActionBtn
          icon={<Bookmark className="h-4 w-4" />}
          label="Save"
          onClick={() => onActionClick("Save Report")}
        />
      </div>
    </motion.div>
  );
}
function ActionBtn({ icon, label, onClick }) {
  return (
    <button
      onClick={onClick}
      className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-surface/40 px-3 py-2 text-xs text-muted-foreground transition-all hover:border-primary/40 hover:bg-primary/10 hover:text-foreground"
    >
      {icon} {label}
    </button>
  );
}
function Card({ children, className = "" }) {
  return (
    <motion.div
      {...fade}
      className={`glass-strong relative overflow-hidden rounded-2xl p-4 sm:p-6 shadow-[var(--shadow-elevated)] ${className}`}
    >
      {children}
    </motion.div>
  );
}
function SectionTitle({ icon, title, subtitle }) {
  return (
    <div className="mb-5 grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3 sm:flex sm:flex-wrap sm:justify-between">
      <div className="flex min-w-0 items-center gap-3">
        <div className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary ring-1 ring-primary/20">
          {icon}
        </div>
        <div className="min-w-0">
          <h3 className="truncate text-base font-semibold">{title}</h3>
          {subtitle && <p className="truncate text-xs text-muted-foreground">{subtitle}</p>}
        </div>
      </div>
    </div>
  );
}
function OverviewCard({ report }) {
  const o = report.overview;
  const rows = [
    ["Sector", o.sector],
    ["Industry", o.industry],
    ["Market Cap", o.marketCap],
    ["Headquarters", o.headquarters],
    ["Founded", o.founded],
    ["CEO", o.ceo],
    ["Employees", o.employees],
    ["Website", o.website],
  ];
  return (
    <Card>
      <div className="grid grid-cols-[auto_minmax(0,1fr)] items-start gap-4 sm:flex sm:flex-wrap sm:justify-between">
        <div className="flex min-w-0 items-center gap-4">
          <div className="grid h-16 w-16 shrink-0 place-items-center rounded-2xl bg-[image:var(--gradient-primary)] text-2xl font-bold text-white shadow-[var(--shadow-glow)]">
            {o.logo}
          </div>
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="truncate text-2xl font-bold tracking-tight">{o.name}</h2>
              <span className="rounded-md bg-primary/15 px-2 py-0.5 font-mono text-xs text-primary ring-1 ring-primary/20">
                {o.ticker}
              </span>
            </div>
            <p className="mt-0.5 text-sm text-muted-foreground">
              {o.sector} · {o.industry}
            </p>
          </div>
        </div>
        <a
          href={
            o.website
              ? o.website.startsWith("http://") || o.website.startsWith("https://")
                ? o.website
                : `https://${o.website}`
              : "#"
          }
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex shrink-0 items-center gap-1 rounded-lg border border-border bg-surface/40 px-3 py-1.5 text-xs text-muted-foreground hover:text-foreground"
        >
          <Globe className="h-3.5 w-3.5" /> {o.website} <ExternalLink className="h-3 w-3" />
        </a>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {rows.map(([k, v]) => (
          <div key={k} className="rounded-xl border border-border/60 bg-surface/40 p-3">
            <div className="text-[10px] uppercase tracking-widest text-muted-foreground">{k}</div>
            <div className="mt-1 truncate text-sm font-medium text-foreground">{v}</div>
          </div>
        ))}
      </div>

      <p className="mt-6 text-sm leading-relaxed text-muted-foreground">{o.summary}</p>
    </Card>
  );
}
function getDecisionReason(report, verdict) {
  const thesis = report.thesis || "";
  const paragraphs = thesis
    .split("\n")
    .map((p) => p.trim())
    .filter((p) => p && !p.startsWith("#") && !p.startsWith("-") && !p.startsWith("*") && !p.startsWith(">"));

  if (paragraphs.length > 0) {
    const text = paragraphs[0];
    const sentences = text.match(/[^.!?]+[.!?]+(\s|$)/g);
    if (sentences && sentences.length > 0) {
      return sentences.slice(0, 2).join("").trim();
    }
    return text;
  }

  if (verdict === "INVEST") {
    return report.pros && report.pros.length > 0
      ? `Strong investment potential supported by key positive factors: ${report.pros[0]}.`
      : "Positive financial indicators and a robust competitive position justify an investment stance.";
  } else {
    return report.cons && report.cons.length > 0
      ? `Advising caution due to primary risk concerns: ${report.cons[0]}.`
      : "Lower composite metrics and elevated valuation concerns suggest passing at the current price.";
  }
}

function PremiumDecisionCard({ report }) {
  const { verdict, confidence, score } = report.decision;
  
  // BUY -> INVEST, HOLD/SELL -> PASS
  const isInvest = verdict === "BUY";
  const mappedDecision = isInvest ? "INVEST" : "PASS";

  const riskScore = report.risk?.score || 50;
  let riskLevel = "Medium";
  let riskColor = "text-warning bg-warning/10 ring-warning/30";
  if (riskScore <= 35) {
    riskLevel = "Low";
    riskColor = "text-success bg-success/10 ring-success/30";
  } else if (riskScore > 65) {
    riskLevel = "High";
    riskColor = "text-destructive bg-destructive/10 ring-destructive/30";
  }

  const shortReason = getDecisionReason(report, mappedDecision);

  const styles = {
    INVEST: {
      bg: "from-success/20 via-success/5 to-transparent",
      ring: "ring-success/30",
      text: "text-success",
      badgeBg: "bg-success/10",
      icon: <CheckCircle2 className="h-6 w-6" />,
      glow: "shadow-[0_0_20px_rgba(34,197,94,0.15)]",
    },
    PASS: {
      bg: "from-destructive/20 via-destructive/5 to-transparent",
      ring: "ring-destructive/30",
      text: "text-destructive",
      badgeBg: "bg-destructive/10",
      icon: <XCircle className="h-6 w-6" />,
      glow: "shadow-[0_0_20px_rgba(239,68,68,0.15)]",
    },
  }[mappedDecision];

  return (
    <Card className={`bg-gradient-to-r ${styles.bg} ring-1 ${styles.ring} ${styles.glow}`}>
      <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        
        {/* Left Side: Decision & Short Reason */}
        <div className="flex-grow space-y-3">
          <div className="flex items-center gap-3">
            <div className={`grid h-10 w-10 place-items-center rounded-xl bg-background/80 ${styles.text} shadow-md`}>
              {styles.icon}
            </div>
            <div>
              <div className="text-[10px] uppercase tracking-widest text-muted-foreground">Investment Decision</div>
              <div className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-bold uppercase tracking-wide ${styles.badgeBg} ${styles.text} ring-1 ${styles.ring}`}>
                {mappedDecision}
              </div>
            </div>
          </div>
          
          <div className="space-y-1">
            <p className="text-sm leading-relaxed text-foreground/90 font-medium font-serif italic">
              "{shortReason}"
            </p>
          </div>
        </div>

        {/* Divider line for larger screens */}
        <div className="hidden h-16 w-px bg-border/40 md:block" />

        {/* Right Side: Key Decision Stats */}
        <div className="grid grid-cols-3 gap-2 shrink-0 sm:gap-6 md:w-[320px]">
          {/* Confidence */}
          <div className="rounded-xl border border-border/60 bg-surface/30 p-3 text-center">
            <div className="text-[9px] uppercase tracking-widest text-muted-foreground">Confidence</div>
            <div className="mt-1 text-xl font-extrabold text-foreground">{confidence}%</div>
            <div className="mt-1.5 h-1 overflow-hidden rounded-full bg-white/5">
              <div 
                className="h-full rounded-full bg-primary" 
                style={{ width: `${confidence}%` }} 
              />
            </div>
          </div>

          {/* Investment Score */}
          <div className="rounded-xl border border-border/60 bg-surface/30 p-3 text-center">
            <div className="text-[9px] uppercase tracking-widest text-muted-foreground">Score</div>
            <div className="mt-1 text-xl font-extrabold text-gradient">{score}</div>
            <div className="mt-1 text-[9px] text-muted-foreground">out of 100</div>
          </div>

          {/* Risk Profile */}
          <div className="rounded-xl border border-border/60 bg-surface/30 p-3 text-center">
            <div className="text-[9px] uppercase tracking-widest text-muted-foreground">Risk Level</div>
            <div className={`mt-1 inline-block rounded-md px-1.5 py-0.5 text-xs font-bold uppercase tracking-wider ring-1 ${riskColor}`}>
              {riskLevel}
            </div>
            <div className="mt-1 text-[9px] text-muted-foreground">score: {riskScore}</div>
          </div>
        </div>

      </div>
    </Card>
  );
}

function TimelineStep({ num, icon, title, description, statusLabel, delay }) {
  const [status, setStatus] = React.useState("loading");

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setStatus("completed");
    }, delay);
    return () => clearTimeout(timer);
  }, [delay]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: delay / 1500 }}
      className="relative flex items-start gap-4 pb-6 last:pb-0"
    >
      {/* Connecting Line */}
      <div className="absolute left-4 top-8 bottom-0 w-px bg-border/40 last:hidden" />

      {/* Step Icon / Status indicator */}
      <div className="relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-surface border border-border/80">
        {status === "loading" ? (
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 1.2, ease: "linear" }}
            className="h-4 w-4 rounded-full border border-primary border-t-transparent"
          />
        ) : (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="text-success"
          >
            <Check className="h-4 w-4" />
          </motion.div>
        )}
      </div>

      {/* Content */}
      <div className="flex-grow min-w-0 pt-0.5">
        <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-semibold text-primary/70">{num}</span>
            <div className="flex items-center gap-1.5 text-sm font-semibold text-foreground">
              <span className="text-muted-foreground/80">{icon}</span>
              <span>{title}</span>
            </div>
          </div>
          <span className={`self-start sm:self-auto text-[10px] font-bold uppercase tracking-wider ${status === "loading" ? "text-primary animate-pulse" : "text-success bg-success/10 px-2 py-0.5 rounded ring-1 ring-success/20"}`}>
            {status === "loading" ? "Analyzing..." : statusLabel}
          </span>
        </div>
        <div className="mt-1 text-xs text-muted-foreground/95 leading-relaxed">
          {description}
        </div>
      </div>
    </motion.div>
  );
}

function ResearchWorkflowTimeline({ report }) {
  const { verdict } = report.decision;
  const isInvest = verdict === "BUY";
  const mappedDecision = isInvest ? "INVEST" : "PASS";

  const peerCount = Math.max(0, (report.competitors?.length || 1) - 1);
  const positiveSentiment = report.sentiment?.positive || 50;
  const riskScore = report.risk?.score || 50;
  const riskFactorsCount = report.risk?.factors?.length || 0;
  const strengthsCount = report.swot?.strengths?.length || 0;
  const weaknessesCount = report.swot?.weaknesses?.length || 0;

  // Derive dynamic risk level
  let riskLevel = "Medium";
  if (riskScore <= 35) riskLevel = "Low";
  else if (riskScore > 65) riskLevel = "High";

  // Dynamic Financial Metrics labels
  const m = report.metrics || [];
  const peMetric = m.find(x => x.label.toUpperCase().includes("P/E") || x.label.toUpperCase().includes("PE"));
  const roeMetric = m.find(x => x.label.toUpperCase().includes("ROE"));
  const first = peMetric || m[0];
  const second = roeMetric || m[1] || m[0];
  const firstVal = first ? `${first.label}: ${first.value}` : "";
  const secondVal = (second && second !== first) ? `${second.label}: ${second.value}` : "";
  const metricsInsight = [firstVal, secondVal].filter(Boolean).join(" · ") || "Processed";

  // Dynamic Revenue/Profit latest values
  const revData = report.revenue || [];
  const latestYear = revData[revData.length - 1];
  const revenueInsight = latestYear ? `Rev: $${latestYear.revenue}B · Net: $${latestYear.profit}B` : "Analyzed";

  // Dynamic Competitors list
  const compList = (report.competitors || []).slice(1).map(c => c.name.split(" ")[0]).join(", ");
  const compInsight = compList ? `Peers: ${compList}` : "Evaluated";

  // Dynamic Thesis Synopsis (first two sentences)
  const shortReason = getDecisionReason(report, mappedDecision);

  const steps = [
    {
      num: "01",
      icon: <Building2 className="h-4 w-4" />,
      title: "Company Identification",
      description: `Identified stock ticker ${report.overview?.ticker || "N/A"} for ${report.overview?.name || "the company"} (founded ${report.overview?.founded || "N/A"}).`,
      statusLabel: `${report.overview?.ticker || "N/A"} · ${report.overview?.name ? report.overview.name.split(" ")[0] : "N/A"}`,
    },
    {
      num: "02",
      icon: <FileText className="h-4 w-4" />,
      title: "Business Overview Analysis",
      description: `Analyzed company sector (${report.overview?.sector || "N/A"}) and specific industry (${report.overview?.industry || "N/A"}).`,
      statusLabel: report.overview?.sector ? `Sector: ${report.overview.sector.split(" ")[0]}` : "Overview",
    },
    {
      num: "03",
      icon: <Activity className="h-4 w-4" />,
      title: "Financial Metrics Analysis",
      description: `Processed ${report.metrics?.length || 0} core valuation, growth, and financial health indicators.`,
      statusLabel: metricsInsight,
    },
    {
      num: "04",
      icon: <TrendingUp className="h-4 w-4" />,
      title: "Revenue & Profit Analysis",
      description: `Evaluated historical revenue and profit trends across ${report.revenue?.length || 0} fiscal years.`,
      statusLabel: revenueInsight,
    },
    {
      num: "05",
      icon: <Users className="h-4 w-4" />,
      title: "Competitor Analysis",
      description: `Evaluated relative market capitalization and growth rates against ${peerCount} direct industry peers.`,
      statusLabel: compInsight,
    },
    {
      num: "06",
      icon: <Newspaper className="h-4 w-4" />,
      title: "Market & News Sentiment Analysis",
      description: `Synthesized recent headlines; market sentiment is ${positiveSentiment}% positive.`,
      statusLabel: `${positiveSentiment}% Positive`,
    },
    {
      num: "07",
      icon: <Shield className="h-4 w-4" />,
      title: "Risk Assessment",
      description: `Determined composite risk score of ${riskScore}/100 based on ${riskFactorsCount} key risk categories.`,
      statusLabel: `${riskLevel} (${riskScore}/100)`,
    },
    {
      num: "08",
      icon: <Radar className="h-4 w-4" />,
      title: "SWOT Analysis",
      description: `Identified ${strengthsCount} strengths, ${weaknessesCount} weaknesses, and key market opportunities/threats.`,
      statusLabel: `SWOT: ${strengthsCount}S / ${weaknessesCount}W`,
    },
    {
      num: "09",
      icon: <Zap className="h-4 w-4" />,
      title: "Investment Verdict Analysis",
      description: (
        <div className="mt-1 space-y-1.5 font-medium">
          <div className="flex flex-wrap gap-2 text-xs">
            <span className="text-muted-foreground">Decision:</span>
            <span className={isInvest ? "text-success font-semibold" : "text-destructive font-semibold"}>
              {mappedDecision}
            </span>
            <span className="text-muted-foreground/30">|</span>
            <span className="text-muted-foreground">Confidence:</span>
            <span className="text-foreground font-semibold">{report.decision?.confidence || 0}%</span>
          </div>
          <p className="text-xs text-muted-foreground/80 leading-relaxed font-serif italic">
            "{shortReason}"
          </p>
        </div>
      ),
      statusLabel: `Verdict: ${mappedDecision}`,
    },
  ];

  return (
    <Card className="p-6">
      <SectionTitle
        icon={<Radar className="h-4 w-4 text-primary" />}
        title="Research Execution Timeline"
        subtitle="Step-by-step processing details"
      />
      <div className="mt-6 flex flex-col pl-2 pr-2">
        {steps.map((step, idx) => (
          <TimelineStep
            key={step.num}
            num={step.num}
            icon={step.icon}
            title={step.title}
            description={step.description}
            statusLabel={step.statusLabel}
            delay={(idx + 1) * 450}
          />
        ))}
      </div>
    </Card>
  );
}

function InvestmentReasoningCards({ report }) {
  const { verdict } = report.decision;
  const isInvest = verdict === "BUY";
  const mappedDecision = isInvest ? "INVEST" : "PASS";

  const bullets = [];
  if (isInvest) {
    if (report.pros) report.pros.forEach((p) => bullets.push(p));
    if (report.swot?.strengths) {
      report.swot.strengths.forEach((s) => {
        if (!bullets.includes(s)) bullets.push(s);
      });
    }
    if (report.sentiment?.positive > 60) {
      bullets.push(`Strong market sentiment with ${report.sentiment.positive}% positive news indicators.`);
    }
    if (report.decision?.score >= 70) {
      bullets.push(`High composite financial health score of ${report.decision.score}/100.`);
    }
  } else {
    if (report.cons) report.cons.forEach((c) => bullets.push(c));
    if (report.swot?.weaknesses) {
      report.swot.weaknesses.forEach((w) => {
        if (!bullets.includes(w)) bullets.push(w);
      });
    }
    if (report.swot?.threats) {
      report.swot.threats.forEach((t) => {
        if (!bullets.includes(t)) bullets.push(t);
      });
    }
    if (report.risk?.score > 50) {
      bullets.push(`Elevated composite risk profile scored at ${report.risk.score}/100.`);
    }
  }

  const displayBullets = bullets.slice(0, 6);

  const styles = {
    INVEST: {
      bg: "from-success/20 via-success/5 to-transparent",
      border: "border-success/30",
      text: "text-success",
      icon: <Check className="h-5 w-5 text-success" />,
      title: "Why INVEST?",
      summary: "The AI recommends INVEST because the company demonstrates strong financial performance, positive market sentiment, and healthy long-term growth potential.",
      glow: "shadow-[0_0_20px_rgba(34,197,94,0.12)]",
    },
    PASS: {
      bg: "from-destructive/20 via-destructive/5 to-transparent",
      border: "border-destructive/30",
      text: "text-destructive",
      icon: <XCircle className="h-5 w-5 text-destructive" />,
      title: "Why PASS?",
      summary: "The AI recommends PASS because the company shows elevated risk, weaker financial performance, or negative market indicators.",
      glow: "shadow-[0_0_20px_rgba(239,68,68,0.12)]",
    },
  }[mappedDecision];

  return (
    <Card className={`bg-gradient-to-br ${styles.bg} ${styles.border} ${styles.glow}`}>
      <div className="flex items-center gap-2.5 mb-3">
        <div className={`flex h-8 w-8 items-center justify-center rounded-lg bg-background/60 ring-1 ${isInvest ? "ring-success/20" : "ring-destructive/20"}`}>
          {styles.icon}
        </div>
        <h3 className={`text-base font-bold tracking-tight ${styles.text}`}>
          {styles.title}
        </h3>
      </div>

      <p className="text-sm text-foreground/80 mb-4 font-medium leading-relaxed">
        {styles.summary}
      </p>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {displayBullets.map((bullet, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, x: -10 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: idx * 0.05 }}
            className="flex items-start gap-3 rounded-xl border border-border/40 bg-surface/35 p-3 shadow-sm hover:bg-surface/50 transition-colors"
          >
            <div className="mt-0.5 shrink-0">
              {isInvest ? (
                <Check className="h-4 w-4 text-success" />
              ) : (
                <XCircle className="h-4 w-4 text-destructive" />
              )}
            </div>
            <span className="text-xs text-foreground/90 font-medium leading-relaxed">
              {bullet}
            </span>
          </motion.div>
        ))}
      </div>
    </Card>
  );
}
function ScoreGauge({ report }) {
  const score = report.decision.score;
  const R = 70,
    C = 2 * Math.PI * R;
  const offset = C - (score / 100) * C;
  return (
    <Card>
      <SectionTitle
        icon={<Activity className="h-4 w-4" />}
        title="Investment Score"
        subtitle="AI-weighted composite"
      />
      <div className="relative mx-auto grid h-52 w-52 place-items-center">
        <svg className="absolute inset-0 -rotate-90" viewBox="0 0 160 160">
          <defs>
            <linearGradient id="scoreGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="oklch(0.62 0.20 275)" />
              <stop offset="100%" stopColor="oklch(0.78 0.18 320)" />
            </linearGradient>
          </defs>
          <circle cx="80" cy="80" r={R} fill="none" stroke="oklch(1 0 0 / 0.08)" strokeWidth="10" />
          <motion.circle
            cx="80"
            cy="80"
            r={R}
            fill="none"
            stroke="url(#scoreGrad)"
            strokeWidth="10"
            strokeLinecap="round"
            strokeDasharray={C}
            initial={{ strokeDashoffset: C }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 1.4, ease: "easeOut" }}
          />
        </svg>
        <div className="text-center">
          <div className="text-5xl font-bold text-gradient">{score}</div>
          <div className="text-[10px] uppercase tracking-widest text-muted-foreground">
            out of 100
          </div>
        </div>
      </div>
      <div className="mt-4 grid grid-cols-2 gap-2 text-center text-[10px] uppercase tracking-widest">
        <div className="rounded-lg bg-destructive/10 px-2 py-1.5 text-destructive">0-70 Pass</div>
        <div className="rounded-lg bg-success/10 px-2 py-1.5 text-success">70-100 Invest</div>
      </div>
    </Card>
  );
}

function FinancialMetrics({ report }) {
  const sanitizeVal = (val) => {
    if (!val || val === "0" || val === "0.0" || val === "0%" || val === "0.0%" || val === "N/A" || val === "-") {
      return "N/A";
    }
    return val;
  };
  return (
    <Card>
      <SectionTitle
        icon={<Activity className="h-4 w-4" />}
        title="Financial Metrics"
        subtitle="Trailing twelve months"
      />
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {report.metrics.map((m, i) => (
          <motion.div
            key={m.label}
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.03 }}
            className="group relative overflow-hidden rounded-xl border border-border/60 bg-surface/40 p-4 transition-all hover:border-primary/40 hover:bg-surface/60"
          >
            <div className="text-[10px] uppercase tracking-widest text-muted-foreground">
              {m.label}
            </div>
            <div className="mt-2 text-xl font-bold tracking-tight">{sanitizeVal(m.value)}</div>
            {m.delta && (
              <div
                className={`mt-1 inline-flex items-center gap-1 text-xs ${m.positive ? "text-success" : "text-destructive"}`}
              >
                {m.positive ? (
                  <TrendingUp className="h-3 w-3" />
                ) : (
                  <TrendingDown className="h-3 w-3" />
                )}{" "}
                {m.delta}
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </Card>
  );
}
const chartTooltip = {
  contentStyle: {
    background: "oklch(0.18 0.035 265 / 0.95)",
    border: "1px solid oklch(1 0 0 / 0.1)",
    borderRadius: 12,
    fontSize: 12,
    color: "white",
  },
  cursor: { stroke: "oklch(0.62 0.20 275 / 0.4)" },
};
function RevenueChartCard({ report }) {
  return (
    <Card>
      <SectionTitle
        icon={<TrendingUp className="h-4 w-4" />}
        title="Revenue Trend"
        subtitle="Billions USD · 6Y"
      />
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={report.revenue}>
            <defs>
              <linearGradient id="rev" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="oklch(0.62 0.20 275)" stopOpacity={0.6} />
                <stop offset="100%" stopColor="oklch(0.62 0.20 275)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="oklch(1 0 0 / 0.05)" />
            <XAxis dataKey="year" stroke="oklch(0.72 0.03 255)" fontSize={11} />
            <YAxis stroke="oklch(0.72 0.03 255)" fontSize={11} />
            <Tooltip {...chartTooltip} />
            <Area
              type="monotone"
              dataKey="revenue"
              stroke="oklch(0.72 0.22 285)"
              strokeWidth={2.5}
              fill="url(#rev)"
              animationDuration={1200}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
function ProfitChartCard({ report }) {
  return (
    <Card>
      <SectionTitle
        icon={<TrendingUp className="h-4 w-4" />}
        title="Profit Growth"
        subtitle="Net income · Billions USD"
      />
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={report.revenue}>
            <CartesianGrid strokeDasharray="3 3" stroke="oklch(1 0 0 / 0.05)" />
            <XAxis dataKey="year" stroke="oklch(0.72 0.03 255)" fontSize={11} />
            <YAxis stroke="oklch(0.72 0.03 255)" fontSize={11} />
            <Tooltip {...chartTooltip} />
            <Line
              type="monotone"
              dataKey="profit"
              stroke="oklch(0.72 0.17 155)"
              strokeWidth={2.5}
              dot={{ fill: "oklch(0.72 0.17 155)", r: 4 }}
              animationDuration={1200}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
function StockChartCard({ report }) {
  return (
    <Card>
      <SectionTitle
        icon={<Activity className="h-4 w-4" />}
        title="Stock Performance"
        subtitle="12-month share price"
      />
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={report.stock}>
            <defs>
              <linearGradient id="bar" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="oklch(0.72 0.22 285)" />
                <stop offset="100%" stopColor="oklch(0.62 0.20 275)" />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="oklch(1 0 0 / 0.05)" />
            <XAxis dataKey="month" stroke="oklch(0.72 0.03 255)" fontSize={11} />
            <YAxis stroke="oklch(0.72 0.03 255)" fontSize={11} />
            <Tooltip {...chartTooltip} />
            <Bar dataKey="price" fill="url(#bar)" radius={[6, 6, 0, 0]} animationDuration={1200} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
function FinancialHealth({ report }) {
  return (
    <Card>
      <SectionTitle
        icon={<Shield className="h-4 w-4" />}
        title="Financial Health"
        subtitle="Composite indicators"
      />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {report.health.map((h, i) => (
          <motion.div
            key={h.label}
            initial={{ opacity: 0, x: -10 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.05 }}
          >
            <div className="mb-1.5 flex items-center justify-between">
              <span className="text-sm text-muted-foreground">{h.label}</span>
              <span className="text-sm font-semibold">{h.value}%</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-white/5">
              <motion.div
                className="h-full rounded-full bg-[image:var(--gradient-primary)]"
                initial={{ width: 0 }}
                whileInView={{ width: `${h.value}%` }}
                viewport={{ once: true }}
                transition={{ duration: 1, delay: i * 0.05, ease: "easeOut" }}
              />
            </div>
          </motion.div>
        ))}
      </div>
    </Card>
  );
}
function SwotGrid({ report }) {
  const groups = [
    {
      key: "strengths",
      label: "Strengths",
      items: report.swot.strengths,
      color: "success",
      icon: <CheckCircle2 className="h-4 w-4" />,
    },
    {
      key: "weaknesses",
      label: "Weaknesses",
      items: report.swot.weaknesses,
      color: "destructive",
      icon: <XCircle className="h-4 w-4" />,
    },
    {
      key: "opportunities",
      label: "Opportunities",
      items: report.swot.opportunities,
      color: "primary",
      icon: <Lightbulb className="h-4 w-4" />,
    },
    {
      key: "threats",
      label: "Threats",
      items: report.swot.threats,
      color: "warning",
      icon: <AlertTriangle className="h-4 w-4" />,
    },
  ];
  return (
    <Card>
      <SectionTitle
        icon={<Radar className="h-4 w-4" />}
        title="SWOT Analysis"
        subtitle="AI-generated strategic view"
      />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {groups.map((g, gi) => (
          <motion.div
            key={g.key}
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: gi * 0.08 }}
            className={`rounded-xl border p-4 bg-${g.color}/5 border-${g.color}/30`}
            style={{
              background: `color-mix(in oklab, var(--color-${g.color}) 8%, transparent)`,
              borderColor: `color-mix(in oklab, var(--color-${g.color}) 30%, transparent)`,
            }}
          >
            <div
              className="mb-3 flex items-center gap-2"
              style={{ color: `var(--color-${g.color})` }}
            >
              {g.icon}
              <span className="text-sm font-semibold uppercase tracking-widest">{g.label}</span>
            </div>
            <ul className="space-y-2">
              {g.items.map((it) => (
                <li key={it} className="flex gap-2 text-sm text-foreground/85">
                  <span
                    className="mt-2 h-1 w-1 shrink-0 rounded-full"
                    style={{ background: `var(--color-${g.color})` }}
                  />
                  {it}
                </li>
              ))}
            </ul>
          </motion.div>
        ))}
      </div>
    </Card>
  );
}
function RiskCard({ report }) {
  const levelStyle = {
    low: "text-success bg-success/10 ring-success/30",
    medium: "text-warning bg-warning/10 ring-warning/30",
    high: "text-destructive bg-destructive/10 ring-destructive/30",
  };
  return (
    <Card>
      <SectionTitle
        icon={<Shield className="h-4 w-4" />}
        title="Risk Analysis"
        subtitle="Composite exposure"
      />
      <div className="rounded-xl border border-border/60 bg-surface/40 p-4">
        <div className="flex items-center justify-between text-xs">
          <span className="text-muted-foreground">Risk Score</span>
          <span className="font-semibold text-warning">{report.risk.score}/100</span>
        </div>
        <div className="mt-2 h-2 overflow-hidden rounded-full bg-white/5">
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-success via-warning to-destructive"
            initial={{ width: 0 }}
            whileInView={{ width: `${report.risk.score}%` }}
            viewport={{ once: true }}
            transition={{ duration: 1.2 }}
          />
        </div>
      </div>
      <div className="mt-4 grid grid-cols-2 gap-2">
        {report.risk.factors.map((f) => (
          <div
            key={f.name}
            className={`flex items-center justify-between rounded-lg px-3 py-2 text-xs ring-1 ${levelStyle[f.level]}`}
          >
            <span>{f.name}</span>
            <span className="font-semibold uppercase tracking-widest">{f.level}</span>
          </div>
        ))}
      </div>
    </Card>
  );
}
function NewsTimeline({ report }) {
  const sentimentStyle = {
    positive: "text-success bg-success/10 ring-success/30",
    neutral: "text-muted-foreground bg-white/5 ring-border",
    negative: "text-destructive bg-destructive/10 ring-destructive/30",
  };
  return (
    <Card>
      <SectionTitle
        icon={<Newspaper className="h-4 w-4" />}
        title="Latest News"
        subtitle="Aggregated & AI-scored"
      />
      <div className="space-y-3">
        {report.news.map((n, i) => (
          <motion.article
            key={n.headline}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.05 }}
            className="group rounded-xl border border-border/60 bg-surface/40 p-4 transition-all hover:border-primary/40"
          >
            <div className="flex flex-wrap items-center gap-2 text-[11px] text-muted-foreground">
              <span className="font-medium text-foreground/80">{n.source}</span>
              <span>·</span>
              <span>{n.time}</span>
              <span
                className={`ml-auto rounded-full px-2 py-0.5 uppercase tracking-widest ring-1 ${sentimentStyle[n.sentiment]}`}
              >
                {n.sentiment}
              </span>
            </div>
            <h4 className="mt-2 text-sm font-semibold leading-snug group-hover:text-primary">
              {n.headline}
            </h4>
            <p className="mt-1 text-sm text-muted-foreground">{n.summary}</p>
          </motion.article>
        ))}
      </div>
    </Card>
  );
}
function SentimentDonut({ report }) {
  const data = [
    { name: "Positive", value: report.sentiment.positive, color: "oklch(0.72 0.17 155)" },
    { name: "Neutral", value: report.sentiment.neutral, color: "oklch(0.72 0.03 255)" },
    { name: "Negative", value: report.sentiment.negative, color: "oklch(0.65 0.24 25)" },
  ];
  return (
    <Card>
      <SectionTitle icon={<Info className="h-4 w-4" />} title="Market Sentiment" />
      <div className="h-52">
        <ResponsiveContainer>
          <PieChart>
            <Pie
              data={data}
              innerRadius={50}
              outerRadius={80}
              paddingAngle={4}
              dataKey="value"
              stroke="none"
            >
              {data.map((d) => (
                <Cell key={d.name} fill={d.color} />
              ))}
            </Pie>
            <Tooltip {...chartTooltip} />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-2 grid grid-cols-3 gap-2 text-center">
        {data.map((d) => (
          <div key={d.name} className="rounded-lg border border-border/60 bg-surface/40 p-2">
            <div className="mx-auto mb-1 h-2 w-2 rounded-full" style={{ background: d.color }} />
            <div className="text-[10px] uppercase tracking-widest text-muted-foreground">
              {d.name}
            </div>
            <div className="text-sm font-semibold">{d.value}%</div>
          </div>
        ))}
      </div>
    </Card>
  );
}
function AnalystCard({ report }) {
  const a = report.analyst;

  // Terminology mapping function for consensus
  const getMappedConsensus = () => {
    const rawConsensus = a.consensus;
    if (!rawConsensus) {
      // Determine consensus from the highest recommendation count if string is empty
      const buyVal = Number(a.buy) || 0;
      const holdVal = Number(a.hold) || 0;
      const sellVal = Number(a.sell) || 0;

      if (buyVal > holdVal && buyVal > sellVal) return "Positive";
      if (sellVal > buyVal && sellVal > holdVal) return "Negative";
      return "Neutral";
    }

    const consensusLower = rawConsensus.toLowerCase();

    // Map Positive terms: buy, strong buy, moderate buy, outperform, overweight, positive
    if (
      consensusLower.includes("buy") || 
      consensusLower.includes("positive") || 
      consensusLower.includes("outperform") || 
      consensusLower.includes("overweight")
    ) {
      return "Positive";
    }

    // Map Negative terms: sell, strong sell, underperform, underweight, negative
    if (
      consensusLower.includes("sell") || 
      consensusLower.includes("negative") || 
      consensusLower.includes("underperform") || 
      consensusLower.includes("underweight")
    ) {
      return "Negative";
    }

    // Default or Hold/Neutral mapping
    return "Neutral";
  };

  const displayConsensus = getMappedConsensus();

  return (
    <Card>
      <SectionTitle icon={<Users className="h-4 w-4" />} title="Analyst Recommendations" />
      <div className="grid grid-cols-3 gap-2">
        <StatPill label="Positive Analysts" value={a.buy} tone="success" />
        <StatPill label="Neutral Analysts" value={a.hold} tone="warning" />
        <StatPill label="Negative Analysts" value={a.sell} tone="destructive" />
      </div>
      <div className="mt-4 rounded-xl border border-primary/30 bg-primary/10 p-3">
        <div className="text-[10px] uppercase tracking-widest text-muted-foreground">Consensus</div>
        <div className="mt-0.5 text-lg font-bold text-primary">{displayConsensus}</div>
        <div className="mt-2 flex items-center justify-between text-xs">
          <span className="text-muted-foreground">12-Month Price Target</span>
          <span className="font-semibold text-foreground">{a.priceTarget}</span>
        </div>
      </div>
    </Card>
  );
}
function StatPill({ label, value, tone }) {
  return (
    <div className="rounded-xl border border-border/60 bg-surface/40 p-3 text-center">
      <div className="text-[10px] uppercase tracking-widest text-muted-foreground">{label}</div>
      <div className="mt-1 text-2xl font-bold" style={{ color: `var(--color-${tone})` }}>
        {value}
      </div>
    </div>
  );
}
function CompetitorTable({ report }) {
  const cols = ["Company", "Revenue", "Growth", "Market Cap", "P/E", "Margins"];
  const sanitizeVal = (val) => {
    if (!val || val === "0" || val === "0.0" || val === "0%" || val === "0.0%" || val === "N/A" || val === "-") {
      return "N/A";
    }
    return val;
  };
  return (
    <Card>
      <SectionTitle
        icon={<Building2 className="h-4 w-4" />}
        title="Competitor Comparison"
        subtitle="Peer benchmark"
      />
      <div className="overflow-x-auto scrollbar-thin">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-[10px] uppercase tracking-widest text-muted-foreground">
              {cols.map((c) => (
                <th key={c} className="py-2 pr-4 font-medium">
                  {c}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {report.competitors.map((c, i) => (
              <tr
                key={c.name}
                className={`border-t border-border/60 ${i === 0 ? "bg-primary/5" : ""}`}
              >
                <td className="py-3 pr-4 font-medium">
                  <div className="flex items-center gap-2">
                    <div className="grid h-7 w-7 place-items-center rounded-lg bg-surface text-[11px] font-bold ring-1 ring-border">
                      {c.name[0]}
                    </div>
                    {c.name}
                    {i === 0 && (
                      <span className="rounded bg-primary/20 px-1.5 py-0.5 text-[10px] text-primary">
                        You
                      </span>
                    )}
                  </div>
                </td>
                <td className="py-3 pr-4">{sanitizeVal(c.revenue)}</td>
                <td className="py-3 pr-4 text-success">{sanitizeVal(c.growth)}</td>
                <td className="py-3 pr-4">{sanitizeVal(c.marketCap)}</td>
                <td className="py-3 pr-4">{sanitizeVal(c.pe)}</td>
                <td className="py-3 pr-4">{sanitizeVal(c.margins)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
function ProsConsGrid({ report }) {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
      <Card>
        <SectionTitle icon={<Check className="h-4 w-4" />} title="Pros" />
        <ul className="space-y-2">
          {report.pros.map((p, i) => (
            <motion.li
              key={p}
              initial={{ opacity: 0, x: -10 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="flex items-start gap-2 rounded-lg border border-success/20 bg-success/5 p-3 text-sm"
            >
              <Check className="mt-0.5 h-4 w-4 shrink-0 text-success" />
              {p}
            </motion.li>
          ))}
        </ul>
      </Card>
      <Card>
        <SectionTitle icon={<XCircle className="h-4 w-4" />} title="Cons" />
        <ul className="space-y-2">
          {report.cons.map((p, i) => (
            <motion.li
              key={p}
              initial={{ opacity: 0, x: -10 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="flex items-start gap-2 rounded-lg border border-destructive/20 bg-destructive/5 p-3 text-sm"
            >
              <XCircle className="mt-0.5 h-4 w-4 shrink-0 text-destructive" />
              {p}
            </motion.li>
          ))}
        </ul>
      </Card>
    </div>
  );
}
function ThesisCard({ report }) {
  const sanitizeThesisText = (text) => {
    if (!text) return "";
    let sanitized = text;
    // Replace "BUY/HOLD/SELL recommendation(s)" first
    sanitized = sanitized.replace(/\bBUY recommendation\b/gi, "INVEST recommendation");
    sanitized = sanitized.replace(/\bBUY recommendations\b/gi, "INVEST recommendations");
    sanitized = sanitized.replace(/\bHOLD recommendation\b/gi, "PASS recommendation");
    sanitized = sanitized.replace(/\bHOLD recommendations\b/gi, "PASS recommendations");
    sanitized = sanitized.replace(/\bSELL recommendation\b/gi, "PASS recommendation");
    sanitized = sanitized.replace(/\bSELL recommendations\b/gi, "PASS recommendations");

    // Replace "a BUY" / "A BUY" to "an INVEST" / "An INVEST"
    sanitized = sanitized.replace(/\ba BUY\b/g, "an INVEST");
    sanitized = sanitized.replace(/\bA BUY\b/g, "An INVEST");
    sanitized = sanitized.replace(/\ba buy\b/g, "an invest");
    sanitized = sanitized.replace(/\bA buy\b/g, "An invest");

    // Replace "BUY/HOLD/SELL" with word boundaries
    sanitized = sanitized.replace(/\bBUY\b/g, "INVEST");
    sanitized = sanitized.replace(/\bbuy\b/g, "invest");
    sanitized = sanitized.replace(/\bHOLD\b/g, "PASS");
    sanitized = sanitized.replace(/\bhold\b/g, "pass");
    sanitized = sanitized.replace(/\bSELL\b/g, "PASS");
    sanitized = sanitized.replace(/\bsell\b/g, "pass");

    return sanitized;
  };

  const sanitizedThesis = sanitizeThesisText(report.thesis);

  return (
    <Card>
      <div className="mb-4 flex items-center gap-3">
        <div className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary ring-1 ring-primary/20">
          <FileText className="h-4 w-4" />
        </div>
        <div className="min-w-0">
          <h3 className="truncate text-base font-semibold">AI Investment Thesis</h3>
          <p className="truncate text-xs text-muted-foreground">Generated report · Markdown</p>
        </div>
      </div>
      <div className="markdown-body rounded-xl border border-border/60 bg-surface/40 p-5">
        <ReactMarkdown>{sanitizedThesis}</ReactMarkdown>
      </div>
    </Card>
  );
}

function SourcesGrid({ report }) {
  const getSourceDescription = (sourceName) => {
    const name = (sourceName || "").toLowerCase();
    if (name.includes("sec") || name.includes("filing") || name.includes("10-k") || name.includes("10-q")) {
      return "Official regulatory filings and financial disclosures";
    }
    if (name.includes("yahoo") || name.includes("finance")) {
      return "Real-time stock charts, profile, and historical data";
    }
    if (name.includes("annual report") || name.includes("shareholder letter")) {
      return "Direct corporate performance summaries and investor reports";
    }
    if (name.includes("bloomberg") || name.includes("reuters") || name.includes("cnbc") || name.includes("news")) {
      return "Market news coverage and analyst reporting";
    }
    if (name.includes("website") || name.includes("company") || name.includes("corporate")) {
      return "Official company web portal and investor relations";
    }
    return "Market information source";
  };

  const getCleanUrl = (source) => {
    const url = source.url || "";
    const name = (source.name || "").toLowerCase();
    const ticker = report.overview?.ticker || "";

    // 1. SEC filings: redirect to guaranteed company filings query on SEC EDGAR search
    if (name.includes("sec") || name.includes("filing") || name.includes("10-k") || name.includes("10-q")) {
      if (ticker) {
        return `https://www.sec.gov/cgi-bin/browse-edgar?action=getcompany&CIK=${ticker}`;
      }
      return "https://www.sec.gov/edgar/searchedgar/companysearch";
    }

    // 2. Yahoo Finance: redirect to live quote quote details
    if (name.includes("yahoo") || name.includes("finance")) {
      if (ticker) {
        return `https://finance.yahoo.com/quote/${ticker}`;
      }
      return "https://finance.yahoo.com";
    }

    // 3. Alpha Vantage: redirect to the official Alpha Vantage homepage to prevent raw JSON key errors
    if (name.includes("alpha") || name.includes("vantage") || url.includes("alphavantage")) {
      return "https://www.alphavantage.co";
    }

    // 4. Corporate website: fallback to overview website field if blank
    if (name.includes("website") || name.includes("company") || name.includes("corporate")) {
      if (!url || url === "#" || url === "/") {
        const companyWeb = report.overview?.website || "";
        if (companyWeb) {
          return companyWeb.startsWith("http") ? companyWeb : `https://${companyWeb}`;
        }
      }
    }

    // 5. Missing URL fallback: Google search query
    if (!url || url === "#" || url === "/") {
      return `https://www.google.com/search?q=${encodeURIComponent((report.overview?.name || "") + " investment research")}`;
    }

    return url;
  };

  const displaySources = (report.sources || []).filter((s) => {
    const name = (s.name || "").toLowerCase();
    return (
      !name.includes("mongodb") &&
      !name.includes("langchain") &&
      !name.includes("groq") &&
      !name.includes("react") &&
      !name.includes("node")
    );
  });

  return (
    <Card>
      <SectionTitle
        icon={<FileText className="h-4 w-4" />}
        title="Sources Used"
        subtitle="Verified data providers"
      />
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {displaySources.map((s, i) => (
          <motion.a
            key={s.name}
            href={getCleanUrl(s)}
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.04 }}
            className="group flex flex-col justify-between gap-3 rounded-xl border border-border/60 bg-surface/40 p-3 transition-all hover:border-primary/40 hover:bg-primary/10"
          >
            <div className="flex items-start justify-between gap-2 w-full">
              <div className="min-w-0 flex-1">
                <div className="truncate text-sm font-semibold text-foreground">{s.name}</div>
                <div className="text-[10px] uppercase tracking-widest text-primary/70 font-semibold mt-0.5">
                  {s.type}
                </div>
              </div>
              <ArrowUpRight className="h-4 w-4 shrink-0 text-muted-foreground transition-all group-hover:text-primary group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </div>
            <div className="text-xs text-muted-foreground/80 leading-normal mt-0.5">
              {getSourceDescription(s.name)}
            </div>
          </motion.a>
        ))}
      </div>
    </Card>
  );
}
