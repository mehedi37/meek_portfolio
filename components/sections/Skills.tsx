"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useState, useEffect, useCallback } from "react";
import { Card, Chip, Tabs, Separator } from "@heroui/react";
import { HiCode, HiServer, HiDatabase, HiCloud, HiSparkles, HiTrendingUp, HiChevronLeft, HiChevronRight } from "react-icons/hi";
import {
  FaDocker,
  FaGitAlt,
} from "react-icons/fa";
import {
  SiVercel,
} from "react-icons/si";
import type { Skill, SkillCategory, SiteProfile } from "@/lib/supabase/types";
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
  profile?: SiteProfile | null;
}

// Animated skill card with modern glassmorphism design
function SkillCard({ skill, delay = 0 }: {
  skill: Skill;
  delay?: number;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const [isHovered, setIsHovered] = useState(false);

  // Get icon component from skill.icon string or use fallback
  const IconComponent = skill.icon ? getIconComponent(skill.icon) : HiCode;

  return (
    <motion.div
      ref={ref}
      className="group relative"
      initial={{ opacity: 0, scale: 0.8, y: 20 }}
      animate={isInView ? { opacity: 1, scale: 1, y: 0 } : {}}
      transition={{
        delay: delay * 0.05,
        duration: 0.5,
        type: "spring",
        stiffness: 100
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative h-full p-4 rounded-2xl bg-gradient-to-br from-default/50 to-default/30 backdrop-blur-sm border border-separator/50 overflow-hidden transition-all duration-300 hover:shadow-xl hover:scale-105 hover:border-accent/50">
        {/* Animated gradient background on hover */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-br from-accent/5 to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          animate={isHovered ? {
            background: [
              "linear-gradient(135deg, rgba(var(--color-accent-rgb), 0.05) 0%, rgba(var(--color-primary-rgb), 0.05) 100%)",
              "linear-gradient(225deg, rgba(var(--color-accent-rgb), 0.08) 0%, rgba(var(--color-primary-rgb), 0.08) 100%)",
              "linear-gradient(135deg, rgba(var(--color-accent-rgb), 0.05) 0%, rgba(var(--color-primary-rgb), 0.05) 100%)",
            ]
          } : {}}
          transition={{ duration: 2, repeat: Infinity }}
        />

        {/* Icon */}
        <motion.div
          className="relative w-12 h-12 mb-3 rounded-xl bg-gradient-to-br from-accent/20 to-primary/20 flex items-center justify-center"
          whileHover={{ rotate: 35, scale: 1.1 }}
          transition={{ duration: 0.6, type: "spring" }}
        >
          {IconComponent ? (
            <IconComponent className="w-6 h-6 text-accent" />
          ) : (
            <HiCode className="w-6 h-6 text-accent" />
          )}
        </motion.div>

        {/* Skill name */}
        <h4 className="relative text-base font-semibold mb-1 group-hover:text-accent transition-colors">
          {skill.name}
        </h4>

        {/* Featured badge */}
        {skill.is_featured && (
          <motion.div
            className="relative inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-accent/10 text-accent text-xs font-medium"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: delay * 0.05 + 0.3 }}
          >
            <HiSparkles className="w-3 h-3" />
            <span>Featured</span>
          </motion.div>
        )}

        {/* Hover effect - shine */}
        <motion.div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          style={{
            background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)",
          }}
          animate={isHovered ? { x: [-200, 200] } : {}}
          transition={{ duration: 1, repeat: Infinity, repeatDelay: 1 }}
        />
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
export function Skills({ className = "", categories = [], skills = [], profile }: SkillsProps) {
  // Scroll indicator state
  const tabsContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  // Check scroll position
  const checkScroll = useCallback(() => {
    const container = tabsContainerRef.current;
    if (container) {
      setCanScrollLeft(container.scrollLeft > 0);
      setCanScrollRight(
        container.scrollLeft < container.scrollWidth - container.clientWidth - 1
      );
    }
  }, []);

  useEffect(() => {
    const container = tabsContainerRef.current;
    if (container) {
      checkScroll();
      container.addEventListener("scroll", checkScroll);
      window.addEventListener("resize", checkScroll);
      return () => {
        container.removeEventListener("scroll", checkScroll);
        window.removeEventListener("resize", checkScroll);
      };
    }
  }, [checkScroll, categories]);

  const scrollTabs = (direction: "left" | "right") => {
    const container = tabsContainerRef.current;
    if (container) {
      const scrollAmount = 200;
      container.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth"
      });
    }
  };

  // Group skills by category_id
  const skillsByCategory = skills.reduce((acc, skill) => {
    const categoryId = skill.category_id || "other";
    if (!acc[categoryId]) {
      acc[categoryId] = [];
    }
    acc[categoryId].push(skill);
    return acc;
  }, {} as Record<string, Skill[]>);

  // Compute stats from profile or fallback
  const totalSkills = skills.length;

  // Use profile data if available, otherwise use fallback values
  const stats = [
    {
      label: "Years Experience",
      value: profile?.years_experience ? `${profile.years_experience}+` : "3+",
      icon: HiTrendingUp
    },
    {
      label: "Projects Completed",
      value: profile?.completed_projects ? `${profile.completed_projects}+` : "35+",
      icon: HiCode
    },
    {
      label: "Happy Clients",
      value: profile?.happy_clients ? `${profile.happy_clients}+` : "40+",
      icon: HiSparkles
    },
    {
      label: "Technologies",
      value: totalSkills > 0 ? `${totalSkills}+` : "20+",
      icon: HiServer
    },
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

          {/* Skills Tabs - Main Content */}
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
                  <Tabs
                    className="w-full"
                    defaultSelectedKey={categories[0]?.id || ""}
                  >
                    {/* Tabs List Container with horizontal scroll and indicators */}
                    <div className="relative mb-8">
                      {/* Left scroll indicator */}
                      {canScrollLeft && (
                        <button
                          onClick={() => scrollTabs("left")}
                          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-8 h-8 rounded-full bg-surface/90 backdrop-blur-sm border border-separator shadow-lg flex items-center justify-center hover:bg-default transition-colors"
                          aria-label="Scroll tabs left"
                        >
                          <HiChevronLeft className="w-5 h-5 text-foreground" />
                        </button>
                      )}

                      {/* Right scroll indicator */}
                      {canScrollRight && (
                        <button
                          onClick={() => scrollTabs("right")}
                          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-8 h-8 rounded-full bg-surface/90 backdrop-blur-sm border border-separator shadow-lg flex items-center justify-center hover:bg-default transition-colors"
                          aria-label="Scroll tabs right"
                        >
                          <HiChevronRight className="w-5 h-5 text-foreground" />
                        </button>
                      )}

                      {/* Gradient fade indicators */}
                      {canScrollLeft && (
                        <div className="absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-surface to-transparent pointer-events-none z-[5]" />
                      )}
                      {canScrollRight && (
                        <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-surface to-transparent pointer-events-none z-[5]" />
                      )}

                      <Tabs.ListContainer
                        ref={tabsContainerRef}
                        className="overflow-x-auto pb-2 scrollbar-hide px-1"
                        style={{
                          scrollbarWidth: "none",
                          msOverflowStyle: "none",
                        }}
                      >
                      <Tabs.List
                        aria-label="Skill Categories"
                        className="w-fit *:h-auto *:w-fit *:px-4 *:py-2.5 *:text-sm *:font-medium gap-2"
                      >
                        {categories.map((category) => {
                          const CategoryIcon = category.icon ? getIconComponent(category.icon) : DEFAULT_CATEGORY_ICONS[category.id.toLowerCase()] || HiCode;
                          const categoryColor = category.color || DEFAULT_CATEGORY_COLORS[category.id.toLowerCase()] || "accent";

                          return (
                            <Tabs.Tab key={category.id} id={category.id}>
                              <div className="flex items-center gap-2">
                                <div className={`w-8 h-8 rounded-lg bg-gradient-to-br from-${categoryColor}/20 to-${categoryColor}/10 flex items-center justify-center transition-transform group-hover:scale-110`}>
                                  {CategoryIcon ? (
                                    <CategoryIcon className={`w-4 h-4 text-${categoryColor}`} />
                                  ) : (
                                    <HiCode className={`w-4 h-4 text-${categoryColor}`} />
                                  )}
                                </div>
                                <span>{category.name}</span>
                              </div>
                              <Tabs.Indicator className="bg-gradient-to-r from-accent to-primary h-1 rounded-full" />
                            </Tabs.Tab>
                          );
                        })}
                      </Tabs.List>
                    </Tabs.ListContainer>
                    </div>

                    {/* Tab Panels with masonry grid layout */}
                    {categories.map((category) => {
                      const categorySkills = skillsByCategory[category.id] || [];

                      return (
                        <Tabs.Panel
                          key={category.id}
                          id={category.id}
                          className="animate-in fade-in duration-500"
                        >
                          {category.description && (
                            <motion.p
                              className="text-sm text-muted mb-6 px-1"
                              initial={{ opacity: 0, y: -10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ duration: 0.4 }}
                            >
                              {category.description}
                            </motion.p>
                          )}

                          {/* Responsive masonry-style grid */}
                          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                            {categorySkills.length > 0 ? (
                              categorySkills.map((skill, skillIndex) => (
                                <SkillCard
                                  key={skill.id}
                                  skill={skill}
                                  delay={skillIndex}
                                />
                              ))
                            ) : (
                              <div className="col-span-full text-center py-12">
                                <motion.div
                                  initial={{ opacity: 0, scale: 0.8 }}
                                  animate={{ opacity: 1, scale: 1 }}
                                  transition={{ duration: 0.5 }}
                                >
                                  <HiCode className="w-16 h-16 mx-auto text-muted/50 mb-4" />
                                  <p className="text-sm text-muted">No skills added yet</p>
                                </motion.div>
                              </div>
                            )}
                          </div>
                        </Tabs.Panel>
                      );
                    })}
                  </Tabs>
                ) : (
                  <div className="text-center py-12">
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.5 }}
                    >
                      <HiCode className="w-12 h-12 mx-auto text-muted mb-4" />
                      <h3 className="text-lg font-semibold mb-2">No Skills Added Yet</h3>
                      <p className="text-sm text-muted">Add skills through the admin dashboard to display them here.</p>
                    </motion.div>
                  </div>
                )}
              </Card.Content>
            </Card>

            {/* Add CSS to hide scrollbars */}
            <style jsx global>{`
              .scrollbar-hide::-webkit-scrollbar {
                display: none;
              }
              .scrollbar-hide {
                -ms-overflow-style: none;
                scrollbar-width: none;
              }
            `}</style>
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
