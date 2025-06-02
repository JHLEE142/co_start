"use client";

import React from "react";

interface ChatCardProps {
  response: string;
}

export default function ChatCard({ response }: ChatCardProps) {
  return (
    <div className="border rounded p-4 bg-gray-50 text-gray-700 shadow">
      {response || "GPT 응답이 여기에 표시됩니다."}
    </div>
  );
}