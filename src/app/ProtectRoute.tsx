"use client";
import { redirect, usePathname, useRouter } from "next/navigation";
import React from "react";
import FullPageLoader from "./FullPageLoader";

function ProtectRoute({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [loading, setLoading] = React.useState(true);
  React.useEffect(() => {
    const user = localStorage.getItem("user")
      ? JSON.parse(localStorage.getItem("user") ?? "")
      : null;

    if (user) {
      if (user.role.includes("USER") || user.role.includes("SELLER")) {
        if (pathname.startsWith("/admin") || pathname.startsWith("/manager")) {
          router.back();
        } else {
          setLoading(false);
        }
      } else if (user.role.includes("MANAGER")) {
        if (!pathname.startsWith("/manager")) {
          router.back();
        } else {
          setLoading(false);
        }
      } else if (user.role.includes("ADMIN")) {
        if (!pathname.startsWith("/admin")) {
          router.back();
        } else {
          if (pathname === "/admin") {
            redirect("/admin/dashboard");
          }
          if (pathname === "/admin/user") {
            redirect("/admin/user/all");
          }
          setLoading(false);
        }
      }
    } else {
      if (pathname.startsWith("/admin") || pathname.startsWith("/manager")) {
        redirect("/");
      } else {
        setLoading(false);
      }
    }
  }, []);
  if (loading) {
    return <FullPageLoader />;
  }

  return children;
}

export default ProtectRoute;
