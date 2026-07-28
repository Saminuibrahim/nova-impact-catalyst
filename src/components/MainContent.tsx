import { useState, useRef, useEffect } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import {
  ArrowRight, Heart, Globe, Lightbulb, GraduationCap, Sparkles, Target,
  Shield, Check, X, BookOpen, Cpu, Leaf, Microscope, Zap, Users,
  ChevronDown, Award, ExternalLink, Search, HelpCircle, ScrollText,
  Rocket, Puzzle, BrainCircuit, Gauge, Hammer, Star, Quote, Compass,
  Atom, BadgeCheck, Fingerprint, TreePine, Wind, BarChart3, Palette,
  Cloud, Terminal, Code,
} from "lucide-react";
import {
  SOLUTIONS, CHALLENGES, SKILL_BADGES, IMPACT_KPIS, CHARTER_PRINCIPLES,
  BRAND_NAME, TAGLINE,
} from "../constants";
import type { PledgeSignature, QuizResult, Solution, Challenge, SkillBadge } from "../types";

interface MainContentProps {
  activeTab: string;
  onOpenPledge: () => void;
  pledgeSignature: PledgeSignature | null;
  onSavePledge: (sig: PledgeSignature) => void;
  quizResult: QuizResult | null;
  onSaveQuiz: (r: QuizResult) => void;
}

const iconMap: Record<string, React.ElementType> = {
  Rocket, Atom, GraduationCap, Lightbulb, Award, Target, Shield, Zap,
  Star, Compass, Microscope, BookOpen, BrainCircuit, Cpu, Leaf, Users, Heart,
  Globe, Sparkles, Check, X, ScrollText, Puzzle, Gauge, Hammer,
  TreePine, Wind, BadgeCheck, Fingerprint, Quote, ArrowRight, ExternalLink,
  Search, HelpCircle, ChevronDown, Code, BarChart3, Palette, Cloud, Terminal,
};

function SectionHeading({ title, subtitle, icon }: { title: string; subtitle?: string; icon?: string }) {
  const Icon = icon ? iconMap[icon] : null;
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="mb-8"
    >
      <div className="flex items-center gap-3">
        {Icon && <Icon className="h-5 w-5 text-cyan-400" />}
        <h2 className="text-xl font-bold tracking-tight text-white sm:text-2xl">{title}</h2>
      </div>
      {subtitle && <p className="mt-1 text-sm text-zinc-400">{subtitle}</p>}
    </motion.div>
  );
}

function StatCard({ value, label, icon, gradient, trend }: { value: string; label: string; icon: string; gradient: string; trend?: number }) {
  const Icon = iconMap[icon];
  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.02 }}
      className="group relative overflow-hidden rounded-xl border border-zinc-800/50 bg-zinc-900/50 p-4 backdrop-blur-sm transition-all hover:border-zinc-700/50"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
      <div className="relative z-10 flex items-start justify-between">
        <div>
          <p className="text-2xl font-bold tracking-tight text-white">{value}</p>
          <p className="mt-1 text-xs text-zinc-400">{label}</p>
        </div>
        <div className={`flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br ${gradient}`}>
          {Icon && <Icon className="h-4 w-4 text-white" />}
        </div>
      </div>
      {trend !== undefined && (
        <div className="mt-2 flex items-center gap-1 text-xs">
          <span className={trend >= 0 ? "text-emerald-400" : "text-red-400"}>
            {trend >= 0 ? "+" : ""}{trend}%
          </span>
          <span className="text-zinc-600">vs last month</span>
        </div>
      )}
    </motion.div>
  );
}

