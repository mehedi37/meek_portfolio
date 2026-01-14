"use client";

import { useState, useRef } from "react";
import { motion, useInView } from "framer-motion";
import Link from "next/link";
import {
  Button,
  Chip,
  Card,
  Form,
  TextField,
  Label,
  Input,
  TextArea,
  FieldError,
  Description,
  Separator
} from "@heroui/react";
import {
  HiMail,
  HiLocationMarker,
  HiPhone,
  HiSparkles,
  HiPaperAirplane,
  HiCheck,
  HiExclamation
} from "react-icons/hi";
import { FaGithub, FaLinkedin, FaTwitter } from "react-icons/fa";
import type { ContactFormData } from "@/types";
import type { SiteProfile, SocialLink } from "@/lib/supabase/types";
import { IconRenderer } from "@/components/admin/IconSearch";

interface ContactProps {
  className?: string;
  profile?: SiteProfile | null;
  socialLinks?: SocialLink[];
}

/**
 * Contact Section - Modern form with HeroUI components
 */
export function Contact({ className = "", profile, socialLinks = [] }: ContactProps) {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  // Extract profile data with fallbacks
  const email = profile?.email || "your.email@example.com";
  const location = profile?.location || "Remote Worldwide";
  const isAvailable = profile?.status_color === "success" ? true : false;

  // Build contact info dynamically
  const contactInfo = [
    {
      icon: HiMail,
      label: "Email",
      value: email,
      href: `mailto:${email}`,
    },
    {
      icon: HiLocationMarker,
      label: "Location",
      value: location,
      href: null,
    },
    {
      icon: HiPhone,
      label: "Response Time",
      value: "Within 24 hours",
      href: null,
    },
  ];

  const [formData, setFormData] = useState<ContactFormData>({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus("idle");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error("Failed to send message");

      setSubmitStatus("success");
      setFormData({ name: "", email: "", subject: "", message: "" });
    } catch {
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section
      ref={sectionRef}
      id="contact"
      className={`relative py-24 lg:py-32 overflow-hidden ${className}`}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <Chip color="accent" variant="soft" className="mb-6 gap-2">
            <HiSparkles className="w-4 h-4" />
            Get In Touch
          </Chip>
          <h2 className="text-4xl lg:text-5xl font-bold mb-4">
            Let&apos;s Work Together
          </h2>
          <p className="text-lg text-muted max-w-2xl mx-auto text-balance">
            Have a project in mind or just want to chat? I&apos;d love to hear from you.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Contact Info - Left Side */}
          <motion.div
            className="lg:col-span-2 space-y-6"
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            {/* Info Cards */}
            <Card variant="secondary" className="p-6">
              <Card.Content className="space-y-4 p-0">
                {contactInfo.map((info, index) => (
                  <motion.div
                    key={info.label}
                    className="flex items-center gap-4 p-3 rounded-lg hover:bg-default/50 transition-colors group"
                    initial={{ opacity: 0, y: 20 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ delay: 0.3 + index * 0.1, duration: 0.5 }}
                  >
                    <div className="w-12 h-12 rounded-xl bg-default flex items-center justify-center group-hover:bg-accent group-hover:text-white transition-colors">
                      <info.icon className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs text-muted uppercase tracking-wide">
                        {info.label}
                      </p>
                      {info.href ? (
                        <a
                          href={info.href}
                          className="text-sm font-medium hover:text-accent transition-colors"
                        >
                          {info.value}
                        </a>
                      ) : (
                        <p className="text-sm font-medium">{info.value}</p>
                      )}
                    </div>
                  </motion.div>
                ))}
              </Card.Content>
            </Card>

            {/* Social Links */}
            <Card variant="tertiary" className="p-6">
              <Card.Header className="p-0 pb-4">
                <Card.Title className="text-sm font-medium text-muted uppercase tracking-wider">
                  Connect with me
                </Card.Title>
              </Card.Header>
              <Card.Content className="p-0">
                <div className="flex gap-3">
                  {socialLinks.length > 0 ? (
                    socialLinks.map((social) => (
                      <a
                        key={social.id}
                        href={social.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={social.platform}
                        className="inline-flex items-center justify-center h-12 w-12 rounded-lg border border-border/50 hover:bg-accent/10 hover:text-accent hover:border-accent/50 transition-all duration-200"
                      >
                        {social.icon ? (
                          <IconRenderer name={social.icon} className="w-5 h-5" />
                        ) : social.platform.toLowerCase() === "github" ? (
                          <FaGithub className="w-5 h-5" />
                        ) : social.platform.toLowerCase() === "linkedin" ? (
                          <FaLinkedin className="w-5 h-5" />
                        ) : social.platform.toLowerCase() === "twitter" ? (
                          <FaTwitter className="w-5 h-5" />
                        ) : null}
                      </a>
                    ))
                  ) : (
                    <>
                      <a
                        href="#"
                        aria-label="GitHub"
                        className="inline-flex items-center justify-center h-12 w-12 rounded-lg border border-border/50 hover:bg-accent/10 hover:text-accent hover:border-accent/50 transition-all duration-200"
                      >
                        <FaGithub className="w-5 h-5" />
                      </a>
                      <a
                        href="#"
                        aria-label="LinkedIn"
                        className="inline-flex items-center justify-center h-12 w-12 rounded-lg border border-border/50 hover:bg-accent/10 hover:text-accent hover:border-accent/50 transition-all duration-200"
                      >
                        <FaLinkedin className="w-5 h-5" />
                      </a>
                      <a
                        href="#"
                        aria-label="Twitter"
                        className="inline-flex items-center justify-center h-12 w-12 rounded-lg border border-border/50 hover:bg-accent/10 hover:text-accent hover:border-accent/50 transition-all duration-200"
                      >
                        <FaTwitter className="w-5 h-5" />
                      </a>
                    </>
                  )}
                </div>
              </Card.Content>
            </Card>

            {/* Availability Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.6, duration: 0.5 }}
            >
              <Card variant="default" className="p-6">
                <Card.Content className="space-y-3 p-0">
                  <div className="flex items-center gap-3">
                    <span className="relative flex h-3 w-3">
                      <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${isAvailable ? 'bg-success' : 'bg-default'} opacity-75`} />
                      <span className={`relative inline-flex rounded-full h-3 w-3 ${isAvailable ? 'bg-success' : 'bg-default'}`} />
                    </span>
                    <span className="text-sm font-medium">
                      {isAvailable ? "Available for work" : "Currently unavailable"}
                    </span>
                  </div>
                  <p className="text-sm text-muted">
                    {isAvailable
                      ? "Currently accepting new projects and collaborations. Let's build something amazing together!"
                      : "Not taking on new projects at the moment. Feel free to reach out for future opportunities."}
                  </p>
                </Card.Content>
              </Card>
            </motion.div>
          </motion.div>

          {/* Contact Form - Right Side */}
          <motion.div
            className="lg:col-span-3"
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            <Card variant="default" className="p-6 sm:p-8">
              <Card.Content className="p-0">
                <Form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {/* Name */}
                    <TextField
                      isRequired
                      name="name"
                      value={formData.name}
                      onChange={(value) => setFormData(prev => ({ ...prev, name: value }))}
                    >
                      <Label>Name</Label>
                      <Input placeholder="Your name" />
                      <FieldError />
                    </TextField>

                    {/* Email */}
                    <TextField
                      isRequired
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={(value) => setFormData(prev => ({ ...prev, email: value }))}
                      validate={(value) => {
                        if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(value)) {
                          return "Please enter a valid email";
                        }
                        return null;
                      }}
                    >
                      <Label>Email</Label>
                      <Input placeholder="your@email.com" />
                      <FieldError />
                    </TextField>
                  </div>

                  {/* Subject */}
                  <TextField
                    isRequired
                    name="subject"
                    fullWidth
                    value={formData.subject}
                    onChange={(value) => setFormData(prev => ({ ...prev, subject: value }))}
                  >
                    <Label>Subject</Label>
                    <Input placeholder="What's this about?" />
                    <FieldError />
                  </TextField>

                  {/* Message */}
                  <TextField
                    isRequired
                    name="message"
                    fullWidth
                    value={formData.message}
                    onChange={(value) => setFormData(prev => ({ ...prev, message: value }))}
                  >
                    <Label>Message</Label>
                    <TextArea
                      rows={5}
                      placeholder="Tell me about your project..."
                    />
                    <Description>Min 20 characters</Description>
                    <FieldError />
                  </TextField>

                  <Separator />

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    fullWidth
                    isPending={isSubmitting}
                  >
                    {isSubmitting ? (
                      "Sending..."
                    ) : submitStatus === "success" ? (
                      <>
                        <HiCheck className="w-5 h-5 mr-2" />
                        Message Sent!
                      </>
                    ) : submitStatus === "error" ? (
                      <>
                        <HiExclamation className="w-5 h-5 mr-2" />
                        Try Again
                      </>
                    ) : (
                      <>
                        Send Message
                        <HiPaperAirplane className="w-5 h-5 ml-2" />
                      </>
                    )}
                  </Button>

                  {/* Status Messages */}
                  {submitStatus === "success" && (
                    <motion.p
                      className="text-sm text-success text-center"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      Thank you! I&apos;ll get back to you soon.
                    </motion.p>
                  )}
                  {submitStatus === "error" && (
                    <motion.p
                      className="text-sm text-danger text-center"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      Something went wrong. Please try again or email me directly.
                    </motion.p>
                  )}
                </Form>
              </Card.Content>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
