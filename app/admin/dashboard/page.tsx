"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Card, Spinner } from "@heroui/react";
import { motion } from "framer-motion";
import {
  FaCode,
  FaBriefcase,
  FaCertificate,
  FaBlog,
  FaEye,
  FaPlus,
} from "react-icons/fa";
import { createClient } from "@/lib/supabase/client";

interface Stats {
  skills: number;
  projects: number;
  experiences: number;
  contacts: number;
}

const quickActions = [
  {
    href: "/admin/dashboard/skills",
    label: "Add Skill",
    icon: FaCode,
    color: "bg-blue-500",
  },
  {
    href: "/admin/dashboard/projects",
    label: "Add Project",
    icon: FaBriefcase,
    color: "bg-green-500",
  },
  {
    href: "/admin/dashboard/experience",
    label: "Add Experience",
    icon: FaCertificate,
    color: "bg-purple-500",
  },
  {
    href: "/admin/dashboard/blog",
    label: "New Post",
    icon: FaBlog,
    color: "bg-orange-500",
  },
];

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const [
        { count: skillsCount },
        { count: projectsCount },
        { count: experiencesCount },
        { count: contactsCount },
      ] = await Promise.all([
        supabase.from("skills").select("*", { count: "exact", head: true }),
        supabase.from("projects").select("*", { count: "exact", head: true }),
        supabase.from("experiences").select("*", { count: "exact", head: true }),
        supabase.from("contacts").select("*", { count: "exact", head: true }),
      ]);

      setStats({
        skills: skillsCount || 0,
        projects: projectsCount || 0,
        experiences: experiencesCount || 0,
        contacts: contactsCount || 0,
      });
    } catch (error) {
      console.error("Error fetching stats:", error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      label: "Skills",
      value: stats?.skills || 0,
      icon: FaCode,
      href: "/admin/dashboard/skills",
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
    },
    {
      label: "Projects",
      value: stats?.projects || 0,
      icon: FaBriefcase,
      href: "/admin/dashboard/projects",
      color: "text-green-500",
      bgColor: "bg-green-500/10",
    },
    {
      label: "Experiences",
      value: stats?.experiences || 0,
      icon: FaCertificate,
      href: "/admin/dashboard/experience",
      color: "text-purple-500",
      bgColor: "bg-purple-500/10",
    },
    {
      label: "Messages",
      value: stats?.contacts || 0,
      icon: FaEye,
      href: "/admin/dashboard/settings",
      color: "text-orange-500",
      bgColor: "bg-orange-500/10",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold">Dashboard</h1>
        <p className="text-muted mt-1">
          Welcome back! Here&apos;s an overview of your portfolio.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {loading
          ? Array(4)
              .fill(0)
              .map((_, i) => (
                <Card key={i} className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-muted/20 animate-pulse" />
                    <div className="flex-1">
                      <div className="h-4 w-16 bg-muted/20 rounded animate-pulse mb-2" />
                      <div className="h-6 w-10 bg-muted/20 rounded animate-pulse" />
                    </div>
                  </div>
                </Card>
              ))
          : statCards.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Link href={stat.href}>
                    <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer group">
                      <div className="flex items-center gap-4">
                        <div
                          className={`w-12 h-12 rounded-xl ${stat.bgColor} flex items-center justify-center group-hover:scale-110 transition-transform`}
                        >
                          <Icon className={`w-5 h-5 ${stat.color}`} />
                        </div>
                        <div>
                          <p className="text-sm text-muted">{stat.label}</p>
                          <p className="text-2xl font-bold">{stat.value}</p>
                        </div>
                      </div>
                    </Card>
                  </Link>
                </motion.div>
              );
            })}
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {quickActions.map((action, index) => {
            const Icon = action.icon;
            return (
              <motion.div
                key={action.label}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 + index * 0.1 }}
              >
                <Link href={action.href}>
                  <Card className="p-4 hover:shadow-lg transition-all cursor-pointer group text-center">
                    <div
                      className={`w-12 h-12 rounded-xl ${action.color} mx-auto flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}
                    >
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex items-center justify-center gap-1.5">
                      <FaPlus className="w-3 h-3 text-muted" />
                      <span className="text-sm font-medium">{action.label}</span>
                    </div>
                  </Card>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Recent Activity */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Getting Started</h2>
        <Card className="p-6">
          <div className="space-y-4">
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0">
                <span className="text-sm font-bold text-accent">1</span>
              </div>
              <div>
                <h3 className="font-medium">Add Your Skills</h3>
                <p className="text-sm text-muted">
                  Start by adding your technical skills with proficiency levels.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0">
                <span className="text-sm font-bold text-accent">2</span>
              </div>
              <div>
                <h3 className="font-medium">Showcase Projects</h3>
                <p className="text-sm text-muted">
                  Add your best projects with images, descriptions, and links.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0">
                <span className="text-sm font-bold text-accent">3</span>
              </div>
              <div>
                <h3 className="font-medium">Document Experience</h3>
                <p className="text-sm text-muted">
                  Add your work experience and certifications.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0">
                <span className="text-sm font-bold text-accent">4</span>
              </div>
              <div>
                <h3 className="font-medium">Write Blog Posts</h3>
                <p className="text-sm text-muted">
                  Share your knowledge through blog posts.
                </p>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
