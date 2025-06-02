"use client";

import React, { useEffect, useState } from "react";
import { PayPalScriptProvider, PayPalButtons, ReactPayPalScriptOptions } from "@paypal/react-paypal-js";
import Sidebar from "@/components/Sidebar";
import SidebarItem from "@/components/SidebarItem";
import Link from "next/link";
import {
  LayoutDashboard,
  UserCircle,
  Boxes,
  Receipt,
  Settings,
  LifeBuoy,
} from "lucide-react";
import { usePathname } from "next/navigation";
import { useRouter } from "next/router";
import { getToken } from "@/lib/auth";

// ✅ 타입 정의
type Plan = {
  id: string;
  name: string;
  price: number;
  coins: string;
  description: string;
};

const initialOptions: ReactPayPalScriptOptions = {
  clientId: "ATmCIBJ3nmvsDkwo3afFULqUe0EON_xbmNiDD3wMntN8ZOjouKbSw9QmK9yFiCgpfncwetmeHbYkyL2Z",
  currency: "USD",
  intent: "capture",
};

const subscriptionPlans = [
  { id: "basic", name: "Basic", price: 5, coins: "300 coins", description: "Get started with light usage." },
  { id: "plus", name: "Plus", price: 10, coins: "600 coins", description: "Perfect for consistent users." },
  { id: "pro", name: "Pro", price: 20, coins: "1,200 coins", description: "Power users need more." },
  { id: "team", name: "Team Plan", price: 50, coins: "3,000 coins", description: "Best for teams and shared access." },
];

const coinPacks = [
  { id: "packA", name: "Coin Pack A", price: 5, coins: "250 coins", description: "For occasional use." },
  { id: "packB", name: "Coin Pack B", price: 10, coins: "550 coins", description: "Great value pack." },
  { id: "packC", name: "Coin Pack C", price: 20, coins: "1,200 coins", description: "Most popular choice." },
  { id: "packD", name: "Coin Pack D", price: 50, coins: "3,500 coins", description: "For heavy users." },
];

export default function BillingsPage() {
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const token = getToken();
    if (!token) {
      alert("Please log in to view billing options.");
      router.push("/login");
    }
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

      <PayPalScriptProvider options={initialOptions}>
        <div className="p-10 min-h-screen bg-gray-50 dark:bg-gray-900 flex-1">
          <h1 className="text-3xl font-bold mb-8">Choose Your Plan</h1>

          <h2 className="text-2xl font-semibold mb-4">📦 Subscription Plans</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
            {subscriptionPlans.map((plan) => (
              <div key={plan.id} className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow hover:scale-105 transition">
                <h2 className="text-xl font-semibold mb-2">{plan.name}</h2>
                <p className="text-2xl font-bold mb-4">${plan.price}</p>
                <p className="text-indigo-500 font-semibold mb-4">{plan.coins}</p>
                <p className="text-gray-600 dark:text-gray-300 text-sm mb-6">{plan.description}</p>

                <button onClick={() => setSelectedPlan(plan)} className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700 transition">
                  Subscribe
                </button>
              </div>
            ))}
          </div>

          <h2 className="text-2xl font-semibold mb-4">💰 One-time Coin Purchase</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {coinPacks.map((pack) => (
              <div key={pack.id} className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow hover:scale-105 transition">
                <h2 className="text-xl font-semibold mb-2">{pack.name}</h2>
                <p className="text-2xl font-bold mb-4">${pack.price}</p>
                <p className="text-green-500 font-semibold mb-4">{pack.coins}</p>
                <p className="text-gray-600 dark:text-gray-300 text-sm mb-6">{pack.description}</p>

                <button onClick={() => setSelectedPlan(pack)} className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 transition">
                  Purchase
                </button>
              </div>
            ))}
          </div>

          {selectedPlan && (
            <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
              <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg w-full max-w-md relative">
                <button
                  onClick={() => setSelectedPlan(null)}
                  className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>

                <h2 className="text-2xl font-bold mb-4 text-center">Confirm Your Purchase</h2>
                <p className="text-center text-lg mb-6">{selectedPlan.name} - ${selectedPlan.price}</p>

                <PayPalButtons
                  style={{ layout: "vertical" }}
                  createOrder={(data, actions) => {
                    return actions.order.create({
                      intent: "CAPTURE",
                      purchase_units: [
                        {
                          amount: {
                            currency_code: "USD",
                            value: selectedPlan.price.toString(),
                          },
                          description: `${selectedPlan.name} Plan`,
                        },
                      ],
                    });
                  }}
                  onApprove={async (data, actions) => {
                    if (!actions.order) throw new Error("Order is not available.");
                    const details = await actions.order.capture();
                    alert(`Payment complete! Thank you, ${details.payer?.name?.given_name}`);
                    setSelectedPlan(null);
                  }}
                  onCancel={() => {
                    alert("Payment was cancelled.");
                    setSelectedPlan(null);
                  }}
                  onError={(err) => {
                    console.error("PayPal error", err);
                    alert("Something went wrong during payment.");
                    setSelectedPlan(null);
                  }}
                />
              </div>
            </div>
          )}
        </div>
      </PayPalScriptProvider>
    </main>
  );
}
