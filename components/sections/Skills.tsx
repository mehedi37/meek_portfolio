"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Card, Chip, Accordion, Separator } from "@heroui/react";
import { HiCode, HiServer, HiDatabase, HiCloud, HiSparkles, HiTrendingUp } from "react-icons/hi";
import {
  FaDocker,
  FaGitAlt,
} from "react-icons/fa";
import {
  SiVercel,
} from "react-icons/si";
import type { Skill, SkillCategory } from "@/lib/supabase/types";
import { IconRenderer, getIconComponent } from "@/components/admin/IconSearch";

// Default icons for categories
const DEFAULT_CATEGORY_ICONS: Record<string, React.ElementType> = {
  frontend: HiCode,
  backend: HiServer,
  database: HiDatabase,
  devops: HiCloud,
};

// Default colors for categories
const DEFAULT_CATEGORY_COLORS: Record<string, string> = {
  frontend: "accent",
  backend: "success",
  database: "warning",
  devops: "danger",
};

interface SkillsProps {
  className?: string;
  categories?: SkillCategory[];
  skills?: Skill[];
}

// Animated skill bar with HeroUI styling
function SkillBar({ skill, delay = 0 }: {
  skill: Skill;
  delay?: number;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  // Get icon component from skill.icon string or use fallback
  const IconComponent = skill.icon ? getIconComponent(skill.icon) : HiCode;

  return (
    <motion.div
      ref={ref}
      className="group flex items-center gap-3 p-3 rounded-lg hover:bg-default/50 transition-colors"
      initial={{ opacity: 0, x: -20 }}
      animate={isInView ? { opacity: 1, x: 0 } : {}}
      transition={{ delay: delay * 0.1, duration: 0.5 }}
    >
      <div className="shrink-0 w-10 h-10 rounded-lg bg-default flex items-center justify-center group-hover:scale-110 transition-transform">
        {IconComponent ? (
          <IconComponent className="w-5 h-5 text-accent" />
        ) : (
          <HiCode className="w-5 h-5 text-accent" />
        )}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-center mb-1.5">
          <span className="text-sm font-medium truncate">{skill.name}</span>
          <span className="text-xs text-muted">{skill.level}%</span>
        </div>
        <div className="h-1.5 bg-default rounded-full overflow-hidden">
          <motion.div
            className="h-full rounded-full bg-accent"
            initial={{ width: 0 }}
            animate={isInView ? { width: `${skill.level}%` } : {}}
            transition={{ delay: delay * 0.1 + 0.3, duration: 0.8, ease: "easeOut" }}
          />
        </div>
      </div>
    </motion.div>
  );
}

// Stats card component
function StatCard({ label, value, icon: Icon, index }: { label: string; value: string; icon: React.ElementType; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
    >
      <Card variant="secondary" className="p-6 text-center hover:scale-105 transition-transform">
        <Card.Content className="space-y-2 p-0">
          <Icon className="w-6 h-6 mx-auto text-accent" />
          <div className="text-3xl font-bold">{value}</div>
          <div className="text-sm text-muted">{label}</div>
        </Card.Content>
      </Card>
    </motion.div>
  );
}

/**
 * Skills Section - Bento Grid with Accordion
 * Uses HeroUI v3 semantic classes
 */
export function Skills({ className = "", categories = [], skills = [] }: SkillsProps) {
  // Group skills by category_id
  const skillsByCategory = skills.reduce((acc, skill) => {
    const categoryId = skill.category_id || "other";
    if (!acc[categoryId]) {
      acc[categoryId] = [];
    }
    acc[categoryId].push(skill);
    return acc;
  }, {} as Record<string, Skill[]>);

  // Compute stats from data
  const totalSkills = skills.length;
  const totalCategories = categories.length;

  // Fallback stats if no data
  const stats = [
    { label: "Years Experience", value: "4+", icon: HiTrendingUp },
    { label: "Projects Completed", value: "50+", icon: HiCode },
    { label: "Happy Clients", value: "30+", icon: HiSparkles },
    { label: "Technologies", value: totalSkills > 0 ? `${totalSkills}+` : "20+", icon: HiServer },
  ];

  // Check if we have data
  const hasData = categories.length > 0 && skills.length > 0;

  return (
    <section id="skills" className={`relative py-24 lg:py-32 overflow-hidden ${className}`}>
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
            {stats.map((stat, index) => (
              <StatCard key={stat.label} label={stat.label} value={stat.value} icon={stat.icon} index={index} />
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
                {hasData ? (
                  <Accordion variant="surface" defaultExpandedKeys={[categories[0]?.id || ""]}>
                    {categories.map((category) => {
                      const categorySkills = skillsByCategory[category.id] || [];
                      const CategoryIcon = category.icon ? getIconComponent(category.icon) : DEFAULT_CATEGORY_ICONS[category.id.toLowerCase()] || HiCode;
                      const categoryColor = category.color || DEFAULT_CATEGORY_COLORS[category.id.toLowerCase()] || "accent";

                      return (
                        <Accordion.Item key={category.id} id={category.id}>
                          <Accordion.Heading>
                            <Accordion.Trigger className="py-4 w-full">
                              <div className="flex items-center gap-3">
                                <div className={`w-10 h-10 rounded-lg bg-${categoryColor}/10 flex items-center justify-center`}>
                                  {CategoryIcon ? (
                                    <CategoryIcon className={`w-5 h-5 text-${categoryColor}`} />
                                  ) : (
                                    <HiCode className={`w-5 h-5 text-${categoryColor}`} />
                                  )}
                                </div>
                                <div className="text-left">
                                  <div className="font-semibold">{category.name}</div>
                                  <div className="text-sm text-muted">{category.description}</div>
                                </div>
                              </div>
                              <Accordion.Indicator />
                            </Accordion.Trigger>
                          </Accordion.Heading>
                          <Accordion.Panel>
                            <Accordion.Body>
                              <div className="space-y-1 pb-4">
                                {categorySkills.length > 0 ? (
                                  categorySkills.map((skill, skillIndex) => (
                                    <SkillBar
                                      key={skill.id}
                                      skill={skill}
                                      delay={skillIndex}
                                    />
                                  ))
                                ) : (
                                  <p className="text-sm text-muted py-4 text-center">No skills added yet</p>
                                )}
                              </div>
                            </Accordion.Body>
                          </Accordion.Panel>
                        </Accordion.Item>
                      );
                    })}
                  </Accordion>
                ) : (
                  <div className="text-center py-12">
                    <HiCode className="w-12 h-12 mx-auto text-muted mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No Skills Added Yet</h3>
                    <p className="text-sm text-muted">Add skills through the admin dashboard to display them here.</p>
                  </div>
                )}
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