function SolutionCard({ solution, index }: { solution: Solution; index: number }) {
  const Icon = iconMap[solution.icon] || Rocket;
  const statusColors: Record<string, string> = {
    active: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    prototype: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    idea: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
  };
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.08, ease: "easeOut" }}
      whileHover={{ y: -6, scale: 1.01 }}
      className="group relative overflow-hidden rounded-xl border border-zinc-800/50 bg-zinc-900/50 p-5 backdrop-blur-sm transition-all hover:border-zinc-700/50"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
      <div className="relative z-10">
        <div className="flex items-start justify-between">
          <div className={`flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br ${solution.gradient}`}>
            <Icon className="h-5 w-5 text-white" />
          </div>
          <span className={`rounded-full border px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-wider ${statusColors[solution.status]}`}>
            {solution.status}
          </span>
        </div>
        <h3 className="mt-4 text-sm font-semibold text-white">{solution.title}</h3>
        <p className="mt-1.5 text-xs leading-relaxed text-zinc-400">{solution.description}</p>
        <div className="mt-4 flex flex-wrap gap-1.5">
          {solution.tech.map((t) => (
            <span key={t} className="rounded-md bg-zinc-800/50 px-2 py-0.5 text-[10px] font-medium text-zinc-500">
              {t}
            </span>
          ))}
        </div>
        <div className="mt-4 flex items-center gap-1.5 text-xs text-zinc-600">
          <Users className="h-3 w-3" />
          {solution.contributors} contributors
        </div>
      </div>
    </motion.div>
  );
}

function ChallengeCard({ challenge, index }: { challenge: Challenge; index: number }) {
  const Icon = iconMap[challenge.icon] || Target;
  const diffColors: Record<string, string> = {
    beginner: "bg-emerald-500/10 text-emerald-400",
    intermediate: "bg-amber-500/10 text-amber-400",
    advanced: "bg-red-500/10 text-red-400",
  };
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.08, ease: "easeOut" }}
      whileHover={{ y: -4 }}
      className="group relative overflow-hidden rounded-xl border border-zinc-800/50 bg-zinc-900/50 p-5 backdrop-blur-sm transition-all hover:border-cyan-500/20"
    >
      <div className="flex items-start gap-4">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-zinc-800">
          <Icon className="h-5 w-5 text-cyan-400" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-semibold text-white">{challenge.title}</h3>
            <span className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${diffColors[challenge.difficulty]}`}>
              {challenge.difficulty}
            </span>
          </div>
          <p className="mt-1.5 text-xs leading-relaxed text-zinc-400">{challenge.description}</p>
          <div className="mt-3 flex items-center gap-4 text-xs text-zinc-600">
            <span className="flex items-center gap-1"><Users className="h-3 w-3" />{challenge.participants}</span>
            <span className="flex items-center gap-1"><Award className="h-3 w-3" />{challenge.reward}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function SkillBadgeCard({ badge, index }: { badge: SkillBadge; index: number }) {
  const Icon = iconMap[badge.icon] || Code;
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      className="group relative flex items-center gap-3 rounded-xl border border-zinc-800/50 bg-zinc-900/50 p-3 backdrop-blur-sm transition-all hover:border-zinc-700/50"
    >
      <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br ${badge.color}`}>
        <Icon className="h-4 w-4 text-white" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-xs font-semibold text-white">{badge.name}</p>
        <p className="text-[10px] text-zinc-500">{badge.category}</p>
      </div>
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((lvl) => (
          <div
            key={lvl}
            className={`h-1.5 w-1.5 rounded-full ${
              lvl <= badge.level ? "bg-cyan-400" : "bg-zinc-700"
            }`}
          />
        ))}
      </div>
    </motion.div>
  );
}

