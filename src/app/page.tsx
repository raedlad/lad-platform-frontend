
"use client";
import { redirect } from "next/navigation";
import { tokenStorage } from "@/features/auth/utils/tokenStorage";
import { useEffect } from "react";

const page = () => {
  useEffect(() => {
    tokenStorage.clearAll();
  }, []);
  return redirect("/home");
};

export default page;
