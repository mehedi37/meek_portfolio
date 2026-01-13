"use client";

import Link from "next/link";
import { Button } from "@heroui/react";
import { FadeInSection } from "@/components/animations";
import { FaHome, FaArrowLeft } from "react-icons/fa";

/**
 * Custom 404 page with animations
 */
export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <FadeInSection className="text-center">
        <div className="mb-8">
          <span className="text-9xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-accent to-primary">
            404
          </span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-bold mb-4">
          Page Not Found
        </h1>

        <p className="text-lg text-muted-foreground max-w-md mx-auto mb-8">
          Oops! The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/">
            <Button variant="primary" size="lg">
              <FaHome className="mr-2" />
              Go Home
            </Button>
          </Link>

          <Button
            variant="secondary"
            size="lg"
            onPress={() => window.history.back()}
          >
            <FaArrowLeft className="mr-2" />
            Go Back
          </Button>
        </div>
      </FadeInSection>
    </div>
  );
}
