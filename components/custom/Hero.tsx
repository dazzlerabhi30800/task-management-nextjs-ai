"use client";
import { Button } from "@/components/ui/button";
import { useUserStore } from "@/public/store/UserSlice";
import { useGoogleLogin } from "@react-oauth/google";
import axios from "axios";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Hero() {
  const { user, saveUserInDatabase } = useUserStore((state) => state);
  const router = useRouter();

  useEffect(() => {
    if (!user) return;
    router.push("/list");
  }, [user]);

  const handleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      const userInfo = await axios.get(
        "https://www.googleapis.com/oauth2/v3/userinfo",
        { headers: { Authorization: `Bearer ${tokenResponse?.access_token}` } },
      );
      console.log("hello");
      const newUser = {
        name: userInfo?.data.name as string,
        email: userInfo?.data.email as string,
        uid: "new user",
        picture: userInfo?.data?.picture,
      };
      saveUserInDatabase(newUser);
    },
    onError: (err) => {
      console.log(err);
    },
  });

  return (
    <div className="flex flex-col gap-3 items-center justify-center min-h-screen p-10 font-[family-name:var(--font-geist-sans)] text-center bg-bgMobile md:bg-bgLarge bg-center bg-cover bg-no-repeat">
      <Image
        src={"/logo.png"}
        alt="Task Buddy"
        className="object-cover"
        style={{ width: "auto", height: "auto" }}
        width={200}
        height={100}
      />
      <p className="text-sm md:text-base">
        Streamline your workflow and track progress effortlessly with our
        all-in-one task management app.
      </p>
      {user ? (
        <h2 className="bg-primary text-white rounded-sm font-bold p-3 px-8">
          Welcome Back, {user.name}
        </h2>
      ) : (
        <Button
          onClick={() => handleLogin()}
          className="mt-5 font-medium text-lg h-12"
        >
          <Image src={"/google.svg"} alt="Google" width={18} height={18} />
          Continue with Google
        </Button>
      )}
    </div>
  );
}
