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
  Select,
  ListBox,
  Checkbox,
} from "@heroui/react";
import { motion, AnimatePresence } from "framer-motion";
import { FaPlus, FaEdit, FaTrash, FaCode } from "react-icons/fa";
import { createClient } from "@/lib/supabase/client";
import { IconSearch, IconRenderer } from "@/components/admin/IconSearch";
import { ColorSelect } from "@/components/admin/ColorSelect";
import type { Skill, SkillCategory } from "@/lib/supabase/types";

const defaultSkill: Partial<Skill> = {
  name: "",
  category_id: "",
  level: 80,
  icon: "",
  color: "",
  is_featured: false,
  sort_order: 0,
};

export default function SkillsManagementPage() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [categories, setCategories] = useState<SkillCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSkill, setEditingSkill] = useState<Partial<Skill> | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [error, setError] = useState("");

  const supabase = createClient();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // Fetch skills and categories in parallel
      const [skillsRes, categoriesRes] = await Promise.all([
        supabase.from("skills").select("*").order("sort_order", { ascending: true }),
        supabase.from("skill_categories").select("*").order("sort_order", { ascending: true }),
      ]);

      if (skillsRes.error) throw skillsRes.error;
      if (categoriesRes.error) throw categoriesRes.error;

      setSkills(skillsRes.data || []);
      setCategories(categoriesRes.data || []);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const openModal = (skill?: Skill) => {
    setEditingSkill(skill || { ...defaultSkill, category_id: categories[0]?.id || "" });
    setIsModalOpen(true);
    setError("");
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingSkill(null);
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editingSkill) return;

    setSaving(true);
    setError("");

    try {
      if (editingSkill.id) {
        // Update
        const { error } = await supabase
          .from("skills")
          .update({
            name: editingSkill.name,
            category_id: editingSkill.category_id || null,
            level: editingSkill.level,
            icon: editingSkill.icon || null,
            color: editingSkill.color || null,
            is_featured: editingSkill.is_featured,
            sort_order: editingSkill.sort_order,
          })
          .eq("id", editingSkill.id);

        if (error) throw error;
      } else {
        console.log("Creating skill:", editingSkill.category_id);
        // Create
        const { error } = await supabase.from("skills").insert({
          name: editingSkill.name,
          category_id: editingSkill.category_id || null,
          level: editingSkill.level || 80,
          icon: editingSkill.icon || null,
          color: editingSkill.color || null,
          is_featured: editingSkill.is_featured || false,
          sort_order: editingSkill.sort_order || 0,
        });

        if (error) throw error;
      }

      await fetchData();
      closeModal();
    } catch (error: unknown) {
      console.error("Error saving skill:", error);
      setError((error as Error).message || "Failed to save skill");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this skill?")) return;

    setDeleting(id);
    try {
      const { error } = await supabase.from("skills").delete().eq("id", id);
      if (error) throw error;
      await fetchData();
    } catch (error) {
      console.error("Error deleting skill:", error);
      alert("Failed to delete skill");
    } finally {
      setDeleting(null);
    }
  };

  // Group skills by category_id
  const groupedSkills = skills.reduce(
    (acc, skill) => {
      const categoryId = skill.category_id || "uncategorized";
      if (!acc[categoryId]) {
        acc[categoryId] = [];
      }
      acc[categoryId].push(skill);
      return acc;
    },
    {} as Record<string, Skill[]>
  );

  // Get category name by id
  const getCategoryName = (categoryId: string | null) => {
    if (!categoryId || categoryId === "uncategorized") return "Uncategorized";
    const category = categories.find(c => c.id === categoryId);
    return category?.name || "Unknown";
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">Skills</h1>
          <p className="text-muted mt-1">
            Manage your technical skills and proficiency levels.
          </p>
        </div>
        <Button onPress={() => openModal()} isDisabled={categories.length === 0}>
          <FaPlus className="w-4 h-4" />
          Add Skill
        </Button>
      </div>

      {/* Warning if no categories */}
      {!loading && categories.length === 0 && (
        <Card className="p-4 bg-warning/10 border-warning-soft-hover">
          <p className="text-sm text-warning">
            Please create skill categories first before adding skills.{" "}
            <a href="/admin/dashboard/categories" className="underline font-medium">
              Go to Categories →
            </a>
          </p>
        </Card>
      )}

      {/* Skills List */}
      {loading ? (
        <div className="flex justify-center py-12">
          <Spinner size="lg" />
        </div>
      ) : skills.length === 0 ? (
        <Card className="p-12 text-center">
          <div className="w-16 h-16 rounded-full bg-muted/20 mx-auto flex items-center justify-center mb-4">
            <FaCode className="w-6 h-6 text-muted" />
          </div>
          <h3 className="text-lg font-semibold mb-2">No skills yet</h3>
          <p className="text-muted mb-4">
            Add your first skill to get started.
          </p>
          <Button onPress={() => openModal()} isDisabled={categories.length === 0}>
            <FaPlus className="w-4 h-4" />
            Add Skill
          </Button>
        </Card>
      ) : (
        <div className="space-y-6">
          {Object.entries(groupedSkills).map(([categoryId, categorySkills]) => (
            <div key={categoryId}>
              <h2 className="text-lg font-semibold mb-3">{getCategoryName(categoryId)}</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <AnimatePresence mode="popLayout">
                  {categorySkills.map((skill) => (
                    <motion.div
                      key={skill.id}
                      layout
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                    >
                      <Card className="p-4">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-start gap-3 flex-1 min-w-0">
                            {skill.icon && (
                              <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center shrink-0">
                                <IconRenderer name={skill.icon} className="w-5 h-5 text-accent" />
                              </div>
                            )}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <h3 className="font-medium truncate">
                                  {skill.name}
                                </h3>
                                {skill.is_featured && (
                                  <span className="px-2 py-0.5 text-xs bg-accent/10 text-accent rounded-full">
                                    Featured
                                  </span>
                                )}
                              </div>
                              <p className="text-sm text-muted mt-1">
                                {skill.level}% proficiency
                              </p>
                              {/* Progress bar */}
                              <div className="mt-2 h-2 bg-muted/20 rounded-full overflow-hidden">
                                <div
                                  className="h-full bg-accent rounded-full transition-all"
                                  style={{ width: `${skill.level}%` }}
                                />
                              </div>
                            </div>
                          </div>
                          <div className="flex gap-1">
                            <button
                              onClick={() => openModal(skill)}
                              className="p-2 text-muted hover:text-foreground hover:bg-surface-secondary rounded-lg transition-colors"
                              title="Edit skill"
                            >
                              <FaEdit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(skill.id)}
                              disabled={deleting === skill.id}
                              className="p-2 text-muted hover:text-danger hover:bg-danger/10 rounded-lg transition-colors disabled:opacity-50"
                              title="Delete skill"
                            >
                              {deleting === skill.id ? (
                                <Spinner size="sm" />
                              ) : (
                                <FaTrash className="w-4 h-4" />
                              )}
                            </button>
                          </div>
                        </div>
                      </Card>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add/Edit Modal */}
      <Modal.Backdrop isOpen={isModalOpen} onOpenChange={setIsModalOpen}>
        <Modal.Container>
          <Modal.Dialog className="sm:max-w-md max-h-[90vh] overflow-y-auto">
            <Modal.CloseTrigger />
            <Modal.Header>
              <Modal.Heading>
                {editingSkill?.id ? "Edit Skill" : "Add New Skill"}
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
                  name="name"
                  isRequired
                  value={editingSkill?.name || ""}
                  onChange={(value) =>
                    setEditingSkill((prev) => ({ ...prev, name: value }))
                  }
                >
                  <Label>Skill Name</Label>
                  <Input placeholder="e.g., React, Python, Docker" />
                  <FieldError />
                </TextField>

                <div>
                  <Select
                    name="category_id"
                    selectedKey={editingSkill?.category_id || ""}
                    onSelectionChange={(key) =>
                      setEditingSkill((prev) => ({
                        ...prev,
                        category_id: String(key),
                      }))
                    }
                  >
                    <Label>Category</Label>
                    <Select.Trigger>
                      <Select.Value />
                      <Select.Indicator />
                    </Select.Trigger>
                    <Select.Popover>
                      <ListBox>
                        {categories.map((cat) => (
                          <ListBox.Item key={cat.id} id={cat.id} textValue={cat.name}>
                            {cat.name}
                            <ListBox.ItemIndicator />
                          </ListBox.Item>
                        ))}
                      </ListBox>
                    </Select.Popover>
                  </Select>
                </div>

                <TextField
                  name="level"
                  type="number"
                  isRequired
                  value={String(editingSkill?.level || 80)}
                  onChange={(value) =>
                    setEditingSkill((prev) => ({
                      ...prev,
                      level: Math.min(100, Math.max(0, parseInt(value) || 0)),
                    }))
                  }
                >
                  <Label>Proficiency Level (%)</Label>
                  <Input placeholder="0-100" />
                  <Description>Enter a value between 0 and 100</Description>
                  <FieldError />
                </TextField>

                <div>
                  <Label className="mb-2 block">Icon</Label>
                  <IconSearch
                    value={editingSkill?.icon || ""}
                    onChange={(value) =>
                      setEditingSkill((prev) => ({ ...prev, icon: value }))
                    }
                  />
                  <Description className="mt-1">Search and select an icon for this skill</Description>
                </div>

                <div>
                  <ColorSelect
                    value={editingSkill?.color || ""}
                    onChange={(value) =>
                      setEditingSkill((prev) => ({ ...prev, color: value }))
                    }
                    label="Color (optional)"
                    description="Select a color for this skill"
                  />
                </div>

                <TextField
                  name="sort_order"
                  type="number"
                  value={String(editingSkill?.sort_order || 0)}
                  onChange={(value) =>
                    setEditingSkill((prev) => ({
                      ...prev,
                      sort_order: parseInt(value) || 0,
                    }))
                  }
                >
                  <Label>Sort Order</Label>
                  <Input placeholder="0" />
                  <Description>Lower numbers appear first</Description>
                </TextField>

                <Checkbox
                  isSelected={editingSkill?.is_featured || false}
                  onChange={(checked) =>
                    setEditingSkill((prev) => ({ ...prev, is_featured: checked }))
                  }
                >
                  <Checkbox.Control>
                    <Checkbox.Indicator />
                  </Checkbox.Control>
                  <Label>Featured Skill</Label>
                </Checkbox>
              </Modal.Body>
              <Modal.Footer>
                <Button variant="secondary" slot="close">
                  Cancel
                </Button>
                <Button type="submit" isPending={saving}>
                  {({ isPending }) => (
                    <>
                      {isPending && <Spinner color="current" size="sm" />}
                      {isPending ? "Saving..." : editingSkill?.id ? "Update" : "Create"}
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
