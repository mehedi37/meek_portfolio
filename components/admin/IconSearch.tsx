"use client";

import { useState, useMemo, useCallback, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, Input, Button } from "@heroui/react";
import { HiSearch, HiX } from "react-icons/hi";

// Import all common icon libraries
import * as FaIcons from "react-icons/fa";
import * as HiIcons from "react-icons/hi";
import * as SiIcons from "react-icons/si";
import * as BiIcons from "react-icons/bi";
import * as AiIcons from "react-icons/ai";

// Icon library mapping
const iconLibraries = {
  fa: { icons: FaIcons, prefix: "Fa", name: "Font Awesome" },
  hi: { icons: HiIcons, prefix: "Hi", name: "Hero Icons" },
  si: { icons: SiIcons, prefix: "Si", name: "Simple Icons" },
  bi: { icons: BiIcons, prefix: "Bi", name: "Box Icons" },
  ai: { icons: AiIcons, prefix: "Ai", name: "Ant Design" },
};

// Common tech/development icons for quick access
const commonIcons = [
  // Languages & Frameworks
  "FaReact", "FaVuejs", "FaAngular", "FaNodeJs", "FaPython", "FaJava",
  "FaPhp", "FaSwift", "FaRust", "FaDocker", "FaAws", "FaGithub",
  "SiTypescript", "SiJavascript", "SiNextdotjs", "SiTailwindcss",
  "SiPostgresql", "SiMongodb", "SiRedis", "SiGraphql", "SiFirebase",
  "SiVercel", "SiNetlify", "SiSupabase", "SiPrisma", "SiFigma",
  // UI/Design
  "HiCode", "HiServer", "HiDatabase", "HiCloud", "HiCog", "HiLightningBolt",
  "HiGlobe", "HiDesktopComputer", "HiDeviceMobile", "HiPuzzle",
  // Social
  "FaLinkedin", "FaTwitter", "FaInstagram", "FaYoutube", "FaDiscord",
  "FaMedium", "FaDev", "FaStackOverflow", "FaGitlab", "FaBitbucket",
];

interface IconSearchProps {
  value: string;
  onChange: (iconName: string) => void;
  onClose?: () => void;
  className?: string;
}

// Get icon component by name
export function getIconComponent(iconName: string): React.ComponentType<{ className?: string }> | null {
  if (!iconName) return null;

  // Determine library prefix
  const prefix = iconName.substring(0, 2);
  const library = Object.values(iconLibraries).find((lib) => lib.prefix === prefix);

  if (library) {
    const IconComponent = (library.icons as Record<string, any>)[iconName];
    return IconComponent || null;
  }

  return null;
}

// Render icon by name
export function IconRenderer({
  name,
  className = "w-5 h-5"
}: {
  name: string;
  className?: string;
}) {
  const IconComponent = getIconComponent(name);
  if (!IconComponent) return null;
  return <IconComponent className={className} />;
}

