import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ThemeProvider, useTheme } from "next-themes";
import { Toaster } from "sonner";
import { Sun, Moon, List, X } from "lucide-react";
import MainContent from "./components/MainContent";
import PledgeModal from "./components/PledgeModal";
import type { PledgeSignature, QuizResult } from "./types";

const NAV_ITEMS = [
  { id: "dashboard", label: "Dashboard" },
  { id: "solutions", label: "Solutions" },
  { id: "challenges", label: "Challenges" },
  { id: "skills", label: "Skill Matrix" },
  { id: "charter", label: "Charter" },
];

function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  return (
    <button
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="flex h-8 w-8 items-center justify-center rounded-lg border border-zinc-700/50 bg-zinc-800/50 text-zinc-400 transition-all hover:border-zinc-600 hover:text-zinc-200"
      aria-label="Toggle theme"
    >
      {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
    </button>
  );
}

function App() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [pledgeOpen, setPledgeOpen] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [pledgeSignature, setPledgeSignature] = useState<PledgeSignature | null>(null);
  const [quizResult, setQuizResult] = useState<QuizResult | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem("novaheart-pledge");
    if (saved) {
      try {
        setPledgeSignature(JSON.parse(saved));
      } catch {}
    }
    const savedQuiz = localStorage.getItem("novaheart-quiz");
    if (savedQuiz) {
      try {
        setQuizResult(JSON.parse(savedQuiz));
      } catch {}
    }
  }, []);

  const handleSavePledge = useCallback((sig: PledgeSignature) => {
    setPledgeSignature(sig);
    localStorage.setItem("novaheart-pledge", JSON.stringify(sig));
  }, []);

  const handleSaveQuiz = useCallback((r: QuizResult) => {
    setQuizResult(r);
    localStorage.setItem("novaheart-quiz", JSON.stringify(r));
  }, []);

  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
      <div className="min-h-screen bg-zinc-950 text-zinc-100 dark:bg-zinc-950 dark:text-zinc-100 light:bg-zinc-50 light:text-zinc-900">
        <Toaster position="top-right" theme="dark" />

        {/* NAV */}
        <nav className="fixed top-0 z-40 w-full border-b border-zinc-800/50 bg-zinc-950/80 backdrop-blur-xl">
          <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600">
                <span className="text-xs font-bold text-white">N</span>
              </div>
              <span className="text-sm font-bold tracking-tight text-white">
                NOVA<span className="text-cyan-400">HEART</span>
              </span>
            </div>

            {/* Desktop nav */}
            <div className="hidden items-center gap-1 md:flex">
              {NAV_ITEMS.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
                    activeTab === item.id
                      ? "bg-cyan-500/10 text-cyan-400"
                      : "text-zinc-400 hover:bg-zinc-800/50 hover:text-zinc-200"
                  }`}
                >
                  {item.label}
                </button>
              ))}
              <div className="ml-2 h-5 w-px bg-zinc-800" />
              <ThemeToggle />
            </div>

            {/* Mobile menu button */}
            <div className="flex items-center gap-2 md:hidden">
              <ThemeToggle />
              <button
                onClick={() => setMobileNavOpen(!mobileNavOpen)}
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-zinc-700/50 bg-zinc-800/50 text-zinc-400"
              >
                {mobileNavOpen ? <X className="h-4 w-4" /> : <List className="h-4 w-4" />}
              </button>
            </div>
          </div>

          {/* Mobile nav dropdown */}
          <AnimatePresence>
            {mobileNavOpen && (
              <motion.div
                className="border-t border-zinc-800/50 bg-zinc-950 px-4 py-3 md:hidden"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
              >
                <div className="flex flex-col gap-1">
                  {NAV_ITEMS.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => {
                        setActiveTab(item.id);
                        setMobileNavOpen(false);
                      }}
                      className={`rounded-lg px-3 py-2 text-left text-sm font-medium transition-all ${
                        activeTab === item.id
                          ? "bg-cyan-500/10 text-cyan-400"
                          : "text-zinc-400 hover:bg-zinc-800/50 hover:text-zinc-200"
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </nav>

        {/* MAIN CONTENT */}
        <main className="pt-16">
          <MainContent
            activeTab={activeTab}
            onOpenPledge={() => setPledgeOpen(true)}
            pledgeSignature={pledgeSignature}
            onSavePledge={handleSavePledge}
            quizResult={quizResult}
            onSaveQuiz={handleSaveQuiz}
          />
        </main>

        {/* PLEDGE MODAL */}
        <PledgeModal
          open={pledgeOpen}
          onClose={() => setPledgeOpen(false)}
          onSave={handleSavePledge}
          existing={pledgeSignature}
        />

        {/* FOOTER */}
        <footer className="border-t border-zinc-800/50 bg-zinc-950 py-8">
          <div className="mx-auto max-w-7xl px-4 text-center">
            <div className="mb-4 flex items-center justify-center gap-3">
              <div className="flex h-6 w-6 items-center justify-center rounded-md bg-gradient-to-br from-cyan-500 to-blue-600">
                <span className="text-[8px] font-bold text-white">N</span>
              </div>
              <span className="text-xs font-semibold text-zinc-400">
                NOVA<span className="text-cyan-400">HEART</span>
              </span>
            </div>
            <p className="text-xs text-zinc-600">
              Human Progress Through Innovation, Education &amp; Action.
            </p>
            <p className="mt-2 text-[10px] text-zinc-700">
              &copy; {new Date().getFullYear()} NOVAHEART Ecosystem. All rights reserved.
            </p>
          </div>
        </footer>
      </div>
    </ThemeProvider>
  );
}

export default App;