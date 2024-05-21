"use client";
import React from "react";
import FrameFormInit from "@/components/FrameFormInit";
import { Input } from "@material-tailwind/react";
import FrameInit from "@/components/FrameInit";
import { FaLongArrowAltLeft } from "react-icons/fa";
import * as Yup from "yup";
import Link from "next/link";
import Toast from "@/utils/Toast";
import { APIForgetPassword } from "@/services/Auth";
import { FORGETPASSWORD } from "@/constants/ForgetPassword";
import { APISendOTPForget, APIVerifyOTP } from "@/services/UserOTP";
import { useFormik } from "formik";
import { useRouter } from "next/navigation";

function ForgetPassword() {
  const router = useRouter();
  const forgetForm = useFormik({
    initialValues: {
      email: "",
      otp: "",
      password: "",
      repassword: "",
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .email("Email không đúng định dạng")
        .required("Email không được để trống"),
      otp: Yup.string()
        .required("Không được để trống")
        .min(6, "Mã OTP không hợp lệ")
        .max(6, "Mã OTP không hợp lệ")
        .matches(/^[0-9]+$/, "Mã OTP không hợp lệ"),
      password: Yup.string()
        .required("Mật khẩu không được để trống")
        .min(6, "Mật khẩu tối thiểu 6 kí tự")
        .max(20, "Mật khẩu tối đa 20 kí tự")
        .matches(
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\da-zA-Z])/,
          "Mật khẩu phải có ít nhất 1 chữ hoa, 1 chữ thường, 1 số và 1 ký tự đặc biệt"
        ),
      repassword: Yup.string().oneOf(
        [Yup.ref("password"), undefined],
        "Mật khẩu không khớp"
      ),
    }),
    onSubmit: (values) => {
      Confirm();
    },
  });

  const [listField, setListField] = React.useState(
    FORGETPASSWORD.filter(
      (item) =>
        item.name !== "otp" &&
        item.name !== "password" &&
        item.name !== "repassword"
    )
  );
  const [checkState, setCheckState] = React.useState("UnSend");

  const Confirm = async () => {
    if (checkState == "UnSend") {
      const res = await APISendOTPForget(forgetForm.values.email);
      Toast(
        "success",
        `Mã OTP đang được gửi đến ${forgetForm.values.email}`,
        5000
      );
      setCheckState("Sent");
      forgetForm.setErrors({});
    } else if (checkState == "Sent") {
      const res = await APIVerifyOTP(
        forgetForm.values.email,
        forgetForm.values.otp
      );
      if (res?.status != 200 && res.status != 201) {
        Toast("error", res.message, 5000);
        return;
      }
      Toast("success", "Chuẩn rồi, nhập mật khẩu mới nhé", 2000);
      setCheckState("Confirm");
      forgetForm.setErrors({});
    } else {
      const result = await APIForgetPassword(
        forgetForm.values.email,
        forgetForm.values.password
      );
      if (result.status != 200 && result.status != 201) {
        Toast("error", result.message, 5000);
        return;
      }
      Toast("success", "Cập nhật thành công", 2000);
      setTimeout(() => {
        document.getElementById("loading-page")?.classList.remove("hidden");
        router.push("/login");
      }, 2000);
    }
  };
  React.useEffect(() => {
    if (checkState == "UnSend") {
      forgetForm.values.email = "";
      setListField(
        FORGETPASSWORD.filter(
          (item) =>
            item.name !== "otp" &&
            item.name !== "password" &&
            item.name !== "repassword"
        )
      );
    } else if (checkState == "Sent") {
      forgetForm.values.otp = "";
      setListField(
        FORGETPASSWORD.filter(
          (item) =>
            item.name !== "email" &&
            item.name !== "password" &&
            item.name !== "repassword"
        )
      );
    } else if (checkState == "Confirm") {
      forgetForm.values.password = "";
      forgetForm.values.repassword = "";
      setListField(
        FORGETPASSWORD.filter(
          (item) => item.name !== "email" && item.name !== "otp"
        )
      );
    }
  }, [checkState, forgetForm.values]);
  React.useEffect(() => {
    const listener = (event: { code: string; preventDefault: () => void }) => {
      if (event.code === "Enter" || event.code === "NumpadEnter") {
        event.preventDefault();
        Confirm();
      }
    };
    document.addEventListener("keydown", listener);
    return () => {
      document.removeEventListener("keydown", listener);
    };
  }, [Confirm]);
  return (
    <div>
      <FrameInit />
      <div className="absolute top-0 left-[5%] z-20">
        <div className="flex flex-col items-center justify-center h-screen">
          <FrameFormInit title="QUÊN MẬT KHẨU">
            {listField.map((item) => (
              <div key={item.name} className="w-full mt-3">
                <Input
                  label={item.label}
                  crossOrigin={undefined}
                  value={
                    forgetForm.values[
                      item.name as keyof typeof forgetForm.values
                    ]
                  }
                  onChange={forgetForm.handleChange}
                  name={item.name}
                  type={
                    item.name === "password" || item.name == "repassword"
                      ? "password"
                      : "text"
                  }
                  placeholder={item.placeholder}
                />
                {forgetForm.errors[
                  item.name as keyof typeof forgetForm.values
                ] && (
                  <p className="text-red-500 text-xs italic pt-1.5">
                    {
                      forgetForm.errors[
                        item.name as keyof typeof forgetForm.values
                      ]
                    }
                  </p>
                )}
              </div>
            ))}
            {checkState != "UnSend" && (
              <div className="w-full mt-2 flex justify-end">
                <div
                  className="font-bold cursor-pointer"
                  onClick={(e) => setCheckState("UnSend")}
                >
                  <div className="flex items-center">
                    <div className="mr-2">
                      <FaLongArrowAltLeft></FaLongArrowAltLeft>
                    </div>
                    Nhập lại email
                  </div>
                </div>
              </div>
            )}

            <div className="w-full mt-4">
              <Link href="/login" className=" font-bold cursor-pointer mb-3">
                <div className="flex items-center justify-center">
                  <div className="mr-2">
                    <FaLongArrowAltLeft></FaLongArrowAltLeft>
                  </div>
                  Trở về trang đăng nhập
                </div>
              </Link>
              <Link href="/" className=" font-bold cursor-pointer mb-3">
                <div className="flex items-center justify-center">
                  <div className="mr-2">
                    <FaLongArrowAltLeft></FaLongArrowAltLeft>
                  </div>
                  Trở về trang chủ
                </div>
              </Link>
              <button
                className="py-3 bg-gray-600 text-white rounded-[10px] mt-2 w-full px-4 font-bold text-lg"
                onClick={(e) => Confirm()}
              >
                Xác nhận
              </button>
            </div>
          </FrameFormInit>
        </div>
      </div>
    </div>
  );
}

export default ForgetPassword;
