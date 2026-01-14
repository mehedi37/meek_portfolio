"use client";

import dynamic from "next/dynamic";
import { useState, useCallback } from "react";
import { Button, Spinner } from "@heroui/react";
import {
  FaBold,
  FaItalic,
  FaCode,
  FaListUl,
  FaListOl,
  FaLink,
  FaImage,
  FaQuoteRight,
  FaHeading,
  FaTable,
  FaEye,
  FaEdit,
  FaExpand,
  FaCompress
} from "react-icons/fa";

// Dynamically import the MDEditor to avoid SSR issues
const MDEditor = dynamic(
  () => import("@uiw/react-md-editor").then((mod) => mod.default),
  {
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center h-96 bg-surface rounded-lg border border-default">
        <Spinner size="lg" />
      </div>
    )
  }
);

interface MDXEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  minHeight?: number;
}

// Custom toolbar buttons
const toolbarItems = [
  { icon: FaHeading, label: "Heading", syntax: "## " },
  { icon: FaBold, label: "Bold", syntax: "**text**", wrap: true },
  { icon: FaItalic, label: "Italic", syntax: "*text*", wrap: true },
  { icon: FaCode, label: "Code", syntax: "`code`", wrap: true },
  { icon: FaQuoteRight, label: "Quote", syntax: "> " },
  { icon: FaListUl, label: "Bullet List", syntax: "- " },
  { icon: FaListOl, label: "Numbered List", syntax: "1. " },
  { icon: FaLink, label: "Link", syntax: "[text](url)", wrap: true },
  { icon: FaImage, label: "Image", syntax: "![alt](url)" },
  { icon: FaTable, label: "Table", syntax: "| Header | Header |\n| --- | --- |\n| Cell | Cell |" },
];

export function MDXEditor({ value, onChange, placeholder, minHeight = 400 }: MDXEditorProps) {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [previewMode, setPreviewMode] = useState<"edit" | "preview" | "live">("live");

  const insertText = useCallback((syntax: string, wrap?: boolean) => {
    // For wrapped syntax, we need to handle selection
    if (wrap) {
      const selection = window.getSelection()?.toString() || "text";
      const newText = syntax.replace("text", selection);
      onChange(value + newText);
    } else {
      onChange(value + "\n" + syntax);
    }
  }, [value, onChange]);

  return (
    <div
      className={`mdx-editor-container ${isFullscreen ? "fixed inset-0 z-50 bg-background p-4" : ""}`}
      data-color-mode="dark"
    >
      {/* Custom Toolbar */}
      <div className="flex items-center gap-1 p-2 bg-surface-secondary rounded-t-lg border border-b-0 border-default flex-wrap">
        {toolbarItems.map((item) => (
          <button
            key={item.label}
            type="button"
            onClick={() => insertText(item.syntax, item.wrap)}
            className="p-2 text-muted hover:text-foreground hover:bg-default rounded transition-colors"
            title={item.label}
          >
            <item.icon className="w-4 h-4" />
          </button>
        ))}

        <div className="flex-1" />

        {/* View Mode Toggles */}
        <div className="flex items-center gap-1 border-l border-default pl-2 ml-2">
          <button
            type="button"
            onClick={() => setPreviewMode("edit")}
            className={`p-2 rounded transition-colors ${
              previewMode === "edit"
                ? "bg-accent text-white"
                : "text-muted hover:text-foreground hover:bg-default"
            }`}
            title="Edit only"
          >
            <FaEdit className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => setPreviewMode("live")}
            className={`p-2 rounded transition-colors ${
              previewMode === "live"
                ? "bg-accent text-white"
                : "text-muted hover:text-foreground hover:bg-default"
            }`}
            title="Split view"
          >
            <FaEye className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => setPreviewMode("preview")}
            className={`p-2 rounded transition-colors ${
              previewMode === "preview"
                ? "bg-accent text-white"
                : "text-muted hover:text-foreground hover:bg-default"
            }`}
            title="Preview only"
          >
            <FaEye className="w-4 h-4" />
          </button>
        </div>

        {/* Fullscreen Toggle */}
        <button
          type="button"
          onClick={() => setIsFullscreen(!isFullscreen)}
          className="p-2 text-muted hover:text-foreground hover:bg-default rounded transition-colors ml-2"
          title={isFullscreen ? "Exit fullscreen" : "Fullscreen"}
        >
          {isFullscreen ? <FaCompress className="w-4 h-4" /> : <FaExpand className="w-4 h-4" />}
        </button>
      </div>

      {/* Editor */}
      <MDEditor
        value={value}
        onChange={(val) => onChange(val || "")}
        preview={previewMode}
        height={isFullscreen ? "calc(100vh - 120px)" : minHeight}
        visibleDragbar={false}
        hideToolbar={true}
        textareaProps={{
          placeholder: placeholder || "Write your content in Markdown...",
        }}
        className="!rounded-t-none"
      />

      {/* Fullscreen Close Button */}
      {isFullscreen && (
        <div className="mt-4 flex justify-end">
          <Button variant="secondary" onPress={() => setIsFullscreen(false)}>
            Close Fullscreen
          </Button>
        </div>
      )}
    </div>
  );
}

// Export for easier usage
export default MDXEditor;
