// pages/admin/dashboard.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { usePathname } from "next/navigation";
import { getToken } from "@/lib/auth";
import Sidebar from "@/components/Sidebar";
import SidebarItem from "@/components/SidebarItem";
import AdminStatsCard from "@/components/AdminStatsCard";

import {
  LayoutDashboard,
  Receipt,
  Boxes,
  UserCircle,
  Settings,
  LifeBuoy,
  Database,
  Users,
  Cpu,
  Clock,
} from "lucide-react";
import Link from "next/link";

export default function AdminDashboard() {
  const router = useRouter();
  const pathname = usePathname();
  const [stats, setStats] = useState<any[]>([]);

  useEffect(() => {
    const token = getToken();
    if (!token) {
      alert("Admin access only. Please log in.");
      router.push("/login");
      return;
    }

    // TODO: 실제 API 호출로 대체
    const mockStats = [
      { icon: <Users size={24} />, title: "Total Users", value: "134" },
      { icon: <Database size={24} />, title: "Total Tokens Used", value: "1,240,000" },
      { icon: <Cpu size={24} />, title: "Total Requests", value: "19,542" },
      { icon: <Clock size={24} />, title: "Avg. Response Time", value: "850ms" },
    ];
    setStats(mockStats);
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
        <SidebarItem icon={<UserCircle size={20} />} text="Users" active={pathname === "/users"} />
        <SidebarItem icon={<Settings size={20} />} text="Settings" active={pathname === "/settings"} />
        <SidebarItem icon={<LifeBuoy size={20} />} text="Help" active={pathname === "/help"} />
      </Sidebar>

      <div className="flex-1 p-10 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white">
        <h1 className="text-4xl font-bold mb-8">Admin Dashboard</h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {stats.map((stat, index) => (
            <AdminStatsCard key={index} icon={stat.icon} title={stat.title} value={stat.value} />
          ))}
        </div>
      </div>
    </main>
  );
}
