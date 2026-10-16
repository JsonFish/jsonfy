"use client";

import { useEditor, EditorContent, type Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Markdown } from "@tiptap/markdown";
import Image from "@tiptap/extension-image";
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
import { common, createLowlight } from "lowlight";
import {
  Bold,
  Italic,
  List,
  ListOrdered,
  Quote,
  Undo,
  Redo,
  Code,
  Heading1,
  Heading2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ArticleToc } from "@/components/article-toc";
import { HeadingAnchors } from "./heading-anchors";

const lowlight = createLowlight(common);

// Parse the legacy linked-image form as an image token. Marked only invokes
// inline tokenizers outside code spans and fenced code blocks.
const LegacyImage = Image.extend({
  markdownTokenizer: {
    name: "legacyImage",
    level: "inline",
    start: "![",
    tokenize(src) {
      const match = /^!\[([^\]]*)\]\\\(\[([^\]]+)\]\((https?:\/\/[^)\s]+)\)\)/.exec(
        src,
      );
      if (!match) return;

      return {
        type: "image",
        raw: match[0],
        text: match[1] || match[2],
        href: match[3],
        title: null,
      };
    },
  },
});

const Toolbar = ({ editor }: { editor: Editor | null }) => {
  if (!editor) return null;

  return (
    <div className="flex flex-wrap gap-1 mb-6 p-1 border border-zinc-200 dark:border-zinc-800 rounded-lg bg-white dark:bg-zinc-950 sticky top-4 z-10 backdrop-blur-sm shadow-sm">
      <Button
        variant="ghost"
        size="icon"
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={`w-8 h-8 ${
          editor.isActive("bold") ? "bg-zinc-100 dark:bg-zinc-800" : ""
        }`}
      >
        <Bold className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={`w-8 h-8 ${
          editor.isActive("italic") ? "bg-zinc-100 dark:bg-zinc-800" : ""
        }`}
      >
        <Italic className="h-4 w-4" />
      </Button>
      <div className="w-px h-4 bg-zinc-200 dark:bg-zinc-800 my-auto mx-1" />
      <Button
        variant="ghost"
        size="icon"
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        className={`w-8 h-8 ${
          editor.isActive("heading", { level: 1 })
            ? "bg-zinc-100 dark:bg-zinc-800"
            : ""
        }`}
      >
        <Heading1 className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        className={`w-8 h-8 ${
          editor.isActive("heading", { level: 2 })
            ? "bg-zinc-100 dark:bg-zinc-800"
            : ""
        }`}
      >
        <Heading2 className="h-4 w-4" />
      </Button>
      <div className="w-px h-4 bg-zinc-200 dark:bg-zinc-800 my-auto mx-1" />
      <Button
        variant="ghost"
        size="icon"
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={`w-8 h-8 ${
          editor.isActive("bulletList") ? "bg-zinc-100 dark:bg-zinc-800" : ""
        }`}
      >
        <List className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={`w-8 h-8 ${
          editor.isActive("orderedList") ? "bg-zinc-100 dark:bg-zinc-800" : ""
        }`}
      >
        <ListOrdered className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        className={`w-8 h-8 ${
          editor.isActive("blockquote") ? "bg-zinc-100 dark:bg-zinc-800" : ""
        }`}
      >
        <Quote className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => editor.chain().focus().toggleCodeBlock().run()}
        className={`w-8 h-8 ${
          editor.isActive("codeBlock") ? "bg-zinc-100 dark:bg-zinc-800" : ""
        }`}
      >
        <Code className="h-4 w-4" />
      </Button>
      <div className="flex-1" />
      <Button
        variant="ghost"
        size="icon"
        onClick={() => editor.chain().focus().undo().run()}
        className="w-8 h-8"
      >
        <Undo className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => editor.chain().focus().redo().run()}
        className="w-8 h-8"
      >
        <Redo className="h-4 w-4" />
      </Button>
    </div>
  );
};

const Tiptap = ({
  content = "",
  editable = true,
  showTableOfContents = false,
  backHref,
  onChange = () => {},
}: {
  content?: string;
  editable?: boolean;
  showTableOfContents?: boolean;
  backHref?: string;
  onChange?: (markdown: string) => void;
}) => {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({ codeBlock: false }),
      CodeBlockLowlight.configure({ lowlight }),
      LegacyImage,
      Markdown,
      ...(!editable && showTableOfContents ? [HeadingAnchors] : []),
    ],
    content,
    contentType: "markdown",
    editable: editable,
    onUpdate: ({ editor }) => {
      onChange(editor.getMarkdown());
    },
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class:
          "prose prose-zinc dark:prose-invert max-w-none focus:outline-none min-h-[400px] leading-relaxed",
      },
    },
  });

  return (
    <div className="relative w-full min-w-0">
      {!editable && showTableOfContents && editor && (
        <ArticleToc editor={editor} backHref={backHref} />
      )}
      {editable && <Toolbar editor={editor} />}
      <EditorContent editor={editor} />
    </div>
  );
};

export default Tiptap;
