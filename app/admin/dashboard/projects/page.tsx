"use client";

import { useEffect, useState } from "react";
import {
  Button,
  Card,
  Modal,
  Form,
  TextField,
  Input,
  Label,
  TextArea,
  Description,
  FieldError,
  Spinner,
  Checkbox,
} from "@heroui/react";
import { motion, AnimatePresence } from "framer-motion";
import { FaPlus, FaEdit, FaTrash, FaBriefcase, FaExternalLinkAlt, FaGithub } from "react-icons/fa";
import { createClient } from "@/lib/supabase/client";
import type { Project } from "@/lib/supabase/types";
import Image from "next/image";

const defaultProject: Partial<Project> = {
  title: "",
  slug: "",
  description: "",
  long_description: "",
  image: "",
  video_url: "",
  images: [],
  tech_stack: [],
  live_url: "",
  github_url: "",
  featured: false,
  is_active: true,
  sort_order: 0,
  start_date: new Date().toISOString().split('T')[0],
  end_date: null,
};

export default function ProjectsManagementPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Partial<Project> | null>(null);
  const [techInput, setTechInput] = useState("");
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [error, setError] = useState("");

  const supabase = createClient();

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .order("sort_order", { ascending: true });

      if (error) throw error;
      setProjects(data || []);
    } catch (error) {
      console.error("Error fetching projects:", error);
    } finally {
      setLoading(false);
    }
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  };

  const openModal = (project?: Project) => {
    if (project) {
      setEditingProject(project);
      setTechInput("");
    } else {
      setEditingProject({ ...defaultProject });
      setTechInput("");
    }
    setIsModalOpen(true);
    setError("");
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingProject(null);
    setTechInput("");
    setError("");
  };

  const addTechnology = () => {
    if (!techInput.trim()) return;
    const tech = techInput.trim();
    if (!editingProject?.tech_stack?.includes(tech)) {
      setEditingProject((prev) => prev ? ({
        ...prev,
        tech_stack: [...(prev.tech_stack || []), tech],
      }) : prev);
    }
    setTechInput("");
  };

  const removeTechnology = (tech: string) => {
    setEditingProject((prev) => prev ? ({
      ...prev,
      tech_stack: prev.tech_stack?.filter((t) => t !== tech) || [],
    }) : prev);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editingProject) return;

    setSaving(true);
    setError("");

    const slug = editingProject.slug || generateSlug(editingProject.title || "");

    try {
      if (editingProject.id) {
        // Update
        const { error } = await supabase
          .from("projects")
          .update({
            title: editingProject.title,
            slug: slug,
            description: editingProject.description,
            long_description: editingProject.long_description || null,
            image: editingProject.image || null,
            video_url: editingProject.video_url || null,
            images: editingProject.images || [],
            tech_stack: editingProject.tech_stack || [],
            live_url: editingProject.live_url || null,
            github_url: editingProject.github_url || null,
            featured: editingProject.featured,
            is_active: editingProject.is_active,
            sort_order: editingProject.sort_order,
            start_date: editingProject.start_date,
            end_date: editingProject.end_date || null,
          })
          .eq("id", editingProject.id);

        if (error) throw error;
      } else {
        // Create
        const { error } = await supabase.from("projects").insert({
          title: editingProject.title,
          slug: slug,
          description: editingProject.description,
          long_description: editingProject.long_description || null,
          image: editingProject.image || null,
          video_url: editingProject.video_url || null,
          images: editingProject.images || [],
          tech_stack: editingProject.tech_stack || [],
          live_url: editingProject.live_url || null,
          github_url: editingProject.github_url || null,
          featured: editingProject.featured || false,
          is_active: editingProject.is_active !== false,
          sort_order: editingProject.sort_order || 0,
          start_date: editingProject.start_date || new Date().toISOString().split('T')[0],
          end_date: editingProject.end_date || null,
        });

        if (error) throw error;
      }

      await fetchProjects();
      closeModal();
    } catch (error: unknown) {
      console.error("Error saving project:", error);
      setError((error as Error).message || "Failed to save project");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this project?")) return;

    setDeleting(id);
    try {
      const { error } = await supabase.from("projects").delete().eq("id", id);
      if (error) throw error;
      await fetchProjects();
    } catch (error) {
      console.error("Error deleting project:", error);
      alert("Failed to delete project");
    } finally {
      setDeleting(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">Projects</h1>
          <p className="text-muted mt-1">
            Showcase your best work and side projects.
          </p>
        </div>
        <Button onPress={() => openModal()}>
          <FaPlus className="w-4 h-4" />
          Add Project
        </Button>
      </div>

      {/* Projects List */}
      {loading ? (
        <div className="flex justify-center py-12">
          <Spinner size="lg" />
        </div>
      ) : projects.length === 0 ? (
        <Card className="p-12 text-center">
          <div className="w-16 h-16 rounded-full bg-muted/20 mx-auto flex items-center justify-center mb-4">
            <FaBriefcase className="w-6 h-6 text-muted" />
          </div>
          <h3 className="text-lg font-semibold mb-2">No projects yet</h3>
          <p className="text-muted mb-4">
            Add your first project to showcase your work.
          </p>
          <Button onPress={() => openModal()}>
            <FaPlus className="w-4 h-4" />
            Add Project
          </Button>
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence mode="popLayout">
            {projects.map((project) => (
              <motion.div
                key={project.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
              >
                <Card className="overflow-hidden">
                  {/* Image */}
                  <div className="relative h-48 bg-muted/20">
                    {project.image ? (
                      <Image
                        src={project.image}
                        alt={project.title}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <FaBriefcase className="w-12 h-12 text-muted" />
                      </div>
                    )}
                    <div className="absolute top-3 left-3 flex gap-2">
                      {project.featured && (
                        <span className="px-2 py-1 text-xs bg-accent text-white rounded-full">
                          Featured
                        </span>
                      )}
                      {!project.is_active && (
                        <span className="px-2 py-1 text-xs bg-muted text-white rounded-full">
                          Inactive
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-4">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <h3 className="font-semibold text-lg">{project.title}</h3>
                      <div className="flex gap-1">
                        {project.live_url && (
                          <a
                            href={project.live_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 text-muted hover:text-foreground hover:bg-surface-secondary rounded-lg transition-colors"
                            title="View live project"
                          >
                            <FaExternalLinkAlt className="w-3 h-3" />
                          </a>
                        )}
                        {project.github_url && (
                          <a
                            href={project.github_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 text-muted hover:text-foreground hover:bg-surface-secondary rounded-lg transition-colors"
                            title="View on GitHub"
                          >
                            <FaGithub className="w-3 h-3" />
                          </a>
                        )}
                      </div>
                    </div>
                    <p className="text-sm text-muted line-clamp-2 mb-3">
                      {project.description}
                    </p>

                    {/* Technologies */}
                    <div className="flex flex-wrap gap-1 mb-4">
                      {project.tech_stack?.slice(0, 4).map((tech) => (
                        <span
                          key={tech}
                          className="px-2 py-0.5 text-xs bg-surface-secondary rounded-full"
                        >
                          {tech}
                        </span>
                      ))}
                      {(project.tech_stack?.length || 0) > 4 && (
                        <span className="px-2 py-0.5 text-xs text-muted">
                          +{(project.tech_stack?.length || 0) - 4} more
                        </span>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="secondary"
                        onPress={() => openModal(project)}
                        className="flex-1"
                      >
                        <FaEdit className="w-3 h-3" />
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="danger"
                        onPress={() => handleDelete(project.id)}
                        isPending={deleting === project.id}
                      >
                        {({ isPending }) => (
                          <>
                            {isPending ? (
                              <Spinner size="sm" color="current" />
                            ) : (
                              <FaTrash className="w-3 h-3" />
                            )}
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Add/Edit Modal */}
      <Modal.Backdrop variant="opaque" isOpen={isModalOpen} onOpenChange={setIsModalOpen}>
        <Modal.Container size="lg" scroll="outside">
          <Modal.Dialog>
            <Modal.CloseTrigger />
            <Modal.Header>
              <Modal.Heading className="mb-2 text-center">
                {editingProject?.id ? "Edit Project" : "Add New Project"}
              </Modal.Heading>
            </Modal.Header>
            <Form onSubmit={handleSubmit}>
              <Modal.Body className="space-y-4">
                {error && (
                  <div className="p-3 rounded-lg bg-danger/10 border-danger-soft-hover">
                    <p className="text-sm text-danger">{error}</p>
                  </div>
                )}

                <TextField
                  name="title"
                  isRequired
                  value={editingProject?.title || ""}
                  onChange={(value) =>
                    setEditingProject((prev) => prev ? ({
                      ...prev,
                      title: value,
                      slug: prev.slug || generateSlug(value),
                    }) : prev)
                  }
                >
                  <Label>Project Title</Label>
                  <Input placeholder="e.g., E-commerce Platform" />
                  <FieldError />
                </TextField>

                <TextField
                  name="slug"
                  isRequired
                  value={editingProject?.slug || ""}
                  onChange={(value) =>
                    setEditingProject((prev) => prev ? ({ ...prev, slug: value }) : prev)
                  }
                >
                  <Label>URL Slug</Label>
                  <Input placeholder="e-commerce-platform" />
                  <Description>Used in the project URL</Description>
                  <FieldError />
                </TextField>

                <TextField
                  name="description"
                  isRequired
                  value={editingProject?.description || ""}
                  onChange={(value) =>
                    setEditingProject((prev) => prev ? ({ ...prev, description: value }) : prev)
                  }
                >
                  <Label>Short Description</Label>
                  <TextArea placeholder="Brief description of the project" rows={2} />
                  <FieldError />
                </TextField>

                <TextField
                  name="long_description"
                  value={editingProject?.long_description || ""}
                  onChange={(value) =>
                    setEditingProject((prev) => prev ? ({ ...prev, long_description: value }) : prev)
                  }
                >
                  <Label>Full Description (optional)</Label>
                  <TextArea placeholder="Detailed project description" rows={4} />
                </TextField>

                <TextField
                  name="image"
                  value={editingProject?.image || ""}
                  onChange={(value) =>
                    setEditingProject((prev) => prev ? ({ ...prev, image: value }) : prev)
                  }
                >
                  <Label>Image URL</Label>
                  <Input placeholder="https://example.com/image.jpg" />
                  <Description>URL to project screenshot or thumbnail</Description>
                </TextField>

                <TextField
                  name="video_url"
                  value={editingProject?.video_url || ""}
                  onChange={(value) =>
                    setEditingProject((prev) => prev ? ({ ...prev, video_url: value }) : prev)
                  }
                >
                  <Label>Video URL (optional)</Label>
                  <Input placeholder="https://youtube.com/watch?v=... or https://vimeo.com/..." />
                  <Description>YouTube, Vimeo, or direct video file URL</Description>
                </TextField>

                {/* Technologies */}
                <div className="space-y-2">
                  <Label>Technologies</Label>
                  <div className="flex gap-2">
                    <Input
                      value={techInput}
                      onChange={(e) => setTechInput(e.target.value)}
                      placeholder="Add technology"
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          addTechnology();
                        }
                      }}
                      className="flex-1"
                    />
                    <Button type="button" variant="secondary" onPress={addTechnology}>
                      Add
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {editingProject?.tech_stack?.map((tech) => (
                      <span
                        key={tech}
                        className="inline-flex items-center gap-1 px-2 py-1 bg-surface-secondary rounded-full text-sm"
                      >
                        {tech}
                        <button
                          type="button"
                          onClick={() => removeTechnology(tech)}
                          className="ml-1 text-muted hover:text-danger"
                          title="Remove technology"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <TextField
                    name="live_url"
                    value={editingProject?.live_url || ""}
                    onChange={(value) =>
                      setEditingProject((prev) => prev ? ({ ...prev, live_url: value }) : prev)
                    }
                  >
                    <Label>Live URL (optional)</Label>
                    <Input placeholder="https://project.com" />
                  </TextField>

                  <TextField
                    name="github_url"
                    value={editingProject?.github_url || ""}
                    onChange={(value) =>
                      setEditingProject((prev) => prev ? ({ ...prev, github_url: value }) : prev)
                    }
                  >
                    <Label>GitHub URL (optional)</Label>
                    <Input placeholder="https://github.com/user/repo" />
                  </TextField>
                </div>

                {/* Project Timeline */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <TextField
                    name="start_date"
                    type="date"
                    isRequired
                    value={editingProject?.start_date || ""}
                    onChange={(value) =>
                      setEditingProject((prev) => prev ? ({ ...prev, start_date: value }) : prev)
                    }
                  >
                    <Label>Start Date</Label>
                    <Input />
                    <Description>When you started the project</Description>
                  </TextField>

                  <TextField
                    name="end_date"
                    type="date"
                    value={editingProject?.end_date || ""}
                    onChange={(value) =>
                      setEditingProject((prev) => prev ? ({ ...prev, end_date: value || null }) : prev)
                    }
                  >
                    <Label>End Date (optional)</Label>
                    <Input />
                    <Description>Leave empty for ongoing projects</Description>
                  </TextField>
                </div>

                <TextField
                  name="sort_order"
                  type="number"
                  value={String(editingProject?.sort_order || 0)}
                  onChange={(value) =>
                    setEditingProject((prev) => prev ? ({
                      ...prev,
                      sort_order: parseInt(value) || 0,
                    }) : prev)
                  }
                >
                  <Label>Sort Order</Label>
                  <Input placeholder="0" />
                </TextField>

                <div className="flex gap-4">
                  <Checkbox
                    isSelected={editingProject?.featured || false}
                    onChange={(checked) =>
                      setEditingProject((prev) => prev ? ({ ...prev, featured: checked }) : prev)
                    }
                  >
                    <Checkbox.Control>
                      <Checkbox.Indicator />
                    </Checkbox.Control>
                    <Label>Featured Project</Label>
                  </Checkbox>

                  <Checkbox
                    isSelected={editingProject?.is_active !== false}
                    onChange={(checked) =>
                      setEditingProject((prev) => prev ? ({ ...prev, is_active: checked }) : prev)
                    }
                  >
                    <Checkbox.Control>
                      <Checkbox.Indicator />
                    </Checkbox.Control>
                    <Label>Active</Label>
                  </Checkbox>
                </div>
              </Modal.Body>
              <Modal.Footer>
                <Button variant="secondary" slot="close">
                  Cancel
                </Button>
                <Button type="submit" isPending={saving}>
                  {({ isPending }) => (
                    <>
                      {isPending && <Spinner color="current" size="sm" />}
                      {isPending ? "Saving..." : editingProject?.id ? "Update" : "Create"}
                    </>
                  )}
                </Button>
              </Modal.Footer>
            </Form>
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </div>
  );
}
