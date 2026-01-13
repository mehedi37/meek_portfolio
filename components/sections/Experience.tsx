"use client";

import { motion } from "framer-motion";
import { FadeInSection, StaggerContainer, StaggerItem } from "@/components/animations";
import { TimelineItem } from "@/components/ui/TimelineItem";
import type { Experience as ExperienceType } from "@/lib/supabase/types";

// Demo experience using Supabase Experience type
const DEMO_EXPERIENCES: ExperienceType[] = [
  {
    id: "1",
    company: "Tech Innovations Inc.",
    position: "Senior Full Stack Developer",
    description: "Led development of enterprise applications serving 100K+ users. Architected microservices infrastructure and mentored junior developers. Reduced page load time by 40% through performance optimization.",
    start_date: "2022-06-01",
    end_date: null,
    location: "San Francisco, CA",
    technologies: ["React", "Node.js", "AWS", "PostgreSQL", "Docker"],
    type: "full-time",
    created_at: "2022-06-01T00:00:00.000Z",
  },
  {
    id: "2",
    company: "Digital Solutions Co.",
    position: "Full Stack Developer",
    description: "Developed and maintained multiple client projects including e-commerce platforms and CRM systems. Built real-time collaborative tools using WebSocket. Integrated payment gateways processing $2M+ monthly.",
    start_date: "2020-01-15",
    end_date: "2022-05-31",
    location: "Austin, TX",
    technologies: ["Vue.js", "Python", "MongoDB", "Redis", "Kubernetes"],
    type: "full-time",
    created_at: "2020-01-15T00:00:00.000Z",
  },
  {
    id: "3",
    company: "StartUp Labs",
    position: "Junior Developer",
    description: "Started career building web applications and learning modern development practices. Contributed to multiple MVP launches for early-stage startups.",
    start_date: "2018-07-01",
    end_date: "2019-12-31",
    location: "Remote",
    technologies: ["JavaScript", "React", "Node.js", "MySQL"],
    type: "full-time",
    created_at: "2018-07-01T00:00:00.000Z",
  },
];

interface ExperienceProps {
  className?: string;
  experiences?: ExperienceType[];
}

/**
 * Professional experience section with timeline
 */
export function Experience({ className = "", experiences = DEMO_EXPERIENCES }: ExperienceProps) {
  return (
    <section id="experience" className={`relative py-24 lg:py-32 ${className}`}>
      {/* Background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-background via-secondary/20 to-background" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <FadeInSection className="text-center mb-16">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium bg-accent/10 text-accent border border-accent/20 mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-accent" />
            Experience
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            Professional Journey
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            A timeline of my career growth and key achievements.
          </p>
        </FadeInSection>

        {/* Timeline */}
        <div className="relative max-w-4xl mx-auto">
          {/* Timeline line */}
          <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-px bg-border/60" />

          <StaggerContainer className="space-y-12" staggerDelay={0.15}>
            {experiences.map((experience, index) => (
              <StaggerItem key={experience.id}>
                <TimelineItem
                  experience={experience}
                  index={index}
                  isLeft={index % 2 === 0}
                />
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>

        {/* Career Stats */}
        <FadeInSection delay={0.4} className="mt-20">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 lg:gap-6">
            {[
              { value: "5+", label: "Years Experience" },
              { value: "30+", label: "Projects Completed" },
              { value: "15+", label: "Happy Clients" },
              { value: "10+", label: "Technologies" },
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                className="p-6 rounded-2xl bg-card/60 backdrop-blur-sm border border-border/50 text-center"
                whileHover={{ y: -4, boxShadow: "0 20px 40px -20px rgba(0,0,0,0.1)" }}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="text-3xl sm:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-accent to-primary mb-2">
                  {stat.value}
                </div>
                <div className="text-sm text-muted-foreground font-medium">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </FadeInSection>
      </div>
    </section>
  );
}

export default Experience;
