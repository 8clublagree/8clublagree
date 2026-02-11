"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Spin } from "antd";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session) {
        router.push("/dashboard");
      } else {
        // router.push('/login');
        router.push("/about");
      }
    };

    checkAuth();
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="flex justify-center">
          <img
            src="/images/main-8-logo.png"
            alt="Logo"
            width={100}
            height={100}
          />
        </div>
        <div className="flex flex-row gap-x-[20px]">
          <p className="mt-4 text-slate-600 animate-loading-shade">Warming Up</p>
          <Spin spinning={true} />
        </div>
      </div>
    </div>
  );
}
