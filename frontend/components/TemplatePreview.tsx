"use client";

import React, { useEffect } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface TemplatePreviewProps {
  content: string;
}

export default function TemplatePreview({ content }: TemplatePreviewProps) {
  useEffect(() => {
    console.log("🧾 GPT response (RAW) :", content);
  }, [content]);

  return (
    <div className="flex-1 border rounded p-4 bg-white text-gray-900 shadow">
      <h2 className="text-lg font-semibold mb-2">📄 Template Result</h2>
      <ReactMarkdown
        children={content}
        remarkPlugins={[remarkGfm]}
        className="prose prose-neutral prose-sm dark:prose-invert max-w-none"/>
        <ReactMarkdown
          children={content}
          remarkPlugins={[remarkGfm]}
          className="prose prose-neutral prose-sm dark:prose-invert max-w-none"
        />
    </div>
  );
}
