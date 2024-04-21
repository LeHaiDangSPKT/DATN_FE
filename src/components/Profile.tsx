"use client";
import { APIUploadImage } from "@/services/UploadImage";
import { APIGetUserById, APIUpdateUser } from "@/services/User";
import ConvertDate from "@/utils/ConvertDate";
import FormatMoney from "@/utils/FormatMoney";
import Toast from "@/utils/Toast";
import React from "react";
import {
  FaAddressCard,
  FaPhone,
  FaRegCircleUser,
  FaTransgender,
} from "react-icons/fa6";
interface ProfileProps {
  idProps?: string;
  setIsShow?: (data: boolean) => any;
}

function Profile(props: ProfileProps) {
  const { idProps, setIsShow } = props;
  const [userInfo, setUserInfo] = React.useState({
    id: idProps || "",
    avatar: "",
    fullName: "",
    gender: "",
    email: "",
    phone: "",
    joinFrom: "",
  });
  const [ortherInfo, setOrtherInfo] = React.useState({
    totalBills: 0,
    totalPricePaid: 0,
    totalReceived: 0,
    followStores: 0,
    friends: 0,
    wallet: 0,
    warningCount: 0,
  });
  React.useEffect(() => {
    const user = localStorage.getItem("user")
      ? JSON.parse(localStorage.getItem("user") ?? "").providerData[0]
      : null;
    const fetchData = async () => {
      const data = await APIGetUserById(idProps || user._id);
      setOrtherInfo({
        totalBills: data.metadata.data.totalBills,
        totalPricePaid: data.metadata.data.totalPricePaid,
        totalReceived: data.metadata.data.totalReceived,
        followStores: data.metadata.data.followStores.length,
        friends: data.metadata.data.friends.length,
        wallet: data.metadata.data.wallet,
        warningCount: data.metadata.data.warningCount,
      });
      setUserInfo({
        id: data.metadata.data._id || "",
        avatar: data.metadata.data.avatar,
        fullName: data.metadata.data.fullName,
        gender: data.metadata.data.gender || "Khác",
        email: data.metadata.data.email,
        phone: data.metadata.data.phone,
        joinFrom: ConvertDate(data.metadata.data.createdAt),
      });
      const avatar = document.getElementById("avatar-preview");
      if (avatar) {
        avatar.setAttribute("src", data.metadata.data.avatar);
        avatar.hidden = false;
      }
    };
    fetchData();
  }, [idProps]);

  const UpdateInfo = async () => {
    document.getElementById("loading-page")?.classList.remove("hidden");
    var avatarUrl = "";
    if (typeof userInfo.avatar != "string") {
      let formData = new FormData();
      formData.append("file", userInfo.avatar);
      const res = await APIUploadImage(formData);
      if (res?.status == 200 || res.status == 201) {
        avatarUrl = res.data.url;
      }
    }
    await APIUpdateUser(userInfo.id, {
      avatar: avatarUrl || userInfo.avatar,
      fullName: userInfo.fullName,
      gender: userInfo.gender,
      email: userInfo.email,
      phone: userInfo.phone,
    }).then((res) => {
      if (res?.status == 200 || res.status == 201) {
        document.getElementById("loading-page")?.classList.add("hidden");
        Toast("success", "Cập nhật thành công", 2000);
        // Set lại localstorage
        const user = JSON.parse(localStorage.getItem("user") ?? "");
        user.providerData[0].fullName = userInfo.fullName;
        user.providerData[0].avatar = avatarUrl || userInfo.avatar;
        user.providerData[0].gender = userInfo.gender;
        user.providerData[0].email = userInfo.email;
        user.providerData[0].phone = userInfo.phone;
        localStorage.setItem("user", JSON.stringify(user));
      } else {
        Toast("error", "Cập nhật thất bại", 2000);
      }
    });
  };
  return (
    <div className={`min-h-screen ${!idProps ? "px-[150px]" : ""} my-4`}>
      <div className="flex flex-col bg-white rounded-md py-2 px-4 mb-5">
        {idProps && (
          <div className="flex justify-end">
            <button
              type="button"
              className="flex-shrink-0 flex justify-center items-center h-8 w-8 rounded-lg text-white bg-gray-400 hover:bg-gray-300 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 focus:ring-offset-gray-900 transition-all text-sm dark:focus:ring-gray-700 dark:focus:ring-offset-gray-800"
              onClick={() => setIsShow!(false)}
            >
              <span className="sr-only">Close</span>
              <svg
                className="flex-shrink-0 w-4 h-4 text-center"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M18 6 6 18" />
                <path d="m6 6 12 12" />
              </svg>
            </button>
          </div>
        )}
        <div className="mx-auto mt-5">
          <div
            className="w-[200px] h-[200px] border border-[#d9d9d9] rounded-full flex justify-center items-center cursor-pointer"
            onClick={(e) => {
              if (idProps) return;
              const input = document.getElementById("upload-avatar");
              if (input) {
                input.click();
              }
            }}
          >
            <img
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
                setUserInfo({ ...userInfo, avatar: file as any });
                const reader = new FileReader();
                reader.onloadend = function () {
                  const avatar = document.getElementById("avatar-preview");
                  if (avatar) {
                    avatar.setAttribute("src", reader.result as string);
                    avatar.hidden = false;
                  }
                };
                reader.readAsDataURL(file);
              }
            }}
          />
        </div>
        <div className="font-bold text-3xl text-center mt-4">
          {userInfo.fullName.toUpperCase()}
        </div>
        <div className="text-sm text-gray-500 text-center mt-2">
          (Tham gia từ: {userInfo.joinFrom})
        </div>
        <div className="text-sm text-gray-500 text-center mt-2">
          (Tổng xu hiện có:{" "}
          <span className="font-bold">{ortherInfo.wallet}</span> xu)
        </div>
        <div className="text-2xl font-bold text-blue-600 mt-10">
          Thông tin cá nhân
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          <div className="flex items-center p-4 bg-white shadow-md rounded-md">
            <div className="text-2xl mr-3">
              <FaRegCircleUser />
            </div>

            <div className="flex flex-col text-lg">
              <p className=" font-semibold">Họ và tên</p>
              <input
                disabled={idProps ? true : false}
                type="text"
                value={userInfo.fullName}
                className="w-full border border-[#d9d9d9] rounded-md px-2 py-1"
                onChange={(e) => {
                  setUserInfo({ ...userInfo, fullName: e.target.value });
                }}
              />
            </div>
          </div>
          <div className="flex items-center p-4 bg-white shadow-md rounded-md">
            <div className="text-2xl mr-3">
              <FaTransgender />
            </div>
            <div className="flex flex-col text-lg">
              <p className=" font-semibold">Giới tính</p>
              <select
                disabled={idProps ? true : false}
                className="w-full border border-[#d9d9d9] rounded-md px-2 py-1"
                value={userInfo.gender}
                onChange={(e) => {
                  setUserInfo({ ...userInfo, gender: e.target.value });
                }}
              >
                <option value="Nam">Nam</option>
                <option value="Nữ">Nữ</option>
                <option value="Khác">Khác</option>
              </select>
            </div>
          </div>
          <div className="flex items-center p-4 bg-white shadow-md rounded-md">
            <div className="text-2xl mr-3">
              <FaAddressCard />
            </div>

            <div className="flex flex-col text-lg">
              <p className=" font-semibold">Email</p>
              <input
                disabled={true}
                type="text"
                value={userInfo.email}
                className="w-full border border-[#d9d9d9] rounded-md px-2 py-1"
                onChange={(e) => {
                  setUserInfo({ ...userInfo, email: e.target.value });
                }}
              />
            </div>
          </div>
          <div className="flex items-center p-4 bg-white shadow-md rounded-md">
            <div className="text-2xl mr-3">
              <FaPhone />
            </div>
            <div className="flex flex-col text-lg">
              <p className=" font-semibold">Số điện thoại</p>
              <input
                disabled={idProps ? true : false}
                type="text"
                value={userInfo.phone}
                className="w-full border border-[#d9d9d9] rounded-md px-2 py-1"
                onChange={(e) => {
                  setUserInfo({ ...userInfo, phone: e.target.value });
                }}
              />
            </div>
          </div>
        </div>
        {!idProps && (
          <div className="flex justify-center my-5">
            <button
              className="bg-blue-600 text-white rounded-md px-4 py-2 hover:bg-blue-500"
              onClick={(e) => UpdateInfo()}
            >
              Cập nhật thông tin
            </button>
          </div>
        )}
        <div className="text-2xl font-bold text-blue-600 mt-10">
          Thông tin khác
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 pb-5">
          <div className="flex flex-col items-center justify-center p-4 bg-white shadow-md rounded-md cursor-pointer hover:shadow-xl hover:scale-105 transition-all ease-in">
            <p className=" font-semibold">Số lượng của hàng đang theo dõi</p>
            <p className="">{ortherInfo.followStores}</p>
          </div>

          <div className="flex flex-col items-center justify-center p-4 bg-white shadow-md rounded-md cursor-pointer hover:shadow-xl hover:scale-105 transition-all ease-in">
            <p className=" font-semibold">Số lượng bạn bè</p>
            <p className="">{ortherInfo.friends}</p>
          </div>
          <div className="flex flex-col items-center justify-center p-4 bg-white shadow-md rounded-md cursor-pointer hover:shadow-xl hover:scale-105 transition-all ease-in">
            <p className=" font-semibold">Số lượng đơn hàng đã mua</p>
            <p className="">{ortherInfo.totalBills}</p>
          </div>
          <div className="flex flex-col items-center justify-center p-4 bg-white shadow-md rounded-md cursor-pointer hover:shadow-xl hover:scale-105 transition-all ease-in">
            <p className=" font-semibold">Số số tiền đã mua</p>
            <p className="">{FormatMoney(ortherInfo.totalPricePaid)}</p>
          </div>
          <div className="flex flex-col items-center justify-center p-4 bg-white shadow-md rounded-md cursor-pointer hover:shadow-xl hover:scale-105 transition-all ease-in">
            <p className=" font-semibold">Số lượng quà đã nhận</p>
            <p className="">{ortherInfo.totalReceived}</p>
          </div>

          <div className="flex flex-col items-center justify-center p-4 bg-white shadow-md rounded-md cursor-pointer hover:shadow-xl hover:scale-105 transition-all ease-in">
            <p className=" font-semibold text-red-500">Số lần bị cảnh báo</p>
            <p className="">{ortherInfo.warningCount}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
