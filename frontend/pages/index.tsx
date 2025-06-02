"use client";

import Sidebar from "@/components/Sidebar";
import SidebarItem from "@/components/SidebarItem";
import ChatWindow from "@/components/ChatWindow";
import TemplatePreview from "@/components/TemplatePreview";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useUserStore } from "@/store/user"; // ✅ 상태 불러오기

import {
  LayoutDashboard,
  BarChart3,
  UserCircle,
  Boxes,
  Package,
  Receipt,
  Settings,
  LifeBuoy,
} from "lucide-react";

export default function HomePage() {
  const { user } = useUserStore(); // ✅ Zustand 사용자 상태
  const isLoggedIn = !!user;

  const pathname = usePathname();

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
        <SidebarItem icon={<UserCircle size={20} />} text="Users" active={pathname === "/users"} />
        <SidebarItem icon={<Settings size={20} />} text="Settings" active={pathname === "/settings"} />
        <SidebarItem icon={<LifeBuoy size={20} />} text="Help" active={pathname === "/help"} />
      </Sidebar>

      <div className="flex flex-1 flex-col gap-4 p-4">
        {!isLoggedIn && (
          <div className="text-sm text-gray-600 dark:text-gray-300 mb-2">
            🚀 Activate a plan or coins to access more features!
          </div>
        )}
        <ChatWindow />
      </div>
    </main>
  );
}
