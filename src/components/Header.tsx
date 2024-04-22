"use client";
import Link from "next/link";
import React from "react";
import { FaBell, FaCartPlus, FaSistrix, FaStore } from "react-icons/fa";
import FramePopup from "./FramePopup";
import { APIGetAllNotification } from "@/services/Notification";
import { UserInterface } from "@/types/User";
import Notification from "./Notification";
import { APIGetAllCart } from "@/services/Cart";
import { Cart, Order } from "@/types/Cart";
import { APIGetMyStore } from "@/services/Store";
import { setCartPopUp } from "@/redux/features/cart/cartpopup-slice";
import { useDispatch } from "react-redux";
import { AppDispatch, useAppSelector } from "@/redux/store";
import FormatMoney from "@/utils/FormatMoney";
import { UserAuth } from "@/app/authContext";
import io from "socket.io-client";
import { BiSolidMessageRounded } from "react-icons/bi";
import { redirect, usePathname } from "next/navigation";

import { MenuHeaderInfoUser } from "./Menu";
import Chat from "./chat/page";
import { IoClose } from "react-icons/io5";

function Header() {
  const [test, setTest] = React.useState(false);
  const arrPathName = [
    "/login",
    "/sign-up",
    "/forget-password",
    "/admin",
    "/manager",
    "/error",
  ];
  const pathname = usePathname();
  const [user, setUser] = React.useState<UserInterface>();
  const [role, setRole] = React.useState("");
  const [countNewNoti, setCountNewNoti] = React.useState(0);
  const [dataNoti, setDataNoti] = React.useState([]);

  const [isShowCart, setIsShowCart] = React.useState(true);
  const dispatch = useDispatch<AppDispatch>();
  const dataCarts = useAppSelector((state) => state.cartPopupReducer.items);
  const totalCart = useAppSelector((state) => state.cartPopupReducer.totalCart);
  const [search, setSearch] = React.useState("");
  const [socket, setSocket] = React.useState<any>();
  // React.useEffect(() => {
  //   const socket = io("https://dtex-be.onrender.com/conversation", {
  //     auth: {
  //       token:
  //         "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NWUyMTQ5ZDA2OTAzNzkwOGVhYTA0NzciLCJpYXQiOjE3MDkzOTIyMTUsImV4cCI6MTcwOTQ3ODYxNX0.lBNjxxTcWIohP2svcb8uNhbqyjQY23gOIwBSsh_7LE0",
  //     },
  //   });
  //   setSocket(socket);
  // }, []);

  // const Test = () => {
  //   console.log(socket);
  //   // socket.emit(
  //   //   "sendMessage",
  //   //   {
  //   //     text: "Hi Dang 2",
  //   //     receiverId: "65e2c72b24f295a6d1ae4fe3",
  //   //   },
  //   //   (data: any) => {
  //   //     console.log("ABCD", data);
  //   //   }
  //   // );
  //   socket.join("65e2da218231ac059e34b2d8");
  //   const aa = io.of("/conversation");
  //   aa.emit(
  //     "getPreviewConversations",
  //     {
  //       page: 1,
  //       limit: 10,
  //     },
  //     (data: any) => {
  //       console.log("ABCD", data);
  //     }
  //   );
  // };
  React.useEffect(() => {
    const user = localStorage.getItem("user")
      ? JSON.parse(localStorage.getItem("user") ?? "")
      : null;
    user && setUser(user?.providerData[0]);
    user && setRole(user?.role);
  }, []);
  React.useEffect(() => {
    // Nếu role là admin và đang ở trang khác có pathname khác /admin thì redirect về trang admin
    const user = localStorage.getItem("user")
      ? JSON.parse(localStorage.getItem("user") ?? "")
      : null;
    if (user) {
      if (role.includes("ADMIN") && !pathname.startsWith("/admin")) {
        redirect("/admin");
      } else if (
        role.includes("MANAGER") &&
        !pathname.startsWith("/manager/product")
      ) {
        redirect("/manager/product");
      } else {
        if (
          (role.includes("USER") || role.includes("SELLER")) &&
          (pathname.startsWith("/admin") || pathname.startsWith("/manager"))
        ) {
          redirect("/");
        } else {
          const fetchAllCart = async () => {
            const res = await APIGetAllCart();
            console.log(res);
            var total = 0;
            if (res?.status == 200 || res?.status == 201) {
              const carts: Cart = {
                isCheckAll: false,
                store: res.data.metadata.data.map((item: any) => {
                  return {
                    id: item.storeId,
                    name: item.storeName,
                    isChecked: false,
                    avatar: item.storeAvatar,
                    product: item.products.map((product: any) => {
                      total += 1;
                      return {
                        id: product.id,
                        name: product.name,
                        avatar: product.avatar[0],
                        type: product.newPrice == 0 ? "GIVE" : "SELL",
                        newPrice: product.newPrice,
                        oldPrice: product.oldPrice,
                        quantity: product.quantity,
                        quantityInStock: product.quantityInStock,
                        isChecked: false,
                      };
                    }),
                  };
                }),
              };
              dispatch(setCartPopUp(carts));
            }
          };
          if (user) {
            fetchAllCart();
          }
        }
      }
    } else {
    }
  }, []);

  React.useEffect(() => {
    const user = localStorage.getItem("user")
      ? JSON.parse(localStorage.getItem("user") ?? "").providerData[0]
      : null;
    const fetchAllNoti = async () => {
      const res = await APIGetAllNotification({
        page: 1,
        limit: 10,
      });
      if (res?.status == 200 || res?.status == 201) {
        setDataNoti(res?.metadata.data.notifications);
        setCountNewNoti(
          res.metadata.data.notifications.filter(
            (item: any) => item.status == false
          ).length
        );
      }
    };
    if (user && user.role != "Admin") {
      // fetchAllNoti();
    }
  }, []);
  React.useEffect(() => {
    if (pathname == "/cart") {
      setIsShowCart(false);
    } else {
      setIsShowCart(true);
    }
  }, []);

  const OpenStore = async () => {
    const store = await APIGetMyStore();
    if (store?.status == 200 || store?.status == 201) {
      window.location.href = "/shop/seller/" + store?.data.metadata.data._id;
    } else {
      window.location.href = "/shop/create";
    }
  };
  if (!arrPathName.some((path) => pathname.includes(path))) {
    return (
      <>
        {(role.includes("USER") || role.includes("SELLER") || !role) && (
          <header className="h-[60px]">
            <div className="flex justify-between items-center w-full h-[60px] bg-[#D2E0FB] px-[10%] fixed top-0 left-0 right-0 z-10">
              <img
                className="cursor-pointer w-[8%]"
                src="/logo.png"
                alt="Loading..."
                onClick={() => {
                  window.location.href = "/";
                }}
              />

              <div className="flex items-center rounded-3xl w-[400px] h-[40px] bg-[#E1E9F7] px-2">
                <div className="p-2">
                  <FaSistrix className="w-[24px] h-[24px] hover:cursor-pointer" />
                </div>
                <input
                  type="text"
                  placeholder="Tìm kiếm sản phẩm..."
                  value={search}
                  className="flex-1 h-full outline-none bg-transparent"
                  onChange={(e) => setSearch(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key == "Enter") {
                      window.location.href = "/product/search?search=" + search;
                    }
                  }}
                />
              </div>

              {user && (
                <>
                  <div className="flex items-center cursor-pointer">
                    <div
                      onClick={() => OpenStore()}
                      className="flex flex-col items-center"
                    >
                      <span className="text-[14px]">Kênh người bán</span>
                      <FaStore className="w-[24px] h-[24px] cursor-pointer hover:fill-[#59595b]" />
                    </div>
                    <div className="border-r border-gray-400 mx-10 h-6"></div>

                    <div className="group py-6 flex flex-col justify-center items-center mr-10">
                      <FaCartPlus className="w-[24px] h-[24px]  hover:fill-[#59595b] " />
                      {dataCarts?.store?.length! > 0 && isShowCart && (
                        <>
                          <div className="group-hover:block group-hover:shadow-inner hidden">
                            <FramePopup>
                              <div
                                className="text-center rounded-lg cursor-pointer hover:bg-[#c1d2f6] px-1  text-blue-500 font-bold py-2"
                                onClick={() => (window.location.href = "/cart")}
                              >
                                Xem tất cả
                              </div>
                              <>
                                {dataCarts?.store.map((store, index) => {
                                  return (
                                    <div
                                      key={index}
                                      className="flex flex-col items-start mb-2 border-b-2 border-[#90b0f4] max-w-full"
                                    >
                                      <div>
                                        <Link
                                          href={`/shop/${store.id}`}
                                          className="flex items-center hover:bg-[#c1d2f6] p-2 rounded-lg"
                                        >
                                          <span className="text-[14px] font-bold p-2">
                                            {store.name}
                                          </span>
                                        </Link>
                                      </div>
                                      {store.product.length > 0 &&
                                        store.product.map((product, index) => (
                                          <Link
                                            key={index}
                                            href={`/product/${product.id}`}
                                          >
                                            <div className="flex justify-between products-center w-[500px] cursor-pointer hover:bg-[#c1d2f6] p-2 rounded-lg">
                                              <img
                                                className="rounded-full w-[54px] h-[54px] mr-2"
                                                src={product.avatar}
                                                alt="Loading..."
                                              />
                                              <span className="text-[12px]">
                                                x{product.quantity}
                                              </span>
                                              <p className="text-[12px] mr-2 text-ellipsis line-clamp-1 overflow-hidden max-w-[50%]">
                                                {product.name}
                                              </p>
                                              <span className="text-[12px]">
                                                {FormatMoney(product.newPrice)}
                                              </span>
                                            </div>
                                          </Link>
                                        ))}
                                    </div>
                                  );
                                })}
                              </>
                            </FramePopup>
                          </div>

                          <div
                            className={`flex justify-center items-center w-[20px] h-[20px] ${"bg-[#6499FF]"} rounded-full absolute mt-[-24px] ml-[30px]`}
                          >
                            <span className="text-[12px] text-white">
                              {totalCart}
                            </span>
                          </div>
                        </>
                      )}
                    </div>

                    <div className="group py-6 flex flex-col justify-center items-center mr-10">
                      <FaBell className="w-[24px] h-[24px] cursor-pointer hover:fill-[#59595b]" />
                      {dataNoti.length > 0 && isShowCart && (
                        <>
                          <div className="group-hover:block group-hover:shadow-inner hidden">
                            <FramePopup>
                              {dataNoti.map((item, index) => (
                                <Notification
                                  key={index}
                                  data={item}
                                  setCountNewNoti={() =>
                                    setCountNewNoti((prev) => prev - 1)
                                  }
                                />
                              ))}
                            </FramePopup>
                          </div>
                          {countNewNoti > 0 && (
                            <div
                              className={`flex justify-center items-center w-[20px] h-[20px] ${"bg-[#6499FF]"} rounded-full absolute mt-[-24px] ml-[30px]`}
                            >
                              <span className="text-[12px] text-white">
                                {countNewNoti}
                              </span>
                            </div>
                          )}
                        </>
                      )}
                    </div>

                    <div
                      className="group py-6 flex flex-col justify-center items-center"
                      onClick={(e) => {
                        setTest(true);
                        // Test();
                      }}
                    >
                      <BiSolidMessageRounded className="w-[24px] h-[24px] cursor-pointer hover:fill-[#59595b]" />
                      {dataNoti.length > 0 && isShowCart && (
                        <>
                          <div className="group-hover:block group-hover:shadow-inner hidden">
                            <FramePopup>
                              {dataNoti.map((item, index) => (
                                <Notification
                                  key={index}
                                  data={item}
                                  setCountNewNoti={() =>
                                    setCountNewNoti((prev) => prev - 1)
                                  }
                                />
                              ))}
                            </FramePopup>
                          </div>
                          {countNewNoti > 0 && (
                            <div
                              className={`flex justify-center items-center w-[20px] h-[20px] ${"bg-[#6499FF]"} rounded-full absolute mt-[-24px] ml-[30px]`}
                            >
                              <span className="text-[12px] text-white">
                                {countNewNoti}
                              </span>
                            </div>
                          )}
                        </>
                      )}
                    </div>
                    {test && (
                      <div className="fixed bottom-[-30px] right-0 w-1/3">
                        <div className="flex flex-col flex-auto p-6">
                          <div className="rounded-2xl bg-gray-100 p-4">
                            <div className="flex justify-between items-center">
                              <div>
                                <span className="text-lg font-bold">
                                  Tên cửa hàng
                                </span>
                              </div>
                              <div onClick={(e) => setTest(false)}>
                                <IoClose className="w-6 h-6" />
                              </div>
                            </div>
                            <Chat />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </>
              )}

              {user ? (
                <div className="flex items-center group py-10">
                  <MenuHeaderInfoUser user={user} />
                </div>
              ) : (
                <div className="flex items-center">
                  <div onClick={(e) => (window.location.href = "/login")}>
                    <span className="text-[14px] font-medium cursor-pointer">
                      Đăng Nhập
                    </span>
                  </div>
                  <div className="border-r border-gray-400 mx-3 h-6"></div>
                  <div onClick={(e) => (window.location.href = "/sign-up")}>
                    <span className="text-[14px] font-medium cursor-pointer">
                      Đăng Ký
                    </span>
                  </div>
                </div>
              )}
            </div>
          </header>
        )}
      </>
    );
  }
}

export default Header;
