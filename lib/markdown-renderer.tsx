import React from 'react';

// Enhanced markdown renderer for bold, italic, underline, code, and links
export function renderMarkdown(text: string): React.ReactNode {
  if (!text) return text;

  let processed = text;
  const elements: React.ReactNode[] = [];
  let key = 0;

  // Process in order: bold, italic, underline, code, links
  const patterns = [
    { regex: /\*\*(.+?)\*\*/g, component: (match: string) => <strong key={`bold-${key++}`}>{match}</strong> },
    { regex: /\*(.+?)\*/g, component: (match: string) => <em key={`italic-${key++}`}>{match}</em> },
    { regex: /<u>(.+?)<\/u>/g, component: (match: string) => <u key={`underline-${key++}`}>{match}</u> },
    { regex: /`(.+?)`/g, component: (match: string) => <code key={`code-${key++}`} className="bg-gray-100 px-1 rounded text-sm">{match}</code> },
    { regex: /\[(.+?)\]\((.+?)\)/g, component: (text: string, url: string) => <a key={`link-${key++}`} href={url} className="text-blue-600 underline" target="_blank" rel="noopener noreferrer">{text}</a> },
  ];

  // Split and process text with all patterns
  const parts = processMarkdown(text);
  
  return <>{parts}</>;
}

function processMarkdown(text: string): React.ReactNode[] {
  const parts: React.ReactNode[] = [];
  let key = 0;
  
  // Process bold (**text**)
  const boldRegex = /\*\*(.+?)\*\*/g;
  const segments = text.split(boldRegex);
  
  for (let i = 0; i < segments.length; i++) {
    if (i % 2 === 0) {
      // Regular text, process for other formats
      const segment = segments[i];
      parts.push(...processItalicAndOther(segment, key));
    } else {
      // Bold text
      parts.push(<strong key={`bold-${key++}`}>{segments[i]}</strong>);
    }
  }
  
  return parts;
}

function processItalicAndOther(text: string, baseKey: number): React.ReactNode[] {
  const parts: React.ReactNode[] = [];
  let key = baseKey;
  
  // Process italic (*text*)
  const italicRegex = /\*(.+?)\*/g;
  const segments = text.split(italicRegex);
  
  for (let i = 0; i < segments.length; i++) {
    if (i % 2 === 0) {
      // Regular text, process for underline/code/links
      const segment = segments[i];
      parts.push(...processOtherFormats(segment, key));
    } else {
      // Italic text
      parts.push(<em key={`italic-${key++}`}>{segments[i]}</em>);
    }
  }
  
  return parts;
}

function processOtherFormats(text: string, baseKey: number): React.ReactNode[] {
  const parts: React.ReactNode[] = [];
  let remaining = text;
  let key = baseKey;
  
  // Process underline
  const underlineRegex = /<u>(.+?)<\/u>/g;
  let match;
  let lastIndex = 0;
  
  while ((match = underlineRegex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(<span key={`text-${key++}`}>{text.substring(lastIndex, match.index)}</span>);
    }
    parts.push(<u key={`u-${key++}`}>{match[1]}</u>);
    lastIndex = match.index + match[0].length;
  }
  
  if (lastIndex < text.length) {
    const remaining = text.substring(lastIndex);
    // Process code
    const codeRegex = /`(.+?)`/g;
    const codeSegments = remaining.split(codeRegex);
    for (let i = 0; i < codeSegments.length; i++) {
      if (i % 2 === 0 && codeSegments[i]) {
        parts.push(<span key={`text-${key++}`}>{codeSegments[i]}</span>);
      } else if (codeSegments[i]) {
        parts.push(<code key={`code-${key++}`} className="bg-gray-100 px-1 rounded text-sm font-mono">{codeSegments[i]}</code>);
      }
    }
  }
  
  if (parts.length === 0 && text) {
    parts.push(<span key={`text-${key++}`}>{text}</span>);
  }
  
  return parts;
}

// Alternative: Convert markdown to plain text for PDF export
export function markdownToPlain(text: string): string {
  if (!text) return text;
  return text
    .replace(/\*\*([^*]+)\*\*/g, '$1') // Remove bold
    .replace(/\*([^*]+)\*/g, '$1');     // Remove italic
}
