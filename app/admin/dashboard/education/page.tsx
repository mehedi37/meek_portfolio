"use client";

import { useEffect, useState } from "react";
import {
  Button,
  Card,
  Modal,
  Form,
  TextField,
  TextArea,
  Input,
  Label,
  Description,
  FieldError,
  Spinner,
  Checkbox,
} from "@heroui/react";
import { motion, AnimatePresence } from "framer-motion";
import { FaPlus, FaEdit, FaTrash, FaGraduationCap, FaExternalLinkAlt } from "react-icons/fa";
import { createClient } from "@/lib/supabase/client";
import type { Education } from "@/lib/supabase/types";

const defaultEducation: Partial<Education> = {
  institution: "",
  degree: "",
  field_of_study: "",
  location: "",
  start_date: "",
  end_date: null,
  is_current: false,
  description: "",
  gpa: "",
  institution_logo: "",
  institution_url: "",
  sort_order: 0,
};

export default function EducationManagementPage() {
  const [education, setEducation] = useState<Education[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEntry, setEditingEntry] = useState<Partial<Education> | null>(null);
  const [isCurrent, setIsCurrent] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [error, setError] = useState("");

  const supabase = createClient();

  useEffect(() => {
    fetchEducation();
  }, []);

  const fetchEducation = async () => {
    try {
      const { data, error } = await supabase
        .from("education")
        .select("*")
        .order("start_date", { ascending: false })
        .order("sort_order", { ascending: true });

      if (error) throw error;
      setEducation(data || []);
    } catch (error) {
      console.error("Error fetching education:", error);
    } finally {
      setLoading(false);
    }
  };

  const openModal = (entry?: Education) => {
    setEditingEntry(entry || { ...defaultEducation });
    setIsCurrent(entry ? entry.is_current || !entry.end_date : false);
    setIsModalOpen(true);
    setError("");
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingEntry(null);
    setError("");
  };

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return "Present";
    return new Date(dateStr).toLocaleDateString("en-US", { month: "short", year: "numeric" });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editingEntry) return;

    setSaving(true);
    setError("");

    const payload = {
      institution: editingEntry.institution,
      degree: editingEntry.degree,
      field_of_study: editingEntry.field_of_study || null,
      location: editingEntry.location || null,
      start_date: editingEntry.start_date,
      end_date: isCurrent ? null : editingEntry.end_date || null,
      is_current: isCurrent,
      description: editingEntry.description || null,
      gpa: editingEntry.gpa || null,
      institution_logo: editingEntry.institution_logo || null,
      institution_url: editingEntry.institution_url || null,
      sort_order: editingEntry.sort_order || 0,
    };

    try {
      if (editingEntry.id) {
        const { error } = await supabase
          .from("education")
          .update(payload)
          .eq("id", editingEntry.id);

        if (error) throw error;
      } else {
        const { error } = await supabase.from("education").insert(payload);
        if (error) throw error;
      }

      await fetchEducation();
      closeModal();
    } catch (error: unknown) {
      console.error("Error saving education entry:", error);
      setError((error as Error).message || "Failed to save education entry");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this education entry?")) return;

    setDeleting(id);
    try {
      const { error } = await supabase.from("education").delete().eq("id", id);
      if (error) throw error;
      await fetchEducation();
    } catch (error) {
      console.error("Error deleting education entry:", error);
      alert("Failed to delete education entry");
    } finally {
      setDeleting(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">Education</h1>
          <p className="text-muted mt-1">
            Manage your academic background.
          </p>
        </div>
        <Button onPress={() => openModal()}>
          <FaPlus className="w-4 h-4" />
          Add Education
        </Button>
      </div>

      {/* Education List */}
      {loading ? (
        <div className="flex justify-center py-12">
          <Spinner size="lg" />
        </div>
      ) : education.length === 0 ? (
        <Card className="p-12 text-center">
          <div className="w-16 h-16 rounded-full bg-muted/20 mx-auto flex items-center justify-center mb-4">
            <FaGraduationCap className="w-6 h-6 text-muted" />
          </div>
          <h3 className="text-lg font-semibold mb-2">No education entries yet</h3>
          <p className="text-muted mb-4">
            Add your academic background to show on the portfolio.
          </p>
          <Button onPress={() => openModal()}>
            <FaPlus className="w-4 h-4" />
            Add Education
          </Button>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <AnimatePresence mode="popLayout">
            {education.map((entry) => (
              <motion.div
                key={entry.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
              >
                <Card className="p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <h3 className="font-semibold truncate">
                        {entry.degree}
                        {entry.field_of_study ? `, ${entry.field_of_study}` : ""}
                      </h3>
                      <p className="text-sm text-muted mt-1">{entry.institution}</p>
                      <p className="text-xs text-muted mt-1">
                        {formatDate(entry.start_date)} — {formatDate(entry.end_date)}
                        {entry.location ? ` · ${entry.location}` : ""}
                      </p>
                      {entry.gpa && (
                        <p className="text-xs text-muted mt-1">GPA: {entry.gpa}</p>
                      )}
                    </div>
                    {(entry.is_current || !entry.end_date) && (
                      <span className="px-2 py-0.5 text-xs font-medium bg-accent/10 text-accent rounded-full shrink-0">
                        Current
                      </span>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 mt-4">
                    {entry.institution_url && (
                      <a
                        href={entry.institution_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 text-muted hover:text-accent hover:bg-accent/10 rounded-lg transition-colors"
                        title="Visit institution site"
                      >
                        <FaExternalLinkAlt className="w-3 h-3" />
                      </a>
                    )}
                    <div className="flex-1" />
                    <button
                      onClick={() => openModal(entry)}
                      className="p-2 text-muted hover:text-foreground hover:bg-surface-secondary rounded-lg transition-colors"
                      title="Edit education entry"
                    >
                      <FaEdit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(entry.id)}
                      disabled={deleting === entry.id}
                      className="p-2 text-muted hover:text-danger hover:bg-danger/10 rounded-lg transition-colors disabled:opacity-50"
                      title="Delete education entry"
                    >
                      {deleting === entry.id ? (
                        <Spinner size="sm" />
                      ) : (
                        <FaTrash className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Add/Edit Modal */}
      <Modal.Backdrop variant="opaque" isOpen={isModalOpen} onOpenChange={setIsModalOpen}>
        <Modal.Container size="md" scroll="outside">
          <Modal.Dialog>
            <Modal.CloseTrigger />
            <Modal.Header>
              <Modal.Heading className="mb-2 text-center">
                {editingEntry?.id ? "Edit Education" : "Add Education"}
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
                  name="institution"
                  isRequired
                  value={editingEntry?.institution || ""}
                  onChange={(value) =>
                    setEditingEntry((prev) => prev ? ({ ...prev, institution: value }) : prev)
                  }
                >
                  <Label>Institution</Label>
                  <Input placeholder="e.g., Rajshahi University of Engineering & Technology" />
                  <FieldError />
                </TextField>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <TextField
                    name="degree"
                    isRequired
                    value={editingEntry?.degree || ""}
                    onChange={(value) =>
                      setEditingEntry((prev) => prev ? ({ ...prev, degree: value }) : prev)
                    }
                  >
                    <Label>Degree</Label>
                    <Input placeholder="e.g., B.Sc. Engineering" />
                    <FieldError />
                  </TextField>

                  <TextField
                    name="field_of_study"
                    value={editingEntry?.field_of_study || ""}
                    onChange={(value) =>
                      setEditingEntry((prev) => prev ? ({ ...prev, field_of_study: value }) : prev)
                    }
                  >
                    <Label>Field of Study</Label>
                    <Input placeholder="e.g., Computer Science and Engineering" />
                  </TextField>
                </div>

                <TextField
                  name="location"
                  value={editingEntry?.location || ""}
                  onChange={(value) =>
                    setEditingEntry((prev) => prev ? ({ ...prev, location: value }) : prev)
                  }
                >
                  <Label>Location</Label>
                  <Input placeholder="e.g., Rajshahi, Bangladesh" />
                </TextField>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <TextField
                    name="start_date"
                    type="date"
                    isRequired
                    value={editingEntry?.start_date || ""}
                    onChange={(value) =>
                      setEditingEntry((prev) => prev ? ({ ...prev, start_date: value }) : prev)
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
                    value={editingEntry?.end_date || ""}
                    onChange={(value) =>
                      setEditingEntry((prev) => prev ? ({ ...prev, end_date: value }) : prev)
                    }
                  >
                    <Label>End Date</Label>
                    <Input />
                    <Description>
                      {isCurrent ? "Currently studying here" : "Leave empty if ongoing"}
                    </Description>
                  </TextField>
                </div>

                <Checkbox
                  isSelected={isCurrent}
                  onChange={(checked) => {
                    setIsCurrent(checked);
                    if (checked) {
                      setEditingEntry((prev) => prev ? ({ ...prev, end_date: null, is_current: true }) : prev);
                    } else {
                      setEditingEntry((prev) => prev ? ({ ...prev, is_current: false }) : prev);
                    }
                  }}
                >
                  <Checkbox.Control>
                    <Checkbox.Indicator />
                  </Checkbox.Control>
                  <Label>Currently studying here</Label>
                </Checkbox>

                <TextField
                  name="gpa"
                  value={editingEntry?.gpa || ""}
                  onChange={(value) =>
                    setEditingEntry((prev) => prev ? ({ ...prev, gpa: value }) : prev)
                  }
                >
                  <Label>GPA (optional)</Label>
                  <Input placeholder="e.g., 3.77 (till 7th semester)" />
                  <Description>Free text - include context if it's not final</Description>
                </TextField>

                <TextField
                  name="description"
                  value={editingEntry?.description || ""}
                  onChange={(value) =>
                    setEditingEntry((prev) => prev ? ({ ...prev, description: value }) : prev)
                  }
                >
                  <Label>Description (optional)</Label>
                  <TextArea placeholder="Honors, relevant coursework, activities..." rows={3} />
                </TextField>

                <TextField
                  name="institution_url"
                  value={editingEntry?.institution_url || ""}
                  onChange={(value) =>
                    setEditingEntry((prev) => prev ? ({ ...prev, institution_url: value }) : prev)
                  }
                >
                  <Label>Institution URL (optional)</Label>
                  <Input placeholder="https://ruet.ac.bd" />
                </TextField>

                <TextField
                  name="institution_logo"
                  value={editingEntry?.institution_logo || ""}
                  onChange={(value) =>
                    setEditingEntry((prev) => prev ? ({ ...prev, institution_logo: value }) : prev)
                  }
                >
                  <Label>Institution Logo URL (optional)</Label>
                  <Input placeholder="https://example.com/logo.png" />
                </TextField>

                <TextField
                  name="sort_order"
                  type="number"
                  value={String(editingEntry?.sort_order || 0)}
                  onChange={(value) =>
                    setEditingEntry((prev) => prev ? ({
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
                      {isPending ? "Saving..." : editingEntry?.id ? "Update" : "Create"}
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
