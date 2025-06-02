// pages/admin/user/[id].tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { usePathname } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import SidebarItem from "@/components/SidebarItem";
import UserProfileCard from "@/components/UserProfileCard";
import { getToken } from "@/lib/auth";
import { useParams } from "next/navigation";

import {
  LayoutDashboard,
  Receipt,
  Boxes,
  UserCircle,
  Settings,
  LifeBuoy,
} from "lucide-react";
import Link from "next/link";

type User = {
  id: string;
  email: string;
  nickname: string;
  plan: string;
  model: string;
  joined: string;
  requests: number;
  tokens_used: string;
};

export default function AdminUserDetailPage() {
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();
  const userId = params?.id;

  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const token = getToken();
    if (!token) {
      alert("Please log in as admin.");
      router.push("/login");
      return;
    }

    // TODO: API 호출로 대체
    const mockUsers: User[] = [
      {
        id: "1",
        email: "admin@example.com",
        nickname: "AdminUser",
        plan: "Team",
        model: "GPT-4",
        joined: "2024-12-01",
        requests: 985,
        tokens_used: "234,210",
      },
      {
        id: "2",
        email: "jane@example.com",
        nickname: "JaneDoe",
        plan: "Pro",
        model: "GPT-3.5",
        joined: "2025-01-15",
        requests: 421,
        tokens_used: "102,348",
      },
    ];

    const foundUser = mockUsers.find((u) => u.id === userId);
    if (!foundUser) {
      alert("User not found.");
      router.push("/admin/users");
      return;
    }

    setUser(foundUser);
  }, [userId, router]);

  if (!user) return <div className="p-10">Loading user details...</div>;

  return (
    <main className="flex">
      <Sidebar>
        <Link href="/billings">
          <SidebarItem icon={<LayoutDashboard size={20} />} text="Billings" active={pathname === "/billings"} />
        </Link>
        <Link href="/dashboard">
          <SidebarItem icon={<Receipt size={20} />} text="Dashboard" active={pathname === "/dashboard"} />
        </Link>
        <SidebarItem icon={<Boxes size={20} />} text="Inventory" active={pathname === "/inventory"} />
        <hr className="my-3" />
        <SidebarItem icon={<UserCircle size={20} />} text="Users" active={pathname === "/admin/users"} />
        <SidebarItem icon={<Settings size={20} />} text="Settings" active={pathname === "/settings"} />
        <SidebarItem icon={<LifeBuoy size={20} />} text="Help" active={pathname === "/help"} />
      </Sidebar>

      <div className="flex-1 p-10 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white">
        <h1 className="text-3xl font-bold mb-6">User Detail</h1>

        <UserProfileCard
          email={user.email}
          nickname={user.nickname}
          plan={user.plan}
          model={user.model}
        />

        <div className="mt-6 space-y-2 text-sm text-gray-600 dark:text-gray-300">
          <p><strong>Joined:</strong> {user.joined}</p>
          <p><strong>Total Requests:</strong> {user.requests}</p>
          <p><strong>Tokens Used:</strong> {user.tokens_used}</p>
        </div>
      </div>
    </main>
  );
}
