"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Card, Chip, Link } from "@heroui/react";
import type { Certification } from "@/lib/supabase/types";
import { FaExternalLinkAlt, FaAward, FaCertificate, FaCalendar } from "react-icons/fa";

// Demo certifications using Supabase Certification type with snake_case field names
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

interface CertificationCardProps {
  certification: Certification;
  index: number;
}

function CertificationCard({ certification, index }: CertificationCardProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      whileHover={{ y: -4 }}
      className="h-full"
    >
      <Card variant="default" className="h-full overflow-hidden group hover:scale-[1.02] transition-transform">
        {/* Image */}
        <div className="relative h-36 overflow-hidden">
          {certification.image ? (
            <img
              src={certification.image}
              alt={certification.title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-full bg-default flex items-center justify-center">
              <FaAward size={40} className="text-muted" />
            </div>
          )}
          <div className="absolute inset-0 bg-linear-to-t from-surface via-transparent to-transparent" />

          {/* Badge */}
          <div className="absolute top-3 right-3">
            <div className="p-2 rounded-lg bg-background/80 backdrop-blur-sm">
              <FaAward className="text-warning" size={16} />
            </div>
          </div>
        </div>

        {/* Content */}
        <Card.Content className="p-4 space-y-2">
          <h3 className="font-semibold text-base line-clamp-2 group-hover:text-accent transition-colors">
            {certification.title}
          </h3>
          <p className="text-sm text-muted">
            {certification.issuer}
          </p>

          {/* Date and link */}
          <div className="flex items-center justify-between pt-3 border-t border-separator">
            <span className="text-xs text-muted flex items-center gap-1.5">
              <FaCalendar size={10} />
              {new Date(certification.date).toLocaleDateString("en-US", {
                month: "short",
                year: "numeric",
              })}
            </span>

            {certification.credential_url && (
              <Link
                href={certification.credential_url}
                isExternal
                className="text-accent text-xs font-medium flex items-center gap-1.5 group/link"
              >
                Verify
                <FaExternalLinkAlt
                  size={10}
                  className="group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-transform"
                />
              </Link>
            )}
          </div>
        </Card.Content>
      </Card>
    </motion.div>
  );
}

/**
 * Certifications section displaying professional credentials
 * Each certification links to verification page
 */
export function Certifications({
  className = "",
  certifications = DEMO_CERTIFICATIONS,
}: CertificationsProps) {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  return (
    <section
      ref={sectionRef}
      id="certifications"
      className={`relative py-24 lg:py-32 overflow-hidden bg-background ${className}`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <Chip color="accent" variant="soft" className="mb-6 gap-2">
            <FaCertificate className="w-3 h-3" />
            Certifications
          </Chip>
          <h2 className="text-4xl lg:text-5xl font-bold mb-4">
            Professional Credentials
          </h2>
          <p className="text-lg text-muted max-w-2xl mx-auto text-balance">
            Industry-recognized certifications that validate my expertise
            in modern technologies and best practices.
          </p>
        </motion.div>

        {/* Certifications Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {certifications.map((cert, index) => (
            <CertificationCard
              key={cert.id}
              certification={cert}
              index={index}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

export default Certifications;
