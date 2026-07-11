import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Navbar } from "@/components/investment/Navbar";
import { Hero } from "@/components/investment/Hero";
import { Footer } from "@/components/investment/Footer";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Vortex Investment Research Terminal — Professional Financial Analysis" },
      {
        name: "description",
        content:
          "Institutional-grade platform for global investment research. Get financial ratios, news intelligence, risk scoring, and structured investment thesis generation.",
      },
      { property: "og:title", content: "Vortex Investment Research Terminal" },
      {
        property: "og:description",
        content:
          "Structured quantitative models, real-time market news sentiment, and investment thesis generation.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  const navigate = useNavigate();

  const handleAnalyze = (company) => {
    navigate({
      to: "/report",
      search: { company },
    });
  };

  return (
    <div className="min-h-screen overflow-x-hidden w-full">
      <Navbar />
      <main>
        <Hero onAnalyze={handleAnalyze} loading={false} />
      </main>
      <Footer />
    </div>
  );
}
