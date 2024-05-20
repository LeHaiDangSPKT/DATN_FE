"use client";
import { useFormik } from "formik";
import * as Yup from "yup";
import { APIUploadImage } from "@/services/UploadImage";

import {
  Typography,
  Button,
  Card,
  Input,
  Select,
  Option,
} from "@material-tailwind/react";
import React from "react";
import Toast from "@/utils/Toast";
import { APICreateShippers } from "@/services/Shipper";

function FillForm() {
  React.useEffect(() => {
    document.getElementById("loading-page")?.classList.add("hidden");
  }, []);
  const [file, setFile] = React.useState<File | null>(null);
  const fieldsSubmit = [
    {
      name: "avatar",
      type: "file",
      title: "Hình ảnh",
      placeholder: "",
    },
    {
      name: "name",
      type: "text",
      title: "Họ và tên",
      placeholder: "Nguyễn Văn A",
    },
    {
      name: "email",
      type: "email",
      title: "Email",
      placeholder: "name@mail.com",
    },
    {
      name: "phone",
      type: "text",
      title: "Số điện thoại",
      placeholder: "0888888888",
    },
    {
      name: "address",
      type: "text",
      title: "Địa chỉ",
      placeholder: "Số nhà, đường, quận, thành phố",
    },
    {
      name: "gender",
      type: "select",
      title: "Giới tính",
      placeholder: "",
    },
  ];
  const submitForm = useFormik({
    initialValues: {
      avatar: "",
      name: "",
      email: "",
      phone: "",
      address: "",
      gender: "Nam",
    },
    validationSchema: Yup.object({
      avatar: Yup.string().required("Hình ảnh không được để trống"),
      name: Yup.string().required("Họ và tên không được để trống"),
      email: Yup.string()
        .email("Email không đúng định dạng")
        .required("Email không được để trống"),
      phone: Yup.string()
        .required("Số điện thoại không được để trống")
        .matches(/^[0-9]+$/, "Số điện thoại không đúng định dạng")
        .min(10, "Số điện thoại phải có 10 số"),
      address: Yup.string().required("Địa chỉ không được để trống"),
    }),
    onSubmit: (values) => {
      const val = JSON.parse(JSON.stringify(values));
      const submit = async () => {
        const res = await APICreateShippers(val);
        if (res?.status == 200 || res?.status == 201) {
          Toast("success", "Gửi đăng ký thành công", 2000);
          setTimeout(() => {
            window.location.href = "/";
          }, 1000);
        } else {
          Toast("error", "Gửi đăng ký thất bại", 2000);
        }
      };
      const upload = async () => {
        let formData = new FormData();
        formData.append("file", file!);
        const res = await APIUploadImage(formData);
        if (res?.status == 200 || res?.status == 201) {
          val.avatar = res?.data.url;
          submit();
        } else {
          Toast("error", "Ảnh có kích thước quá lớn hoặc bị lỗi", 2000);
          return;
        }
      };
      if (file) {
        upload();
      }
    },
  });
  return (
    <Card className="my-2 p-2 flex items-stretch sm:items-center justify-center flex-col">
      <Typography variant="h4" color="blue-gray" className="text-center">
        Shipper
      </Typography>
      <Typography color="gray" className="mt-1 font-normal text-center">
        Trở thành shipper để nhận đơn hàng và kiếm thêm thu nhập
      </Typography>
      <form className="mt-4 mb-2 max-w-screen-lg sm:w-96">
        <div className="mb-1 flex flex-col mx-auto gap-[7px]">
          {fieldsSubmit.map((item) => {
            return (
              <>
                <Typography variant="h6" color="blue-gray" className="-mb-1">
                  {item.title}
                </Typography>
                {item.type === "select" ? (
                  <Select
                    label="Chọn giới tính"
                    onChange={submitForm.handleChange}
                    value={
                      submitForm.values[
                        item.name as keyof typeof submitForm.values
                      ]
                    }
                  >
                    <Option value="Nam">Nam</Option>
                    <Option value="Nữ">Nữ</Option>
                    <Option value="Khác">Khác</Option>
                  </Select>
                ) : (
                  <Input
                    name={item.name}
                    value={
                      submitForm.values[
                        item.name as keyof typeof submitForm.values
                      ]
                    }
                    onChange={(e) => {
                      if (item.type === "file") {
                        setFile(e.target.files?.[0] as File);
                        submitForm.handleChange(e);
                      } else {
                        submitForm.handleChange(e);
                      }
                    }}
                    type={item.type}
                    size="lg"
                    placeholder={item.placeholder}
                    className=" !border-t-blue-gray-200 focus:!border-t-gray-900"
                    crossOrigin={undefined}
                  />
                )}

                {submitForm.errors[
                  item.name as keyof typeof submitForm.values
                ] && (
                  <p className="text-red-500 text-xs italic pt-1.5">
                    {
                      submitForm.errors[
                        item.name as keyof typeof submitForm.values
                      ]
                    }
                  </p>
                )}
              </>
            );
          })}
        </div>
        <Button
          className="mt-6"
          fullWidth
          color="blue"
          onClick={(e) => submitForm.handleSubmit()}
        >
          Gửi đăng ký
        </Button>
      </form>
    </Card>
  );
}

export default FillForm;
