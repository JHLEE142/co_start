// frontend/pages/dashboard.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useAuthStore } from "@/store/auth";
import { getToken } from "@/lib/auth";
import Sidebar from "@/components/Sidebar";
import SidebarItem from "@/components/SidebarItem";
import {
  LayoutDashboard,
  BarChart3,
  UserCircle,
  Boxes,
  Package,
  Receipt,
  Settings,
  LifeBuoy,
  Database,
  CreditCard,
  Clock3,
  Cpu,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import axios from "axios";

interface UserInfo {
  nickname: string;
  selected_model: string;
  plan: string;
  total_tokens_used: number;
  credit_usage: number;
  last_active: string;
  requests_processed: number;
  weekly_stat: number;
}

export default function DashboardPage() {
  const pathname = usePathname();
  const { token } = useAuthStore();
  const router = useRouter();
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const currentToken = token || getToken();
      if (!currentToken) {
        alert("You must be logged in to access the dashboard.");
        router.push("/login");
        return;
      }

      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/user/me`, {
          headers: { Authorization: `Bearer ${currentToken}` },
        });
        setUserInfo(res.data);
      } catch (err) {
        console.error("Failed to load user information.", err);
        router.push("/login");
      }
    };

    fetchUser();
  }, [token, router]);

  if (!userInfo) return <div className="p-10">Loading dashboard...</div>;

  const stats = [
    { icon: <Database size={24} />, label: "Total Token Usage", value: `${userInfo.total_tokens_used.toLocaleString()} tokens` },
    { icon: <CreditCard size={24} />, label: "Credit Usage", value: `${userInfo.credit_usage} / 100` },
    { icon: <Clock3 size={24} />, label: "Last Active", value: new Date(userInfo.last_active).toLocaleString() },
    { icon: <Cpu size={24} />, label: "Requests Processed", value: `${userInfo.requests_processed}` },
    { icon: <UserCircle size={24} />, label: "Logged in as", value: userInfo.nickname },
    { icon: <BarChart3 size={24} />, label: "Week's Statistics", value: `${userInfo.weekly_stat > 0 ? '+' : ''}${userInfo.weekly_stat}%` },
  ];

  return (
    <main className="flex">
      <Sidebar>
        <Link href="/billings">
          <SidebarItem
            icon={<LayoutDashboard size={20} />}
            text="Billings"
            active={pathname === "/billings"}
          />
        </Link>
        <Link href="/dashboard">
          <SidebarItem
            icon={<Receipt size={20} />}
            text="Dashboard"
            active={pathname === "/dashboard"}
          />
        </Link>
        <Link href="/inventory">
          <SidebarItem
            icon={<Boxes size={20} />}
            text="Inventory"
            active={pathname === "/inventory"}
          />
        </Link>
        <hr className="my-3" />
        <Link href="/users">
          <SidebarItem icon={<UserCircle size={20} />} text="Users" active={pathname === "/users"} />
        </Link>
        <Link href="/settings">
          <SidebarItem icon={<Settings size={20} />} text="Settings" active={pathname === "/settings"} />
        </Link>
        <Link href="/help">
          <SidebarItem icon={<LifeBuoy size={20} />} text="Help" active={pathname === "/help"} />
        </Link>
      </Sidebar>

      <div className="flex-1 p-8 bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white">
        <h1 className="text-4xl font-bold mb-8">Dashboard</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {stats.map((stat, i) => (
            <div
              key={i}
              className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow flex items-center gap-4"
            >
              <div className="p-3 bg-indigo-100 dark:bg-indigo-500 text-indigo-600 dark:text-white rounded-full">
                {stat.icon}
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">{stat.label}</p>
                <p className="text-xl font-semibold">{stat.value}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}