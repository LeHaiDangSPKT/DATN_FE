import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import FrameFormInit from "@/components/FrameFormInit";
import { Input, Typography } from "@material-tailwind/react";
import { FaFacebook, FaLongArrowAltLeft } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { LOGIN } from "@/constants/Login";
import Link from "next/link";
import Toast from "@/utils/Toast";
import { APILogin } from "@/services/Auth";
import { signIn } from "next-auth/react";
import DialogPolicy from "@/components/DialogPolicy";
interface FormProps {
  fastLogin?: boolean;
}
function Form(props: FormProps) {
  const { fastLogin } = props;
  const [openDialogPolicy, setOpenDialogPolicy] = React.useState(false);
  const Login = async () => {
    const res = await APILogin(
      loginForm.values.email,
      loginForm.values.password
    );
    if (res?.status !== 200 && res.status !== 201) {
      document.getElementById("loading-page")?.classList.add("hidden");
      Toast("error", "Tài khoản hoặc mật khẩu không đúng", 5000);
      return;
    }
    localStorage.setItem("user", JSON.stringify(res?.data.metadata.data));
    if (res?.data.metadata.data.role.includes("ADMIN")) {
      window.location.href = "/admin/dashboard";
    } else if (res?.data.metadata.data.role.includes("MANAGER")) {
      window.location.href = "/admin/user/all";
    } else if (res?.data.metadata.data.role.includes("SHIPPER")) {
      window.location.href = "/shipper";
    } else {
      if (window.location.pathname == "/login") {
        window.location.href = "/";
      } else {
        window.location.reload();
      }
    }
  };
  const loginForm = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: Yup.object({
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
    }),
    onSubmit: (values) => {
      Login();
    },
  });
  React.useEffect(() => {
    const listener = (event: { code: string; preventDefault: () => void }) => {
      if (event.code === "Enter" || event.code === "NumpadEnter") {
        event.preventDefault();
        loginForm.handleSubmit();
      }
    };
    document.addEventListener("keydown", listener);
    return () => {
      document.removeEventListener("keydown", listener);
    };
  }, [loginForm]);

  const HandleSocial = async (type: string) => {
    fastLogin
      ? await signIn(type, {
          callbackUrl: window.location.href,
        })
      : await signIn(type, {
          callbackUrl: "/",
        });
  };

  return (
    <FrameFormInit title="ĐĂNG NHẬP" fastLogin={fastLogin}>
      {LOGIN.map((item) => (
        <div key={item.name} className="w-full mt-3">
          <Input
            size="lg"
            label={item.label}
            crossOrigin={undefined}
            value={loginForm.values[item.name as keyof typeof loginForm.values]}
            type={item.name === "password" ? "password" : "text"}
            name={item.name}
            onChange={loginForm.handleChange}
            placeholder={item.placeholder}
          />
          {loginForm.errors[item.name as keyof typeof loginForm.values] && (
            <p className="text-red-500 text-xs italic pt-1.5">
              {loginForm.errors[item.name as keyof typeof loginForm.values]}
            </p>
          )}
        </div>
      ))}
      <div className="w-full mt-2 flex justify-between text-center">
        <Link href="/forget-password" className="font-bold cursor-pointer">
          Quên mật khẩu
        </Link>
        <Link href="/sign-up" className="font-bold cursor-pointer">
          <div className="flex items-center">Chưa có tài khoản?</div>
        </Link>
      </div>

      <div className="w-full mt-2">
        <button
          className="py-2 bg-gray-600 text-white rounded-[10px] mb-2 w-full px-4 font-bold text-lg"
          onClick={(e) => loginForm.handleSubmit()}
        >
          Đăng nhập
        </button>
        <div className="flex justify-between items-center mb-2">
          <div
            className="py-2 bg-red-600 rounded-[10px] w-[49%] px-4 font-bold text-lg"
            onClick={(e) => {
              e.preventDefault();
              HandleSocial("google");
            }}
          >
            <div className="flex cursor-pointer text-white items-center justify-center rounded-md">
              <FcGoogle fontSize={30} className="r1-2 mr-2" />
              <span className="hidden sm:block">Log in with Google</span>
            </div>
          </div>
          <div
            className="py-2 bg-blue-600 rounded-[10px] w-[49%] px-4 font-bold text-lg"
            onClick={(e) => {
              e.preventDefault();
              HandleSocial("facebook");
            }}
          >
            <div className="flex cursor-pointer text-white items-center justify-center rounded-md">
              <FaFacebook fontSize={30} className="r1-2 mr-2" />
              <span className="hidden sm:block">Log in with Facebook</span>
            </div>
          </div>
        </div>
        <Link href="/" className=" font-bold cursor-pointer">
          <div className="flex items-center justify-center">
            <div className="mr-2">
              <FaLongArrowAltLeft></FaLongArrowAltLeft>
            </div>
            Trở về trang chủ
          </div>
        </Link>

        <Typography color="gray" className="text-center mt-2 italic text-sm">
          Bằng cách đăng nhập, bạn đã đồng ý với{" "}
          <span
            className="cursor-pointer font-bold"
            onClick={() => setOpenDialogPolicy(true)}
          >
            {" "}
            chính sách{" "}
          </span>{" "}
          của chúng tôi
        </Typography>

        <DialogPolicy
          type="USER"
          openDialogPolicy={openDialogPolicy}
          setOpenDialogPolicy={() => setOpenDialogPolicy(false)}
        />
      </div>
    </FrameFormInit>
  );
}

export default Form;
