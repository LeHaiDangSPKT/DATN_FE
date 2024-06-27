"use client";
import React from "react";
import { FaSistrix, FaStore } from "react-icons/fa";
import { UserInterface } from "@/types/User";
import {
  ConservationInterface,
  ConversationDetailInterface,
} from "@/types/Conversation";
import { APIGetAllCart } from "@/services/Cart";
import { Cart } from "@/types/Cart";
import { APIGetMyStore } from "@/services/Store";
import { setCartPopUp } from "@/redux/features/cart/cartpopup-slice";
import { saveSocketChat } from "@/redux/features/chat/chat-slice";
import { useDispatch } from "react-redux";
import { AppDispatch, useAppSelector } from "@/redux/store";
import io from "socket.io-client";
import { usePathname, useRouter } from "next/navigation";
import { MenuHeaderInfoUser } from "./Menu";
import Chat from "./chat/page";
import {
  Avatar,
  Drawer,
  IconButton,
  Typography,
} from "@material-tailwind/react";
import { NotificationInterface } from "@/types/Notification";
import Notification from "./Notification";
import CartPopup from "./CartPopup";
import FormatMoney from "@/utils/FormatMoney";
import Popup from "./chat/Popup";
import { ROLE_CHAT } from "@/constants/Conversation";
import { setParamSearch } from "@/redux/features/search/search-slice";
import { useSession } from "next-auth/react";
import Image from "next/image";
function Header() {
  const arrPathName = [
    "/login",
    "/sign-up",
    "/forget-password",
    "/admin",
    "/manager",
    "/error",
    // "/shipper/fill-form",
  ];
  const [openChat, setOpenChat] = React.useState(false);
  const pathname = usePathname();
  const [user, setUser] = React.useState<UserInterface>();
  const [storeAvatar, setStoreAvater] = React.useState("");
  const [role, setRole] = React.useState("");
  const [countNewNoti, setCountNewNoti] = React.useState(0);
  const [dataNoti, setDataNoti] = React.useState<NotificationInterface[]>([]);
  const [dataNotiCheck, setDataNotiCheck] = React.useState<
    NotificationInterface[]
  >([]);
  const [dataChatCheckUser, setDataChatCheckUser] = React.useState<
    ConservationInterface[]
  >([]);
  const [dataChatCheckSeller, setDataChatCheckSeller] = React.useState<
    ConservationInterface[]
  >([]);
  const [listPreviewUser, setListPreviewUser] = React.useState<
    ConservationInterface[]
  >([]);
  const [listPreviewSeller, setListPreviewSeller] = React.useState<
    ConservationInterface[]
  >([]);
  const [pageNoti, setPageNoti] = React.useState(1);
  const [pageChat, setPageChat] = React.useState(1);
  const [pageConversation, setPageConversation] = React.useState(1);
  const dispatch = useDispatch<AppDispatch>();
  const dataCarts = useAppSelector((state) => state.cartPopupReducer.items);
  const totalCart = useAppSelector((state) => state.cartPopupReducer.totalCart);
  const [search, setSearch] = React.useState("");
  const [socket, setSocket] = React.useState<any>();
  const [socketChat, setSocketChat] = React.useState<any>();
  const [open, setOpen] = React.useState(false);
  const [countUnreadUser, setCountUnreadUser] = React.useState(0);
  const [countUnreadSeller, setCountUnreadSeller] = React.useState(0);
  const [roleChat, setRoleChat] = React.useState({
    receiverRole: "",
    senderRole: "",
  });
  const openDrawer = () => {
    setOpen(true);
    setTimeout(() => {
      const header = document.querySelector("header")
        ?.childNodes[1] as HTMLElement;
      header?.classList.remove("absolute");
      header?.classList.add("fixed");
    }, 100);
  };
  const closeDrawer = () => {
    setOpen(false);
  };
  const [dataDrawer, setDataDrawer] = React.useState({
    storeId: "",
    storeName: "",
    storeAvatar: "",
    data: [] as any,
  });

  const [chatDetail, setChatDetail] =
    React.useState<ConversationDetailInterface>({
      conversationId: "",
      data: [],
      receiverAvatar: "",
      receiverId: "",
      receiverName: "",
    });
  const [chatDetailCheck, setChatDetailCheck] =
    React.useState<ConversationDetailInterface>({
      conversationId: "",
      data: [],
      receiverAvatar: "",
      receiverId: "",
      receiverName: "",
    });
  const [haveNewMessage, setHaveNewMessage] = React.useState(true);

  const router = useRouter();
  const { data: session, status } = useSession();
  React.useEffect(() => {
    var user =
      localStorage.getItem("user") &&
      JSON.parse(localStorage.getItem("user") || "");
    if (
      !localStorage.getItem("user") &&
      status === "authenticated" &&
      session?.user?.name
    ) {
      const userData = session.user.name;
      localStorage.setItem("user", userData);
      user = JSON.parse(userData);
    }

    user && setUser(user?.providerData[0]);
    user && setRole(user?.role);
    if (user?.providerData[0]) {
      if (
        user?.role.includes(ROLE_CHAT.USER) ||
        user?.role.includes(ROLE_CHAT.SELLER)
      ) {
        if (user?.role.includes(ROLE_CHAT.SELLER)) {
          const fetchInforStore = async () => {
            const store = await APIGetMyStore();
            if (store?.status == 200 || store?.status == 201) {
              setStoreAvater(store.data.metadata.data.avatar);
            }
          };
          fetchInforStore();
        }
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
        const socket = io(`${process.env.NEXT_PUBLIC_SOCKET}/notification`, {
          auth: {
            authorization: "Bearer " + user?.accessToken,
          },
        });
        const socketChat = io(
          `${process.env.NEXT_PUBLIC_SOCKET}/conversation`,
          {
            auth: {
              authorization: "Bearer " + user?.accessToken,
            },
          }
        );
        if (socket && socketChat) {
          setSocket(socket);
          setSocketChat(socketChat);
          dispatch(saveSocketChat(socketChat));
          socket.emit("getNotifications", {
            page: 1,
            limit: 10,
          });
          const handleGetNotifications = (data: any) => {
            const dataNotiFetch = data.data as NotificationInterface[];
            console.log("getNotificationsON", dataNotiFetch);
            setDataNotiCheck(dataNotiFetch);
            setDataNoti((prev) => [...prev, ...dataNotiFetch]);
          };
          socket.on("getNotifications", handleGetNotifications);

          socket.emit("countNewNotifications");
          socket.on("countNewNotifications", (data) => {
            setCountNewNoti(data);
          });
          socket.off("countNewNotifications", (data) => {
            setCountNewNoti(data);
          });

          const handleSendNotification = (data: any) => {
            console.log("countNewNotifications ON");
            setCountNewNoti((prev) => prev + 1);
            setDataNoti((prev) => [data, ...prev]);

            setDataNoti((prev) => {
              return prev.filter((item, index) => {
                return (
                  prev.findIndex((item2) => {
                    return item.id == item2.id;
                  }) == index
                );
              });
            });
          };
          socket.on("sendNotification", handleSendNotification);

          const handleReadNotification = (data: any) => {
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
          };
          socket.on("readNotification", handleReadNotification);

          // Chat

          socketChat.emit("getPreviewConversations", {
            page: 1,
            limit: 10,
            senderRole: ROLE_CHAT.USER,
          });
          socketChat.emit("getPreviewConversations", {
            page: 1,
            limit: 10,
            senderRole: ROLE_CHAT.SELLER,
          });
          const handleGetPreviewConversations = (data: any) => {
            console.log("getPreviewConversations ON", data);
            if (data.role == ROLE_CHAT.USER) {
              setDataChatCheckUser(data.data);
              setListPreviewUser((prev) => [...prev, ...data.data]);
            } else {
              setDataChatCheckSeller(data.data);
              setListPreviewSeller((prev) => [...prev, ...data.data]);
            }
          };
          socketChat.on(
            "getPreviewConversations",
            handleGetPreviewConversations
          );

          socketChat.emit("countUnread", {
            senderRole: ROLE_CHAT.USER,
          });
          socketChat.emit("countUnread", {
            senderRole: ROLE_CHAT.SELLER,
          });
          const handleCountUnread = (data: any) => {
            console.log("countUnread ON", data);
            if (data.role == ROLE_CHAT.USER) {
              setCountUnreadUser(data.count);
            } else {
              setCountUnreadSeller(data.count);
            }
          };
          socketChat.on("countUnread", handleCountUnread);

          socketChat.on("getConversation", (data) => {
            setChatDetailCheck(data);
          });

          const handleGetPreviewConversationsOne = (data: any) => {
            console.log(
              "getPreviewConversationsOne ON",
              data,
              listPreviewUser.length
            );
            if (data.role == ROLE_CHAT.USER) {
              let check = true;
              setListPreviewUser((prev) => {
                return prev.map((item) => {
                  if (item.conversationId == data.data.conversationId) {
                    check = false;
                    return data.data;
                  } else {
                    return item;
                  }
                });
              });
              if (check) {
                setListPreviewUser((prev) => [data.data, ...prev]);
              }
              // Lọc ra những conversationId không trùng
              setListPreviewUser((prev) => {
                return prev.filter((item, index) => {
                  return (
                    prev.findIndex((item2) => {
                      return item.conversationId == item2.conversationId;
                    }) == index
                  );
                });
              });
            } else {
              let check = true;
              setListPreviewSeller((prev) => {
                return prev.map((item) => {
                  if (item.conversationId == data.data.conversationId) {
                    check = false;
                    return data.data;
                  } else {
                    return item;
                  }
                });
              });
              if (check) {
                setListPreviewSeller((prev) => [data.data, ...prev]);
              }
              setListPreviewSeller((prev) => {
                return prev.filter((item, index) => {
                  return (
                    prev.findIndex((item2) => {
                      return item.conversationId == item2.conversationId;
                    }) == index
                  );
                });
              });
            }
          };
          socketChat.on(
            "getPreviewConversationsOne",
            handleGetPreviewConversationsOne
          );
          const handleGetConversationOne = (data: any) => {
            console.log("getConversationOne ON chatDetail", chatDetail);
            console.log("getConversationOne ON", data);
            if (!data.isMine) {
              setChatDetail((prev) => {
                const newData = Array.isArray(prev.data) ? prev.data : [];
                return {
                  ...prev,
                  data: [...newData, data],
                };
              });
            }
          };
          socketChat.on("getConversationOne", handleGetConversationOne);
          return () => {
            socketChat.off("getNotifications", handleGetNotifications);
            socket.off("sendNotification", handleSendNotification);
            socket.off("readNotification", handleReadNotification);
            socketChat.off(
              "getPreviewConversations",
              handleGetPreviewConversations
            );
            socketChat.off("countUnread", handleCountUnread);
            socketChat.off(
              "getPreviewConversationsOne",
              handleGetPreviewConversationsOne
            );
            socketChat.off("getConversationOne", handleGetConversationOne);
          };
        }
      }
    }
  }, []);
  React.useEffect(() => {
    if (chatDetailCheck.data) {
      if (chatDetail.conversationId == chatDetailCheck.conversationId) {
        setChatDetail((prev) => {
          return {
            ...chatDetailCheck,
            data: [...chatDetailCheck.data, ...prev.data],
          };
        });
      } else {
        setChatDetail(chatDetailCheck);
      }
    }
  }, [chatDetailCheck]);

  const OpenStore = async () => {
    const store = await APIGetMyStore();
    document.getElementById("loading-page")?.classList.remove("hidden");
    if (store?.status == 200 || store?.status == 201) {
      router.push("/shop/seller/" + store?.data.metadata.data._id);
    } else {
      router.push("/shop/create");
    }
  };
  const ReadNoti = async (id: string, link: string, isRead: boolean) => {
    if (!isRead) {
      socket.emit("readNotification", {
        notificationIds: [id],
      });
    }
    link &&
      (document.getElementById("loading-page")?.classList.remove("hidden"),
      router.push(link));
  };
  const SendMessage = (text: string) => {
    if (text.trim()) {
      socketChat.emit("sendMessage", {
        text: text.trim(),
        receiverId: chatDetail.receiverId,
        senderRole: roleChat.senderRole,
        receiverRole: roleChat.receiverRole,
      });
      setChatDetail((prev) => {
        return {
          ...prev,
          data: [
            ...prev.data,
            {
              id: "",
              text: text.trim(),
              isRead: true,
              isMine: true,
              createdAt: new Date().toISOString(),
            },
          ],
        };
      });
      setHaveNewMessage(true);
    }
  };
  if (!arrPathName.some((path) => pathname.includes(path))) {
    return (
      <>
        {(role.includes(ROLE_CHAT.USER) ||
          role.includes(ROLE_CHAT.SELLER) ||
          !role) && (
          <>
            <header className="h-[70px]">
              <div className="flex z-10 justify-between items-center w-full h-[70px] bg-[#D2E0FB] px-[2%] sm:px-[10%] fixed top-0 left-0 right-0">
                <Image
                  className="cursor-pointer sm:w-[8%] w-[20%]"
                  src="/logo.png"
                  width={100}
                  height={100}
                  alt="Loading..."
                  onClick={() => {
                    document
                      .getElementById("loading-page")
                      ?.classList.remove("hidden");
                    router.push("/");
                  }}
                />

                <div className="flex items-center rounded-3xl w-[50%] sm:w-[40%] h-[40px] bg-[#E1E9F7] px-2 ">
                  <div
                    className="p-2"
                    onClick={() => {
                      dispatch(setParamSearch(search));
                      router.push("/product/search?search=" + search);
                    }}
                  >
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
                    className="flex-1 h-full outline-none bg-transparent sm:text-base text-xs"
                    onChange={(e) => setSearch(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key == "Enter") {
                        dispatch(setParamSearch(search));
                        router.push("/product/search?search=" + search);
                      }
                    }}
                  />
                </div>

                {user && (
                  <>
                    <div className="hidden items-center cursor-pointer sm:flex">
                      <div
                        onClick={() => OpenStore()}
                        className="flex-col items-center flex"
                      >
                        <span className="text-[14px]">Kênh người bán</span>
                        <FaStore className="w-[24px] h-[24px] cursor-pointer hover:fill-[#59595b]" />
                      </div>
                      <div className="border-r border-gray-400 mx-10 h-6 sm:block hidden"></div>

                      <div className="py-6 flex flex-col sm:flex justify-center items-center mr-5">
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
                      </div>
                      <div className="py-6 flex flex-col sm:flex justify-center items-center mr-5">
                        <Notification
                          readNoti={(id, link, isRead) =>
                            ReadNoti(id, link, isRead)
                          }
                          countNewNoti={countNewNoti}
                          dataNotiCheck={dataNotiCheck}
                          dataNoti={dataNoti}
                          fetchData={() => {
                            socket.emit("getNotifications", {
                              page: pageNoti + 1,
                              limit: 10,
                            });
                            setPageNoti(pageNoti + 1);
                          }}
                        />
                      </div>
                      <div className="py-6 flex flex-col sm:flex justify-center items-center mr-5">
                        <Popup
                          role={ROLE_CHAT.USER}
                          countUnread={countUnreadUser}
                          data={listPreviewUser}
                          dataCheck={dataChatCheckUser}
                          fetchData={() => {
                            socketChat.emit("getPreviewConversations", {
                              page: pageChat + 1,
                              limit: 10,
                              senderRole: ROLE_CHAT.USER,
                            });
                            setPageChat(pageChat + 1);
                          }}
                          OpenConversation={(
                            receiverId,
                            idConversation,
                            senderRole,
                            receiverRole
                          ) => {
                            setHaveNewMessage(true);
                            setPageConversation(1);
                            document
                              .getElementById("chat_store")
                              ?.querySelector<HTMLButtonElement>("#close-chat")
                              ?.click();
                            setOpenChat(true);
                            setRoleChat({
                              receiverRole: receiverRole,
                              senderRole: senderRole,
                            });
                            if (chatDetail.conversationId != idConversation) {
                              socketChat.emit("getConversation", {
                                page: 1,
                                limit: 10,
                                receiverId: receiverId,
                                senderRole: senderRole,
                                receiverRole: receiverRole,
                              });
                            }
                          }}
                        />
                      </div>
                      <div className="py-6 flex flex-col sm:flex justify-center items-center mr-5">
                        <Popup
                          role={ROLE_CHAT.SELLER}
                          countUnread={countUnreadSeller}
                          data={listPreviewSeller}
                          dataCheck={dataChatCheckSeller}
                          fetchData={() => {
                            socketChat.emit("getPreviewConversations", {
                              page: pageChat + 1,
                              limit: 10,
                              senderRole: ROLE_CHAT.SELLER,
                            });
                            setPageChat(pageChat + 1);
                          }}
                          OpenConversation={(
                            receiverId,
                            idConversation,
                            senderRole,
                            receiverRole
                          ) => {
                            setHaveNewMessage(true);
                            setPageConversation(1);
                            document
                              .getElementById("chat_store")
                              ?.querySelector<HTMLButtonElement>("#close-chat")
                              ?.click();
                            setOpenChat(true);
                            setRoleChat({
                              receiverRole: receiverRole,
                              senderRole: senderRole,
                            });
                            if (chatDetail.conversationId != idConversation) {
                              socketChat.emit("getConversation", {
                                page: 1,
                                limit: 10,
                                receiverId: receiverId,
                                senderRole: senderRole,
                                receiverRole: receiverRole,
                              });
                            }
                          }}
                        />
                      </div>
                      {openChat && (
                        <div id="chat_header">
                          <Chat
                            socketChat={socketChat}
                            roleChat={roleChat}
                            storeAvatar={storeAvatar}
                            data={chatDetail}
                            userCurrent={user}
                            SendMessage={(message) => SendMessage(message)}
                            setOpenChat={(data) => setOpenChat(data)}
                            fetchData={() => {
                              setHaveNewMessage(false);
                              socketChat.emit("getConversation", {
                                page: pageConversation + 1,
                                limit: 10,
                                receiverId: chatDetail.receiverId,
                                senderRole: roleChat.senderRole,
                                receiverRole: roleChat.receiverRole,
                              });
                              setPageConversation(pageConversation + 1);
                            }}
                            dataCheck={chatDetailCheck}
                            haveNewMessage={haveNewMessage}
                          />
                        </div>
                      )}
                    </div>
                  </>
                )}

                {user ? (
                  <div className="flex items-center group py-10">
                    <MenuHeaderInfoUser user={user} role={role} />
                  </div>
                ) : (
                  <div className="block sm:flex items-center text-center">
                    <div
                      className="sm:my-0 -my-2"
                      onClick={(e) => {
                        document
                          .getElementById("loading-page")
                          ?.classList.remove("hidden");

                        router.push("/shipper/fill-form");
                      }}
                    >
                      <span className="text-[10px] sm:text-[14px] font-medium cursor-pointer">
                        Trở thành shipper
                      </span>
                    </div>
                    <div className="border-r border-gray-400 mx-3 h-6 hidden sm:block"></div>
                    <div
                      className="sm:my-0 -my-2"
                      onClick={(e) => {
                        document
                          .getElementById("loading-page")
                          ?.classList.remove("hidden");

                        router.push("/login");
                      }}
                    >
                      <span className="text-[10px] sm:text-[14px] font-medium cursor-pointer">
                        Đăng Nhập
                      </span>
                    </div>
                    <div className="border-r border-gray-400 mx-3 h-6 hidden sm:block"></div>
                    <div
                      className="sm:my-0 -my-2"
                      onClick={(e) => {
                        document
                          .getElementById("loading-page")
                          ?.classList.remove("hidden");

                        router.push("/sign-up");
                      }}
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
                      width={40}
                      height={40}
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
                      width={40}
                      height={40}
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
            <div className="fixed bottom-0 bg-[#D2E0FB] w-full z-50 sm:hidden">
              {user && (
                <>
                  <div className="flex items-center justify-around cursor-pointer ">
                    <div className="pb-1 pt-4 flex flex-col justify-center items-center mr-5">
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
                    </div>
                    <div className="pb-1 pt-4 flex flex-col justify-center items-center mr-5">
                      <Notification
                        readNoti={(id, link, isRead) =>
                          ReadNoti(id, link, isRead)
                        }
                        countNewNoti={countNewNoti}
                        dataNotiCheck={dataNotiCheck}
                        dataNoti={dataNoti}
                        fetchData={() => {
                          socket.emit("getNotifications", {
                            page: pageNoti + 1,
                            limit: 10,
                          });
                          setPageNoti(pageNoti + 1);
                        }}
                      />
                    </div>
                    <div className="pb-1 pt-4 flex flex-col justify-center items-center mr-5">
                      <Popup
                        role={ROLE_CHAT.USER}
                        countUnread={countUnreadUser}
                        data={listPreviewUser}
                        dataCheck={dataChatCheckUser}
                        fetchData={() => {
                          socketChat.emit("getPreviewConversations", {
                            page: pageChat + 1,
                            limit: 10,
                            senderRole: ROLE_CHAT.USER,
                          });
                          setPageChat(pageChat + 1);
                        }}
                        OpenConversation={(
                          receiverId,
                          idConversation,
                          senderRole,
                          receiverRole
                        ) => {
                          setHaveNewMessage(true);
                          setPageConversation(1);
                          document
                            .getElementById("chat_store")
                            ?.querySelector<HTMLButtonElement>("#close-chat")
                            ?.click();
                          setOpenChat(true);
                          setRoleChat({
                            receiverRole: receiverRole,
                            senderRole: senderRole,
                          });
                          if (chatDetail.conversationId != idConversation) {
                            socketChat.emit("getConversation", {
                              page: 1,
                              limit: 10,
                              receiverId: receiverId,
                              senderRole: senderRole,
                              receiverRole: receiverRole,
                            });
                          }
                        }}
                      />
                    </div>
                    <div className="pb-1 pt-4 flex flex-col justify-center items-center mr-5">
                      <Popup
                        role={ROLE_CHAT.SELLER}
                        countUnread={countUnreadSeller}
                        data={listPreviewSeller}
                        dataCheck={dataChatCheckSeller}
                        fetchData={() => {
                          socketChat.emit("getPreviewConversations", {
                            page: pageChat + 1,
                            limit: 10,
                            senderRole: ROLE_CHAT.SELLER,
                          });
                          setPageChat(pageChat + 1);
                        }}
                        OpenConversation={(
                          receiverId,
                          idConversation,
                          senderRole,
                          receiverRole
                        ) => {
                          setHaveNewMessage(true);
                          setPageConversation(1);
                          document
                            .getElementById("chat_store")
                            ?.querySelector<HTMLButtonElement>("#close-chat")
                            ?.click();
                          setOpenChat(true);
                          setRoleChat({
                            receiverRole: receiverRole,
                            senderRole: senderRole,
                          });
                          if (chatDetail.conversationId != idConversation) {
                            socketChat.emit("getConversation", {
                              page: 1,
                              limit: 10,
                              receiverId: receiverId,
                              senderRole: senderRole,
                              receiverRole: receiverRole,
                            });
                          }
                        }}
                      />
                    </div>
                    {openChat && (
                      <div id="chat_header">
                        <Chat
                          socketChat={socketChat}
                          roleChat={roleChat}
                          storeAvatar={storeAvatar}
                          data={chatDetail}
                          userCurrent={user}
                          SendMessage={(message) => SendMessage(message)}
                          setOpenChat={(data) => setOpenChat(data)}
                          fetchData={() => {
                            setHaveNewMessage(false);
                            socketChat.emit("getConversation", {
                              page: pageConversation + 1,
                              limit: 10,
                              receiverId: chatDetail.receiverId,
                              senderRole: roleChat.senderRole,
                              receiverRole: roleChat.receiverRole,
                            });
                            setPageConversation(pageConversation + 1);
                          }}
                          dataCheck={chatDetailCheck}
                          haveNewMessage={haveNewMessage}
                        />
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          </>
        )}
      </>
    );
  }
}

export default Header;
