"use client";

import React, { useState, useRef } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Bold, Italic, List, Underline, Link, Code } from "lucide-react";

interface RichTextareaProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  rows?: number;
  className?: string;
}

export function RichTextarea({ value, onChange, placeholder, rows = 3, className }: RichTextareaProps) {
  const [isFocused, setIsFocused] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const applyFormatting = (prefix: string, suffix: string, placeholder: string = '') => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = value.substring(start, end);
    const textToWrap = selectedText || placeholder;
    
    const before = value.substring(0, start);
    const after = value.substring(end);

    const newText = before + prefix + textToWrap + suffix + after;
    onChange(newText);

    // Restore focus and set cursor position after formatting
    requestAnimationFrame(() => {
      textarea.focus();
      if (selectedText) {
        // If text was selected, place cursor after the formatted text
        const newCursorPos = start + prefix.length + textToWrap.length + suffix.length;
        textarea.setSelectionRange(newCursorPos, newCursorPos);
      } else {
        // If no text was selected, select the placeholder text
        const selectStart = start + prefix.length;
        const selectEnd = start + prefix.length + textToWrap.length;
        textarea.setSelectionRange(selectStart, selectEnd);
      }
    });
  };

  const makeBold = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    applyFormatting('**', '**', 'bold text');
  };

  const makeItalic = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    applyFormatting('*', '*', 'italic text');
  };

  const makeUnderline = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    applyFormatting('<u>', '</u>', 'underlined text');
  };

  const makeCode = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    applyFormatting('`', '`', 'code');
  };

  const insertBullet = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    
    if (start === end) {
      // No selection - add bullet at cursor
      const lineStart = value.lastIndexOf('\n', start - 1) + 1;
      const lineEnd = value.indexOf('\n', start);
      const actualLineEnd = lineEnd === -1 ? value.length : lineEnd;
      const currentLine = value.substring(lineStart, actualLineEnd);
      
      // Check if line already has bullet
      if (currentLine.trim().startsWith('•') || currentLine.trim().startsWith('-')) {
        return; // Already has bullet
      }
      
      const before = value.substring(0, lineStart);
      const after = value.substring(lineStart);
      const newText = before + '• ' + after;
      onChange(newText);
      
      requestAnimationFrame(() => {
        textarea.focus();
        textarea.setSelectionRange(start + 2, start + 2);
      });
    } else {
      // Selection exists - add bullets to selected lines
      const selectedText = value.substring(start, end);
      const lines = selectedText.split('\n');
      const newLines = lines.map(line => {
        const trimmed = line.trim();
        if (trimmed && !trimmed.startsWith('•') && !trimmed.startsWith('-')) {
          return '• ' + line;
        }
        return line;
      });
      
      const before = value.substring(0, start);
      const after = value.substring(end);
      const newText = before + newLines.join('\n') + after;
      onChange(newText);
      
      requestAnimationFrame(() => {
        textarea.focus();
        textarea.setSelectionRange(start, start + newLines.join('\n').length);
      });
    }
  };

  const insertLink = (e: React.MouseEvent) => {
    e.preventDefault();
    applyFormatting('[', '](https://example.com)', 'link text');
  };

  return (
    <div className="space-y-2">
      {isFocused && (
        <div className="flex gap-1 p-1.5 bg-gray-50 border rounded-md flex-wrap">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onMouseDown={makeBold}
            className="h-7 px-2 hover:bg-gray-200"
            title="Bold (**text**)"
          >
            <Bold className="h-3.5 w-3.5" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onMouseDown={makeItalic}
            className="h-7 px-2 hover:bg-gray-200"
            title="Italic (*text*)"
          >
            <Italic className="h-3.5 w-3.5" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onMouseDown={makeUnderline}
            className="h-7 px-2 hover:bg-gray-200"
            title="Underline (<u>text</u>)"
          >
            <Underline className="h-3.5 w-3.5" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onMouseDown={makeCode}
            className="h-7 px-2 hover:bg-gray-200"
            title="Code (`code`)"
          >
            <Code className="h-3.5 w-3.5" />
          </Button>
          <div className="w-px h-6 bg-gray-300 mx-1"></div>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onMouseDown={insertBullet}
            className="h-7 px-2 hover:bg-gray-200"
            title="Bullet list"
          >
            <List className="h-3.5 w-3.5" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onMouseDown={insertLink}
            className="h-7 px-2 hover:bg-gray-200"
            title="Insert link"
          >
            <Link className="h-3.5 w-3.5" />
          </Button>
          <span className="text-xs text-gray-500 flex items-center ml-auto">
            Select text & click to format
          </span>
        </div>
      )}
      <Textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setTimeout(() => setIsFocused(false), 300)}
        placeholder={placeholder}
        rows={rows}
        className={className}
      />
    </div>
  );
}
