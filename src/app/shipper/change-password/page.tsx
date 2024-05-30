"use client";
import React from "react";
import { Card, Input, Button, Typography } from "@material-tailwind/react";
import Toast from "@/utils/Toast";
import { APIChangePassword } from "@/services/Shipper";
import { useRouter } from "next/navigation";

function Page() {
  const router = useRouter();
  const [oldPassword, setOldPassword] = React.useState("");
  const [newPassword, setNewPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");

  React.useEffect(() => {
    document.getElementById("loading-page")?.classList.add("hidden");
  }, []);
  const validatePassword = (password: string, fieldName: string) => {
    if (password === "") {
      Toast("error", `${fieldName} không được để trống`, 3000);
      return false;
    }
    if (password.length < 6 || password.length > 20) {
      Toast("error", `${fieldName} phải có từ 6 đến 20 kí tự`, 3000);
      return false;
    }
    if (!password.match(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\da-zA-Z])/)) {
      Toast(
        "error",
        `${fieldName} phải có ít nhất 1 chữ hoa, 1 chữ thường, 1 số và 1 ký tự đặc biệt`,
        3000
      );
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validatePassword(newPassword, "Mật khẩu mới")) return;
    if (!validatePassword(oldPassword, "Mật khẩu cũ")) return;
    if (newPassword !== confirmPassword) {
      Toast("error", "Mật khẩu mới nhập lại không khớp", 3000);
      return;
    }

    const res = await APIChangePassword({
      oldPassword,
      newPassword,
    });
    if (res?.status === 200 || res?.status === 201) {
      Toast("success", res?.data.message, 3000);
      setTimeout(() => {
        document.getElementById("loading-page")?.classList.remove("hidden");
        router.push("/shipper");
      }, 2000);
    } else {
      Toast("error", res?.data.message, 3000);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <Card color="transparent" shadow={false} className="p-4 shadow-2xl">
        <Typography variant="h4" color="blue-gray">
          Đổi mật khẩu
        </Typography>
        <form className="mt-8 mb-2 w-80 max-w-screen-lg sm:w-96 bg-gray-200">
          <div className="mb-1 flex flex-col gap-6">
            <Typography variant="h6" color="blue-gray" className="-mb-3">
              Mật khẩu hiện tại
            </Typography>
            <Input
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              type="password"
              size="lg"
              placeholder="********"
              className=" !border-t-blue-gray-200 focus:!border-t-gray-900"
              labelProps={{
                className: "before:content-none after:content-none",
              }}
              crossOrigin={undefined}
            />
            <Typography variant="h6" color="blue-gray" className="-mb-3">
              Mật khẩu mới
            </Typography>
            <Input
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              type="password"
              size="lg"
              placeholder="********"
              className=" !border-t-blue-gray-200 focus:!border-t-gray-900"
              labelProps={{
                className: "before:content-none after:content-none",
              }}
              crossOrigin={undefined}
            />
            <Typography variant="h6" color="blue-gray" className="-mb-3">
              Nhập lại mật khẩu mới
            </Typography>
            <Input
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              type="password"
              size="lg"
              placeholder="********"
              className=" !border-t-blue-gray-200 focus:!border-t-gray-900"
              labelProps={{
                className: "before:content-none after:content-none",
              }}
              crossOrigin={undefined}
            />
          </div>
          <Button
            className="mt-6"
            fullWidth
            color="blue-gray"
            onClick={(e) => handleSubmit()}
          >
            Xác nhận
          </Button>
          <Button
            className="mt-2"
            fullWidth
            onClick={(e) => {
              document
                .getElementById("loading-page")
                ?.classList.remove("hidden");
              router.push("/shipper");
            }}
          >
            Quay lại trang chủ
          </Button>
        </form>
      </Card>
    </div>
  );
}

export default Page;
