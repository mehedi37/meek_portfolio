"use client";

import { motion } from "framer-motion";
import { FadeInSection, StaggerContainer, StaggerItem } from "@/components/animations";
import { SkillBar } from "@/components/ui/SkillBar";
import type { Skill } from "@/lib/supabase/types";
import {
  FaReact,
  FaNodeJs,
  FaPython,
  FaDocker,
  FaGitAlt,
  FaDatabase,
} from "react-icons/fa";
import {
  SiTypescript,
  SiNextdotjs,
  SiTailwindcss,
  SiPostgresql,
  SiMongodb,
  SiGraphql,
  SiAmazonwebservices,
  SiFigma,
} from "react-icons/si";

// Demo skills using Supabase Skill type
const DEMO_SKILLS: Skill[] = [
  { id: "1", name: "React", level: 95, category: "frontend", icon: "FaReact", created_at: null },
  { id: "2", name: "TypeScript", level: 90, category: "languages", icon: "SiTypescript", created_at: null },
  { id: "3", name: "Next.js", level: 92, category: "frameworks", icon: "SiNextdotjs", created_at: null },
  { id: "4", name: "Tailwind CSS", level: 88, category: "frontend", icon: "SiTailwindcss", created_at: null },
  { id: "5", name: "Node.js", level: 85, category: "backend", icon: "FaNodeJs", created_at: null },
  { id: "6", name: "Python", level: 80, category: "languages", icon: "FaPython", created_at: null },
  { id: "7", name: "PostgreSQL", level: 82, category: "database", icon: "SiPostgresql", created_at: null },
  { id: "8", name: "MongoDB", level: 78, category: "database", icon: "SiMongodb", created_at: null },
  { id: "9", name: "GraphQL", level: 75, category: "backend", icon: "SiGraphql", created_at: null },
  { id: "10", name: "Docker", level: 72, category: "devops", icon: "FaDocker", created_at: null },
  { id: "11", name: "AWS", level: 70, category: "devops", icon: "SiAmazonwebservices", created_at: null },
  { id: "12", name: "Git", level: 90, category: "tools", icon: "FaGitAlt", created_at: null },
];

type SkillCategoryKey = "frontend" | "backend" | "database" | "devops" | "languages" | "frameworks" | "tools";

const SKILL_CATEGORIES: { key: SkillCategoryKey; label: string; description: string }[] = [
  { key: "frontend", label: "Frontend", description: "Building beautiful interfaces" },
  { key: "backend", label: "Backend", description: "Server-side development" },
  { key: "database", label: "Database", description: "Data management" },
  { key: "devops", label: "DevOps", description: "Infrastructure & deployment" },
  { key: "languages", label: "Languages", description: "Programming languages" },
  { key: "tools", label: "Tools", description: "Development utilities" },
];

const iconMap: Record<string, React.ElementType> = {
  FaReact, FaNodeJs, FaPython, FaDocker, FaGitAlt, FaDatabase,
  SiTypescript, SiNextdotjs, SiTailwindcss, SiPostgresql, SiMongodb, SiGraphql, SiAmazonwebservices, SiFigma,
};

interface SkillsProps {
  className?: string;
  skills?: Skill[];
}

/**
 * Professional skills section with animated progress bars
 */
export function Skills({ className = "", skills = DEMO_SKILLS }: SkillsProps) {
  const groupedSkills = skills.reduce((acc, skill) => {
    if (!acc[skill.category]) acc[skill.category] = [];
    acc[skill.category].push(skill);
    return acc;
  }, {} as Record<string, Skill[]>);

  return (
    <section id="skills" className={`relative py-24 lg:py-32 ${className}`}>
      {/* Background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-background via-secondary/30 to-background" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <FadeInSection className="text-center mb-16">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium bg-accent/10 text-accent border border-accent/20 mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-accent" />
            Technical Skills
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            Technologies I Work With
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Constantly learning and expanding my skill set to deliver the best solutions.
          </p>
        </FadeInSection>

        {/* Skills Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {SKILL_CATEGORIES.map((category, categoryIndex) => {
            const categorySkills = groupedSkills[category.key];
            if (!categorySkills || categorySkills.length === 0) return null;

            return (
              <FadeInSection key={category.key} delay={categoryIndex * 0.1} direction="up">
                <motion.div
                  className="p-6 rounded-2xl bg-card/60 backdrop-blur-sm border border-border/50 hover:border-accent/30 transition-all duration-300 h-full"
                  whileHover={{ y: -4, boxShadow: "0 20px 40px -20px rgba(0,0,0,0.1)" }}
                >
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
                      <span className="text-lg font-bold text-accent">{category.label.charAt(0)}</span>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-foreground">{category.label}</h3>
                      <p className="text-xs text-muted-foreground">{category.description}</p>
                    </div>
                  </div>

                  <StaggerContainer className="space-y-4" staggerDelay={0.05}>
                    {categorySkills.map((skill) => {
                      const IconComponent = skill.icon ? iconMap[skill.icon] : null;
                      return (
                        <StaggerItem key={skill.id}>
                          <SkillBar
                            name={skill.name}
                            level={skill.level ?? 0}
                            icon={IconComponent ? <IconComponent size={16} /> : undefined}
                          />
                        </StaggerItem>
                      );
                    })}
                  </StaggerContainer>
                </motion.div>
              </FadeInSection>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default Skills;
