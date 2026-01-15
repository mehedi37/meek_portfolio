import type { Metadata } from "next";
import { Container } from "@/components/layout/Container";
import { CertificationsListClient } from "@/components/certifications/CertificationsListClient";
import { getCertifications } from "@/lib/supabase/data";

export const metadata: Metadata = {
  title: "Certifications | Professional Credentials",
  description: "Industry-recognized certifications that validate expertise in modern technologies and best practices.",
  openGraph: {
    title: "Certifications | Professional Credentials",
    description: "Industry-recognized certifications that validate expertise in modern technologies and best practices.",
  },
};

export const dynamic = 'force-dynamic';

export default async function CertificationsPage() {
  const certifications = await getCertifications();

  return (
    <div className="min-h-screen pt-32 pb-16">
      <Container>
        <CertificationsListClient certifications={certifications} />
      </Container>
    </div>
  );
}
