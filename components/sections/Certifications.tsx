"use client";

import { motion } from "framer-motion";
import { FadeInSection, StaggerContainer, StaggerItem } from "@/components/animations";
import type { Certification } from "@/lib/supabase/types";
import { FaExternalLinkAlt, FaAward, FaCertificate, FaCalendar } from "react-icons/fa";

// Demo certifications using Supabase Certification type with snake_case field names
// In production, fetch from Supabase using: supabase.from('certifications').select('*')
const DEMO_CERTIFICATIONS: Certification[] = [
  {
    id: "1",
    title: "AWS Solutions Architect",
    issuer: "Amazon Web Services",
    date: "2024-01-15",
    credential_url: "https://aws.amazon.com/verification",
    image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=400",
    created_at: "2024-01-15T00:00:00.000Z",
  },
  {
    id: "2",
    title: "Professional Cloud Developer",
    issuer: "Google Cloud",
    date: "2023-09-10",
    credential_url: "https://cloud.google.com/certification",
    image: "https://images.unsplash.com/photo-1573164713714-d95e436ab8d6?w=400",
    created_at: "2023-09-10T00:00:00.000Z",
  },
  {
    id: "3",
    title: "Meta Frontend Developer",
    issuer: "Meta",
    date: "2023-06-20",
    credential_url: "https://coursera.org/verify",
    image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400",
    created_at: "2023-06-20T00:00:00.000Z",
  },
  {
    id: "4",
    title: "MongoDB Developer",
    issuer: "MongoDB University",
    date: "2023-03-05",
    credential_url: "https://university.mongodb.com",
    image: "https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=400",
    created_at: "2023-03-05T00:00:00.000Z",
  },
];

interface CertificationsProps {
  className?: string;
  certifications?: Certification[];
}

/**
 * Certifications section displaying professional credentials
 * Each certification links to verification page
 */
export function Certifications({
  className = "",
  certifications = DEMO_CERTIFICATIONS,
}: CertificationsProps) {
  return (
    <section
      id="certifications"
      className={`relative py-20 lg:py-32 ${className}`}
    >
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-accent/5 to-background -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <FadeInSection className="text-center mb-16">
          <motion.span
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium bg-accent/10 text-accent border border-accent/20 mb-6"
          >
            <FaCertificate size={12} />
            Certifications
          </motion.span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
            Professional{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-primary">
              Credentials
            </span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Industry-recognized certifications that validate my expertise
            in modern technologies and best practices.
          </p>
        </FadeInSection>

        {/* Certifications Grid */}
        <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {certifications.map((cert, index) => (
            <StaggerItem key={cert.id}>
              <CertificationCard certification={cert} index={index} />
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}

interface CertificationCardProps {
  certification: Certification;
  index: number;
}

function CertificationCard({ certification, index }: CertificationCardProps) {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className="h-full"
    >
      <div className="h-full bg-card/50 backdrop-blur-sm rounded-xl border border-border/50 overflow-hidden group hover:border-accent/30 transition-all duration-300">
        {/* Image */}
        <div className="relative h-36 overflow-hidden">
          {certification.image ? (
            <img
              src={certification.image}
              alt={certification.title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-accent/20 to-primary/20 flex items-center justify-center">
              <FaAward size={40} className="text-accent/40" />
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-card/90 via-transparent to-transparent" />

          {/* Badge */}
          <div className="absolute top-3 right-3">
            <div className="p-2 rounded-lg bg-background/80 backdrop-blur-sm">
              <FaAward className="text-yellow-500" size={16} />
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          <h3 className="font-semibold text-base mb-1 text-foreground line-clamp-2 group-hover:text-accent transition-colors">
            {certification.title}
          </h3>
          <p className="text-sm text-muted-foreground mb-3">
            {certification.issuer}
          </p>

          {/* Date and link */}
          <div className="flex items-center justify-between pt-3 border-t border-border/50">
            <span className="text-xs text-muted-foreground flex items-center gap-1.5">
              <FaCalendar size={10} className="text-accent/60" />
              {new Date(certification.date).toLocaleDateString("en-US", {
                month: "short",
                year: "numeric",
              })}
            </span>

            {certification.credential_url && (
              <a
                href={certification.credential_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-accent hover:text-accent/80 flex items-center gap-1.5 text-xs font-medium group/link"
              >
                Verify 
                <FaExternalLinkAlt 
                  size={10} 
                  className="group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-transform" 
                />
              </a>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default Certifications;