export function IconSearch({ value, onChange, onClose, className = "" }: IconSearchProps) {
  const [search, setSearch] = useState("");
  const [activeLibrary, setActiveLibrary] = useState<string>("all");
  const [isOpen, setIsOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Get all icons from selected library or all libraries
  const allIcons = useMemo(() => {
    const icons: { name: string; library: string }[] = [];

    if (activeLibrary === "all" || activeLibrary === "common") {
      // Common icons first
      commonIcons.forEach((name) => {
        icons.push({ name, library: "common" });
      });
    }

    if (activeLibrary === "all") {
      // Add all icons from all libraries
      Object.entries(iconLibraries).forEach(([key, lib]) => {
        Object.keys(lib.icons).forEach((iconName) => {
          if (iconName.startsWith(lib.prefix) && !commonIcons.includes(iconName)) {
            icons.push({ name: iconName, library: key });
          }
        });
      });
    } else if (activeLibrary !== "common") {
      const lib = iconLibraries[activeLibrary as keyof typeof iconLibraries];
      if (lib) {
        Object.keys(lib.icons).forEach((iconName) => {
          if (iconName.startsWith(lib.prefix)) {
            icons.push({ name: iconName, library: activeLibrary });
          }
        });
      }
    }

    return icons;
  }, [activeLibrary]);

  // Filter icons based on search
  const filteredIcons = useMemo(() => {
    if (!search.trim()) {
      return allIcons.slice(0, 100); // Limit initial display
    }

    const searchLower = search.toLowerCase();
    return allIcons
      .filter((icon) => icon.name.toLowerCase().includes(searchLower))
      .slice(0, 100);
  }, [allIcons, search]);

  const handleSelect = useCallback(
    (iconName: string) => {
      onChange(iconName);
      setIsOpen(false);
      setSearch("");
    },
    [onChange]
  );

  const SelectedIcon = value ? getIconComponent(value) : null;

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      {/* Selected Icon Display / Trigger */}
      <div
        className="flex items-center gap-2 p-2 rounded-lg bg-default border border-separator cursor-pointer hover:bg-surface transition-colors"
        onClick={() => setIsOpen(!isOpen)}
      >
        {SelectedIcon ? (
          <>
            <SelectedIcon className="w-6 h-6 text-accent" />
            <span className="flex-1 text-sm font-mono">{value}</span>
          </>
        ) : (
          <>
            <HiSearch className="w-4 h-4 text-muted" />
            <span className="flex-1 text-sm text-muted">Search for an icon...</span>
          </>
        )}
        {value && (
          <Button
            size="sm"
            variant="ghost"
            onPress={() => {
              onChange("");
              setIsOpen(false);
            }}
            className="p-1"
          >
            <HiX className="w-4 h-4" />
          </Button>
        )}
      </div>

      {/* Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute z-50 top-full left-0 right-0 mt-2"
          >
            <Card variant="default" className="p-2 shadow-xl max-h-96 overflow-hidden flex flex-col">
              {/* Search Input */}
              <div>
                <Input
                  ref={inputRef}
                  type="text"
                  placeholder="Search icons..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full"
                  autoFocus
                />
              </div>

              {/* Library Tabs */}
              <div className="flex flex-wrap gap-1 mb-0">
                <Button
                  size="sm"
                  variant={activeLibrary === "all" ? "primary" : "ghost"}
                  onPress={() => setActiveLibrary("all")}
                >
                  All
                </Button>
                <Button
                  size="sm"
                  variant={activeLibrary === "common" ? "primary" : "ghost"}
                  onPress={() => setActiveLibrary("common")}
                >
                  Common
                </Button>
                {Object.entries(iconLibraries).map(([key, lib]) => (
                  <Button
                    key={key}
                    size="sm"
                    variant={activeLibrary === key ? "primary" : "ghost"}
                    onPress={() => setActiveLibrary(key)}
                  >
                    {lib.prefix}
                  </Button>
                ))}
              </div>

              {/* Icon Grid */}
              <div className="flex-1 overflow-y-auto">
                <div className="grid grid-cols-6 sm:grid-cols-8 gap-1">
                  {filteredIcons.map((icon) => {
                    const IconComponent = getIconComponent(icon.name);
                    if (!IconComponent) return null;

                    return (
                      <motion.button
                        key={icon.name}
                        type="button"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleSelect(icon.name)}
                        className={`p-2 rounded-lg flex items-center justify-center transition-colors ${
                          value === icon.name
                            ? "bg-accent text-white"
                            : "hover:bg-surface"
                        }`}
                        title={icon.name}
                      >
                        <IconComponent className="w-5 h-5" />
                      </motion.button>
                    );
                  })}
                </div>

                {filteredIcons.length === 0 && (
                  <div className="text-center py-8 text-muted">
                    No icons found for "{search}"
                  </div>
                )}
              </div>

              {/* Selected Icon Preview */}
              {value && (
                <div className="mt-3 pt-3 border-t border-separator flex items-center gap-3">
                  <span className="text-sm text-muted">Selected:</span>
                  <code className="text-sm bg-surface px-2 py-1 rounded">{value}</code>
                </div>
              )}
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default IconSearch;
