"use client";

import { useEffect, useState } from "react";
import {
  Button,
  Card,
  TextField,
  Input,
  Label,
  TextArea,
  Description,
  Spinner,
} from "@heroui/react";
import { FaSave, FaGlobe, FaUser, FaEnvelope, FaGithub, FaLinkedin, FaTwitter } from "react-icons/fa";
import { createClient } from "@/lib/supabase/client";

interface SiteSettings {
  name: string;
  title: string;
  description: string;
  email: string;
  github: string;
  linkedin: string;
  twitter: string;
  resume_url: string;
}

const STORAGE_KEY = "admin_site_settings";

const defaultSettings: SiteSettings = {
  name: "Mehedi Hasan Maruf",
  title: "Full Stack Developer",
  description: "Passionate developer building modern web applications",
  email: "contact@example.com",
  github: "https://github.com/username",
  linkedin: "https://linkedin.com/in/username",
  twitter: "https://twitter.com/username",
  resume_url: "",
};

export default function SettingsPage() {
  const [settings, setSettings] = useState<SiteSettings>(defaultSettings);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [contacts, setContacts] = useState<unknown[]>([]);
  const [loadingContacts, setLoadingContacts] = useState(true);

  const supabase = createClient();

  useEffect(() => {
    loadSettings();
    loadContacts();
  }, []);

  const loadSettings = () => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setSettings(JSON.parse(stored));
      }
    } catch (error) {
      console.error("Error loading settings:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadContacts = async () => {
    try {
      const { data, error } = await supabase
        .from("contacts")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(10);

      if (error) throw error;
      setContacts(data || []);
    } catch (error) {
      console.error("Error loading contacts:", error);
    } finally {
      setLoadingContacts(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (error) {
      console.error("Error saving settings:", error);
      alert("Failed to save settings");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-4xl">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold">Settings</h1>
        <p className="text-muted mt-1">
          Configure your site settings and social links.
        </p>
      </div>

      {/* Personal Info */}
      <Card className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
            <FaUser className="w-5 h-5 text-accent" />
          </div>
          <div>
            <h2 className="font-semibold">Personal Information</h2>
            <p className="text-sm text-muted">Basic info displayed on your portfolio</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <TextField
            name="name"
            value={settings.name}
            onChange={(value) => setSettings((prev) => ({ ...prev, name: value }))}
          >
            <Label>Full Name</Label>
            <Input placeholder="Your name" />
          </TextField>

          <TextField
            name="title"
            value={settings.title}
            onChange={(value) => setSettings((prev) => ({ ...prev, title: value }))}
          >
            <Label>Professional Title</Label>
            <Input placeholder="e.g., Full Stack Developer" />
          </TextField>
        </div>

        <div className="mt-4">
          <TextField
            name="description"
            value={settings.description}
            onChange={(value) => setSettings((prev) => ({ ...prev, description: value }))}
          >
            <Label>Bio / Description</Label>
            <TextArea placeholder="Brief description about yourself" rows={3} />
            <Description>This appears in the hero section and meta tags</Description>
          </TextField>
        </div>
      </Card>

      {/* Contact & Social */}
      <Card className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
            <FaGlobe className="w-5 h-5 text-accent" />
          </div>
          <div>
            <h2 className="font-semibold">Contact & Social Links</h2>
            <p className="text-sm text-muted">Your social media and contact information</p>
          </div>
        </div>

        <div className="space-y-4">
          <TextField
            name="email"
            type="email"
            value={settings.email}
            onChange={(value) => setSettings((prev) => ({ ...prev, email: value }))}
          >
            <Label className="flex items-center gap-2">
              <FaEnvelope className="w-4 h-4" />
              Email Address
            </Label>
            <Input placeholder="contact@example.com" />
          </TextField>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <TextField
              name="github"
              value={settings.github}
              onChange={(value) => setSettings((prev) => ({ ...prev, github: value }))}
            >
              <Label className="flex items-center gap-2">
                <FaGithub className="w-4 h-4" />
                GitHub URL
              </Label>
              <Input placeholder="https://github.com/username" />
            </TextField>

            <TextField
              name="linkedin"
              value={settings.linkedin}
              onChange={(value) => setSettings((prev) => ({ ...prev, linkedin: value }))}
            >
              <Label className="flex items-center gap-2">
                <FaLinkedin className="w-4 h-4" />
                LinkedIn URL
              </Label>
              <Input placeholder="https://linkedin.com/in/username" />
            </TextField>

            <TextField
              name="twitter"
              value={settings.twitter}
              onChange={(value) => setSettings((prev) => ({ ...prev, twitter: value }))}
            >
              <Label className="flex items-center gap-2">
                <FaTwitter className="w-4 h-4" />
                Twitter/X URL
              </Label>
              <Input placeholder="https://twitter.com/username" />
            </TextField>

            <TextField
              name="resume_url"
              value={settings.resume_url}
              onChange={(value) => setSettings((prev) => ({ ...prev, resume_url: value }))}
            >
              <Label>Resume URL (optional)</Label>
              <Input placeholder="https://example.com/resume.pdf" />
            </TextField>
          </div>
        </div>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button
          onPress={handleSave}
          isPending={saving}
          className={saved ? "bg-green-500" : ""}
        >
          {({ isPending }) => (
            <>
              {isPending ? (
                <Spinner color="current" size="sm" />
              ) : saved ? (
                <span className="text-white">✓ Saved!</span>
              ) : (
                <FaSave className="w-4 h-4" />
              )}
              {!saved && (isPending ? "Saving..." : "Save Settings")}
            </>
          )}
        </Button>
      </div>

      {/* Contact Messages */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
              <FaEnvelope className="w-5 h-5 text-accent" />
            </div>
            <div>
              <h2 className="font-semibold">Recent Messages</h2>
              <p className="text-sm text-muted">Contact form submissions</p>
            </div>
          </div>
          <Button variant="secondary" size="sm" onPress={loadContacts}>
            Refresh
          </Button>
        </div>

        {loadingContacts ? (
          <div className="flex justify-center py-8">
            <Spinner />
          </div>
        ) : contacts.length === 0 ? (
          <div className="text-center py-8 text-muted">
            <FaEnvelope className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p>No messages yet</p>
          </div>
        ) : (
          <div className="space-y-4">
            {contacts.map((contact: unknown) => {
              const c = contact as {
                id: string;
                name: string;
                email: string;
                message: string;
                created_at: string;
              };
              return (
                <div
                  key={c.id}
                  className="p-4 bg-surface-secondary rounded-lg"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-medium">{c.name}</span>
                        <span className="text-muted text-sm">{c.email}</span>
                      </div>
                      <p className="text-sm text-muted mt-1 line-clamp-2">
                        {c.message}
                      </p>
                    </div>
                    <span className="text-xs text-muted whitespace-nowrap">
                      {new Date(c.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </Card>
    </div>
  );
}
