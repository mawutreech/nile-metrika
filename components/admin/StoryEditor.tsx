"use client";

import { useEffect, useMemo, useState } from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import Placeholder from "@tiptap/extension-placeholder";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import Highlight from "@tiptap/extension-highlight";

type StoryEditorProps = {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
};

type ToolbarButtonProps = {
  label: string;
  onClick: () => void;
  isActive?: boolean;
  disabled?: boolean;
};

function ToolbarButton({
  label,
  onClick,
  isActive = false,
  disabled = false,
}: ToolbarButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={[
        "rounded border px-3 py-2 text-sm font-medium transition",
        disabled
          ? "cursor-not-allowed border-[#d6d6d6] bg-[#f5f5f5] text-[#999]"
          : isActive
          ? "border-[#1f6f57] bg-[#1f6f57] text-white"
          : "border-[#d0d7de] bg-white text-[#222] hover:bg-[#f6f8fa]",
      ].join(" ")}
    >
      {label}
    </button>
  );
}

export default function StoryEditor({
  value,
  onChange,
  placeholder = "Write the story here...",
}: StoryEditorProps) {
  const [imageUrl, setImageUrl] = useState("");
  const [linkUrl, setLinkUrl] = useState("");

  const normalizedValue = useMemo(() => value || "<p></p>", [value]);

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [2, 3, 4],
        },
      }),
      Underline,
      Highlight,
      Link.configure({
        openOnClick: false,
        autolink: true,
        HTMLAttributes: {
          class: "text-[#0f3f75] underline",
        },
      }),
      Image.configure({
        inline: false,
        allowBase64: true,
      }),
      Placeholder.configure({
        placeholder,
      }),
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
    ],
    content: normalizedValue,
    editorProps: {
      attributes: {
        class:
          "min-h-[420px] w-full rounded-b border border-t-0 border-[#d0d7de] bg-white px-5 py-4 focus:outline-none prose prose-lg max-w-none prose-headings:text-[#111] prose-p:text-[#222] prose-li:text-[#222] prose-blockquote:border-l-4 prose-blockquote:border-[#d0d7de] prose-blockquote:pl-4 prose-a:text-[#0f3f75]",
      },
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  useEffect(() => {
    if (!editor) return;

    const current = editor.getHTML();
    if (normalizedValue !== current) {
      editor.commands.setContent(normalizedValue, { emitUpdate: false });
    }
  }, [editor, normalizedValue]);

  if (!editor) {
    return (
      <div className="rounded border border-[#d0d7de] bg-white px-4 py-3 text-sm text-[#666]">
        Loading editor...
      </div>
    );
  }

  const setLink = () => {
    const previousUrl = editor.getAttributes("link").href ?? "";
    const url = linkUrl.trim() || previousUrl || window.prompt("Enter link URL") || "";

    if (!url) {
      editor.chain().focus().unsetLink().run();
      setLinkUrl("");
      return;
    }

    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
    setLinkUrl("");
  };

  const addImage = () => {
    const url = imageUrl.trim() || window.prompt("Enter image URL") || "";

    if (!url) return;

    editor.chain().focus().setImage({ src: url }).run();
    setImageUrl("");
  };

  return (
    <div className="w-full">
      <div className="rounded-t border border-[#d0d7de] bg-[#f8fafc] p-3">
        <div className="flex flex-wrap gap-2">
          <ToolbarButton
            label="Bold"
            onClick={() => editor.chain().focus().toggleBold().run()}
            isActive={editor.isActive("bold")}
          />
          <ToolbarButton
            label="Italic"
            onClick={() => editor.chain().focus().toggleItalic().run()}
            isActive={editor.isActive("italic")}
          />
          <ToolbarButton
            label="Underline"
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            isActive={editor.isActive("underline")}
          />
          <ToolbarButton
            label="Strike"
            onClick={() => editor.chain().focus().toggleStrike().run()}
            isActive={editor.isActive("strike")}
          />
          <ToolbarButton
            label="Highlight"
            onClick={() => editor.chain().focus().toggleHighlight().run()}
            isActive={editor.isActive("highlight")}
          />
          <ToolbarButton
            label="H2"
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
            isActive={editor.isActive("heading", { level: 2 })}
          />
          <ToolbarButton
            label="H3"
            onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
            isActive={editor.isActive("heading", { level: 3 })}
          />
          <ToolbarButton
            label="H4"
            onClick={() => editor.chain().focus().toggleHeading({ level: 4 }).run()}
            isActive={editor.isActive("heading", { level: 4 })}
          />
          <ToolbarButton
            label="Bullet List"
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            isActive={editor.isActive("bulletList")}
          />
          <ToolbarButton
            label="Numbered List"
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            isActive={editor.isActive("orderedList")}
          />
          <ToolbarButton
            label="Quote"
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            isActive={editor.isActive("blockquote")}
          />
          <ToolbarButton
            label="Left"
            onClick={() => editor.chain().focus().setTextAlign("left").run()}
            isActive={editor.isActive({ textAlign: "left" })}
          />
          <ToolbarButton
            label="Center"
            onClick={() => editor.chain().focus().setTextAlign("center").run()}
            isActive={editor.isActive({ textAlign: "center" })}
          />
          <ToolbarButton
            label="Right"
            onClick={() => editor.chain().focus().setTextAlign("right").run()}
            isActive={editor.isActive({ textAlign: "right" })}
          />
          <ToolbarButton
            label="Rule"
            onClick={() => editor.chain().focus().setHorizontalRule().run()}
          />
          <ToolbarButton
            label="Clear"
            onClick={() => editor.chain().focus().unsetAllMarks().clearNodes().run()}
          />
          <ToolbarButton
            label="Undo"
            onClick={() => editor.chain().focus().undo().run()}
            disabled={!editor.can().chain().focus().undo().run()}
          />
          <ToolbarButton
            label="Redo"
            onClick={() => editor.chain().focus().redo().run()}
            disabled={!editor.can().chain().focus().redo().run()}
          />
        </div>

        <div className="mt-3 grid gap-3 md:grid-cols-2">
          <div className="flex gap-2">
            <input
              type="url"
              value={linkUrl}
              onChange={(e) => setLinkUrl(e.target.value)}
              placeholder="Paste link URL"
              className="w-full rounded border border-[#d0d7de] px-3 py-2 text-sm outline-none focus:border-[#1f6f57]"
            />
            <button
              type="button"
              onClick={setLink}
              className="rounded border border-[#1f6f57] bg-[#1f6f57] px-3 py-2 text-sm font-medium text-white hover:opacity-90"
            >
              Link
            </button>
            <button
              type="button"
              onClick={() => editor.chain().focus().unsetLink().run()}
              className="rounded border border-[#d0d7de] bg-white px-3 py-2 text-sm font-medium text-[#222] hover:bg-[#f6f8fa]"
            >
              Unlink
            </button>
          </div>

          <div className="flex gap-2">
            <input
              type="url"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="Paste image URL"
              className="w-full rounded border border-[#d0d7de] px-3 py-2 text-sm outline-none focus:border-[#1f6f57]"
            />
            <button
              type="button"
              onClick={addImage}
              className="rounded border border-[#1f6f57] bg-[#1f6f57] px-3 py-2 text-sm font-medium text-white hover:opacity-90"
            >
              Add Image
            </button>
          </div>
        </div>
      </div>

      <EditorContent editor={editor} />
    </div>
  );
}