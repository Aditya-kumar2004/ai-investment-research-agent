import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { z } from "zod";
import { toast, Toaster } from "sonner";
import { Navbar } from "@/components/investment/Navbar";
import { LoadingScreen } from "@/components/investment/LoadingScreen";
import { Results } from "@/components/investment/Results";
import { ErrorState } from "@/components/investment/ErrorState";
import { Footer } from "@/components/investment/Footer";
import { analyzeCompany, normalizeError } from "@/services/api";

const reportSearchSchema = z.object({
  company: z.string().catch(""),
});

export const Route = createFileRoute("/report")({
  validateSearch: (search) => reportSearchSchema.parse(search),
  head: () => ({
    meta: [
      { title: "Vortex Investment Report — Analysis Results" },
      {
        name: "description",
        content: "Comprehensive company investment research and quantitative analysis report.",
      },
    ],
  }),
  component: ReportPage,
});

function ReportPage() {
  const { company } = Route.useSearch();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState(null);
  const [error, setError] = useState(null);

  // Redirect to home page if no company is specified
  useEffect(() => {
    if (!company) {
      toast.error("No company specified", {
        description: "Please enter a company name on the home page.",
      });
      navigate({ to: "/" });
    }
  }, [company, navigate]);

  // Run the analysis whenever the company name in search parameters changes
  useEffect(() => {
    if (!company) return;

    let isCurrent = true;

    async function fetchAnalysis() {
      setLoading(true);
      setError(null);
      setReport(null);
      try {
        const data = await analyzeCompany(company);
        if (isCurrent) {
          setReport(data);
        }
      } catch (err) {
        if (isCurrent) {
          const apiErr =
            err && typeof err === "object" && "message" in err && "retryable" in err
              ? err
              : normalizeError(err);
          setError(apiErr);
          toast.error("Analysis failed", {
            description: apiErr.message,
          });
        }
      } finally {
        if (isCurrent) {
          setLoading(false);
        }
      }
    }

    fetchAnalysis();

    return () => {
      isCurrent = false;
    };
  }, [company]);

  const handleReset = () => {
    navigate({ to: "/" });
  };

  const handleRetry = () => {
    // Triggers the useEffect again by reloading
    navigate({ to: "/report", search: { company } });
  };

  return (
    <div className="flex flex-col min-h-screen overflow-x-hidden w-full">
      <Toaster
        theme="light"
        position="top-right"
        toastOptions={{
          style: {
            background: "oklch(1 0 0)",
            border: "1px solid oklch(0 0 0 / 0.08)",
            color: "oklch(0.18 0.02 265)",
          },
        }}
      />
      <Navbar />
      <main className="py-8 flex-1">
        <AnimatePresence mode="wait">
          {loading && <LoadingScreen key="loading" />}

          {error && !loading && (
            <div key="error" id="results">
              <ErrorState
                error={error}
                company={company}
                onRetry={handleRetry}
                onReset={handleReset}
              />
            </div>
          )}

          {report && !loading && !error && (
            <motion.section
              key="results"
              id="results"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Results report={report.data} onReset={handleReset} />
            </motion.section>
          )}
        </AnimatePresence>
      </main>
      <Footer />
    </div>
  );
}
