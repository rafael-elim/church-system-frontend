"use client";

import { useEffect, useRef } from "react";
import { Bold, Heading, Italic, Link, List, ListOrdered } from "lucide-react";

import { Button } from "@/components/ui/button";
import { sanitizeHtml } from "@/utils/sanitize-html";

interface RichTextEditorProps {
  value: string;
  disabled?: boolean;
  onChange: (value: string) => void;
}

export function RichTextEditor({ value, disabled, onChange }: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== value) {
      editorRef.current.innerHTML = value;
    }
  }, [value]);

  function run(command: string, commandValue?: string) {
    if (disabled) {
      return;
    }

    document.execCommand(command, false, commandValue);
    onChange(sanitizeHtml(editorRef.current?.innerHTML ?? ""));
  }

  function addLink() {
    const url = window.prompt("URL do link");
    if (url) {
      run("createLink", url);
    }
  }

  return (
    <div className="rounded-md border">
      <div className="flex flex-wrap gap-1 border-b bg-slate-50 p-2">
        <Button type="button" size="sm" variant="ghost" disabled={disabled} onClick={() => run("formatBlock", "h3")}>
          <Heading className="h-4 w-4" />
        </Button>
        <Button type="button" size="sm" variant="ghost" disabled={disabled} onClick={() => run("bold")}>
          <Bold className="h-4 w-4" />
        </Button>
        <Button type="button" size="sm" variant="ghost" disabled={disabled} onClick={() => run("italic")}>
          <Italic className="h-4 w-4" />
        </Button>
        <Button type="button" size="sm" variant="ghost" disabled={disabled} onClick={() => run("insertUnorderedList")}>
          <List className="h-4 w-4" />
        </Button>
        <Button type="button" size="sm" variant="ghost" disabled={disabled} onClick={() => run("insertOrderedList")}>
          <ListOrdered className="h-4 w-4" />
        </Button>
        <Button type="button" size="sm" variant="ghost" disabled={disabled} onClick={addLink}>
          <Link className="h-4 w-4" />
        </Button>
      </div>
      <div
        ref={editorRef}
        contentEditable={!disabled}
        className="min-h-40 p-3 text-sm outline-none"
        onInput={() => onChange(sanitizeHtml(editorRef.current?.innerHTML ?? ""))}
      />
    </div>
  );
}
