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
  Separator,
  SearchField,
} from "@heroui/react";
import {
  FaSave,
  FaUser,
  FaGlobe,
  FaPlus,
  FaTrash,
  FaGithub,
  FaLinkedin,
  FaTwitter,
  FaLink,
  FaEdit,
} from "react-icons/fa";
import { createClient } from "@/lib/supabase/client";
import { IconSearch, IconRenderer } from "@/components/admin/IconSearch";
import { StatusColorSelect } from "@/components/admin/ColorSelect";
import type { SiteProfile, SocialLink } from "@/lib/supabase/types";

// Default profile matching database schema
const defaultProfile: Partial<SiteProfile> = {
  full_name: "",
  short_name: "",
  tagline: "",
  about_me: "",
  profile_image: "",
  email: "",
  phone: "",
  location: "",
  resume_url: "",
  status: "Available for work",
  status_color: "success",
  years_experience: 0,
  completed_projects: 0,
};

// Default social link matching database schema
const defaultSocialLink: Partial<SocialLink> = {
  platform: "",
  url: "",
  icon: "",
  is_active: true,
  sort_order: 0,
};

export default function ProfilePage() {
  const [profile, setProfile] = useState<Partial<SiteProfile>>(defaultProfile);
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  // Modal state for social links
  const [editingSocialLink, setEditingSocialLink] =
    useState<Partial<SocialLink> | null>(null);
  const [savingLink, setSavingLink] = useState(false);

  const supabase = createClient();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // Fetch profile and social links in parallel
      const [profileRes, socialRes] = await Promise.all([
        supabase.from("site_profile").select("*").single(),
        supabase
          .from("social_links")
          .select("*")
          .order("sort_order", { ascending: true }),
      ]);

      // Profile might not exist yet, that's okay
      if (profileRes.data) {
        setProfile(profileRes.data);
      }

      setSocialLinks(socialRes.data || []);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProfile = async () => {
    setSaving(true);
    setError("");

    try {
      // Check if profile exists
      const { data: existing } = await supabase
        .from("site_profile")
        .select("id")
        .single();

      const profileData = {
        full_name: profile.full_name || "",
        short_name: profile.short_name || null,
        tagline: profile.tagline || null,
        about_me: profile.about_me || null,
        profile_image: profile.profile_image || null,
        email: profile.email || null,
        phone: profile.phone || null,
        location: profile.location || null,
        resume_url: profile.resume_url || null,
        status: profile.status || "Available for work",
        status_color: profile.status_color || "success",
        years_experience: profile.years_experience || 0,
        completed_projects: profile.completed_projects || 0,
      };

      if (existing) {
        // Update
        const { error } = await supabase
          .from("site_profile")
          .update(profileData)
          .eq("id", existing.id);

        if (error) throw error;
      } else {
        // Create
        const { error } = await supabase
          .from("site_profile")
          .insert(profileData);

        if (error) throw error;
      }

      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (error: unknown) {
      console.error("Error saving profile:", error);
      setError((error as Error).message || "Failed to save profile");
    } finally {
      setSaving(false);
    }
  };

  const handleSaveSocialLink = async () => {
    if (!editingSocialLink) return;
    setSavingLink(true);

    try {
      const linkData = {
        platform: editingSocialLink.platform || "",
        url: editingSocialLink.url || "",
        icon: editingSocialLink.icon || null,
        is_active: editingSocialLink.is_active ?? true,
        sort_order: editingSocialLink.sort_order || 0,
      };

      if (editingSocialLink.id) {
        // Update
        const { error } = await supabase
          .from("social_links")
          .update(linkData)
          .eq("id", editingSocialLink.id);

        if (error) throw error;
      } else {
        // Create
        const { error } = await supabase.from("social_links").insert(linkData);

        if (error) throw error;
      }

      await fetchData();
      setEditingSocialLink(null);
    } catch (error: unknown) {
      console.error("Error saving social link:", error);
      alert((error as Error).message || "Failed to save social link");
    } finally {
      setSavingLink(false);
    }
  };

  const handleDeleteSocialLink = async (id: string) => {
    if (!confirm("Are you sure you want to delete this social link?")) return;

    try {
      const { error } = await supabase
        .from("social_links")
        .delete()
        .eq("id", id);
      if (error) throw error;
      await fetchData();
    } catch (error) {
      console.error("Error deleting social link:", error);
      alert("Failed to delete social link");
    }
  };

  // Get default icon for common platforms
  const getDefaultIcon = (platform: string) => {
    const lower = platform.toLowerCase();
    if (lower.includes("github")) return FaGithub;
    if (lower.includes("linkedin")) return FaLinkedin;
    if (lower.includes("twitter") || lower.includes("x")) return FaTwitter;
    return FaLink;
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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">Profile</h1>
          <p className="text-muted mt-1">
            Manage your personal information and social links.
          </p>
        </div>
        <Button onPress={handleSaveProfile} isPending={saving}>
          {({ isPending }) => (
            <>
              {isPending ? (
                <Spinner color="current" size="sm" />
              ) : (
                <FaSave className="w-4 h-4" />
              )}
              {saved ? "Saved!" : isPending ? "Saving..." : "Save Profile"}
            </>
          )}
        </Button>
      </div>

      {error && (
        <Card className="p-4 bg-danger/10 border border-danger-soft-hover">
          <p className="text-sm text-danger">{error}</p>
        </Card>
      )}

      {/* Personal Info */}
      <Card className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
            <FaUser className="w-5 h-5 text-accent" />
          </div>
          <div>
            <h2 className="font-semibold">Personal Information</h2>
            <p className="text-sm text-muted">
              Basic info displayed on your portfolio
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <TextField
              name="full_name"
              isRequired
              value={profile.full_name || ""}
              onChange={(value) =>
                setProfile((prev) => ({ ...prev, full_name: value }))
              }
            >
              <Label>Full Name</Label>
              <Input placeholder="e.g., John Doe" />
            </TextField>

            <TextField
              name="short_name"
              value={profile.short_name || ""}
              onChange={(value) =>
                setProfile((prev) => ({ ...prev, short_name: value }))
              }
            >
              <Label>Short Name / Initials</Label>
              <Input placeholder="e.g., JD" />
              <Description>Used as avatar fallback</Description>
            </TextField>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <TextField
              name="tagline"
              value={profile.tagline || ""}
              onChange={(value) =>
                setProfile((prev) => ({ ...prev, tagline: value }))
              }
            >
              <Label>Tagline / Professional Title</Label>
              <Input placeholder="e.g., Full Stack Developer" />
            </TextField>

            <TextField
              name="location"
              value={profile.location || ""}
              onChange={(value) =>
                setProfile((prev) => ({ ...prev, location: value }))
              }
            >
              <Label>Location</Label>
              <Input placeholder="e.g., San Francisco, CA" />
            </TextField>
          </div>

          <TextField
            name="about_me"
            value={profile.about_me || ""}
            onChange={(value) =>
              setProfile((prev) => ({ ...prev, about_me: value }))
            }
          >
            <Label>About Me / Bio</Label>
            <TextArea
              placeholder="A brief introduction about yourself..."
              rows={3}
            />
          </TextField>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <TextField
              name="email"
              type="email"
              value={profile.email || ""}
              onChange={(value) =>
                setProfile((prev) => ({ ...prev, email: value }))
              }
            >
              <Label>Email</Label>
              <Input placeholder="your@email.com" />
            </TextField>

            <TextField
              name="phone"
              value={profile.phone || ""}
              onChange={(value) =>
                setProfile((prev) => ({ ...prev, phone: value }))
              }
            >
              <Label>Phone (optional)</Label>
              <Input placeholder="+1 234 567 8900" />
            </TextField>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <TextField
              name="profile_image"
              value={profile.profile_image || ""}
              onChange={(value) =>
                setProfile((prev) => ({ ...prev, profile_image: value }))
              }
            >
              <Label>Profile Image URL</Label>
              <Input placeholder="https://..." />
            </TextField>

            <TextField
              name="resume_url"
              value={profile.resume_url || ""}
              onChange={(value) =>
                setProfile((prev) => ({ ...prev, resume_url: value }))
              }
            >
              <Label>Resume URL</Label>
              <Input placeholder="https://..." />
            </TextField>
          </div>

          <Separator />

          {/* Status Settings */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <TextField
              name="status"
              value={profile.status || ""}
              onChange={(value) =>
                setProfile((prev) => ({ ...prev, status: value }))
              }
            >
              <Label>Status Text</Label>
              <Input placeholder="e.g., Available for work" />
              <Description>Displayed next to your name</Description>
            </TextField>

            <div>
              <StatusColorSelect
                value={profile.status_color || "success"}
                onChange={(value) =>
                  setProfile((prev) => ({ ...prev, status_color: value }))
                }
                label="Status Color"
                description="Visual indicator for your availability"
              />
            </div>
          </div>

          <Separator />

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <TextField
              name="years_experience"
              type="number"
              value={String(profile.years_experience || 0)}
              onChange={(value) =>
                setProfile((prev) => ({
                  ...prev,
                  years_experience: parseInt(value) || 0,
                }))
              }
            >
              <Label>Years of Experience</Label>
              <Input placeholder="0" />
            </TextField>

            <TextField
              name="completed_projects"
              type="number"
              value={String(profile.completed_projects || 0)}
              onChange={(value) =>
                setProfile((prev) => ({
                  ...prev,
                  completed_projects: parseInt(value) || 0,
                }))
              }
            >
              <Label>Completed Projects</Label>
              <Input placeholder="0" />
            </TextField>
          </div>
        </div>
      </Card>

      {/* Social Links */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
              <FaGlobe className="w-5 h-5 text-accent" />
            </div>
            <div>
              <h2 className="font-semibold">Social Links</h2>
              <p className="text-sm text-muted">
                Links displayed in hero and contact sections
              </p>
            </div>
          </div>
          <Button
            size="sm"
            variant="secondary"
            onPress={() => setEditingSocialLink({ ...defaultSocialLink })}
          >
            <FaPlus className="w-3 h-3" />
            Add Link
          </Button>
        </div>

        {socialLinks.length === 0 ? (
          <div className="text-center py-8 text-muted">
            <FaLink className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p>No social links added yet.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {socialLinks.map((link) => {
              const DefaultIcon = getDefaultIcon(link.platform);
              return (
                <div
                  key={link.id}
                  className="flex items-center gap-4 p-3 rounded-lg bg-surface hover:bg-default/50 transition-colors"
                >
                  <div className="w-10 h-10 rounded-lg bg-default flex items-center justify-center">
                    {link.icon ? (
                      <IconRenderer
                        name={link.icon}
                        className="w-5 h-5 text-accent"
                      />
                    ) : (
                      <DefaultIcon className="w-5 h-5 text-accent" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{link.platform}</span>
                      {!link.is_active && (
                        <span className="px-2 py-0.5 text-xs bg-muted/20 text-muted rounded-full">
                          Inactive
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-muted truncate">{link.url}</p>
                  </div>
                  <div className="flex gap-1">
                    <button
                      onClick={() => setEditingSocialLink(link)}
                      className="p-2 text-muted hover:text-foreground hover:bg-surface-secondary rounded-lg transition-colors"
                      title="Edit social link"
                    >
                      <FaEdit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteSocialLink(link.id)}
                      className="p-2 text-muted hover:text-danger hover:bg-danger/10 rounded-lg transition-colors"
                      title="Delete social link"
                    >
                      <FaTrash className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </Card>

      {/* Edit Social Link Inline */}
      {editingSocialLink && (
        <Card className="p-6 border-2 border-accent">
          <div className="flex items-center justify-between mb-0">
            <h3 className="font-semibold">
              {editingSocialLink.id ? "Edit Social Link" : "Add Social Link"}
            </h3>
          </div>

          <div className="space-y-4 mb-32">
            <SearchField className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <TextField
                name="link_platform"
                isRequired
                value={editingSocialLink.platform || ""}
                onChange={(value) =>
                  setEditingSocialLink((prev) =>
                    prev ? { ...prev, platform: value } : null
                  )
                }
              >
                <Label>Platform Name</Label>
                <Input placeholder="e.g., GitHub, LinkedIn" />
              </TextField>

              <div className="space-y-1">
                <Label className="mb-2 block">Icon</Label>
                <IconSearch
                  value={editingSocialLink.icon || ""}
                  onChange={(value) =>
                    setEditingSocialLink((prev) =>
                      prev ? { ...prev, icon: value } : null
                    )
                  }
                />
              </div>
            </SearchField>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <TextField
                name="link_url"
                isRequired
                value={editingSocialLink.url || ""}
                onChange={(value) =>
                  setEditingSocialLink((prev) =>
                    prev ? { ...prev, url: value } : null
                  )
                }
              >
                <Label>URL</Label>
                <Input placeholder="https://..." />
              </TextField>

              <TextField
                name="link_sort"
                type="number"
                value={String(editingSocialLink.sort_order || 0)}
                onChange={(value) =>
                  setEditingSocialLink((prev) =>
                    prev
                      ? {
                          ...prev,
                          sort_order: parseInt(value) || 0,
                        }
                      : null
                  )
                }
              >
                <Label>Sort Order</Label>
                <Input placeholder="0" />
              </TextField>
            </div>

            <div className="flex justify-end">
              <Button
                className="mr-2"
                variant="danger-soft"
                size="md"
                onPress={() => setEditingSocialLink(null)}
              >
                Cancel
              </Button>
              <Button onPress={handleSaveSocialLink} isPending={savingLink}>
                {({ isPending }) => (
                  <>
                    {isPending && <Spinner color="current" size="sm" />}
                    {isPending ? "Saving..." : "Save Link"}
                  </>
                )}
              </Button>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}
