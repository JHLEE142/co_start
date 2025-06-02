import { useUserStore } from "@/store/user";

export default function TopNavBar() {
  const { user, resetUser } = useUserStore();

  return (
    <nav className="flex justify-between items-center p-4 bg-gray-100">
      <div className="font-bold text-xl">DocAuto</div>
      {user && (
        <div className="flex items-center space-x-4">
          <span>{user.name} ({user.plan})</span>
          <button onClick={resetUser} className="text-red-600">Logout</button>
        </div>
      )}
    </nav>
  );
}
