// components/UserProfileCard.tsx
type Props = {
  email: string;
  nickname: string;
  plan: string;
  model: string;
};

export default function UserProfileCard({ email, nickname, plan, model }: Props) {
  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow space-y-2">
      <h2 className="text-xl font-bold text-gray-800 dark:text-white">{nickname}</h2>
      <p className="text-sm text-gray-500 dark:text-gray-300">Email: {email}</p>
      <p className="text-sm text-gray-500 dark:text-gray-300">Plan: {plan}</p>
      <p className="text-sm text-gray-500 dark:text-gray-300">Model: {model}</p>
    </div>
  );
}
