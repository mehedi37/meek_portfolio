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
  Select,
  ListBox,
} from "@heroui/react";
import { motion, AnimatePresence } from "framer-motion";
import { FaPlus, FaEdit, FaTrash, FaBriefcase, FaBuilding, FaCalendar, FaMapMarkerAlt } from "react-icons/fa";
import { createClient } from "@/lib/supabase/client";
import type { Experience, ExperienceInsert, ExperienceUpdate } from "@/lib/supabase/types";

const defaultExperience: Partial<Experience> = {
  company: "",
  company_logo: "",
  company_url: "",
  position: "",
  description: "",
  start_date: "",
  end_date: null,
  location: "",
  technologies: [],
  type: "full-time",
  is_current: false,
  sort_order: 0,
};

const experienceTypes = [
  { value: "full-time", label: "Full-time" },
  { value: "part-time", label: "Part-time" },
  { value: "contract", label: "Contract" },
  { value: "freelance", label: "Freelance" },
  { value: "internship", label: "Internship" },
];

export default function ExperienceManagementPage() {
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingExperience, setEditingExperience] = useState<Partial<Experience> | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [techInput, setTechInput] = useState("");
  const [isCurrent, setIsCurrent] = useState(false);

  const supabase = createClient();

  useEffect(() => {
    fetchExperiences();
  }, []);

  const fetchExperiences = async () => {
    try {
      const { data, error } = await supabase
        .from("experiences")
        .select("*")
        .order("start_date", { ascending: false });

      if (error) throw error;
      setExperiences(data || []);
    } catch (error) {
      console.error("Error fetching experiences:", error);
    } finally {
      setLoading(false);
    }
  };

  const openModal = (experience?: Experience) => {
    if (experience) {
      setEditingExperience(experience);
      setIsCurrent(experience.is_current || !experience.end_date);
    } else {
      setEditingExperience({ ...defaultExperience });
      setIsCurrent(false);
    }
    setTechInput("");
    setIsModalOpen(true);
    setError("");
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingExperience(null);
    setTechInput("");
    setIsCurrent(false);
    setError("");
  };

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return "Present";
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", { month: "short", year: "numeric" });
  };

  const addTechnology = () => {
    if (techInput.trim() && editingExperience) {
      const currentTech = editingExperience.technologies || [];
      if (!currentTech.includes(techInput.trim())) {
        setEditingExperience({
          ...editingExperience,
          technologies: [...currentTech, techInput.trim()],
        });
      }
      setTechInput("");
    }
  };

  const removeTechnology = (tech: string) => {
    if (editingExperience) {
      setEditingExperience({
        ...editingExperience,
        technologies: (editingExperience.technologies || []).filter((t) => t !== tech),
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editingExperience) return;

    setSaving(true);
    setError("");

    try {
      if (editingExperience.id) {
        // Update existing experience
        const updateData: ExperienceUpdate = {
          company: editingExperience.company,
          company_logo: editingExperience.company_logo || null,
          company_url: editingExperience.company_url || null,
          position: editingExperience.position,
          description: editingExperience.description,
          start_date: editingExperience.start_date,
          end_date: isCurrent ? null : editingExperience.end_date || null,
          is_current: isCurrent,
          location: editingExperience.location || null,
          technologies: editingExperience.technologies || null,
          type: editingExperience.type || null,
          sort_order: editingExperience.sort_order || 0,
        };

        const { error } = await supabase
          .from("experiences")
          .update(updateData)
          .eq("id", editingExperience.id);

        if (error) throw error;
      } else {
        // Create new experience
        const insertData: ExperienceInsert = {
          company: editingExperience.company!,
          company_logo: editingExperience.company_logo || null,
          company_url: editingExperience.company_url || null,
          position: editingExperience.position!,
          description: editingExperience.description!,
          start_date: editingExperience.start_date!,
          end_date: isCurrent ? null : editingExperience.end_date || null,
          is_current: isCurrent,
          location: editingExperience.location || null,
          technologies: editingExperience.technologies || null,
          type: editingExperience.type || null,
          sort_order: editingExperience.sort_order || 0,
        };

        const { error } = await supabase.from("experiences").insert(insertData);
        if (error) throw error;
      }

      await fetchExperiences();
      closeModal();
    } catch (error: unknown) {
      console.error("Error saving experience:", error);
      setError((error as Error).message || "Failed to save experience");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this experience?")) return;

    setDeleting(id);
    try {
      const { error } = await supabase.from("experiences").delete().eq("id", id);
      if (error) throw error;
      await fetchExperiences();
    } catch (error) {
      console.error("Error deleting experience:", error);
      alert("Failed to delete experience");
    } finally {
      setDeleting(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">Experience</h1>
          <p className="text-muted mt-1">
            Manage your work history and professional experience.
          </p>
        </div>
        <Button onPress={() => openModal()}>
          <FaPlus className="w-4 h-4" />
          Add Experience
        </Button>
      </div>

      {/* Experience List */}
      {loading ? (
        <div className="flex justify-center py-12">
          <Spinner size="lg" />
        </div>
      ) : experiences.length === 0 ? (
        <Card className="p-12 text-center">
          <div className="w-16 h-16 rounded-full bg-muted/20 mx-auto flex items-center justify-center mb-4">
            <FaBriefcase className="w-6 h-6 text-muted" />
          </div>
          <h3 className="text-lg font-semibold mb-2">No experience yet</h3>
          <p className="text-muted mb-4">
            Add your first work experience to build your timeline.
          </p>
          <Button onPress={() => openModal()}>
            <FaPlus className="w-4 h-4" />
            Add Experience
          </Button>
        </Card>
      ) : (
        <div className="space-y-4">
          <AnimatePresence mode="popLayout">
            {experiences.map((exp, index) => (
              <motion.div
                key={exp.id}
                layout
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className="p-6">
                  <div className="flex flex-col sm:flex-row gap-4">
                    {/* Timeline indicator */}
                    <div className="hidden sm:flex flex-col items-center">
                      <div className={`w-4 h-4 rounded-full ${exp.is_current || !exp.end_date ? "bg-accent" : "bg-muted"}`} />
                      {index < experiences.length - 1 && (
                        <div className="w-0.5 flex-1 bg-border mt-2" />
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1">
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <h3 className="font-semibold text-lg">{exp.position}</h3>
                            {(exp.is_current || !exp.end_date) && (
                              <span className="px-2 py-0.5 text-xs bg-accent/10 text-accent rounded-full">
                                Current
                              </span>
                            )}
                            {exp.type && (
                              <span className="px-2 py-0.5 text-xs bg-muted/20 text-muted rounded-full capitalize">
                                {exp.type}
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-2 text-muted mt-1">
                            <FaBuilding className="w-3 h-3" />
                            <span>{exp.company}</span>
                            {exp.location && (
                              <>
                                <span className="text-muted">•</span>
                                <FaMapMarkerAlt className="w-3 h-3" />
                                <span>{exp.location}</span>
                              </>
                            )}
                          </div>
                          <div className="flex items-center gap-2 text-sm text-muted mt-1">
                            <FaCalendar className="w-3 h-3" />
                            <span>
                              {formatDate(exp.start_date)} — {formatDate(exp.end_date)}
                            </span>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-1">
                          <button
                            onClick={() => openModal(exp)}
                            className="p-2 text-muted hover:text-foreground hover:bg-surface-secondary rounded-lg transition-colors"
                            title="Edit experience"
                          >
                            <FaEdit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(exp.id)}
                            disabled={deleting === exp.id}
                            className="p-2 text-muted hover:text-danger hover:bg-danger/10 rounded-lg transition-colors disabled:opacity-50"
                            title="Delete experience"
                          >
                            {deleting === exp.id ? (
                              <Spinner size="sm" />
                            ) : (
                              <FaTrash className="w-4 h-4" />
                            )}
                          </button>
                        </div>
                      </div>

                      {exp.description && (
                        <p className="text-muted mt-3 whitespace-pre-line">
                          {exp.description}
                        </p>
                      )}

                      {exp.technologies && exp.technologies.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-3">
                          {exp.technologies.map((tech) => (
                            <span
                              key={tech}
                              className="px-2 py-1 text-xs bg-accent/10 text-accent rounded-md"
                            >
                              {tech}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Add/Edit Modal */}
      <Modal.Backdrop isOpen={isModalOpen} onOpenChange={setIsModalOpen}>
        <Modal.Container size="md" scroll="inside">
          <Modal.Dialog>
            <Modal.CloseTrigger />
            <Modal.Header>
              <Modal.Heading>
                {editingExperience?.id ? "Edit Experience" : "Add New Experience"}
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
                  name="company"
                  isRequired
                  value={editingExperience?.company || ""}
                  onChange={(value) =>
                    setEditingExperience((prev) => prev ? ({ ...prev, company: value }) : prev)
                  }
                >
                  <Label>Company Name</Label>
                  <Input placeholder="e.g., Google, Microsoft" />
                  <FieldError />
                </TextField>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <TextField
                    name="company_logo"
                    value={editingExperience?.company_logo || ""}
                    onChange={(value) =>
                      setEditingExperience((prev) => prev ? ({ ...prev, company_logo: value }) : prev)
                    }
                  >
                    <Label>Company Logo URL (optional)</Label>
                    <Input placeholder="https://example.com/logo.png" />
                  </TextField>

                  <TextField
                    name="company_url"
                    value={editingExperience?.company_url || ""}
                    onChange={(value) =>
                      setEditingExperience((prev) => prev ? ({ ...prev, company_url: value }) : prev)
                    }
                  >
                    <Label>Company Website (optional)</Label>
                    <Input placeholder="https://company.com" />
                  </TextField>
                </div>

                <TextField
                  name="position"
                  isRequired
                  value={editingExperience?.position || ""}
                  onChange={(value) =>
                    setEditingExperience((prev) => prev ? ({ ...prev, position: value }) : prev)
                  }
                >
                  <Label>Position / Role</Label>
                  <Input placeholder="e.g., Senior Software Engineer" />
                  <FieldError />
                </TextField>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <TextField
                    name="location"
                    value={editingExperience?.location || ""}
                    onChange={(value) =>
                      setEditingExperience((prev) => prev ? ({ ...prev, location: value }) : prev)
                    }
                  >
                    <Label>Location (optional)</Label>
                    <Input placeholder="e.g., San Francisco, CA" />
                  </TextField>

                  <Select
                    name="type"
                    selectedKey={editingExperience?.type || "full-time"}
                    onSelectionChange={(key) =>
                      setEditingExperience((prev) => prev ? ({ ...prev, type: key as string }) : prev)
                    }
                  >
                    <Label>Employment Type</Label>
                    <Select.Trigger>
                      <Select.Value />
                      <Select.Indicator />
                    </Select.Trigger>
                    <Select.Popover>
                      <ListBox>
                        {experienceTypes.map((type) => (
                          <ListBox.Item key={type.value} id={type.value} textValue={type.label}>
                            {type.label}
                            <ListBox.ItemIndicator />
                          </ListBox.Item>
                        ))}
                      </ListBox>
                    </Select.Popover>
                  </Select>
                </div>

                <TextField
                  name="description"
                  isRequired
                  value={editingExperience?.description || ""}
                  onChange={(value) =>
                    setEditingExperience((prev) => prev ? ({ ...prev, description: value }) : prev)
                  }
                >
                  <Label>Description</Label>
                  <TextArea
                    placeholder="Describe your responsibilities and achievements"
                    rows={4}
                  />
                  <FieldError />
                </TextField>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <TextField
                    name="start_date"
                    type="date"
                    isRequired
                    value={editingExperience?.start_date || ""}
                    onChange={(value) =>
                      setEditingExperience((prev) => prev ? ({ ...prev, start_date: value }) : prev)
                    }
                  >
                    <Label>Start Date</Label>
                    <Input />
                    <FieldError />
                  </TextField>

                  <TextField
                    name="end_date"
                    type="date"
                    isDisabled={isCurrent}
                    value={editingExperience?.end_date || ""}
                    onChange={(value) =>
                      setEditingExperience((prev) => prev ? ({ ...prev, end_date: value }) : prev)
                    }
                  >
                    <Label>End Date</Label>
                    <Input />
                    <Description>
                      {isCurrent ? "Currently working here" : "Leave empty if current"}
                    </Description>
                  </TextField>
                </div>

                <Checkbox
                  isSelected={isCurrent}
                  onChange={(checked) => {
                    setIsCurrent(checked);
                    if (checked) {
                      setEditingExperience((prev) => prev ? ({ ...prev, end_date: null, is_current: true }) : prev);
                    } else {
                      setEditingExperience((prev) => prev ? ({ ...prev, is_current: false }) : prev);
                    }
                  }}
                >
                  <Checkbox.Control>
                    <Checkbox.Indicator />
                  </Checkbox.Control>
                  <Label>I currently work here</Label>
                </Checkbox>

                {/* Technologies */}
                <div className="space-y-2">
                  <Label>Technologies Used (optional)</Label>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Add a technology"
                      value={techInput}
                      onChange={(e) => setTechInput(e.target.value)}
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
                  {editingExperience?.technologies && editingExperience.technologies.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {editingExperience.technologies.map((tech) => (
                        <span
                          key={tech}
                          className="inline-flex items-center gap-1 px-2 py-1 text-sm bg-accent/10 text-accent rounded-md"
                        >
                          {tech}
                          <button
                            type="button"
                            onClick={() => removeTechnology(tech)}
                            className="hover:text-danger"
                            title="Remove technology"
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <TextField
                  name="sort_order"
                  type="number"
                  value={String(editingExperience?.sort_order || 0)}
                  onChange={(value) =>
                    setEditingExperience((prev) => prev ? ({
                      ...prev,
                      sort_order: parseInt(value) || 0,
                    }) : prev)
                  }
                >
                  <Label>Sort Order</Label>
                  <Input placeholder="0" />
                  <Description>Lower numbers appear first</Description>
                </TextField>
              </Modal.Body>
              <Modal.Footer>
                <Button variant="secondary" slot="close">
                  Cancel
                </Button>
                <Button type="submit" isPending={saving}>
                  {({ isPending }) => (
                    <>
                      {isPending && <Spinner color="current" size="sm" />}
                      {isPending ? "Saving..." : editingExperience?.id ? "Update" : "Create"}
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
