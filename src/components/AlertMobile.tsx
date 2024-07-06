import React from "react";
import Image from "next/image";
import DevicesBro from "@/assets/DevicesBro.png";
import { Button } from "@material-tailwind/react";
import Link from "next/link";
import { signOut } from "next-auth/react";

interface AlertMobileProps {
  pathname: string;
}

function AlertMobile(props: AlertMobileProps) {
  const { pathname } = props;
  const [link, setLink] = React.useState<string>("");
  React.useEffect(() => {
    if (pathname.startsWith("/shop/seller")) {
      setLink("/");
    } else if (pathname.startsWith("/admin")) {
      setLink("/admin/dashboard");
    }
  }, [pathname]);
  const Singout = async () => {
    localStorage.removeItem("user");
    await signOut({
      callbackUrl: "/login",
    });
  };
  return (
    <div className="fixed bottom-[30%] left-0 right-0 z-50 flex flex-col items-center justify-center p-2 text-white">
      <div className="flex items-center justify-center">
        <Image priority src={DevicesBro} alt="" />
      </div>
      <div className="flex items-center justify-center">
        <div className="flex flex-col items-center justify-center p-4 text-center bg-[#1E293B] rounded-lg">
          <h2 className="text-xl font-bold">Thiết bị không tương thích</h2>
          <p className="text-sm">Vui lòng dùng laptop hoặc máy tính để bàn</p>
        </div>
      </div>
      {link == "/" ? (
        <Link href={link}>
          <Button color="blue" className="mt-3">
            Trở về trang chủ
          </Button>
        </Link>
      ) : (
        <Button
          onClick={() => {
            Singout();
          }}
          color="red"
          className="mt-3"
        >
          Đăng xuất
        </Button>
      )}
    </div>
  );
}

export default AlertMobile;
