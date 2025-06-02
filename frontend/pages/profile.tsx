// frontend/pages/profile.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { getToken } from "@/lib/auth";
import { useAuthStore } from "@/store/auth";

export default function ProfilePage() {
  const { token } = useAuthStore();
  const router = useRouter();
  const [userInfo, setUserInfo] = useState<any>(null);
  const [nickname, setNickname] = useState("");

  useEffect(() => {
    const t = token || getToken();
    if (!t) {
      alert("Please log in to access your profile.");
      router.push("/login");
      return;
    }

    // TODO: Replace with real API call
    const mock = {
      email: "user@example.com",
      nickname: "JohnDoe",
      selected_model: "GPT-4",
      plan: "Pro",
    };
    setUserInfo(mock);
    setNickname(mock.nickname);
  }, [token, router]);

  const handleSave = () => {
    alert(`Nickname updated to "${nickname}" (not actually saved in DB)`);
    // TODO: 실제 API 호출로 nickname PATCH
  };

  if (!userInfo) return <div className="p-10">Loading profile...</div>;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white p-8">
      <h1 className="text-3xl font-bold mb-6">User Profile</h1>

      <div className="space-y-4 max-w-md">
        <div>
          <label className="block text-sm font-medium">Email</label>
          <p className="mt-1">{userInfo.email}</p>
        </div>

        <div>
          <label className="block text-sm font-medium">Nickname</label>
          <input
            type="text"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            className="mt-1 w-full p-2 border rounded bg-white dark:bg-gray-700"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">AI Model</label>
          <p className="mt-1">{userInfo.selected_model}</p>
        </div>

        <div>
          <label className="block text-sm font-medium">Plan</label>
          <p className="mt-1">{userInfo.plan}</p>
        </div>

        <button
          onClick={handleSave}
          className="mt-4 bg-indigo-600 text-white px-4 py-2 rounded"
        >
          Save Changes
        </button>
      </div>
    </div>
  );
}
