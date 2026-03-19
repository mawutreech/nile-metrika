"use client";

import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import { useEffect } from "react";

type Props = {
  value: string;
  onChange: (html: string) => void;
};

export default function StoryEditor({ value, onChange }: Props) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({
        openOnClick: false,
      }),
      Image,
    ],
    content: value,
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class:
          "min-h-[320px] border border-slate-300 bg-white px-4 py-3 focus:outline-none prose max-w-none",
      },
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value || "<p></p>", false);
    }
  }, [editor, value]);

  if (!editor) return null;

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2">
        <button type="button" onClick={() => editor.chain().focus().toggleBold().run()} className="border px-3 py-1">
          Bold
        </button>
        <button type="button" onClick={() => editor.chain().focus().toggleItalic().run()} className="border px-3 py-1">
          Italic
        </button>
        <button type="button" onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} className="border px-3 py-1">
          H2
        </button>
        <button type="button" onClick={() => editor.chain().focus().toggleBulletList().run()} className="border px-3 py-1">
          Bullet List
        </button>
        <button
          type="button"
          onClick={() => {
            const url = window.prompt("Enter link URL");
            if (url) editor.chain().focus().setLink({ href: url }).run();
          }}
          className="border px-3 py-1"
        >
          Link
        </button>
        <button
          type="button"
          onClick={() => {
            const url = window.prompt("Enter image URL");
            if (url) editor.chain().focus().setImage({ src: url }).run();
          }}
          className="border px-3 py-1"
        >
          Image URL
        </button>
      </div>

      <EditorContent editor={editor} />
    </div>
  );
}