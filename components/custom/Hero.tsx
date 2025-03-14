"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useUserStore } from "@/public/store/UserSlice";
import { useGoogleLogin } from "@react-oauth/google";
import axios from "axios";
import Image from "next/image";

export default function Hero() {
  const { user, saveUserInDatabase } = useUserStore((state) => state);

  const handleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      const userInfo = await axios.get(
        "https://www.googleapis.com/oauth2/v3/userinfo",
        { headers: { Authorization: `Bearer ${tokenResponse?.access_token}` } }
      );
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
  const [loading, setLoading] = useState(true);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 md:p-10 font-[family-name:var(--font-geist-sans)] text-center">
      <div className="fixed flex top-0 left-0 w-full h-screen z-10">
        <Image
          src={"/goku.png"}
          alt="Background Img"
          width={1500}
          height={1500}
          style={{ width: "100%", height: "100vh" }}
          className="object-cover"
          onLoad={() => setLoading(false)}
        />
      </div>
      <div
        className={`flex flex-col gap-6 bg-black/50 text-white rounded-xl shadow-md backdrop-blur-lg items-center justify-center py-10 px-6 md:px-10 relative z-20 ${
          loading ? "-translate-y-20 opacity-0" : "translate-y-0 opacity-100"
        } transition duration-500 linear`}
      >
        <div className="w-60 md:w-80">
          <Image
            priority
            src={"/logo.svg"}
            alt="Task Buddy"
            width={100}
            height={100}
            style={{ width: "100%", height: "45px" }}
            className="object-cover rounded-md"
          />
        </div>
        <p className="text-sm md:text-base font-semibold max-w-2xl">
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
            className="mt-5 font-medium md:text-lg md:h-12"
            variant="secondary"
          >
            <Image src={"/google.svg"} alt="Google" width={18} height={18} />
            Continue with Google
          </Button>
        )}
      </div>{" "}
    </div>
  );
}
