import { getSiteProfile, getSocialLinks } from "@/lib/supabase/data";
import { FooterClient } from "./FooterClient";

/**
 * Server-side Footer wrapper
 * Fetches site profile and social links from database
 */
export async function Footer({ className = "" }: { className?: string }) {
  // Fetch data in parallel
  const [profile, socialLinks] = await Promise.all([
    getSiteProfile(),
    getSocialLinks(),
  ]);

  return (
    <FooterClient
      className={className}
      profile={profile}
      socialLinks={socialLinks}
    />
  );
}
