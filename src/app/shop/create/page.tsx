"use client";
import Input from "@/components/Input";
import { CREATESTORE } from "@/constants/CreateStore";
import { APICreate, APIGetMyStore } from "@/services/Store";
import { APIUploadImage } from "@/services/UploadImage";
import { APIGetUserById } from "@/services/User";
import CheckValidInput from "@/utils/CheckValidInput";
import Toast from "@/utils/Toast";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React from "react";
const ReactQuill =
  typeof window === "object" ? require("react-quill") : () => false;
function CreateStore() {
  const router = useRouter();
  const [acceptPolicy, setAcceptPolicy] = React.useState(false);
  const [store, setStore] = React.useState<any>({});
  React.useEffect(() => {
    const userLS = localStorage.getItem("user")
      ? JSON.parse(localStorage.getItem("user")!)
      : null;
    const fetchData = async () => {
      const user = await APIGetUserById(userLS?.providerData[0]._id);
      console.log(`user`, user);
      setStore({
        address: "Địa chỉ mặc định",
        name: "",
        phoneNumber1: user.metadata.data.phone || "",
        phoneNumber2: "",
        description: "",
        avatar: "",
      });
    };
    fetchData();
  }, []);
  const handleDescriptionChange = (value: string) => {
    setStore({ ...store, description: value });
  };

  React.useEffect(() => {
    const fetchData = async () => {
      const store = await APIGetMyStore();
      if (store?.status == 200 || store?.status == 201) {
        Toast("error", "Bạn đã có cửa hàng", 2000);
        setTimeout(() => {
          document.getElementById("loading-page")?.classList.remove("hidden");
          router.push("/shop/seller/" + store?.data.metadata.data._id);
        }, 2000);
      }
    };
    fetchData();
  }, []);

  const CheckValid = () => {
    console.log(`store`, store);
    const validateField = (fieldName: string, errorMessage: string) => {
      const field = store[fieldName];
      if (!field) {
        isValid = false;
        const formElement = document.getElementById(`formCreate-${fieldName}`);
        formElement?.classList.add("border-red-500");
        document.getElementById(`errMes-${fieldName}`)!.innerHTML =
          errorMessage;
      }
    };

    const validatePhoneNumber = (phoneNumber: string, fieldName: string) => {
      if (
        (!phoneNumber.startsWith("0") || phoneNumber.length !== 10) &&
        phoneNumber !== ""
      ) {
        Toast("error", `Số điện thoại ${fieldName} không hợp lệ`, 2000);
        return false;
      }
    };

    const { address, name, phoneNumber1, phoneNumber2, avatar, description } =
      store;

    var isValid = true;

    validateField("address", "Không được để trống");
    validateField("name", "Không được để trống");
    validateField("phoneNumber1", "Không được để trống");
    validateField("phoneNumber2", "Không được để trống");

    validatePhoneNumber(phoneNumber1, "1");
    validatePhoneNumber(phoneNumber2, "2");

    if (!isValid) {
      Toast("error", "Bạn chưa nhập đủ thông tin", 2000);
      return false;
    }

    if (phoneNumber1 === phoneNumber2) {
      Toast("error", "Số điện thoại không được trùng nhau", 2000);
      return false;
    }

    if (!avatar) {
      Toast("error", "Bạn chưa chọn ảnh", 2000);
      return false;
    }

    if (description.replace(/<(.|\n)*?>/g, "").trim().length === 0) {
      Toast("error", "Bạn chưa mô tả cửa hàng", 2000);
      return false;
    }

    if (!acceptPolicy) {
      Toast("error", "Bạn chưa đồng ý với chính sách", 2000);
      return false;
    }

    const elementInValid = document.querySelectorAll("[id^='errMes-']");
    elementInValid.forEach((item) => {
      if (item.innerHTML !== "") {
        Toast("error", "Thông tin chưa chính xác", 2000);
        isValid = false;
      }
    });

    return isValid;
  };

  const CreateStore = async () => {
    if (CheckValid()) {
      // Đưa phoneNumber vào mảng
      const phoneNumber = [];
      phoneNumber.push(store.phoneNumber1);
      phoneNumber.push(store.phoneNumber2);
      if (store.avatar) {
        let formData = new FormData();
        formData.append("file", store.avatar);
        const rs = await APIUploadImage(formData);
        const storeRes = await APICreate({
          address: store.address,
          name: store.name,
          phoneNumber: phoneNumber,
          description: store.description,
          avatar: rs.data.url,
        });
        if (storeRes.status === 200 || storeRes.status === 201) {
          Toast("success", "Tạo cửa hàng thành công", 2000);
        } else {
          Toast("error", storeRes.message, 2000);
        }
        document.getElementById("loading-page")?.classList.remove("hidden");
        router.push("/shop/seller/" + storeRes.metadata?.data._id);
      } else {
        Toast("error", "Bạn chưa chọn ảnh", 2000);
      }
    }
  };
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => {
    setMounted(true);
  }, []);

  return (
    mounted && (
      <div className="min-h-screen flex px-[150px] my-4">
        <div className="bg-white rounded-md p-4 mb-5 w-full">
          <div className="text-center text-blue-500 font-bold text-2xl">
            TẠO CỬA HÀNG CỦA BẠN
          </div>
          <div className="flex mt-5">
            <div
              className="w-[16%] h-[165px] border border-[#d9d9d9] rounded-full flex justify-center items-center cursor-pointer mr-3"
              onClick={(e) => {
                const input = document.getElementById("upload-avatar");
                if (input) {
                  input.click();
                }
              }}
            >
              <div className="text-[50px] text-[#d9d9d9]" id="symbol-upload">
                <span className="text-[#d9d9d9]">+</span>
              </div>
              <Image
                src=""
                id="avatar-preview"
                alt=""
                className="rounded-full h-full fit-cover w-full"
                hidden
              />
            </div>
            {/* Ẩn */}
            <input
              id="upload-avatar"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={async (e) => {
                const file = e.target.files?.[0];
                if (file) {
                  setStore({ ...store, avatar: file as any });
                  const reader = new FileReader();
                  reader.onloadend = function () {
                    const avatar = document.getElementById("avatar-preview");
                    const symbol = document.getElementById("symbol-upload");
                    if (avatar) {
                      avatar.setAttribute("src", reader.result as string);
                      avatar.hidden = false;
                    }
                    if (symbol) {
                      symbol.hidden = true;
                    }
                  };
                  reader.readAsDataURL(file);
                }
              }}
            />

            <div className="grid grid-cols-2 w-full gap-x-2 mx-2">
              {CREATESTORE.map((item, index) => (
                <Input label={item.label} required={true} key={index}>
                  <input
                    id={`formCreate-${item.name}`}
                    type="text"
                    className="w-full outline-none border-solid border-2 border-gray-300 rounded-md p-2"
                    placeholder={item.placeholder}
                    name={item.name}
                    value={store[item.name as keyof typeof store]}
                    onChange={(e) =>
                      setStore({ ...store, [item.name]: e.target.value })
                    }
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
                      document.getElementById(
                        `errMes-${item.name}`
                      )!.innerHTML = result;
                    }}
                  />
                  <span
                    id={`errMes-${item.name}`}
                    className="text-red-500 text-sm"
                  ></span>
                </Input>
              ))}
            </div>
          </div>
          <div className="mt-4">
            <div className="font-bold text-lg">Mô tả cửa hàng của bạn</div>
            {typeof window === "object" && (
              <ReactQuill
                theme="snow"
                value={store.description}
                onChange={handleDescriptionChange}
              />
            )}
          </div>
          <div className="mt-4">
            <div className="flex">
              <input
                type="checkbox"
                name=""
                id=""
                className="w-5 h-5 mr-2"
                onChange={(e) => setAcceptPolicy(!acceptPolicy)}
              />
              <div>Tôi đồng ý với chính sách bên dưới</div>
            </div>
            <div
              className={`outline outline-offset-2 outline-2 ${
                acceptPolicy ? "outline-green-600" : "outline-gray-600"
              } rounded-sm p-2 mt-2`}
            >
              Để thúc đẩy sự phát triển của cộng đồng kinh doanh trực tuyến trên
              nền tảng thương mại điện tử DTExchange, chúng tôi đã xây dựng một
              chính sách Tạo Cửa Hàng linh hoạt và thân thiện với người bán.
              Chúng tôi cam kết mang đến cho doanh nghiệp và cá nhân một trải
              nghiệm buôn bán trực tuyến thuận lợi và an toàn.
              <br />
              <br />
              <span className="font-bold">1. Dễ dàng và Nhanh Chóng:</span>
              <br />
              Chúng tôi đặt trọng tâm vào quy trình đăng ký cửa hàng để đảm bảo
              tính dễ dàng và nhanh chóng. Người bán chỉ cần điền một số thông
              tin cơ bản và một loạt các bước đơn giản để bắt đầu kinh doanh
              trực tuyến trên DTExchange.
              <br />
              <br />
              <span className="font-bold">2. Chăm Sóc Khách Hàng:</span>
              <br />
              Để tạo môi trường mua bán an toàn và tin cậy, chúng tôi cung cấp
              hỗ trợ khách hàng đầy đủ. Chính sách này bao gồm cơ hội gửi câu
              hỏi, yêu cầu hỗ trợ kỹ thuật, và các kênh liên lạc chính thức để
              giúp người bán giải quyết mọi vấn đề một cách hiệu quả.
              <br />
              <br />
              <span className="font-bold">3. An Toàn Giao Dịch: </span>
              <br />
              Chúng tôi áp dụng các biện pháp bảo mật mạnh mẽ để đảm bảo an toàn
              cho cả người mua và người bán trong quá trình giao dịch. Hệ thống
              thanh toán được mã hóa để ngăn chặn rủi ro gian lận và bảo vệ
              thông tin cá nhân của người dùng.
              <br />
              <br />
              <span className="font-bold">
                4. Quảng Bá và Tiếp Cận Khách Hàng:
              </span>
              <br />
              Chúng tôi hỗ trợ người bán tối đa hóa tiềm năng kinh doanh của họ
              thông qua các chiến lược quảng bá mục tiêu. Các chương trình quảng
              cáo, ưu đãi và khuyến mãi sẽ giúp cửa hàng của bạn thu hút đối
              tượng khách hàng mong muốn.
              <br />
              <br />
              <span className="font-bold">4. Chính Sách Hợp Tác Dài Hạn:</span>
              <br />
              Để xây dựng mối quan hệ đối tác bền vững, chúng tôi thúc đẩy chính
              sách hợp tác dài hạn với những người bán tích cực và chất lượng.
              Những đối tác này có thể được đánh giá cao và nhận được ưu đãi đặc
              biệt từ DTExchange.
              <br />
              <br />
              Chính sách Tạo Cửa Hàng trên DTExchange không chỉ là một bước quan
              trọng để đảm bảo sự đa dạng và chất lượng của thị trường, mà còn
              là cam kết của chúng tôi đối với sự thành công và phát triển của
              cộng đồng kinh doanh trực tuyến.
            </div>
          </div>
          <div className="flex justify-center mt-5">
            <button
              className="bg-blue-500 text-white rounded-md px-4 py-2"
              onClick={(e) => CreateStore()}
            >
              Tạo cửa hàng
            </button>
          </div>
        </div>
      </div>
    )
  );
}

export default CreateStore;
