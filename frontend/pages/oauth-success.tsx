import { useEffect } from "react";
import { useRouter } from "next/router";
import { useUserStore } from "@/store/user";
import { saveToken } from "@/lib/auth";

export default function OAuthSuccessPage() {
  const router = useRouter();
  const { token } = router.query;
  const { setUser } = useUserStore();

  useEffect(() => {
    if (typeof token === "string") {
      saveToken(token);  // localStorage 저장
      // 유저 정보 요청
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/me`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
        .then((res) => res.json())
        .then((user) => {
          setUser({
            id: user.id,
            email: user.email,
            name: user.nickname,
            plan: user.plan,
            credit_usage: user.credit_usage
          });
          router.push("/dashboard");
        });
    }
  }, [token, setUser, router]);

  return <div className="p-10">Redirecting...</div>;
}
