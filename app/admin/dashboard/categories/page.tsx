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
} from "@heroui/react";
import { motion, AnimatePresence } from "framer-motion";
import { FaPlus, FaEdit, FaTrash, FaLayerGroup } from "react-icons/fa";
import { HiCode, HiServer, HiDatabase, HiCloud } from "react-icons/hi";
import { createClient } from "@/lib/supabase/client";
import { IconSearch, IconRenderer } from "@/components/admin/IconSearch";
import { ColorSelect } from "@/components/admin/ColorSelect";
import type { SkillCategory } from "@/lib/supabase/types";

const defaultCategory: Partial<SkillCategory> = {
  name: "",
  description: "",
  icon: "",
  color: "accent",
  sort_order: 0,
};

export default function SkillCategoriesPage() {
  const [categories, setCategories] = useState<SkillCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Partial<SkillCategory> | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [error, setError] = useState("");

  const supabase = createClient();

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from("skill_categories")
        .select("*")
        .order("sort_order", { ascending: true });

      if (error) throw error;
      setCategories(data || []);
    } catch (error) {
      console.error("Error fetching categories:", error);
    } finally {
      setLoading(false);
    }
  };

  const openModal = (category?: SkillCategory) => {
    setEditingCategory(category || { ...defaultCategory });
    setIsModalOpen(true);
    setError("");
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingCategory(null);
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editingCategory) return;

    setSaving(true);
    setError("");

    try {
      if (editingCategory.id) {
        // Update
        const { error } = await supabase
          .from("skill_categories")
          .update({
            name: editingCategory.name,
            description: editingCategory.description || null,
            icon: editingCategory.icon || null,
            color: editingCategory.color || null,
            sort_order: editingCategory.sort_order || 0,
          })
          .eq("id", editingCategory.id);

        if (error) throw error;
      } else {
        // Create
        const { error } = await supabase.from("skill_categories").insert({
          name: editingCategory.name,
          description: editingCategory.description || null,
          icon: editingCategory.icon || null,
          color: editingCategory.color || null,
          sort_order: editingCategory.sort_order || 0,
        });

        if (error) throw error;
      }

      await fetchCategories();
      closeModal();
    } catch (error: unknown) {
      console.error("Error saving category:", error);
      setError((error as Error).message || "Failed to save category");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this category? This will NOT delete skills in this category.")) return;

    setDeleting(id);
    try {
      const { error } = await supabase.from("skill_categories").delete().eq("id", id);
      if (error) throw error;
      await fetchCategories();
    } catch (error) {
      console.error("Error deleting category:", error);
      alert("Failed to delete category. Make sure there are no skills using this category.");
    } finally {
      setDeleting(null);
    }
  };

  // Get default icon based on category
  const getDefaultIcon = (name: string) => {
    const lower = name.toLowerCase();
    if (lower.includes("front")) return HiCode;
    if (lower.includes("back")) return HiServer;
    if (lower.includes("data")) return HiDatabase;
    if (lower.includes("devops") || lower.includes("cloud")) return HiCloud;
    return FaLayerGroup;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">Skill Categories</h1>
          <p className="text-muted mt-1">
            Organize your skills into categories like Frontend, Backend, etc.
          </p>
        </div>
        <Button onPress={() => openModal()}>
          <FaPlus className="w-4 h-4" />
          Add Category
        </Button>
      </div>

      {/* Categories List */}
      {loading ? (
        <div className="flex justify-center py-12">
          <Spinner size="lg" />
        </div>
      ) : categories.length === 0 ? (
        <Card className="p-12 text-center">
          <div className="w-16 h-16 rounded-full bg-muted/20 mx-auto flex items-center justify-center mb-4">
            <FaLayerGroup className="w-6 h-6 text-muted" />
          </div>
          <h3 className="text-lg font-semibold mb-2">No categories yet</h3>
          <p className="text-muted mb-4">
            Create categories to organize your skills.
          </p>
          <Button onPress={() => openModal()}>
            <FaPlus className="w-4 h-4" />
            Add Category
          </Button>
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <AnimatePresence mode="popLayout">
            {categories.map((category) => {
              const DefaultIcon = getDefaultIcon(category.name);
              return (
                <motion.div
                  key={category.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                >
                  <Card className="p-6">
                    <div className="flex items-start gap-4">
                      <div className={`w-12 h-12 rounded-xl bg-${category.color || 'accent'}/10 flex items-center justify-center`}>
                        {category.icon ? (
                          <IconRenderer name={category.icon} className={`w-6 h-6 text-${category.color || 'accent'}`} />
                        ) : (
                          <DefaultIcon className={`w-6 h-6 text-${category.color || 'accent'}`} />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold truncate">{category.name}</h3>
                        {category.description && (
                          <p className="text-sm text-muted mt-1 line-clamp-2">
                            {category.description}
                          </p>
                        )}
                        <p className="text-xs text-muted mt-2">
                          Sort order: {category.sort_order}
                        </p>
                      </div>
                      <div className="flex flex-col gap-1">
                        <button
                          onClick={() => openModal(category)}
                          className="p-2 text-muted hover:text-foreground hover:bg-surface-secondary rounded-lg transition-colors"
                          title="Edit category"
                        >
                          <FaEdit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(category.id)}
                          disabled={deleting === category.id}
                          className="p-2 text-muted hover:text-danger hover:bg-danger/10 rounded-lg transition-colors disabled:opacity-50"
                        >
                          {deleting === category.id ? (
                            <Spinner size="sm" />
                          ) : (
                            <FaTrash className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              );
            })}
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
                {editingCategory?.id ? "Edit Category" : "Add New Category"}
              </Modal.Heading>
            </Modal.Header>
            <Form onSubmit={handleSubmit}>
              <Modal.Body className="space-y-4">
                {error && (
                  <div className="p-3 rounded-lg bg-danger/10 border border-danger-soft-hover">
                    <p className="text-sm text-danger">{error}</p>
                  </div>
                )}

                <TextField
                  name="name"
                  isRequired
                  value={editingCategory?.name || ""}
                  onChange={(value) =>
                    setEditingCategory((prev) => ({ ...prev, name: value }))
                  }
                >
                  <Label>Category Name</Label>
                  <Input placeholder="e.g., Frontend Development" />
                  <FieldError />
                </TextField>

                <TextField
                  name="description"
                  value={editingCategory?.description || ""}
                  onChange={(value) =>
                    setEditingCategory((prev) => ({ ...prev, description: value }))
                  }
                >
                  <Label>Description (optional)</Label>
                  <TextArea placeholder="A brief description of this category" rows={2} />
                </TextField>

                <div>
                  <Label className="mb-2 block">Icon</Label>
                  <IconSearch
                    value={editingCategory?.icon || ""}
                    onChange={(value) =>
                      setEditingCategory((prev) => ({ ...prev, icon: value }))
                    }
                  />
                </div>

                <div>
                  <ColorSelect
                    value={editingCategory?.color || "accent"}
                    onChange={(value) =>
                      setEditingCategory((prev) => ({ ...prev, color: value }))
                    }
                    label="Color"
                    description="Select a color theme for this category"
                  />
                </div>

                <TextField
                  name="sort_order"
                  type="number"
                  value={String(editingCategory?.sort_order || 0)}
                  onChange={(value) =>
                    setEditingCategory((prev) => ({
                      ...prev,
                      sort_order: parseInt(value) || 0,
                    }))
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
                      {isPending ? "Saving..." : editingCategory?.id ? "Update" : "Create"}
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
