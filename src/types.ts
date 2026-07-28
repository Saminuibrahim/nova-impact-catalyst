export interface Solution {
  id: string;
  title: string;
  description: string;
  category: string;
  icon: string;
  gradient: string;
  contributors: number;
  status: "active" | "prototype" | "idea";
  tech: string[];
}

export interface Challenge {
  id: string;
  title: string;
  description: string;
  category: string;
  icon: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  participants: number;
  reward: string;
}

export interface SkillBadge {
  id: string;
  name: string;
  category: string;
  level: number;
  icon: string;
  color: string;
}

export interface ImpactKPI {
  id: string;
  label: string;
  value: number;
  prefix?: string;
  suffix?: string;
  icon: string;
  gradient: string;
  trend: number;
}

export interface CharterPrinciple {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
}

export interface PledgeSignature {
  name: string;
  role: string;
  badgeColor: string;
  timestamp: number;
  completed: boolean;
}

export interface QuizResult {
  score: number;
  total: number;
  passed: boolean;
  timestamp: number;
}