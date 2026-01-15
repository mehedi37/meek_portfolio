"use client";

import { useEffect, useState } from "react";
import {
  Button,
  Card,
  Spinner,
  Modal,
  Input,
  Label,
  TextField,
} from "@heroui/react";
import {
  FaEnvelope,
  FaInbox,
  FaTrash,
  FaEye,
  FaSearch,
  FaCheckCircle,
  FaExclamationTriangle,
  FaSync,
} from "react-icons/fa";
import { createClient } from "@/lib/supabase/client";
import { motion, AnimatePresence } from "framer-motion";

interface Contact {
  id: string;
  name: string;
  email: string;
  subject: string | null;
  message: string;
  created_at: string;
  is_read: boolean;
}

export default function ContactsPage() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const supabase = createClient();

  useEffect(() => {
    loadContacts();
  }, []);

  const loadContacts = async () => {
    try {
      setRefreshing(true);
      const { data, error } = await supabase
        .from("contacts")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setContacts(data || []);
    } catch (error) {
      console.error("Error loading contacts:", error);
      alert("Failed to load contacts");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this message?")) return;

    setDeleting(id);
    try {
      const { error } = await supabase.from("contacts").delete().eq("id", id);

      if (error) throw error;

      setContacts((prev) => prev.filter((c) => c.id !== id));
      if (selectedContact?.id === id) {
        setSelectedContact(null);
      }
    } catch (error) {
      console.error("Error deleting contact:", error);
      alert("Failed to delete message");
    } finally {
      setDeleting(null);
    }
  };

  const markAsRead = async (contact: Contact) => {
    if (contact.is_read) return;

    try {
      const { error } = await supabase
        .from("contacts")
        .update({ is_read: true })
        .eq("id", contact.id);

      if (error) throw error;

      setContacts((prev) =>
        prev.map((c) => (c.id === contact.id ? { ...c, is_read: true } : c))
      );
    } catch (error) {
      console.error("Error marking as read:", error);
    }
  };

  const openMessage = (contact: Contact) => {
    setSelectedContact(contact);
    markAsRead(contact);
  };

  const filteredContacts = contacts.filter((contact) => {
    const search = searchQuery.toLowerCase();
    return (
      contact.name.toLowerCase().includes(search) ||
      contact.email.toLowerCase().includes(search) ||
      contact.message.toLowerCase().includes(search) ||
      contact.subject?.toLowerCase().includes(search)
    );
  });

  const unreadCount = contacts.filter((c) => !c.is_read).length;

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-6xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">Contact Messages</h1>
          <p className="text-muted mt-1">
            {contacts.length} total • {unreadCount} unread
          </p>
        </div>
        <Button
          variant="secondary"
          onPress={loadContacts}
          isPending={refreshing}
        >
          {({ isPending }) => (
            <>
              {isPending ? (
                <Spinner color="current" size="sm" />
              ) : (
                <FaSync className="w-4 h-4" />
              )}
              Refresh
            </>
          )}
        </Button>
      </div>

      {/* Email Configuration Warning */}
      {/* <Card className="p-4 border-warning/50 bg-warning/5">
        <div className="flex items-start gap-3">
          <FaExclamationTriangle className="w-5 h-5 text-warning mt-0.5" />
          <div className="flex-1">
            <h3 className="font-semibold text-warning mb-1">
              Email Notifications Not Configured
            </h3>
            <p className="text-sm text-muted mb-3">
              To receive email notifications when someone contacts you, you need to:
            </p>
            <ol className="text-sm text-muted space-y-2 list-decimal list-inside">
              <li>
                <strong>Install Resend package:</strong>{" "}
                <code className="bg-surface px-2 py-1 rounded text-xs">
                  npm install resend
                </code>
              </li>
              <li>
                <strong>Verify your domain</strong> in the{" "}
                <a
                  href="https://resend.com/domains"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-accent hover:underline"
                >
                  Resend Dashboard
                </a>{" "}
                (add DNS records)
              </li>
              <li>
                <strong>Update the "from" email</strong> in{" "}
                <code className="bg-surface px-2 py-1 rounded text-xs">
                  app/api/contact/route.ts
                </code>{" "}
                to use your verified domain (e.g., noreply@yourdomain.com)
              </li>
              <li>
                <strong>Uncomment the email function</strong> in the contact
                API route
              </li>
            </ol>
            <p className="text-sm text-muted mt-3">
              <strong>Note:</strong> Resend requires a verified domain to send
              emails. You cannot use random email addresses. Free tier includes
              100 emails/day.
            </p>
          </div>
        </div>
      </Card> */}

      {/* Search */}
      <Card className="p-4">
        <TextField
          name="search"
          value={searchQuery}
          onChange={setSearchQuery}
        >
          <div className="flex items-center gap-3">
            <FaSearch className="w-4 h-4 text-muted" />
            <Label className="sr-only">Search messages</Label>
            <Input
              placeholder="Search by name, email, subject, or message..."
              className="flex-1"
            />
          </div>
        </TextField>
      </Card>

      {/* Messages List */}
      {filteredContacts.length === 0 ? (
        <Card className="p-12">
          <div className="text-center">
            <FaInbox className="w-12 h-12 mx-auto mb-4 text-muted opacity-50" />
            <h3 className="text-lg font-semibold mb-2">
              {searchQuery ? "No messages found" : "No messages yet"}
            </h3>
            <p className="text-muted">
              {searchQuery
                ? "Try adjusting your search query"
                : "Messages from your contact form will appear here"}
            </p>
          </div>
        </Card>
      ) : (
        <div className="grid gap-4">
          <AnimatePresence mode="popLayout">
            {filteredContacts.map((contact, index) => (
              <motion.div
                key={contact.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ delay: index * 0.05 }}
              >
                <div
                  onClick={() => openMessage(contact)}
                  className="cursor-pointer"
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      openMessage(contact);
                    }
                  }}
                >
                  <Card
                    className={`p-4 transition-all hover:shadow-lg ${
                      !contact.is_read
                        ? "border-accent/30 bg-accent/5"
                        : "hover:bg-surface-secondary"
                    }`}
                  >
                  <div className="flex items-start justify-between gap-4">
                    {/* Left: Message Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-2">
                        {!contact.is_read && (
                          <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                        )}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-semibold">
                              {contact.name}
                            </span>
                            <span className="text-muted text-sm">
                              {contact.email}
                            </span>
                          </div>
                          {contact.subject && (
                            <p className="text-sm font-medium text-accent mt-1">
                              Sub: {contact.subject}
                            </p>
                          )}
                        </div>
                      </div>
                      <p className="text-sm text-muted line-clamp-2">
                        {contact.message.slice(0, 100)}
                        {contact.message.length > 100 ? "..." : ""}
                      </p>
                    </div>

                    {/* Right: Actions */}
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted whitespace-nowrap">
                        {new Date(contact.created_at).toLocaleDateString(
                          "en-US",
                          {
                            month: "short",
                            day: "numeric",
                            year:
                              new Date(contact.created_at).getFullYear() !==
                              new Date().getFullYear()
                                ? "numeric"
                                : undefined,
                          }
                        )}
                      </span>
                      <div
                        onClick={(e) => {
                          e.stopPropagation();
                          openMessage(contact);
                        }}
                      >
                        <Button
                          variant="ghost"
                          size="sm"
                          isIconOnly
                          aria-label="View message"
                        >
                          <FaEye className="w-4 h-4" />
                        </Button>
                      </div>
                      <div
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(contact.id);
                        }}
                      >
                        <Button
                          variant="danger-soft"
                          size="sm"
                          isIconOnly
                          isPending={deleting === contact.id}
                          aria-label="Delete message"
                        >
                          {deleting === contact.id ? (
                            <Spinner color="current" size="sm" />
                          ) : (
                            <FaTrash className="w-4 h-4" />
                          )}
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Message Detail Modal */}
      <Modal.Backdrop
        isOpen={!!selectedContact}
        onOpenChange={(open) => !open && setSelectedContact(null)}
      >
        <Modal.Container scroll="outside">
          <Modal.Dialog className="sm:max-w-2xl">
            <Modal.CloseTrigger />
            <Modal.Header>
              <Modal.Icon className="bg-accent/10 text-accent">
                <FaEnvelope className="w-5 h-5" />
              </Modal.Icon>
              <Modal.Heading>
                Subject: {selectedContact?.subject || "Message from Contact Form"}
              </Modal.Heading>
            </Modal.Header>
            <Modal.Body>
              {selectedContact && (
                <div className="space-y-4">
                  {/* Sender Info */}
                  <Card className="p-4" variant="secondary">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <p className="text-xs text-muted uppercase tracking-wide mb-1">
                          From
                        </p>
                        <p className="font-medium">{selectedContact.name}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted uppercase tracking-wide mb-1">
                          Email
                        </p>
                        <a
                          href={`mailto:${selectedContact.email}`}
                          className="text-accent hover:underline"
                        >
                          {selectedContact.email}
                        </a>
                      </div>
                      <div className="sm:col-span-2">
                        <p className="text-xs text-muted uppercase tracking-wide mb-1">
                          Date
                        </p>
                        <p className="text-sm">
                          {new Date(
                            selectedContact.created_at
                          ).toLocaleDateString("en-US", {
                            weekday: "long",
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      </div>
                    </div>
                  </Card>

                  {/* Message Content */}
                  <div>
                    <p className="text-xs text-muted uppercase tracking-wide mb-2">
                      Message
                    </p>
                    <Card className="p-4" variant="tertiary">
                      <p className="whitespace-pre-wrap text-sm leading-relaxed">
                        {selectedContact.message}
                      </p>
                    </Card>
                  </div>

                  {/* Quick Actions */}
                  <div className="flex flex-col sm:flex-row gap-3 pt-2">
                    <Button
                      className="flex-1"
                      variant="secondary"
                      onPress={() => {
                        window.location.href = `mailto:${selectedContact.email}?subject=Re: ${selectedContact.subject || "Your message"}`;
                      }}
                    >
                      <FaEnvelope className="w-4 h-4" />
                      Reply via Email
                    </Button>
                    <Button
                      variant="danger-soft"
                      onPress={() => {
                        handleDelete(selectedContact.id);
                        setSelectedContact(null);
                      }}
                    >
                      <FaTrash className="w-4 h-4" />
                      Delete
                    </Button>
                  </div>
                </div>
              )}
            </Modal.Body>
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </div>
  );
}
