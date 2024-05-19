"use client";
import React from "react";
import { FaBell, FaSistrix, FaStore } from "react-icons/fa";
import { UserInterface } from "@/types/User";
import { ConservationInterface } from "@/types/Conversation";
import { APIGetAllCart } from "@/services/Cart";
import { Cart } from "@/types/Cart";
import { APIGetMyStore } from "@/services/Store";
import { setCartPopUp } from "@/redux/features/cart/cartpopup-slice";
import { useDispatch } from "react-redux";
import { AppDispatch, useAppSelector } from "@/redux/store";
import io from "socket.io-client";
import { usePathname, useRouter } from "next/navigation";
import { MenuHeaderInfoUser } from "./Menu";
import Chat from "./chat/page";
import { IoClose } from "react-icons/io5";
import {
  Avatar,
  Badge,
  Drawer,
  IconButton,
  Menu,
  MenuHandler,
  Typography,
} from "@material-tailwind/react";
import { NotificationInterface } from "@/types/Notification";
import Notification from "./Notification";
import CartPopup from "./CartPopup";
import FormatMoney from "@/utils/FormatMoney";
import Popup from "./chat/Popup";

function Header() {
  const [openChat, setOpenChat] = React.useState(false);
  const arrPathName = [
    "/login",
    "/sign-up",
    "/forget-password",
    "/admin",
    "/manager",
    "/error",
    // "/shipper/fill-form",
  ];
  const pathname = usePathname();
  const [user, setUser] = React.useState<UserInterface>();
  const [role, setRole] = React.useState("");
  const [countNewNoti, setCountNewNoti] = React.useState(0);
  const [dataNoti, setDataNoti] = React.useState<NotificationInterface[]>([]);
  const [dataNotiCheck, setDataNotiCheck] = React.useState<
    NotificationInterface[]
  >([]);
  const [dataChatCheck, setDataChatCheck] = React.useState<
    ConservationInterface[]
  >([]);
  const [pageNoti, setPageNoti] = React.useState(1);
  const [pageChat, setPageChat] = React.useState(1);
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const handleMenuOpen = () => setIsMenuOpen(!isMenuOpen);
  const [isShowCart, setIsShowCart] = React.useState(true);
  const dispatch = useDispatch<AppDispatch>();
  const dataCarts = useAppSelector((state) => state.cartPopupReducer.items);
  const totalCart = useAppSelector((state) => state.cartPopupReducer.totalCart);
  const [search, setSearch] = React.useState("");
  const [socket, setSocket] = React.useState<any>();
  const [socketChat, setSocketChat] = React.useState<any>();
  const [open, setOpen] = React.useState(false);
  const [countUnread, setCountUnread] = React.useState(0);
  const openDrawer = () => setOpen(true);
  const closeDrawer = () => setOpen(false);
  const [dataDrawer, setDataDrawer] = React.useState({
    storeId: "",
    storeName: "",
    storeAvatar: "",
    data: [] as any,
  });
  const [listPreview, setListPreview] = React.useState<ConservationInterface[]>(
    []
  );

  // const [li]

  const router = useRouter();
  React.useEffect(() => {
    const user = localStorage.getItem("user")
      ? JSON.parse(localStorage.getItem("user") ?? "")
      : null;
    user && setUser(user?.providerData[0]);
    user && setRole(user?.role);
    if (user?.providerData[0]) {
      if (user?.role.includes("USER") || user?.role.includes("SELLER")) {
        const fetchAllCart = async () => {
          const res = await APIGetAllCart();
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
        fetchAllCart();
        const socket = io("https://dtex-be.onrender.com/notification", {
          auth: {
            authorization: "Bearer " + user?.accessToken,
          },
        });
        const socketChat = io("https://dtex-be.onrender.com/conversation", {
          auth: {
            authorization: "Bearer " + user?.accessToken,
          },
        });
        setSocket(socket);
        setSocketChat(socketChat);
        socket.emit("getNotifications", {
          page: 1,
          limit: 10,
        });
        socket.on("getNotifications", (data) => {
          const dataNotiFetch = data.data as NotificationInterface[];
          setDataNotiCheck(dataNotiFetch);
          setDataNoti((prev) => [...prev, ...dataNotiFetch]);
        });

        socket.emit("countNewNotifications");
        socket.on("countNewNotifications", (data) => {
          setCountNewNoti(data);
        });

        socket.on("sendNotification", (data) => {
          setCountNewNoti((prev) => prev + 1);
          setDataNoti((prev) => [data, ...prev]);
        });

        socket.on("readNotification", (data) => {
          setDataNoti((prev) =>
            prev.map((item) => {
              if (item.id == data[0].id) {
                return { ...item, isRead: true };
              } else {
                return item;
              }
            })
          );
          setCountNewNoti((prev) => prev - 1);
        });

        socketChat.emit("getPreviewConversations", {
          page: 1,
          limit: 10,
        });
        socketChat.on("getPreviewConversations", (data) => {
          console.log(data);
          setDataChatCheck(data);
          setListPreview((prev) => [...prev, ...data]);
        });

        socketChat.emit("countUnread");
        socketChat.on("countUnread", (data) => {
          setCountUnread(data);
        });

        socketChat.on("getConversation", (data) => {
          console.log(data);
        });
      }
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
  const ReadNoti = async (id: string, link: string, isRead: boolean) => {
    if (!isRead) {
      socket.emit("readNotification", {
        notificationIds: [id],
      });
    }
    link && router.push(link);
    setIsMenuOpen(false);
  };
  if (!arrPathName.some((path) => pathname.includes(path))) {
    return (
      <>
        {(role.includes("USER") || role.includes("SELLER") || !role) && (
          <header className="h-[70px]">
            <div className="flex z-10 justify-between items-center w-full h-[70px] bg-[#D2E0FB] px-[2%] sm:px-[10%] fixed top-0 left-0 right-0">
              <img
                className="cursor-pointer w-[8%]"
                src="/logo.png"
                alt="Loading..."
                onClick={() => {
                  window.location.href = "/";
                }}
              />

              <div className="flex items-center rounded-3xl w-[200px] sm:w-[400px] h-[40px] bg-[#E1E9F7] px-2">
                <div className="p-2">
                  <FaSistrix
                    className="hover:cursor-pointer"
                    width={24}
                    height={24}
                  />
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

                    <div className="py-6 flex flex-col justify-center items-center mr-5">
                      {isShowCart && (
                        <CartPopup
                          dataCarts={dataCarts}
                          totalCart={totalCart}
                          clickMenuItem={(store) => {
                            setDataDrawer({
                              storeId: store.id,
                              storeName: store.name,
                              storeAvatar: store.avatar,
                              data: store.product,
                            });
                            openDrawer();
                          }}
                        />
                      )}
                    </div>
                    <div className="py-6 flex flex-col justify-center items-center mr-5">
                      {isShowCart && (
                        <Menu open={isMenuOpen} handler={handleMenuOpen}>
                          <Badge
                            withBorder
                            content={countNewNoti}
                            invisible={countNewNoti == 0}
                          >
                            <MenuHandler>
                              <IconButton variant="text">
                                <FaBell className="w-[24px] h-[24px] cursor-pointer hover:fill-[#59595b]" />
                              </IconButton>
                            </MenuHandler>
                          </Badge>
                          <Notification
                            readNoti={(id, link, isRead) =>
                              ReadNoti(id, link, isRead)
                            }
                            countNewNoti={countNewNoti}
                            dataNotiCheck={dataNotiCheck}
                            dataNoti={dataNoti}
                            fetchData={() => {
                              console.log("getNotifications");
                              socket.emit("getNotifications", {
                                page: pageNoti + 1,
                                limit: 10,
                              });
                              setPageNoti(pageNoti + 1);
                            }}
                          />
                        </Menu>
                      )}
                    </div>
                    <div className="py-6 flex flex-col justify-center items-center mr-5">
                      {isShowCart && (
                        <Popup
                          countUnread={countUnread}
                          data={listPreview}
                          dataCheck={dataChatCheck}
                          fetchData={() => {
                            socketChat.emit("getPreviewConversations", {
                              page: pageChat + 1,
                              limit: 10,
                            });
                            setPageChat(pageChat + 1);
                          }}
                          OpenCoversation={(id) => {
                            setOpenChat(true);
                            socketChat.emit("getConversation", {
                              page: 1,
                              limit: 10,
                              receiverId: id,
                            });
                          }}
                        />
                      )}
                    </div>

                    {openChat && (
                      <div className="fixed bottom-[-30px] right-0 w-1/3">
                        <div className="flex flex-col flex-auto p-6">
                          <div className="rounded-2xl bg-gray-100 p-4">
                            <div className="flex justify-between items-center">
                              <div>
                                <span className="text-lg font-bold">
                                  Tên cửa hàng
                                </span>
                              </div>
                              <div onClick={(e) => setOpenChat(false)}>
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
                <div className="block sm:flex items-center text-center">
                  <div
                    className="sm:my-0 -my-2"
                    onClick={(e) =>
                      (window.location.href = "/shipper/fill-form")
                    }
                  >
                    <span className="text-[10px] sm:text-[14px] font-medium cursor-pointer">
                      Trở thành shipper
                    </span>
                  </div>
                  <div className="border-r border-gray-400 mx-3 h-6 hidden sm:block"></div>
                  <div
                    className="sm:my-0 -my-2"
                    onClick={(e) => (window.location.href = "/login")}
                  >
                    <span className="text-[10px] sm:text-[14px] font-medium cursor-pointer">
                      Đăng Nhập
                    </span>
                  </div>
                  <div className="border-r border-gray-400 mx-3 h-6 hidden sm:block"></div>
                  <div
                    className="sm:my-0 -my-2"
                    onClick={(e) => (window.location.href = "/sign-up")}
                  >
                    <span className="text-[10px] sm:text-[14px] font-medium cursor-pointer">
                      Đăng Ký
                    </span>
                  </div>
                </div>
              )}
            </div>
            <Drawer open={open} onClose={closeDrawer} className="p-4">
              <div className="mb-6 flex items-center justify-between">
                <div
                  className="flex items-center gap-4 py-2 pl-2 pr-8 hover:bg-gray-100 cursor-pointer rounded-md"
                  onClick={() => {
                    document
                      .getElementById("loading-page")
                      ?.classList.remove("hidden");
                    closeDrawer();
                    router.push(`/shop/${dataDrawer.storeId}`);
                  }}
                >
                  <Avatar
                    variant="circular"
                    alt="tania andrew"
                    src={dataDrawer.storeAvatar}
                  />
                  <div className="flex flex-col gap-1">
                    <Typography
                      variant="small"
                      color="gray"
                      className="font-semibold"
                    >
                      {dataDrawer.storeName}
                    </Typography>
                  </div>
                </div>
                <IconButton
                  variant="text"
                  color="blue-gray"
                  onClick={closeDrawer}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                    className="h-5 w-5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </IconButton>
              </div>
              <Typography
                variant="small"
                color="gray"
                className="font-semibold"
              >
                Danh sách sản phẩm:
              </Typography>
              {dataDrawer.data.map((item: any, index: number) => (
                <div
                  key={index}
                  className="flex items-center gap-4 py-2 pl-2 pr-8 hover:bg-gray-100 cursor-pointer rounded-md"
                  onClick={() => {
                    document
                      .getElementById("loading-page")
                      ?.classList.remove("hidden");
                    closeDrawer();
                    router.push(`/product/${item.id}`);
                  }}
                >
                  <Avatar
                    variant="circular"
                    alt="tania andrew"
                    src={item.avatar}
                  />
                  <div className="flex flex-col gap-1">
                    <Typography
                      variant="small"
                      color="gray"
                      className="font-semibold"
                    >
                      {item.name}
                    </Typography>
                    <Typography
                      variant="small"
                      color="gray"
                      className="font-semibold"
                    >
                      Giá tiền: {FormatMoney(item.newPrice)}
                    </Typography>
                  </div>
                </div>
              ))}

              {/* Tổng tiền */}
              <div className="flex items-center justify-between mt-6 ">
                <Typography
                  variant="small"
                  color="gray"
                  className="font-semibold text-red-400"
                >
                  Tổng tiền:
                </Typography>
                <Typography
                  variant="small"
                  color="gray"
                  className="font-semibold text-red-400"
                >
                  {FormatMoney(
                    dataDrawer.data.reduce(
                      (total: number, item: any) => total + item.newPrice,
                      0
                    )
                  )}
                </Typography>
              </div>
            </Drawer>
          </header>
        )}
      </>
    );
  }
}

export default Header;
