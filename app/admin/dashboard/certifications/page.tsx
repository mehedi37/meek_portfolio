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
  Description,
  FieldError,
  Spinner,
  Checkbox,
} from "@heroui/react";
import { motion, AnimatePresence } from "framer-motion";
import { FaPlus, FaEdit, FaTrash, FaCertificate, FaExternalLinkAlt } from "react-icons/fa";
import { createClient } from "@/lib/supabase/client";
import type { Certification } from "@/lib/supabase/types";
import Image from "next/image";

const defaultCertification: Partial<Certification> = {
  title: "",
  issuer: "",
  date: "",
  credential_url: "",
  image: "",
  is_active: true,
  sort_order: 0,
};

export default function CertificationsManagementPage() {
  const [certifications, setCertifications] = useState<Certification[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCert, setEditingCert] = useState<Partial<Certification> | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [error, setError] = useState("");

  const supabase = createClient();

  useEffect(() => {
    fetchCertifications();
  }, []);

  const fetchCertifications = async () => {
    try {
      const { data, error } = await supabase
        .from("certifications")
        .select("*")
        .order("date", { ascending: false })
        .order("sort_order", { ascending: true });

      if (error) throw error;
      setCertifications(data || []);
    } catch (error) {
      console.error("Error fetching certifications:", error);
    } finally {
      setLoading(false);
    }
  };

  const openModal = (cert?: Certification) => {
    setEditingCert(cert || { ...defaultCertification });
    setIsModalOpen(true);
    setError("");
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingCert(null);
    setError("");
  };

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", { month: "short", year: "numeric" });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editingCert) return;

    setSaving(true);
    setError("");

    try {
      if (editingCert.id) {
        // Update
        const { error } = await supabase
          .from("certifications")
          .update({
            title: editingCert.title,
            issuer: editingCert.issuer,
            date: editingCert.date,
            credential_url: editingCert.credential_url || null,
            image: editingCert.image || null,
            is_active: editingCert.is_active,
            sort_order: editingCert.sort_order,
          })
          .eq("id", editingCert.id);

        if (error) throw error;
      } else {
        // Create
        const { error } = await supabase.from("certifications").insert({
          title: editingCert.title,
          issuer: editingCert.issuer,
          date: editingCert.date,
          credential_url: editingCert.credential_url || null,
          image: editingCert.image || null,
          is_active: editingCert.is_active !== false,
          sort_order: editingCert.sort_order || 0,
        });

        if (error) throw error;
      }

      await fetchCertifications();
      closeModal();
    } catch (error: unknown) {
      console.error("Error saving certification:", error);
      setError((error as Error).message || "Failed to save certification");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this certification?")) return;

    setDeleting(id);
    try {
      const { error } = await supabase.from("certifications").delete().eq("id", id);
      if (error) throw error;
      await fetchCertifications();
    } catch (error) {
      console.error("Error deleting certification:", error);
      alert("Failed to delete certification");
    } finally {
      setDeleting(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">Certifications</h1>
          <p className="text-muted mt-1">
            Showcase your professional certifications and credentials.
          </p>
        </div>
        <Button onPress={() => openModal()}>
          <FaPlus className="w-4 h-4" />
          Add Certification
        </Button>
      </div>

      {/* Certifications List */}
      {loading ? (
        <div className="flex justify-center py-12">
          <Spinner size="lg" />
        </div>
      ) : certifications.length === 0 ? (
        <Card className="p-12 text-center">
          <div className="w-16 h-16 rounded-full bg-muted/20 mx-auto flex items-center justify-center mb-4">
            <FaCertificate className="w-6 h-6 text-muted" />
          </div>
          <h3 className="text-lg font-semibold mb-2">No certifications yet</h3>
          <p className="text-muted mb-4">
            Add your first certification to showcase your credentials.
          </p>
          <Button onPress={() => openModal()}>
            <FaPlus className="w-4 h-4" />
            Add Certification
          </Button>
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence mode="popLayout">
            {certifications.map((cert) => (
              <motion.div
                key={cert.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
              >
                <Card className="overflow-hidden">
                  {/* Image */}
                  <div className="relative h-32 bg-muted/20">
                    {cert.image ? (
                      <Image
                        src={cert.image}
                        alt={cert.title}
                        fill
                        className="object-contain p-4"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <FaCertificate className="w-12 h-12 text-muted" />
                      </div>
                    )}
                    {!cert.is_active && (
                      <span className="absolute top-2 right-2 px-2 py-0.5 text-xs bg-muted text-white rounded-full">
                        Inactive
                      </span>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-4">
                    <h3 className="font-semibold truncate">{cert.title}</h3>
                    <p className="text-sm text-muted mt-1">{cert.issuer}</p>
                    <p className="text-xs text-muted mt-1">{formatDate(cert.date)}</p>

                    {/* Actions */}
                    <div className="flex items-center gap-2 mt-3">
                      {cert.credential_url && (
                        <a
                          href={cert.credential_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 text-muted hover:text-accent hover:bg-accent/10 rounded-lg transition-colors"
                          title="View credential"
                        >
                          <FaExternalLinkAlt className="w-3 h-3" />
                        </a>
                      )}
                      <div className="flex-1" />
                      <button
                        onClick={() => openModal(cert)}
                        className="p-2 text-muted hover:text-foreground hover:bg-surface-secondary rounded-lg transition-colors"
                        title="Edit certification"
                      >
                        <FaEdit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(cert.id)}
                        disabled={deleting === cert.id}
                        className="p-2 text-muted hover:text-danger hover:bg-danger/10 rounded-lg transition-colors disabled:opacity-50"
                        title="Delete certification"
                      >
                        {deleting === cert.id ? (
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
      )}

      {/* Add/Edit Modal */}
      <Modal.Backdrop variant="opaque" isOpen={isModalOpen} onOpenChange={setIsModalOpen}>
        <Modal.Container size="md" scroll="outside">
          <Modal.Dialog>
            <Modal.CloseTrigger />
            <Modal.Header>
              <Modal.Heading className="mb-2 text-center">
                {editingCert?.id ? "Edit Certification" : "Add New Certification"}
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
                  value={editingCert?.title || ""}
                  onChange={(value) =>
                    setEditingCert((prev) => prev ? ({ ...prev, title: value }) : prev)
                  }
                >
                  <Label>Certification Title</Label>
                  <Input placeholder="e.g., AWS Solutions Architect" />
                  <FieldError />
                </TextField>

                <TextField
                  name="issuer"
                  isRequired
                  value={editingCert?.issuer || ""}
                  onChange={(value) =>
                    setEditingCert((prev) => prev ? ({ ...prev, issuer: value }) : prev)
                  }
                >
                  <Label>Issuing Organization</Label>
                  <Input placeholder="e.g., Amazon Web Services" />
                  <FieldError />
                </TextField>

                <TextField
                  name="date"
                  type="date"
                  isRequired
                  value={editingCert?.date || ""}
                  onChange={(value) =>
                    setEditingCert((prev) => prev ? ({ ...prev, date: value }) : prev)
                  }
                >
                  <Label>Issue Date</Label>
                  <Input />
                  <FieldError />
                </TextField>

                <TextField
                  name="credential_url"
                  value={editingCert?.credential_url || ""}
                  onChange={(value) =>
                    setEditingCert((prev) => prev ? ({ ...prev, credential_url: value }) : prev)
                  }
                >
                  <Label>Credential URL (optional)</Label>
                  <Input placeholder="https://verify.example.com/cert/123" />
                  <Description>Link to verify the certification</Description>
                </TextField>

                <TextField
                  name="image"
                  value={editingCert?.image || ""}
                  onChange={(value) =>
                    setEditingCert((prev) => prev ? ({ ...prev, image: value }) : prev)
                  }
                >
                  <Label>Badge/Logo URL (optional)</Label>
                  <Input placeholder="https://example.com/badge.png" />
                </TextField>

                <TextField
                  name="sort_order"
                  type="number"
                  value={String(editingCert?.sort_order || 0)}
                  onChange={(value) =>
                    setEditingCert((prev) => prev ? ({
                      ...prev,
                      sort_order: parseInt(value) || 0,
                    }) : prev)
                  }
                >
                  <Label>Sort Order</Label>
                  <Input placeholder="0" />
                  <Description>Lower numbers appear first</Description>
                </TextField>

                <Checkbox
                  isSelected={editingCert?.is_active !== false}
                  onChange={(checked) =>
                    setEditingCert((prev) => prev ? ({ ...prev, is_active: checked }) : prev)
                  }
                >
                  <Checkbox.Control>
                    <Checkbox.Indicator />
                  </Checkbox.Control>
                  <Label>Active</Label>
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
                      {isPending ? "Saving..." : editingCert?.id ? "Update" : "Create"}
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
