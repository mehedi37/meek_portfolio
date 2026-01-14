"use client";

import { Label, ListBox, Select, Description } from "@heroui/react";

// Color options for the design system
const colorOptions = [
  { id: "accent", name: "Accent", color: "bg-accent" },
  { id: "success", name: "Success", color: "bg-success" },
  { id: "warning", name: "Warning", color: "bg-warning" },
  { id: "danger", name: "Danger", color: "bg-danger" },
  { id: "default", name: "Default", color: "bg-default" },
  { id: "muted", name: "Muted", color: "bg-muted" },
  // Custom hex colors
  { id: "#61DAFB", name: "React Blue", color: "bg-[#61DAFB]" },
  { id: "#3178C6", name: "TypeScript Blue", color: "bg-[#3178C6]" },
  { id: "#38BDF8", name: "Tailwind Cyan", color: "bg-[#38BDF8]" },
  { id: "#F97316", name: "Orange", color: "bg-[#F97316]" },
  { id: "#A855F7", name: "Purple", color: "bg-[#A855F7]" },
  { id: "#EC4899", name: "Pink", color: "bg-[#EC4899]" },
  { id: "#10B981", name: "Emerald", color: "bg-[#10B981]" },
  { id: "#EAB308", name: "Yellow", color: "bg-[#EAB308]" },
];

interface ColorSelectProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  description?: string;
  placeholder?: string;
  className?: string;
}

export function ColorSelect({
  value,
  onChange,
  label = "Color",
  description,
  placeholder = "Select a color",
  className = "",
}: ColorSelectProps) {
  return (
    <Select
      name="color"
      className={className}
      selectedKey={value || ""}
      onSelectionChange={(key) => onChange(String(key))}
      placeholder={placeholder}
    >
      {label && <Label>{label}</Label>}
      <Select.Trigger>
        <Select.Value>
          {({ defaultChildren, isPlaceholder, state }) => {
            if (isPlaceholder || state.selectedItems.length === 0) {
              return defaultChildren;
            }

            const selectedId = state.selectedItems[0]?.key?.toString();
            const selectedColor = colorOptions.find((c) => c.id === selectedId);

            if (!selectedColor) {
              return defaultChildren;
            }

            return (
              <div className="flex items-center gap-2">
                <span
                  className={`w-4 h-4 rounded-full ${selectedColor.color} border border-white/20`}
                />
                <span>{selectedColor.name}</span>
              </div>
            );
          }}
        </Select.Value>
        <Select.Indicator />
      </Select.Trigger>
      <Select.Popover>
        <ListBox>
          {colorOptions.map((color) => (
            <ListBox.Item key={color.id} id={color.id} textValue={color.name}>
              <div className="flex items-center gap-2">
                <span
                  className={`w-4 h-4 rounded-full ${color.color} border border-white/20`}
                />
                <span>{color.name}</span>
              </div>
              <ListBox.ItemIndicator />
            </ListBox.Item>
          ))}
        </ListBox>
      </Select.Popover>
      {description && <Description>{description}</Description>}
    </Select>
  );
}

// Status color options (for profile availability status)
const statusColorOptions = [
  { id: "success", name: "Success (Green)", color: "bg-success", description: "Available/Active" },
  { id: "warning", name: "Warning (Yellow)", color: "bg-warning", description: "Limited availability" },
  { id: "danger", name: "Danger (Red)", color: "bg-danger", description: "Unavailable" },
  { id: "accent", name: "Accent (Blue)", color: "bg-accent", description: "Custom status" },
  { id: "default", name: "Default (Gray)", color: "bg-default", description: "Neutral" },
];

interface StatusColorSelectProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  description?: string;
  className?: string;
}

export function StatusColorSelect({
  value,
  onChange,
  label = "Status Color",
  description,
  className = "",
}: StatusColorSelectProps) {
  return (
    <Select
      name="status_color"
      className={className}
      selectedKey={value || "success"}
      onSelectionChange={(key) => onChange(String(key))}
      placeholder="Select status color"
    >
      {label && <Label>{label}</Label>}
      <Select.Trigger>
        <Select.Value>
          {({ defaultChildren, isPlaceholder, state }) => {
            if (isPlaceholder || state.selectedItems.length === 0) {
              return defaultChildren;
            }

            const selectedId = state.selectedItems[0]?.key?.toString();
            const selectedColor = statusColorOptions.find((c) => c.id === selectedId);

            if (!selectedColor) {
              return defaultChildren;
            }

            return (
              <div className="flex items-center gap-2">
                <span
                  className={`w-3 h-3 rounded-full ${selectedColor.color}`}
                />
                <span>{selectedColor.name}</span>
              </div>
            );
          }}
        </Select.Value>
        <Select.Indicator />
      </Select.Trigger>
      <Select.Popover>
        <ListBox>
          {statusColorOptions.map((color) => (
            <ListBox.Item key={color.id} id={color.id} textValue={color.name}>
              <div className="flex items-center gap-3">
                <span
                  className={`w-4 h-4 rounded-full ${color.color}`}
                />
                <div className="flex flex-col">
                  <span className="font-medium">{color.name}</span>
                  <span className="text-xs text-muted">{color.description}</span>
                </div>
              </div>
              <ListBox.ItemIndicator />
            </ListBox.Item>
          ))}
        </ListBox>
      </Select.Popover>
      {description && <Description>{description}</Description>}
    </Select>
  );
}
