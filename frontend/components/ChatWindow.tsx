"use client";

import { useUserStore } from "@/store/user";
import { useState, useRef } from "react";
import axios from "axios";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export default function ChatWindow() {
  const { user } = useUserStore();

  const [input, setInput] = useState("");
  const [summary, setSummary] = useState("✍️ Please enter your request.");
  const [templateOutput, setTemplateOutput] = useState("📄 Template results will appear here.");
  const [loading, setLoading] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  if (!user) {
    return (
      <div className="text-center text-red-500 mt-10">
        ⚠️ Please log in to use the chat assistant.
      </div>
    );
  }

  if (user.credit_usage <= 0) {
    return (
      <div className="text-center text-yellow-500 mt-10">
        ⚠️ You have no credits left.
      </div>
    );
  }

  const handleSubmit = async () => {
    if (!input.trim()) return;
    setLoading(true);
    setSummary("⏳ Generating response...");

    try {
      const res = await axios.post("/api/chat", { message: input });
      setTemplateOutput(res.data.answer);
      setSummary("✅ Response received.");
    } catch (err) {
      setTemplateOutput("⚠️ Error occurred while fetching response.");
      setSummary("❌ Failed to get response.");
    } finally {
      setLoading(false);
      setInput("");
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="text-sm text-gray-600">{summary}</div>

      <div className="flex flex-col gap-2">
        <textarea
          ref={textareaRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Enter your request"
          rows={4}
          className="w-full border rounded px-4 py-2"
        />
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded w-fit self-end"
        >
          {loading ? "Loading..." : "Submit"}
        </button>
      </div>

      <div className="bg-white rounded p-4 shadow mt-2">
        <h2 className="text-md font-bold mb-1">📝 Template Result</h2>
        <div className="prose prose-neutral prose-sm dark:prose-invert max-w-none">
          <ReactMarkdown
            children={templateOutput}
            remarkPlugins={[remarkGfm]}
          />
        </div>
      </div>
    </div>
  );
}
