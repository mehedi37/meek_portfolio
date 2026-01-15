"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Card, Chip, Link, Input, SearchField } from "@heroui/react";
import type { Certification } from "@/lib/supabase/types";
import {
  FaExternalLinkAlt,
  FaAward,
  FaCalendar,
  FaSearch,
} from "react-icons/fa";
import { FadeInSection } from "@/components/animations";

interface CertificationsListClientProps {
  certifications: Certification[];
}

export function CertificationsListClient({
  certifications,
}: CertificationsListClientProps) {
  const [searchQuery, setSearchQuery] = useState("");

  // Filter certifications based on search
  const filteredCertifications = certifications.filter(
    (cert) =>
      cert.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cert.issuer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      {/* Header */}
      <FadeInSection>
        <div className="text-center mb-12">
          <Chip color="accent" variant="soft" className="mb-6 gap-2">
            <FaAward className="w-3 h-3" />
            Certifications
          </Chip>
          <h1 className="text-4xl lg:text-5xl font-bold mb-4">
            Professional Credentials
          </h1>
          <p className="text-lg text-muted max-w-2xl mx-auto text-balance mb-8">
            Industry-recognized certifications that validate my expertise in
            modern technologies and best practices.
          </p>

          {/* Search */}
          <div className="max-w-md mx-auto">
            <SearchField name="Search certificates" onClear={() => setSearchQuery("")} value={searchQuery}>
              <SearchField.Group>
                <SearchField.SearchIcon />
                <SearchField.Input
                  placeholder="Search certifications..."
                  className="w-72"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <SearchField.ClearButton />
              </SearchField.Group>
            </SearchField>
          </div>
        </div>
      </FadeInSection>

      {/* Results count */}
      <div className="mb-8">
        <p className="text-sm text-muted text-center">
          Showing {filteredCertifications.length} of {certifications.length}{" "}
          certifications
        </p>
      </div>

      {/* Certifications Grid */}
      {filteredCertifications.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredCertifications.map((cert, index) => (
            <FadeInSection key={cert.id} delay={index * 0.05}>
              <motion.div whileHover={{ y: -4 }} className="h-full">
                <Card
                  variant="default"
                  className="h-full overflow-hidden group hover:scale-[1.02] transition-transform"
                >
                  {/* Image */}
                  <div className="relative h-36 overflow-hidden">
                    {cert.image ? (
                      <img
                        src={cert.image}
                        alt={cert.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="w-full h-full bg-default flex items-center justify-center">
                        <FaAward size={40} className="text-muted" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-surface via-transparent to-transparent" />

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
                      {cert.title}
                    </h3>
                    <p className="text-sm text-muted">{cert.issuer}</p>

                    {/* Date and link */}
                    <div className="flex items-center justify-between pt-3 border-t border-separator">
                      <span className="text-xs text-muted flex items-center gap-1.5">
                        <FaCalendar size={10} />
                        {new Date(cert.date).toLocaleDateString("en-US", {
                          month: "short",
                          year: "numeric",
                        })}
                      </span>

                      {cert.credential_url && (
                        <Link
                          href={cert.credential_url}
                          target="_blank"
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
            </FadeInSection>
          ))}
        </div>
      ) : (
        <FadeInSection>
          <div className="text-center py-16">
            <p className="text-muted text-lg">
              No certifications found matching your search.
            </p>
          </div>
        </FadeInSection>
      )}
    </>
  );
}
