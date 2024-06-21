"use client";
import React from "react";
import UploadFile from "./UploadFile";
import { CREATEPRODUCT } from "@/constants/CreateProduct";
import CheckValidInput from "@/utils/CheckValidInput";
const ReactQuill =
  typeof window === "object" ? require("react-quill") : () => false;
import "react-quill/dist/quill.snow.css";
import Toast from "@/utils/Toast";
import { APICreateProduct } from "@/services/Product";
import { APIUploadImage } from "@/services/UploadImage";
import { useDispatch } from "react-redux";
import { AppDispatch, useAppSelector } from "@/redux/store";
import { setCategoryStore } from "@/redux/features/categoryStore/categoryStore-slice";
import { CATEGORYSTORE } from "@/constants/CategoryStore";
import {
  Input,
  Select,
  Typography,
  Option,
  Button,
} from "@material-tailwind/react";

import DialogPolicy from "@/components/DialogPolicy";
function Create() {
  const lengthIndex = useAppSelector(
    (state) => state.uploadFilesReducer.arr.length
  );
  const [product, setProduct] = React.useState({
    name: "",
    newPrice: 0,
    oldPrice: 0,
    avatar: [] as any,
    description: "",
    categoryId: "",
    quantity: 0,
    list_keyword: "",
    keywords: [] as any,
  });
  const [creating, setCreating] = React.useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const category = localStorage.getItem("category")
    ? JSON.parse(localStorage.getItem("category")!).filter(
        (item: any) => item.name !== "Cho tặng miễn phí"
      )
    : [];
  const CreateProduct = async (product: any) => {
    const objCopied = JSON.parse(JSON.stringify(product));
    delete objCopied.keywords;
    if (+objCopied.newPrice > +objCopied.oldPrice) {
      Toast("error", "Giá sau khi giảm phải nhỏ hơn giá trước giảm", 2000);
      return;
    }
    if (
      CheckValidInput(objCopied) == "" &&
      objCopied.description.replace(/<(.|\n)*?>/g, "").trim().length !== 0
    ) {
      // Upload image
      const listImg: any = [];
      setCreating(true);
      for (let i = 0; i < product.avatar.length; i++) {
        let formData = new FormData();
        formData.append("file", product.avatar[i]);
        const res = await APIUploadImage(formData);
        if (res?.status == 200 || res?.status == 201) {
          listImg.push(res?.data.url);
        } else {
          Toast("error", res.data.message, 2000);
          setCreating(false);
          return;
        }
      }
      product.avatar = listImg;
      // Change price to number
      product.newPrice = Number(product.newPrice);
      product.oldPrice = Number(product.oldPrice);
      product.quantity = Number(product.quantity);

      // Change keyword to array
      product.keywords = product.list_keyword.split(",");
      delete product.list_keyword;
      const res = await APICreateProduct(product);
      setCreating(false);
      if (res?.status == 200 || res?.status == 201) {
        document.getElementById("loading-page")?.classList.add("hidden");
        Toast("success", "Tạo sản phẩm thành công", 2000);
        setTimeout(() => {
          dispatch(setCategoryStore(CATEGORYSTORE[CATEGORYSTORE.length - 2]));
        }, 2000);
      } else {
        document.getElementById("loading-page")?.classList.add("hidden");
        Toast("error", "Tạo sản phẩm thất bại", 2000);
      }
    } else {
      document.getElementById("loading-page")?.classList.add("hidden");
      Toast("error", "Vui lòng điền đầy đủ thông tin", 2000);
    }
  };
  const handleDescriptionChange = (value: string) => {
    setProduct({ ...product, description: value });
  };
  const [openDialogPolicy, setOpenDialogPolicy] = React.useState(false);
  return (
    <div className="bg-white rounded-md p-4 mb-5">
      <div className="flex justify-between items-center">
        {Array.from({ length: 4 }).map((_, index) => (
          <UploadFile
            index={index}
            key={index}
            setProduct={(data: any) => {
              const img = product.avatar;
              img.push(data);
              setProduct({ ...product, avatar: img });
            }}
          />
        ))}
      </div>
      <div>
        {CREATEPRODUCT.map((item, index) => {
          return (
            <div className="mt-4" key={index}>
              <Input
                label={item.label}
                crossOrigin={undefined}
                type={item.identify == "number" ? "number" : "text"}
                value={product[item.name as keyof typeof product]}
                onChange={(e) => {
                  setProduct({ ...product, [item.name]: e.target.value });
                }}
                onBlur={(e) => {
                  if (item.identify == "number") {
                    setProduct({
                      ...product,
                      [item.name]: Math.ceil(+e.target.value),
                    });
                  }
                }}
              />
            </div>
          );
        })}
      </div>
      <div className="mt-4">
        <Select
          label="Chọn danh mục"
          onChange={(val) => setProduct({ ...product, categoryId: val! })}
        >
          {category &&
            category.map((item: any, index: number) => {
              return (
                <Option value={item._id} key={index}>
                  {item.name}
                </Option>
              );
            })}
        </Select>
      </div>

      <div className="mt-4">
        <div className="font-bold text-lg">Mô tả sản phẩm của bạn</div>
        <ReactQuill
          theme="snow"
          value={product.description}
          onChange={handleDescriptionChange}
        />
      </div>
      {/* Nút tạo sản phẩm */}
      <div className="flex justify-center mt-5">
        <Button
          color="blue"
          loading={creating || lengthIndex != 0}
          onClick={(e) => {
            CreateProduct(product);
          }}
        >
          Tạo sản phẩm
        </Button>
      </div>
      <Typography color="gray" className="text-center mt-2 italic text-sm">
        Bằng cách tạo sản phẩm, bạn đã đồng ý với{" "}
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
        type="STORE"
        openDialogPolicy={openDialogPolicy}
        setOpenDialogPolicy={() => setOpenDialogPolicy(false)}
      />
    </div>
  );
}

export default Create;
