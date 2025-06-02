// components/AdminStatsCard.tsx
import { ReactNode } from "react";

type Props = {
  icon: ReactNode;
  title: string;
  value: string;
};

export default function AdminStatsCard({ icon, title, value }: Props) {
  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow flex items-center gap-4">
      <div className="p-3 bg-indigo-100 dark:bg-indigo-500 text-indigo-600 dark:text-white rounded-full">
        {icon}
      </div>
      <div>
        <p className="text-sm text-gray-500 dark:text-gray-400">{title}</p>
        <p className="text-xl font-semibold">{value}</p>
      </div>
    </div>
  );
}
