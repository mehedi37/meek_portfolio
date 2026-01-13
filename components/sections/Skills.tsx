"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Card, Chip, Accordion, Separator } from "@heroui/react";
import {
  FaReact,
  FaNodeJs,
  FaPython,
  FaDocker,
  FaGitAlt,
} from "react-icons/fa";
import {
  SiTypescript,
  SiNextdotjs,
  SiTailwindcss,
  SiPostgresql,
  SiMongodb,
  SiGraphql,
  SiAmazonwebservices,
  SiVercel,
  SiSupabase,
  SiPrisma,
  SiFramer,
} from "react-icons/si";
import { HiCode, HiServer, HiDatabase, HiCloud, HiSparkles, HiTrendingUp } from "react-icons/hi";

// Skill data with categories
const SKILL_CATEGORIES = [
  {
    id: "frontend",
    title: "Frontend Development",
    icon: HiCode,
    color: "accent" as const,
    description: "Building beautiful, responsive user interfaces",
    skills: [
      { name: "React", icon: FaReact, level: 95 },
      { name: "Next.js", icon: SiNextdotjs, level: 92 },
      { name: "TypeScript", icon: SiTypescript, level: 90 },
      { name: "Tailwind CSS", icon: SiTailwindcss, level: 88 },
      { name: "Framer Motion", icon: SiFramer, level: 85 },
    ],
  },
  {
    id: "backend",
    title: "Backend Development",
    icon: HiServer,
    color: "success" as const,
    description: "Scalable APIs and server-side solutions",
    skills: [
      { name: "Node.js", icon: FaNodeJs, level: 88 },
      { name: "Python", icon: FaPython, level: 82 },
      { name: "GraphQL", icon: SiGraphql, level: 78 },
      { name: "Prisma", icon: SiPrisma, level: 85 },
    ],
  },
  {
    id: "database",
    title: "Database & Storage",
    icon: HiDatabase,
    color: "warning" as const,
    description: "Data modeling and management",
    skills: [
      { name: "PostgreSQL", icon: SiPostgresql, level: 85 },
      { name: "MongoDB", icon: SiMongodb, level: 78 },
      { name: "Supabase", icon: SiSupabase, level: 90 },
    ],
  },
  {
    id: "devops",
    title: "DevOps & Cloud",
    icon: HiCloud,
    color: "danger" as const,
    description: "Deployment and infrastructure",
    skills: [
      { name: "Docker", icon: FaDocker, level: 75 },
      { name: "AWS", icon: SiAmazonwebservices, level: 72 },
      { name: "Vercel", icon: SiVercel, level: 92 },
      { name: "Git", icon: FaGitAlt, level: 90 },
    ],
  },
];

// Experience stats
const STATS = [
  { label: "Years Experience", value: "4+", icon: HiTrendingUp },
  { label: "Projects Completed", value: "50+", icon: HiCode },
  { label: "Happy Clients", value: "30+", icon: HiSparkles },
  { label: "Technologies", value: "20+", icon: HiServer },
];

interface SkillsProps {
  className?: string;
}

// Animated skill bar with HeroUI styling
function SkillBar({ name, icon: Icon, level, delay = 0 }: {
  name: string;
  icon: React.ElementType;
  level: number;
  delay?: number;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <motion.div
      ref={ref}
      className="group flex items-center gap-3 p-3 rounded-lg hover:bg-default/50 transition-colors"
      initial={{ opacity: 0, x: -20 }}
      animate={isInView ? { opacity: 1, x: 0 } : {}}
      transition={{ delay: delay * 0.1, duration: 0.5 }}
    >
      <div className="shrink-0 w-10 h-10 rounded-lg bg-default flex items-center justify-center group-hover:scale-110 transition-transform">
        <Icon className="w-5 h-5 text-accent" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-center mb-1.5">
          <span className="text-sm font-medium truncate">{name}</span>
          <span className="text-xs text-muted">{level}%</span>
        </div>
        <div className="h-1.5 bg-default rounded-full overflow-hidden">
          <motion.div
            className="h-full rounded-full bg-accent"
            initial={{ width: 0 }}
            animate={isInView ? { width: `${level}%` } : {}}
            transition={{ delay: delay * 0.1 + 0.3, duration: 0.8, ease: "easeOut" }}
          />
        </div>
      </div>
    </motion.div>
  );
}

// Stats card component
function StatCard({ stat, index }: { stat: typeof STATS[0]; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
    >
      <Card variant="secondary" className="p-6 text-center hover:scale-105 transition-transform">
        <Card.Content className="space-y-2 p-0">
          <stat.icon className="w-6 h-6 mx-auto text-accent" />
          <div className="text-3xl font-bold">{stat.value}</div>
          <div className="text-sm text-muted">{stat.label}</div>
        </Card.Content>
      </Card>
    </motion.div>
  );
}