function DashboardTab({ onOpenPledge, pledgeSignature }: { onOpenPledge: () => void; pledgeSignature: PledgeSignature | null }) {
  return (
    <div>
      {/* Hero */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative mb-12 overflow-hidden rounded-2xl border border-zinc-800/50 bg-gradient-to-br from-zinc-900 via-zinc-900/90 to-zinc-950 p-8 sm:p-12"
      >
        <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-cyan-500/10 blur-3xl" />
        <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-emerald-500/10 blur-3xl" />
        <div className="relative z-10">
          <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-widest text-cyan-400">
            <Sparkles className="h-3 w-3" /> Ecosystem
          </div>
          <h1 className="mt-4 text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
            Where Innovation<br />
            <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
              Meets Purpose
            </span>
          </h1>
          <p className="mt-4 max-w-lg text-sm leading-relaxed text-zinc-400">
            {TAGLINE}. Join a global community of innovators building open-source solutions
            for humanity's greatest challenges.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <button
              onClick={onOpenPledge}
              className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-cyan-500/20 transition-all hover:shadow-cyan-500/30 hover:brightness-110"
            >
              {pledgeSignature ? "View My Pledge" : "Take the Pledge"}
              <ArrowRight className="h-4 w-4" />
            </button>
            <button className="inline-flex items-center gap-2 rounded-lg border border-zinc-700/50 bg-zinc-800/50 px-5 py-2.5 text-sm font-medium text-zinc-300 transition-all hover:bg-zinc-800 hover:text-white">
              Explore Solutions
              <Compass className="h-4 w-4" />
            </button>
          </div>
          {pledgeSignature && (
            <div className="mt-4 flex items-center gap-2 text-xs text-emerald-400">
              <BadgeCheck className="h-3.5 w-3.5" />
              Pledged as {pledgeSignature.name} &middot; {pledgeSignature.role}
            </div>
          )}
        </div>
      </motion.div>

      {/* KPIs */}
      <SectionHeading title="Impact Overview" subtitle="Real-time ecosystem metrics" icon="Gauge" />
      <div className="mb-12 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        {IMPACT_KPIS.map((kpi, i) => (
          <StatCard
            key={kpi.id}
            value={`${kpi.prefix || ""}${kpi.value.toLocaleString()}${kpi.suffix || ""}`}
            label={kpi.label}
            icon={kpi.icon}
            gradient={kpi.gradient}
            trend={kpi.trend}
          />
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { title: "Browse Solutions", desc: "Explore open-source projects", icon: Code, color: "from-cyan-500 to-blue-600" },
          { title: "Join Challenge", desc: "Solve real-world problems", icon: Target, color: "from-emerald-500 to-teal-600" },
          { title: "Earn Badges", desc: "Level up your skills", icon: Award, color: "from-violet-500 to-purple-600" },
          { title: "Read Charter", desc: "Our guiding principles", icon: ScrollText, color: "from-amber-500 to-orange-600" },
        ].map((item, i) => (
          <motion.button
            key={item.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 + i * 0.1 }}
            whileHover={{ y: -4 }}
            className="group relative overflow-hidden rounded-xl border border-zinc-800/50 bg-zinc-900/50 p-4 text-left backdrop-blur-sm transition-all hover:border-zinc-700/50"
          >
            <div className={`mb-3 flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br ${item.color}`}>
              <item.icon className="h-4 w-4 text-white" />
            </div>
            <h3 className="text-sm font-semibold text-white">{item.title}</h3>
            <p className="mt-1 text-xs text-zinc-500">{item.desc}</p>
          </motion.button>
        ))}
      </div>
    </div>
  );
}

function SolutionsTab() {
  const [filter, setFilter] = useState<string>("all");
  const categories = [...new Set(SOLUTIONS.map((s) => s.category))];
  const filtered = filter === "all" ? SOLUTIONS : SOLUTIONS.filter((s) => s.category === filter);

  return (
    <div>
      <SectionHeading title="Solutions Directory" subtitle="Open-source innovation projects" icon="Code" />
      <div className="mb-6 flex flex-wrap gap-2">
        <button
          onClick={() => setFilter("all")}
          className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
            filter === "all" ? "bg-cyan-500/10 text-cyan-400" : "bg-zinc-800/50 text-zinc-500 hover:text-zinc-300"
          }`}
        >
          All
        </button>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
              filter === cat ? "bg-cyan-500/10 text-cyan-400" : "bg-zinc-800/50 text-zinc-500 hover:text-zinc-300"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((sol, i) => (
          <SolutionCard key={sol.id} solution={sol} index={i} />
        ))}
      </div>
      {filtered.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <Search className="mb-3 h-8 w-8 text-zinc-700" />
          <p className="text-sm text-zinc-500">No solutions found in this category</p>
        </div>
      )}
    </div>
  );
}

function ChallengesTab() {
  const [filter, setFilter] = useState<string>("all");
  const categories = [...new Set(CHALLENGES.map((c) => c.category))];
  const diffs = ["all", "beginner", "intermediate", "advanced"] as const;
  const [diffFilter, setDiffFilter] = useState<string>("all");
  const filtered = CHALLENGES.filter((c) => {
    if (filter !== "all" && c.category !== filter) return false;
    if (diffFilter !== "all" && c.difficulty !== diffFilter) return false;
    return true;
  });

  return (
    <div>
      <SectionHeading title="Global Challenges" subtitle="Solve real-world problems. Win grants." icon="Target" />
      <div className="mb-6 flex flex-wrap gap-2">
        <button
          onClick={() => setFilter("all")}
          className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
            filter === "all" ? "bg-cyan-500/10 text-cyan-400" : "bg-zinc-800/50 text-zinc-500 hover:text-zinc-300"
          }`}
        >
          All
        </button>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
              filter === cat ? "bg-cyan-500/10 text-cyan-400" : "bg-zinc-800/50 text-zinc-500 hover:text-zinc-300"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>
      <div className="mb-4 flex flex-wrap gap-2">
        {diffs.map((d) => (
          <button
            key={d}
            onClick={() => setDiffFilter(d)}
            className={`rounded-lg px-3 py-1 text-[10px] font-medium uppercase tracking-wider transition-all ${
              diffFilter === d ? "bg-cyan-500/10 text-cyan-400" : "bg-zinc-800/30 text-zinc-600 hover:text-zinc-400"
            }`}
          >
            {d === "all" ? "All Levels" : d}
          </button>
        ))}
      </div>
      <div className="grid grid-cols-1 gap-4">
        {filtered.map((ch, i) => (
          <ChallengeCard key={ch.id} challenge={ch} index={i} />
        ))}
      </div>
      {filtered.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <Search className="mb-3 h-8 w-8 text-zinc-700" />
          <p className="text-sm text-zinc-500">No challenges match your filters</p>
        </div>
      )}
    </div>
  );
}

