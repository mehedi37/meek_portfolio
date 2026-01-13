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
import { FaPlus, FaEdit, FaTrash, FaBlog, FaEye, FaCalendar } from "react-icons/fa";
import Link from "next/link";

interface BlogPost {
  slug: string;
  title: string;
  description: string;
  content: string;
  date: string;
  tags: string[];
  image?: string;
  published: boolean;
}

const defaultPost: Partial<BlogPost> = {
  slug: "",
  title: "",
  description: "",
  content: "",
  date: new Date().toISOString().split("T")[0],
  tags: [],
  image: "",
  published: false,
};

// For now, we'll use local storage to manage blog posts
// In production, you'd want to use a CMS or database
const STORAGE_KEY = "admin_blog_posts";

export default function BlogManagementPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<Partial<BlogPost> | null>(null);
  const [tagInput, setTagInput] = useState("");
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = () => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setPosts(JSON.parse(stored));
      }
    } catch (error) {
      console.error("Error loading posts:", error);
    } finally {
      setLoading(false);
    }
  };

  const savePosts = (newPosts: BlogPost[]) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newPosts));
    setPosts(newPosts);
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  };

  const openModal = (post?: BlogPost) => {
    if (post) {
      setEditingPost(post);
      setTagInput("");
    } else {
      setEditingPost({ ...defaultPost });
      setTagInput("");
    }
    setIsModalOpen(true);
    setError("");
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingPost(null);
    setTagInput("");
    setError("");
  };

  const addTag = () => {
    if (!tagInput.trim()) return;
    const tag = tagInput.trim().toLowerCase();
    if (!editingPost?.tags?.includes(tag)) {
      setEditingPost((prev) => ({
        ...prev,
        tags: [...(prev?.tags || []), tag],
      }));
    }
    setTagInput("");
  };

  const removeTag = (tag: string) => {
    setEditingPost((prev) => ({
      ...prev,
      tags: prev?.tags?.filter((t) => t !== tag) || [],
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editingPost) return;

    setSaving(true);
    setError("");

    const slug = editingPost.slug || generateSlug(editingPost.title || "");

    try {
      const newPost: BlogPost = {
        slug,
        title: editingPost.title || "",
        description: editingPost.description || "",
        content: editingPost.content || "",
        date: editingPost.date || new Date().toISOString().split("T")[0],
        tags: editingPost.tags || [],
        image: editingPost.image,
        published: editingPost.published || false,
      };

      // Check for existing post with same slug
      const existingIndex = posts.findIndex((p) => p.slug === slug);

      if (existingIndex !== -1) {
        // Update existing
        const updated = [...posts];
        updated[existingIndex] = newPost;
        savePosts(updated);
      } else {
        // Add new
        savePosts([newPost, ...posts]);
      }

      closeModal();
    } catch (error: unknown) {
      console.error("Error saving post:", error);
      setError((error as Error).message || "Failed to save post");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = (slug: string) => {
    if (!confirm("Are you sure you want to delete this post?")) return;

    setDeleting(slug);
    try {
      const updated = posts.filter((p) => p.slug !== slug);
      savePosts(updated);
    } catch (error) {
      console.error("Error deleting post:", error);
      alert("Failed to delete post");
    } finally {
      setDeleting(null);
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">Blog Posts</h1>
          <p className="text-muted mt-1">
            Create and manage your blog content.
          </p>
        </div>
        <Button onPress={() => openModal()}>
          <FaPlus className="w-4 h-4" />
          New Post
        </Button>
      </div>

      {/* Info Card */}
      <Card className="p-4 bg-accent/5 border-accent/20">
        <p className="text-sm">
          <strong>Note:</strong> Blog posts are currently stored locally.
          For production, you&apos;ll want to create MDX files in the{" "}
          <code className="px-1 py-0.5 bg-surface rounded text-xs">content/blog/</code> folder
          or integrate with a CMS.
        </p>
      </Card>

      {/* Posts List */}
      {loading ? (
        <div className="flex justify-center py-12">
          <Spinner size="lg" />
        </div>
      ) : posts.length === 0 ? (
        <Card className="p-12 text-center">
          <div className="w-16 h-16 rounded-full bg-muted/20 mx-auto flex items-center justify-center mb-4">
            <FaBlog className="w-6 h-6 text-muted" />
          </div>
          <h3 className="text-lg font-semibold mb-2">No blog posts yet</h3>
          <p className="text-muted mb-4">
            Start writing your first blog post to share your knowledge.
          </p>
          <Button onPress={() => openModal()}>
            <FaPlus className="w-4 h-4" />
            Create Post
          </Button>
        </Card>
      ) : (
        <div className="space-y-4">
          <AnimatePresence mode="popLayout">
            {posts.map((post, index) => (
              <motion.div
                key={post.slug}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className="p-6">
                  <div className="flex flex-col sm:flex-row gap-4">
                    {/* Content */}
                    <div className="flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h3 className="font-semibold text-lg truncate">
                              {post.title}
                            </h3>
                            <span
                              className={`px-2 py-0.5 text-xs rounded-full ${
                                post.published
                                  ? "bg-green-500/10 text-green-500"
                                  : "bg-yellow-500/10 text-yellow-500"
                              }`}
                            >
                              {post.published ? "Published" : "Draft"}
                            </span>
                          </div>
                          <p className="text-muted text-sm mt-1 line-clamp-2">
                            {post.description}
                          </p>
                          <div className="flex items-center gap-3 mt-2 text-sm text-muted">
                            <span className="flex items-center gap-1">
                              <FaCalendar className="w-3 h-3" />
                              {formatDate(post.date)}
                            </span>
                            {post.tags?.length > 0 && (
                              <span className="flex items-center gap-1">
                                {post.tags.slice(0, 3).map((tag) => (
                                  <span
                                    key={tag}
                                    className="px-2 py-0.5 bg-surface-secondary rounded-full text-xs"
                                  >
                                    #{tag}
                                  </span>
                                ))}
                                {post.tags.length > 3 && (
                                  <span className="text-xs">
                                    +{post.tags.length - 3}
                                  </span>
                                )}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-1">
                          {post.published && (
                            <Link
                              href={`/blog/${post.slug}`}
                              target="_blank"
                              className="p-2 text-muted hover:text-foreground hover:bg-surface-secondary rounded-lg transition-colors"
                            >
                              <FaEye className="w-4 h-4" />
                            </Link>
                          )}
                          <button
                            onClick={() => openModal(post)}
                            className="p-2 text-muted hover:text-foreground hover:bg-surface-secondary rounded-lg transition-colors"
                          >
                            <FaEdit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(post.slug)}
                            disabled={deleting === post.slug}
                            className="p-2 text-muted hover:text-danger hover:bg-danger/10 rounded-lg transition-colors disabled:opacity-50"
                          >
                            {deleting === post.slug ? (
                              <Spinner size="sm" />
                            ) : (
                              <FaTrash className="w-4 h-4" />
                            )}
                          </button>
                        </div>
                      </div>
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
        <Modal.Container size="lg" scroll="inside">
          <Modal.Dialog>
            <Modal.CloseTrigger />
            <Modal.Header>
              <Modal.Heading>
                {editingPost?.slug && posts.some((p) => p.slug === editingPost.slug)
                  ? "Edit Post"
                  : "New Post"}
              </Modal.Heading>
            </Modal.Header>
            <Form onSubmit={handleSubmit}>
              <Modal.Body className="space-y-4">
                {error && (
                  <div className="p-3 rounded-lg bg-danger/10 border border-danger/20">
                    <p className="text-sm text-danger">{error}</p>
                  </div>
                )}

                <TextField
                  name="title"
                  isRequired
                  value={editingPost?.title || ""}
                  onChange={(value) =>
                    setEditingPost((prev) => ({
                      ...prev,
                      title: value,
                      slug: prev?.slug || generateSlug(value),
                    }))
                  }
                >
                  <Label>Post Title</Label>
                  <Input placeholder="e.g., How to Build a REST API" />
                  <FieldError />
                </TextField>

                <TextField
                  name="slug"
                  isRequired
                  value={editingPost?.slug || ""}
                  onChange={(value) =>
                    setEditingPost((prev) => ({ ...prev, slug: value }))
                  }
                >
                  <Label>URL Slug</Label>
                  <Input placeholder="how-to-build-a-rest-api" />
                  <Description>Used in the blog post URL</Description>
                  <FieldError />
                </TextField>

                <TextField
                  name="description"
                  isRequired
                  value={editingPost?.description || ""}
                  onChange={(value) =>
                    setEditingPost((prev) => ({ ...prev, description: value }))
                  }
                >
                  <Label>Description</Label>
                  <TextArea
                    placeholder="Brief description for SEO and previews"
                    rows={2}
                  />
                  <FieldError />
                </TextField>

                <TextField
                  name="content"
                  isRequired
                  value={editingPost?.content || ""}
                  onChange={(value) =>
                    setEditingPost((prev) => ({ ...prev, content: value }))
                  }
                >
                  <Label>Content (Markdown)</Label>
                  <TextArea
                    placeholder="Write your post content in Markdown..."
                    rows={12}
                    className="font-mono text-sm"
                  />
                  <Description>Supports Markdown formatting</Description>
                  <FieldError />
                </TextField>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <TextField
                    name="date"
                    type="date"
                    value={editingPost?.date || ""}
                    onChange={(value) =>
                      setEditingPost((prev) => ({ ...prev, date: value }))
                    }
                  >
                    <Label>Publish Date</Label>
                    <Input />
                  </TextField>

                  <TextField
                    name="image"
                    value={editingPost?.image || ""}
                    onChange={(value) =>
                      setEditingPost((prev) => ({ ...prev, image: value }))
                    }
                  >
                    <Label>Cover Image URL (optional)</Label>
                    <Input placeholder="https://..." />
                  </TextField>
                </div>

                {/* Tags */}
                <div className="space-y-2">
                  <Label>Tags</Label>
                  <div className="flex gap-2">
                    <Input
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      placeholder="Add tag"
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          addTag();
                        }
                      }}
                      className="flex-1"
                    />
                    <Button type="button" variant="secondary" onPress={addTag}>
                      Add
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {editingPost?.tags?.map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center gap-1 px-2 py-1 bg-surface-secondary rounded-full text-sm"
                      >
                        #{tag}
                        <button
                          type="button"
                          onClick={() => removeTag(tag)}
                          className="ml-1 text-muted hover:text-danger"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                </div>

                <Checkbox
                  isSelected={editingPost?.published || false}
                  onChange={(checked) =>
                    setEditingPost((prev) => ({ ...prev, published: checked }))
                  }
                >
                  <Checkbox.Control>
                    <Checkbox.Indicator />
                  </Checkbox.Control>
                  <Label>Publish this post</Label>
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
                      {isPending
                        ? "Saving..."
                        : editingPost?.slug && posts.some((p) => p.slug === editingPost.slug)
                          ? "Update"
                          : "Create"}
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
