// pages/admin/users.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { usePathname } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import SidebarItem from "@/components/SidebarItem";
import AdminUserTable from "@/components/AdminUserTable";
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
  created_at: string;
};

export default function AdminUsersPage() {
  const router = useRouter();
  const pathname = usePathname();
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    const token = getToken();
    if (!token) {
      alert("You must be logged in as admin.");
      router.push("/login");
      return;
    }

    // TODO: 실제 API fetch 로 대체
    const mockUsers: User[] = [
      {
        id: "1",
        email: "admin@example.com",
        nickname: "AdminUser",
        plan: "Team",
        created_at: "2024-12-01",
      },
      {
        id: "2",
        email: "jane@example.com",
        nickname: "JaneDoe",
        plan: "Pro",
        created_at: "2025-01-10",
      },
      {
        id: "3",
        email: "tom@example.com",
        nickname: "TomLee",
        plan: "Basic",
        created_at: "2025-02-17",
      },
    ];
    setUsers(mockUsers);
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
        <h1 className="text-3xl font-bold mb-8">Manage Users</h1>
        <AdminUserTable users={users} />
      </div>
    </main>
  );
}