function SkillsTab() {
  const [filter, setFilter] = useState<string>("all");
  const categories = [...new Set(SKILL_BADGES.map((b) => b.category))];
  const filtered = filter === "all" ? SKILL_BADGES : SKILL_BADGES.filter((b) => b.category === filter);

  return (
    <div>
      <SectionHeading title="Skill Matrix" subtitle="Track your expertise and earn badges" icon="BrainCircuit" />
      <div className="mb-6 flex flex-wrap gap-2">
        <button
          onClick={() => setFilter("all")}
          className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
            filter === "all" ? "bg-cyan-500/10 text-cyan-400" : "bg-zinc-800/50 text-zinc-500 hover:text-zinc-300"
          }`}
        >
          All
        </button>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
              filter === cat ? "bg-cyan-500/10 text-cyan-400" : "bg-zinc-800/50 text-zinc-500 hover:text-zinc-300"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((badge, i) => (
          <SkillBadgeCard key={badge.id} badge={badge} index={i} />
        ))}
      </div>
      {filtered.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <Search className="mb-3 h-8 w-8 text-zinc-700" />
          <p className="text-sm text-zinc-500">No badges in this category yet</p>
        </div>
      )}
    </div>
  );
}

function CharterTab() {
  return (
    <div>
      <SectionHeading title="Ecosystem Charter" subtitle="The principles that guide our community" icon="ScrollText" />
      <div className="mb-8 rounded-xl border border-zinc-800/50 bg-zinc-900/30 p-6 backdrop-blur-sm">
        <p className="text-sm leading-relaxed text-zinc-400">
          The {BRAND_NAME} Charter is our living constitution — a set of principles that every project,
          contributor, and partner agrees to uphold. These aren't just ideals; they're binding commitments
          baked into our governance model.
        </p>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {CHARTER_PRINCIPLES.map((principle, i) => {
          const Icon = iconMap[principle.icon] || BookOpen;
          return (
            <motion.div
              key={principle.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              whileHover={{ y: -4 }}
              className="group relative overflow-hidden rounded-xl border border-zinc-800/50 bg-zinc-900/50 p-5 backdrop-blur-sm transition-all hover:border-zinc-700/50"
            >
              <div className={`mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br ${principle.color}`}>
                <Icon className="h-5 w-5 text-white" />
              </div>
              <h3 className="text-sm font-semibold text-white">{principle.title}</h3>
              <p className="mt-2 text-xs leading-relaxed text-zinc-400">{principle.description}</p>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

export default function MainContent({
  activeTab,
  onOpenPledge,
  pledgeSignature,
  onSavePledge,
  quizResult,
  onSaveQuiz,
}: MainContentProps) {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        >
          {activeTab === "dashboard" && <DashboardTab onOpenPledge={onOpenPledge} pledgeSignature={pledgeSignature} />}
          {activeTab === "solutions" && <SolutionsTab />}
          {activeTab === "challenges" && <ChallengesTab />}
          {activeTab === "skills" && <SkillsTab />}
          {activeTab === "charter" && <CharterTab />}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}