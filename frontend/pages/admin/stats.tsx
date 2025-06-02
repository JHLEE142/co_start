// pages/admin/stats.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { usePathname } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import SidebarItem from "@/components/SidebarItem";
import UserProfileCard from "@/components/UserProfileCard";
import { getToken } from "@/lib/auth";

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
};

export default function AdminStatsPage() {
  const router = useRouter();
  const pathname = usePathname();
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    const token = getToken();
    if (!token) {
      alert("Admin access only. Please log in.");
      router.push("/login");
      return;
    }

    // TODO: Replace with real API call
    const mock: User[] = [
      {
        id: "1",
        email: "admin@example.com",
        nickname: "AdminUser",
        plan: "Team",
        model: "GPT-4",
      },
      {
        id: "2",
        email: "tom@example.com",
        nickname: "TomLee",
        plan: "Pro",
        model: "GPT-3.5",
      },
      {
        id: "3",
        email: "jane@example.com",
        nickname: "JaneDoe",
        plan: "Basic",
        model: "LLaMA-3",
      },
    ];
    setUsers(mock);
  }, [router]);

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
        <h1 className="text-3xl font-bold mb-8">User Statistics</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {users.map((user) => (
            <UserProfileCard
              key={user.id}
              email={user.email}
              nickname={user.nickname}
              plan={user.plan}
              model={user.model}
            />
          ))}
        </div>
      </div>
    </main>
  );
}
