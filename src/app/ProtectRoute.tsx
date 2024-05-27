"use client";
import { redirect, usePathname } from "next/navigation";
import React from "react";
import FullPageLoader from "./FullPageLoader";

function ProtectRoute({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const user =
      localStorage.getItem("user") &&
      JSON.parse(localStorage.getItem("user") || "");
    const redirectUser = (redirectPath: string) => {
      redirect(redirectPath);
    };
    if (
      pathname == "/login" ||
      pathname == "/register" ||
      pathname == "/forgot-password"
    ) {
      setLoading(false);
      return;
    }
    const userRoles = user?.role || [];

    if (userRoles.some((role: string) => role.includes("ADMIN"))) {
      if (!pathname.startsWith("/admin")) {
        redirectUser("/admin/dashboard");
        return;
      }
    } else if (userRoles.some((role: string) => role.includes("MANAGER"))) {
      if (
        !pathname.startsWith("/admin") ||
        pathname.startsWith("/admin/dashboard") ||
        pathname.startsWith("/admin/policy")
      ) {
        redirectUser("/admin/user/all");
        return;
      }
    } else if (userRoles.some((role: string) => role.includes("SELLER"))) {
      if (pathname.startsWith("/admin")) {
        redirectUser("/");
        return;
      }
    } else if (userRoles.some((role: string) => role.includes("SHIPPER"))) {
      if (!pathname.startsWith("/shipper")) {
        redirectUser("/shipper");
        return;
      }
    } else {
      if (
        pathname.startsWith("/shop/seller") ||
        pathname.startsWith("/admin") ||
        pathname.startsWith("/shiper")
      ) {
        redirectUser("/");
        return;
      }
    }

    setLoading(false);
  }, []);
  if (loading) return <FullPageLoader state={loading} />;

  return children;
}

export default ProtectRoute;
