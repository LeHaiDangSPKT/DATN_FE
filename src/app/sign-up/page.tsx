"use client";
import React from "react";
import FrameFormInit from "@/components/FrameFormInit";
import { SIGNUP } from "@/constants/Signup";
import { APIVerifyOTP, APISendOTP } from "@/services/UserOTP";
import FrameInit from "@/components/FrameInit";
import { FaLongArrowAltLeft, FaRedo } from "react-icons/fa";
import { APISignUp } from "@/services/Auth";
import Toast from "@/utils/Toast";
import Link from "next/link";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Input } from "@material-tailwind/react";
import { useRouter } from "next/navigation";

function SignUp() {
  const router = useRouter();
  React.useEffect(() => {
    document.getElementById("loading-page")?.classList.add("hidden");
  }, []);
  const signUpForm = useFormik({
    initialValues: {
      name: "",
      email: "",
      password: "",
      repassword: "",
    },
    validationSchema: Yup.object({
      name: Yup.string().required("Họ và tên không được để trống"),
      email: Yup.string()
        .email("Email không đúng định dạng")
        .required("Email không được để trống"),
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
      SendOTP();
    },
  });

  const otpForm = useFormik({
    initialValues: {
      otp: "",
    },
    validationSchema: Yup.object({
      otp: Yup.string()
        .required("Không được để trống")
        .min(6, "Mã OTP không hợp lệ")
        .max(6, "Mã OTP không hợp lệ")
        .matches(/^[0-9]+$/, "Mã OTP không hợp lệ"),
    }),
    onSubmit: (values) => {
      ConfirmOTP();
    },
  });
  const [checkState, setCheckState] = React.useState({
    isSendOTP: false,
    titleButton: "Đăng ký",
    navigateTitle: "Đã có tài khoản?",
  });

  React.useEffect(() => {
    const listener = (event: { code: string; preventDefault: () => void }) => {
      if (event.code === "Enter" || event.code === "NumpadEnter") {
        event.preventDefault();
        console.log(checkState.isSendOTP);
        console.log(signUpForm.errors);

        checkState.isSendOTP
          ? otpForm.handleSubmit()
          : signUpForm.handleSubmit();
      }
    };
    document.addEventListener("keydown", listener);
    return () => {
      document.removeEventListener("keydown", listener);
    };
  }, [signUpForm, checkState, otpForm]);

  const SendOTP = async () => {
    const res = await APISendOTP(signUpForm.values.email);
    if (res?.status !== 200 && res.status !== 201) {
      Toast("error", res.message, 5000);
    } else {
      Toast(
        "success",
        `Mã OTP đang được gửi đến ${signUpForm.values.email}`,
        5000
      );
      setCheckState({
        ...checkState,
        isSendOTP: true,
        titleButton: "Xác nhận",
        navigateTitle: "Nhập lại thông tin",
      });
    }
  };

  const ReSendOTP = async () => {
    const res = await APISendOTP(signUpForm.values.email);
    if (res?.status !== 200 && res.status !== 201) {
      Toast("error", res.message, 5000);
    } else {
      Toast(
        "success",
        `Mã OTP đang được gửi đến ${signUpForm.values.email}`,
        5000
      );
    }
  };

  const ConfirmOTP = async () => {
    const res = await APIVerifyOTP(signUpForm.values.email, otpForm.values.otp);
    if (res?.status !== 200 && res.status !== 201) {
      Toast("error", res.message, 5000);
      return;
    }

    const result = await APISignUp(signUpForm.values);
    if (result.status !== 200 && result.status !== 201) {
      Toast("error", result.message, 5000);
      return;
    }
    Toast("success", "Đăng ký thành công", 2000);
    setTimeout(() => {
      document.getElementById("loading-page")?.classList.remove("hidden");
      router.push("/login");
    }, 2000);
  };
  return (
    <div>
      <FrameInit />
      <div className="absolute top-0 left-[5%] z-20">
        <div className="flex flex-col items-center justify-center h-screen">
          <FrameFormInit
            title={`${checkState.isSendOTP ? "NHẬP MÃ OTP" : "ĐĂNG KÝ"}`}
          >
            {checkState.isSendOTP ? (
              <>
                <div className="w-full">
                  <Input
                    label="Mã OTP"
                    crossOrigin={undefined}
                    placeholder="Nhập mã OTP"
                    type="text"
                    value={otpForm.values.otp}
                    onChange={otpForm.handleChange}
                    name="otp"
                  />
                  {otpForm.errors.otp && (
                    <p className="text-red-500 text-xs italic pt-1.5">
                      {otpForm.errors.otp}
                    </p>
                  )}
                </div>
              </>
            ) : (
              <>
                {SIGNUP.map((item) => (
                  <div key={item.name} className="w-full mt-3">
                    <Input
                      label={item.label}
                      crossOrigin={undefined}
                      size="lg"
                      value={
                        signUpForm.values[
                          item.name as keyof typeof signUpForm.values
                        ]
                      }
                      type={
                        item.name === "password" || item.name === "repassword"
                          ? "password"
                          : "text"
                      }
                      name={item.name}
                      onChange={signUpForm.handleChange}
                      placeholder={item.placeholder}
                    />
                    {signUpForm.errors[
                      item.name as keyof typeof signUpForm.values
                    ] && (
                      <p className="text-red-500 text-xs italic pt-1.5">
                        {
                          signUpForm.errors[
                            item.name as keyof typeof signUpForm.values
                          ]
                        }
                      </p>
                    )}
                  </div>
                ))}
              </>
            )}
            <div className="w-full mt-2 flex justify-end">
              <div className="font-bold cursor-pointer">
                <div
                  className="flex items-center"
                  onClick={(e) => {
                    checkState.isSendOTP
                      ? setCheckState({
                          ...checkState,
                          isSendOTP: false,
                          titleButton: "Đăng ký",
                          navigateTitle: "Đã có tài khoản?",
                        })
                      : (document
                          .getElementById("loading-page")
                          ?.classList.remove("hidden"),
                        router.push("/login"));
                  }}
                >
                  <div className="mr-2">
                    <FaLongArrowAltLeft></FaLongArrowAltLeft>
                  </div>
                  {checkState.navigateTitle}
                </div>
                {checkState.isSendOTP && (
                  <div
                    className="flex items-center"
                    onClick={(e) => ReSendOTP()}
                  >
                    <div className="mr-2">
                      <FaRedo></FaRedo>
                    </div>
                    Gửi lại mã OTP
                  </div>
                )}
              </div>
            </div>
            <div className="w-full mt-4">
              <button
                className="py-3 bg-gray-600 text-white rounded-[10px] w-full px-4 font-bold text-lg mb-2"
                type="button"
                onClick={(e) => {
                  checkState.isSendOTP
                    ? otpForm.handleSubmit()
                    : signUpForm.handleSubmit();
                }}
              >
                {checkState.titleButton}
              </button>
              <Link href="/" className=" font-bold cursor-pointer">
                <div className="flex items-center justify-center">
                  <div className="mr-2">
                    <FaLongArrowAltLeft></FaLongArrowAltLeft>
                  </div>
                  Trở về trang chủ
                </div>
              </Link>
            </div>
          </FrameFormInit>
        </div>
      </div>
    </div>
  );
}

export default SignUp;
