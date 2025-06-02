"use client";

import React, { useState, useEffect, createContext, ReactNode } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronFirst, ChevronLast, LogOut } from "lucide-react";
import SidebarItem from "./SidebarItem";
import { useAuthStore } from "@/store/auth";
import { useUserStore } from "@/store/user";
import { API_BASE_URL } from "@/lib/api";
import { getToken } from "@/lib/auth";

type SidebarContextType = {
  expanded: boolean;
};

type Chat = { id: string; title: string };

export const SidebarContext = createContext<SidebarContextType>({ expanded: true });

type SidebarProps = {
  children: ReactNode;
};

export default function Sidebar({ children }: SidebarProps) {
  const [expanded, setExpanded] = useState(true);
  const [chats, setChats] = useState<Chat[]>([]);
  const router = useRouter();

  const { logout } = useAuthStore();
  const { user, setUser, clearUser } = useUserStore(); // ✅ user 객체 구조화
  const id = user?.id;
  const name = user?.name;
  const email = user?.email;
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    const fetchUser = async () => {
      const token = getToken();
      if (!token) {
        console.warn("🚨 토큰이 없음");
        return;
      }

      try {
        const res = await fetch(`${API_BASE_URL}/auth/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const data = await res.json();
          setUser({
            id: data.id,
            name: data.name,
            email: data.email,
            plan: data.plan,
            credit_usage: data.credit_usage,
          });
        }
      } catch (err) {
        console.error("Failed to fetch user info:", err);
      }
    };

    const fetchChats = async () => {
      // ✅ 임시 더미 채팅 목록
      setChats([
        { id: "1", title: " " },
      ]);
    };

    fetchUser();
    fetchChats();
  }, [setUser]);

  const handleLogout = () => {
    logout();
    clearUser();
    router.push("/login");
  };

  return (
    <aside className="h-screen">
      <nav className="h-full flex flex-col bg-white dark:bg-gray-900 border-r shadow-sm">
        {/* 상단 로고 & 토글 */}
        <div className="p-4 pb-2 flex justify-between items-center">
          <Link href="/" className="flex items-center space-x-2 overflow-hidden">
            <img
              src="/logo_1.jpeg"
              alt="Logo"
              className={`transition-all ${expanded ? "w-10 h-10" : "w-0 h-10"}`}
            />
            {expanded && (
              <img
                src="/co_start_logo1.png"
                alt="Logo Text"
                className="h-10 object-contain"
              />
            )}
          </Link>
          <button
            onClick={() => setExpanded((prev) => !prev)}
            className="p-1.5 rounded-lg bg-gray-50 dark:bg-gray-800 hover:bg-gray-100"
          >
            {expanded ? <ChevronFirst /> : <ChevronLast />}
          </button>
        </div>

        {/* 사용자 채팅 목록 */}
        <SidebarContext.Provider value={{ expanded }}>
          <ul className="flex-1 px-3 space-y-1 overflow-y-auto">
            {id && chats.map((chat) => (
              <li key={chat.id}>
                <button
                  onClick={() => router.push(`/chat/${chat.id}`)}
                  className="text-sm text-left w-full text-gray-800 dark:text-gray-200 hover:underline"
                >
                  {chat.title}
                </button>
              </li>
            ))}
            {children}
          </ul>
        </SidebarContext.Provider>

        {/* 하단: 사용자 정보 및 액션 */}
        <div className="border-t border-gray-200 dark:border-gray-700 p-4 space-y-3">
          {id ? (
            <div className="flex items-center justify-between">
              {expanded && (
                <div>
                  <p className="text-sm font-semibold">{name}</p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">{email}</p>
                </div>
              )}
              <button
                className="text-red-500 hover:underline flex items-center text-sm"
                onClick={handleLogout}
              >
                <LogOut size={16} className="mr-1" />
                {expanded && "Log out"}
              </button>
            </div>
          ) : (
            <div className={`flex ${expanded ? "justify-end" : "justify-center"} gap-2`}>
              <Link
                href="/login"
                className="text-blue-600 hover:underline text-sm flex items-center"
              >
                <LogOut size={16} className="mr-1 rotate-180" />
                {expanded && "Login"}
              </Link>
            </div>
          )}
        </div>
      </nav>
    </aside>
  );
}
