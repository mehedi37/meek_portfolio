"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Button, Spinner, Avatar } from "@heroui/react";
import {
  FaHome,
  FaCode,
  FaBriefcase,
  FaCertificate,
  FaBlog,
  FaImages,
  FaCog,
  FaSignOutAlt,
  FaBars,
  FaTimes,
  FaUser,
  FaAward,
  FaUserCircle,
  FaTags,
} from "react-icons/fa";

interface User {
  username: string;
  role: string;
}

const navItems = [
  { href: "/admin/dashboard", label: "Dashboard", icon: FaHome },
  { href: "/admin/dashboard/profile", label: "Profile", icon: FaUserCircle },
  { href: "/admin/dashboard/skills", label: "Skills", icon: FaCode },
  { href: "/admin/dashboard/categories", label: "Categories", icon: FaTags },
  { href: "/admin/dashboard/projects", label: "Projects", icon: FaBriefcase },
  { href: "/admin/dashboard/experience", label: "Experience", icon: FaBriefcase },
  { href: "/admin/dashboard/certifications", label: "Certifications", icon: FaAward },
  { href: "/admin/dashboard/blog", label: "Blog Posts", icon: FaBlog },
  { href: "/admin/dashboard/images", label: "Media", icon: FaImages },
  { href: "/admin/dashboard/settings", label: "Settings", icon: FaCog },
];

export default function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const response = await fetch("/api/admin/session");
      const data = await response.json();

      if (!data.authenticated) {
        router.push("/admin/login");
        return;
      }

      setUser(data.user);
    } catch {
      router.push("/admin/login");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await fetch("/api/admin/logout", { method: "POST" });
      router.push("/admin/login");
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setLoggingOut(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile sidebar overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 z-50 h-full w-64 bg-surface border-r border-border
          transform transition-transform duration-300 ease-in-out
          lg:translate-x-0
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-between p-4 border-b border-border">
            <Link href="/admin/dashboard" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center">
                <span className="text-white font-bold text-sm">A</span>
              </div>
              <span className="font-bold text-lg">Admin Panel</span>
            </Link>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden text-muted hover:text-foreground"
              title="Close sidebar"
            >
              <FaTimes className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto p-4">
            <ul className="space-y-1">
              {navItems.map((item) => {
                const isActive = pathname === item.href;
                const Icon = item.icon;

                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      onClick={() => setSidebarOpen(false)}
                      className={`
                        flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all
                        ${
                          isActive
                            ? "bg-accent text-white"
                            : "text-muted hover:bg-surface-secondary hover:text-foreground"
                        }
                      `}
                    >
                      <Icon className="w-4 h-4" />
                      <span className="font-medium">{item.label}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* User info & Logout */}
          <div className="p-4 border-t border-border">
            <div className="flex items-center gap-3 mb-4">
              <Avatar className="w-10 h-10">
                <Avatar.Fallback className="bg-accent/10 text-accent">
                  <FaUser className="w-4 h-4" />
                </Avatar.Fallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm truncate">
                  {user?.username || "Admin"}
                </p>
                <p className="text-xs text-muted capitalize">
                  {user?.role || "Administrator"}
                </p>
              </div>
            </div>
            <Button
              variant="secondary"
              className="w-full"
              onPress={handleLogout}
              isPending={loggingOut}
            >
              {({ isPending }) => (
                <>
                  {isPending ? (
                    <Spinner color="current" size="sm" />
                  ) : (
                    <FaSignOutAlt className="w-4 h-4" />
                  )}
                  {isPending ? "Signing out..." : "Sign Out"}
                </>
              )}
            </Button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Header */}
        <header className="sticky top-0 z-30 bg-background/80 backdrop-blur-md border-b border-border">
          <div className="flex items-center justify-between px-4 py-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 text-muted hover:text-foreground"
              title="Open sidebar"
            >
              <FaBars className="w-5 h-5" />
            </button>
            <div className="flex-1" />
            <Link
              href="/"
              target="_blank"
              className="text-sm text-muted hover:text-foreground transition-colors"
            >
              View Site →
            </Link>
          </div>
        </header>

        {/* Page content */}
        <main className="p-4 sm:p-6 lg:p-8">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {children}
          </motion.div>
        </main>
      </div>
    </div>
  );
}
