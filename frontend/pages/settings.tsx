// pages/settings.tsx
"use client";

import Sidebar from "@/components/Sidebar";
import SidebarItem from "@/components/SidebarItem";
import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  LayoutDashboard,
  Receipt,
  Boxes,
  UserCircle,
  Settings,
  LifeBuoy,
} from "lucide-react";

export default function SettingsPage() {
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
        <SidebarItem icon={<UserCircle size={20} />} text="Users" active={pathname === "/admin/users"} />
        <SidebarItem icon={<Settings size={20} />} text="Settings" active={pathname === "/settings"} />
        <SidebarItem icon={<LifeBuoy size={20} />} text="Help" active={pathname === "/help"} />
      </Sidebar>

      <div className="flex-1 p-10 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white">
        <h1 className="text-3xl font-bold mb-6">Settings</h1>
        <p className="text-gray-600 dark:text-gray-300">
          Coming soon: Notification settings, display preferences, and more.
        </p>
      </div>
    </main>
  );
}