/**
 * Skills Section - Bento Grid with Accordion
 * Uses HeroUI v3 semantic classes
 */
export function Skills({ className = "" }: SkillsProps) {
  return (
    <section id="skills" className={`relative py-24 lg:py-32 overflow-hidden bg-background ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <Chip color="accent" variant="soft" className="mb-6 gap-2">
            <HiSparkles className="w-4 h-4" />
            Technical Skills
          </Chip>
          <h2 className="text-4xl lg:text-5xl font-bold mb-4">
            Technologies I Work With
          </h2>
          <p className="text-lg text-muted max-w-2xl mx-auto text-balance">
            Constantly learning and expanding my skill set to deliver cutting-edge solutions.
          </p>
        </motion.div>

        {/* Main Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

          {/* Stats Row */}
          <div className="lg:col-span-12 grid grid-cols-2 md:grid-cols-4 gap-4 mb-2">
            {STATS.map((stat, index) => (
              <StatCard key={stat.label} stat={stat} index={index} />
            ))}
          </div>

          {/* Skills Accordion - Main Content */}
          <motion.div
            className="lg:col-span-8"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            <Card variant="default" className="p-6">
              <Card.Content className="p-0">
                <Accordion variant="surface" defaultExpandedKeys={["frontend"]}>
                  {SKILL_CATEGORIES.map((category) => (
                    <Accordion.Item key={category.id} id={category.id}>
                      <Accordion.Heading>
                        <Accordion.Trigger className="py-4 w-full">
                          <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-lg bg-${category.color}/10 flex items-center justify-center`}>
                              <category.icon className={`w-5 h-5 text-${category.color}`} />
                            </div>
                            <div className="text-left">
                              <div className="font-semibold">{category.title}</div>
                              <div className="text-sm text-muted">{category.description}</div>
                            </div>
                          </div>
                          <Accordion.Indicator />
                        </Accordion.Trigger>
                      </Accordion.Heading>
                      <Accordion.Panel>
                        <Accordion.Body>
                          <div className="space-y-1 pb-4">
                            {category.skills.map((skill, skillIndex) => (
                              <SkillBar
                                key={skill.name}
                                name={skill.name}
                                icon={skill.icon}
                                level={skill.level}
                                delay={skillIndex}
                              />
                            ))}
                          </div>
                        </Accordion.Body>
                      </Accordion.Panel>
                    </Accordion.Item>
                  ))}
                </Accordion>
              </Card.Content>
            </Card>
          </motion.div>

          {/* Right Sidebar Cards */}
          <div className="lg:col-span-4 space-y-6">
            {/* Currently Learning Card */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3, duration: 0.6 }}
            >
              <Card variant="secondary" className="p-6">
                <Card.Content className="text-center space-y-4 p-0">
                  <div className="w-16 h-16 rounded-2xl bg-accent mx-auto flex items-center justify-center">
                    <HiTrendingUp className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold">Always Learning</h3>
                  <p className="text-sm text-muted">
                    Currently exploring AI/ML, Web3, and advanced animation techniques
                  </p>
                  <Separator />
                  <div className="flex flex-wrap justify-center gap-2">
                    {["AI/ML", "Web3", "Three.js"].map((topic) => (
                      <Chip key={topic} variant="soft" size="sm">
                        {topic}
                      </Chip>
                    ))}
                  </div>
                </Card.Content>
              </Card>
            </motion.div>

            {/* Tools Card */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4, duration: 0.6 }}
            >
              <Card variant="tertiary" className="p-6">
                <Card.Header className="p-0 pb-4">
                  <Card.Title className="text-sm font-medium text-muted uppercase tracking-wider">
                    Daily Tools
                  </Card.Title>
                </Card.Header>
                <Card.Content className="p-0">
                  <div className="flex flex-wrap gap-2">
                    {[
                      { name: "VS Code", icon: HiCode },
                      { name: "Git", icon: FaGitAlt },
                      { name: "Docker", icon: FaDocker },
                      { name: "Vercel", icon: SiVercel },
                    ].map((tool) => (
                      <div
                        key={tool.name}
                        className="flex items-center gap-2 px-3 py-2 rounded-lg bg-default hover:bg-surface transition-colors cursor-default"
                      >
                        <tool.icon className="w-4 h-4 text-accent" />
                        <span className="text-sm">{tool.name}</span>
                      </div>
                    ))}
                  </div>
                </Card.Content>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Skills;
