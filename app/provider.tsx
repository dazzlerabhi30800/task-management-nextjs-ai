"use client";
import { useUserStore } from "@/public/store/UserSlice";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { usePathname, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import Spinner from "./list/_components/Spinner";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";
import { pdfjs } from "react-pdf";

const Provider = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const pathname = usePathname();
  const { user } = useUserStore((state) => state);
  const [client, setClient] = useState(false);

  //NOTE: Check user
  const checkUser = () => {
    if (pathname === "/") return;
    if (!user) {
      router.push("/");
    }
  };

  useEffect(() => {
    if (!client) return;
    checkUser();
  }, [user, client]);

  useEffect(() => {
    setClient(true);
  }, []);

  // NOTE: Config for Pdf File
  pdfjs.GlobalWorkerOptions.workerSrc = new URL(
    "pdfjs-dist/build/pdf.worker.min.mjs",
    import.meta.url
  ).toString();

  if (!client)
    return (
      <div>
        <Spinner additionalStyles="h-full bg-black/50 text-white  fixed top-0 left-0 w-full mt-0" />
      </div>
    );
  return (
    <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_KEY!}>
      {children}
    </GoogleOAuthProvider>
  );
};

export default Provider;
