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
import { FaPlus, FaEdit, FaTrash, FaBlog, FaEye, FaCalendar, FaClock } from "react-icons/fa";
import { createClient } from "@/lib/supabase/client";
import { MDXEditor } from "@/components/admin/MDXEditor";
import type { BlogPost } from "@/lib/supabase/types";
import Link from "next/link";
import Image from "next/image";

const defaultPost: Partial<BlogPost> = {
  slug: "",
  title: "",
  excerpt: "",
  content: "",
  cover_image: "",
  video_url: "",
  tags: [],
  author: "",
  published: false,
  is_featured: false,
  reading_time: 5,
  sort_order: 0,
};

export default function BlogManagementPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<Partial<BlogPost> | null>(null);
  const [tagInput, setTagInput] = useState("");
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [error, setError] = useState("");

  const supabase = createClient();

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const { data, error } = await supabase
        .from("blog_posts")
        .select("*")
        .order("published_at", { ascending: false, nullsFirst: false });

      if (error) throw error;
      setPosts(data || []);
    } catch (error) {
      console.error("Error fetching posts:", error);
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

  const calculateReadingTime = (content: string) => {
    const wordsPerMinute = 200;
    const words = content.trim().split(/\s+/).length;
    return Math.max(1, Math.ceil(words / wordsPerMinute));
  };

  const openModal = (post?: BlogPost) => {
    if (post) {
      setEditingPost(post);
    } else {
      setEditingPost({ ...defaultPost });
    }
    setTagInput("");
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
      setEditingPost((prev) => prev ? ({
        ...prev,
        tags: [...(prev.tags || []), tag],
      }) : prev);
    }
    setTagInput("");
  };

  const removeTag = (tag: string) => {
    setEditingPost((prev) => prev ? ({
      ...prev,
      tags: prev.tags?.filter((t) => t !== tag) || [],
    }) : prev);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editingPost) return;

    setSaving(true);
    setError("");

    const slug = editingPost.slug || generateSlug(editingPost.title || "");
    const readingTime = calculateReadingTime(editingPost.content || "");

    try {
      if (editingPost.id) {
        // Update
        const { error } = await supabase
          .from("blog_posts")
          .update({
            slug,
            title: editingPost.title,
            excerpt: editingPost.excerpt || null,
            content: editingPost.content,
            cover_image: editingPost.cover_image || null,
            video_url: editingPost.video_url || null,
            tags: editingPost.tags || [],
            author: editingPost.author || null,
            published: editingPost.published,
            is_featured: editingPost.is_featured,
            published_at: editingPost.published ? editingPost.published_at || new Date().toISOString() : null,
            reading_time: readingTime,
            sort_order: editingPost.sort_order,
          })
          .eq("id", editingPost.id);

        if (error) throw error;
      } else {
        // Create
        const { error } = await supabase.from("blog_posts").insert({
          slug,
          title: editingPost.title,
          excerpt: editingPost.excerpt || null,
          content: editingPost.content,
          cover_image: editingPost.cover_image || null,
          video_url: editingPost.video_url || null,
          tags: editingPost.tags || [],
          author: editingPost.author || null,
          published: editingPost.published || false,
          is_featured: editingPost.is_featured || false,
          published_at: editingPost.published ? new Date().toISOString() : null,
          reading_time: readingTime,
          sort_order: editingPost.sort_order || 0,
        });

        if (error) throw error;
      }

      await fetchPosts();
      closeModal();
    } catch (error: unknown) {
      console.error("Error saving post:", error);
      setError((error as Error).message || "Failed to save post");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this post?")) return;

    setDeleting(id);
    try {
      const { error } = await supabase.from("blog_posts").delete().eq("id", id);
      if (error) throw error;
      await fetchPosts();
    } catch (error) {
      console.error("Error deleting post:", error);
      alert("Failed to delete post");
    } finally {
      setDeleting(null);
    }
  };

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return "Draft";
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
                key={post.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className="p-4 sm:p-6">
                  <div className="flex flex-col sm:flex-row gap-4">
                    {/* Cover Image */}
                    {post.cover_image && (
                      <div className="relative w-full sm:w-40 h-32 sm:h-24 rounded-lg overflow-hidden shrink-0 bg-muted/20">
                        <Image
                          src={post.cover_image}
                          alt={post.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                    )}

                    {/* Content */}
                    <div className="flex-1 min-w-0">
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
                            {post.is_featured && (
                              <span className="px-2 py-0.5 text-xs bg-accent/10 text-accent rounded-full">
                                Featured
                              </span>
                            )}
                          </div>
                          <p className="text-muted text-sm mt-1 line-clamp-2">
                            {post.excerpt || "No excerpt provided"}
                          </p>
                          <div className="flex items-center gap-3 mt-2 text-sm text-muted flex-wrap">
                            <span className="flex items-center gap-1">
                              <FaCalendar className="w-3 h-3" />
                              {formatDate(post.published_at)}
                            </span>
                            {post.reading_time && (
                              <span className="flex items-center gap-1">
                                <FaClock className="w-3 h-3" />
                                {post.reading_time} min read
                              </span>
                            )}
                            {post.tags && post.tags.length > 0 && (
                              <span className="flex items-center gap-1 flex-wrap">
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
                        <div className="flex gap-1 shrink-0">
                          {post.published && (
                            <Link
                              href={`/blog/${post.slug}`}
                              target="_blank"
                              className="p-2 text-muted hover:text-foreground hover:bg-surface-secondary rounded-lg transition-colors"
                              title="View post"
                            >
                              <FaEye className="w-4 h-4" />
                            </Link>
                          )}
                          <button
                            onClick={() => openModal(post)}
                            className="p-2 text-muted hover:text-foreground hover:bg-surface-secondary rounded-lg transition-colors"
                            title="Edit post"
                          >
                            <FaEdit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(post.id)}
                            disabled={deleting === post.id}
                            className="p-2 text-muted hover:text-danger hover:bg-danger/10 rounded-lg transition-colors disabled:opacity-50"
                            title="Delete post"
                          >
                            {deleting === post.id ? (
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
      <Modal>
      <Modal.Backdrop variant="opaque" isOpen={isModalOpen} onOpenChange={setIsModalOpen}>
        <Modal.Container size="lg" scroll="outside">
          <Modal.Dialog>
            <Modal.CloseTrigger />
            <Modal.Header>
              <Modal.Heading className="mb-2 text-center">
                {editingPost?.id ? "Edit Post" : "New Post"}
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
                  value={editingPost?.title || ""}
                  onChange={(value) =>
                    setEditingPost((prev) => prev ? ({
                      ...prev,
                      title: value,
                      slug: prev.slug || generateSlug(value),
                    }) : prev)
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
                    setEditingPost((prev) => prev ? ({ ...prev, slug: value }) : prev)
                  }
                >
                  <Label>URL Slug</Label>
                  <Input placeholder="how-to-build-a-rest-api" />
                  <Description>Used in the blog post URL</Description>
                  <FieldError />
                </TextField>

                <TextField
                  name="excerpt"
                  value={editingPost?.excerpt || ""}
                  onChange={(value) =>
                    setEditingPost((prev) => prev ? ({ ...prev, excerpt: value }) : prev)
                  }
                >
                  <Label>Excerpt</Label>
                  <TextArea
                    placeholder="Brief description for SEO and previews"
                    rows={2}
                  />
                </TextField>

                <div className="space-y-2">
                  <Label>Content (Markdown/MDX)</Label>
                  <MDXEditor
                    value={editingPost?.content || ""}
                    onChange={(value) =>
                      setEditingPost((prev) => prev ? ({ ...prev, content: value }) : prev)
                    }
                    placeholder="Write your post content in Markdown..."
                    minHeight={350}
                  />
                  <Description>Supports Markdown and MDX formatting</Description>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <TextField
                    name="author"
                    value={editingPost?.author || ""}
                    onChange={(value) =>
                      setEditingPost((prev) => prev ? ({ ...prev, author: value }) : prev)
                    }
                  >
                    <Label>Author (optional)</Label>
                    <Input placeholder="John Doe" />
                  </TextField>

                  <TextField
                    name="cover_image"
                    value={editingPost?.cover_image || ""}
                    onChange={(value) =>
                      setEditingPost((prev) => prev ? ({ ...prev, cover_image: value }) : prev)
                    }
                  >
                    <Label>Cover Image URL (optional)</Label>
                    <Input placeholder="https://..." />
                  </TextField>
                </div>

                <TextField
                  name="video_url"
                  value={editingPost?.video_url || ""}
                  onChange={(value) =>
                    setEditingPost((prev) => prev ? ({ ...prev, video_url: value }) : prev)
                  }
                >
                  <Label>Video URL (optional)</Label>
                  <Input placeholder="https://youtube.com/watch?v=... or https://vimeo.com/..." />
                  <Description>YouTube, Vimeo, or direct video file URL</Description>
                </TextField>

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
                          title="Remove tag"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                </div>

                <TextField
                  name="sort_order"
                  type="number"
                  value={String(editingPost?.sort_order || 0)}
                  onChange={(value) =>
                    setEditingPost((prev) => prev ? ({
                      ...prev,
                      sort_order: parseInt(value) || 0,
                    }) : prev)
                  }
                >
                  <Label>Sort Order</Label>
                  <Input placeholder="0" />
                  <Description>Lower numbers appear first</Description>
                </TextField>

                <div className="flex gap-4">
                  <Checkbox
                    isSelected={editingPost?.published || false}
                    onChange={(checked) =>
                      setEditingPost((prev) => prev ? ({ ...prev, published: checked }) : prev)
                    }
                  >
                    <Checkbox.Control>
                      <Checkbox.Indicator />
                    </Checkbox.Control>
                    <Label>Publish this post</Label>
                  </Checkbox>

                  <Checkbox
                    isSelected={editingPost?.is_featured || false}
                    onChange={(checked) =>
                      setEditingPost((prev) => prev ? ({ ...prev, is_featured: checked }) : prev)
                    }
                  >
                    <Checkbox.Control>
                      <Checkbox.Indicator />
                    </Checkbox.Control>
                    <Label>Featured</Label>
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
                      {isPending ? "Saving..." : editingPost?.id ? "Update" : "Create"}
                    </>
                  )}
                </Button>
              </Modal.Footer>
            </Form>
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
      </Modal>
    </div>
  );
}
