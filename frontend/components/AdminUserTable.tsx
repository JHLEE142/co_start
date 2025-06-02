// components/AdminUserTable.tsx
type User = {
  id: string;
  email: string;
  nickname: string;
  plan: string;
  created_at: string;
};

type Props = {
  users: User[];
};

export default function AdminUserTable({ users }: Props) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white dark:bg-gray-800 border rounded shadow">
        <thead>
          <tr className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-white text-left text-sm uppercase">
            <th className="px-4 py-3">Email</th>
            <th className="px-4 py-3">Nickname</th>
            <th className="px-4 py-3">Plan</th>
            <th className="px-4 py-3">Joined</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id} className="border-t dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700">
              <td className="px-4 py-3">{user.email}</td>
              <td className="px-4 py-3">{user.nickname}</td>
              <td className="px-4 py-3">{user.plan}</td>
              <td className="px-4 py-3">{user.created_at}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
