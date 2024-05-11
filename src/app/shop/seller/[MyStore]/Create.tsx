"use client";
import React from "react";
import UploadFile from "./UploadFile";
import Input from "@/components/Input";
import { CREATEPRODUCT } from "@/constants/CreateProduct";
import CheckValidInput from "@/utils/CheckValidInput";
const ReactQuill =
  typeof window === "object" ? require("react-quill") : () => false;
import "react-quill/dist/quill.snow.css";
import Toast from "@/utils/Toast";
import { APICreateProduct } from "@/services/Product";
import { APIUploadImage } from "@/services/UploadImage";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/store";
import { setCategoryStore } from "@/redux/features/categoryStore/categoryStore-slice";
import { CATEGORYSTORE } from "@/constants/CategoryStore";
function Create() {
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
  const dispatch = useDispatch<AppDispatch>();
  // Get category from localStorage
  const category = localStorage.getItem("category")
    ? JSON.parse(localStorage.getItem("category")!)
    : null;
  const CreateProduct = async (product: any) => {
    document.getElementById("loading-page")?.classList.remove("hidden");
    document
      .getElementById("formCreate-productName")
      ?.classList.remove("border-red-500");
    const objCopied = JSON.parse(JSON.stringify(product));
    delete objCopied.keywords;
    if (+objCopied.newPrice > +objCopied.oldPrice) {
      document.getElementById("loading-page")?.classList.add("hidden");
      Toast("error", "Giá sau khi smar phải nhỏ hơn giá trước giảm", 2000);
      return;
    }
    if (
      CheckValidInput(objCopied) == "" &&
      objCopied.description.replace(/<(.|\n)*?>/g, "").trim().length !== 0
    ) {
      // Upload image
      const listImg: any = [];
      console.log("product.avatar", product.avatar);
      for (let i = 0; i < product.avatar.length; i++) {
        let formData = new FormData();
        formData.append("file", product.avatar[i]);
        const res = await APIUploadImage(formData);
        if (res?.status == 200 || res?.status == 201) {
          listImg.push(res?.data.url);
        } else {
          document.getElementById("loading-page")?.classList.add("hidden");
          Toast("error", "Ảnh có kích thước quá lớn", 2000);
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
  return (
    <div className="bg-white rounded-md p-4 mb-5">
      <div className="flex justify-between items-center">
        {Array.from({ length: 4 }).map((_, index) => (
          <UploadFile
            index={index}
            key={index}
            setProduct={(data: any) => {
              // Push data to img Array
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
            <Input label={item.label} required={true} key={index}>
              <input
                key={index}
                id={`formCreate-${item.name}`}
                type="text"
                className="w-full outline-none border-solid border-2 border-gray-300 rounded-md p-2"
                placeholder={item.placeholder}
                name={item.name}
                value={product[item.name as keyof typeof product]}
                onChange={(e) => {
                  setProduct({ ...product, [item.name]: e.target.value });
                }}
                onBlur={(e) => {
                  const result = CheckValidInput({
                    [`${item.identify}`]: e.target.value,
                  });
                  if (result !== "") {
                    document
                      .getElementById(`formCreate-${item.name}`)
                      ?.classList.add("border-red-500");
                  } else {
                    document
                      .getElementById(`formCreate-${item.name}`)
                      ?.classList.remove("border-red-500");
                  }
                  document.getElementById(`errMes-${item.name}`)!.innerHTML =
                    result;
                }}
              />
              <span
                id={`errMes-${item.name}`}
                className="text-red-500 text-sm"
              ></span>
            </Input>
          );
        })}
      </div>
      <Input label={"Danh mục"} required={true}>
        <select
          name=""
          id=""
          className={`w-full outline-none border-solid border-2 border-gray-300 rounded-md p-2`}
          onChange={(e) =>
            setProduct({ ...product, categoryId: e.target.value })
          }
        >
          <option value=""> Chọn danh mục</option>
          {category &&
            category.map((item: any, index: number) => {
              if (item.name !== "Cho tặng miễn phí") {
                return (
                  <option value={item._id} key={index}>
                    {item.name}
                  </option>
                );
              }
            })}
        </select>
      </Input>

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
        <button
          className="bg-blue-500 hover:bg-blue-600 text-white rounded-md p-2 px-4"
          onClick={(e) => {
            CreateProduct(product);
          }}
        >
          Tạo sản phẩm
        </button>
      </div>
    </div>
  );
}

export default Create;
