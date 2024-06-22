import React from "react";
import { ConversationDetailInterface } from "@/types/Conversation";
import Message from "./Message";
import { UserInterface } from "@/types/User";
import Image from "next/image";
import typing from "../../../public/typing.gif";
import { IoClose } from "react-icons/io5";
import { InView } from "react-intersection-observer";
import { Spinner } from "@material-tailwind/react";

interface ChatProps {
  data: ConversationDetailInterface;
  dataCheck: ConversationDetailInterface;
  userCurrent: UserInterface;
  SendMessage: (text: string) => void;
  storeAvatar: string;
  roleChat: {
    receiverRole: string;
    senderRole: string;
  };
  socketChat: any;
  setOpenChat: (data: boolean) => void;
  fetchData: () => void;
  haveNewMessage: boolean;
}

function Chat(props: ChatProps) {
  const {
    data,
    dataCheck,
    userCurrent,
    SendMessage,
    storeAvatar,
    roleChat,
    socketChat,
    setOpenChat,
    fetchData,
    haveNewMessage,
  } = props;
  const [messages, setMessages] = React.useState("");
  const [isTyping, setIsTyping] = React.useState({
    isTyping: false,
    name: "",
  });
  const chatContainerRef = React.useRef<HTMLDivElement>(null);
  const previousHeightRef = React.useRef<number>(0);
  React.useEffect(() => {
    if (haveNewMessage) {
      if (chatContainerRef.current) {
        chatContainerRef.current.scrollTop =
          chatContainerRef.current.scrollHeight;
      }
    } else {
      if (previousHeightRef.current && chatContainerRef.current) {
        chatContainerRef.current.scrollTop =
          chatContainerRef.current.scrollHeight - previousHeightRef.current;
      }
    }
  }, [data]);
  React.useEffect(() => {
    const handleIsTyping = (res: any) => {
      setIsTyping({ isTyping: res.isTyping, name: res.name });
      setTimeout(() => {
        setIsTyping({ isTyping: !res.isTyping, name: res.name });
      }, 600000); //10 phút
    };
    socketChat.on("isTyping", handleIsTyping);
    return () => {
      socketChat.off("isTyping", handleIsTyping);
    };
  }, []);
  return (
    <div className="fixed bottom-[-30px] right-0 w-1/3 cursor-default">
      <div className="flex flex-col flex-auto p-6">
        <div className="rounded-2xl bg-gray-100 p-4">
          <div className="flex justify-between items-center">
            <div>
              <span className="text-lg font-bold">{data.receiverName}</span>
            </div>
            <div
              className="cursor-pointer"
              id="close-chat"
              onClick={(e) => setOpenChat(false)}
            >
              <IoClose className="w-6 h-6" />
            </div>
          </div>
          <div className="flex flex-col overflow-x-auto mb-4">
            <div className="overflow-y-scroll h-[25rem]" ref={chatContainerRef}>
              {data.data?.length >= 10 && dataCheck?.data.length > 0 && (
                <InView
                  as="div"
                  className="flex justify-center items-center p-4 col-span-1 sm:col-span-2 md:col-span-3"
                  onChange={(inView) => {
                    if (inView) {
                      previousHeightRef.current =
                        chatContainerRef.current?.scrollHeight || 0;
                      fetchData();
                    }
                  }}
                >
                  <Spinner />
                </InView>
              )}
              <div className="grid grid-cols-12 gap-y-2">
                {data.data?.map((item, index) => (
                  <Message
                    key={index}
                    time={item.createdAt}
                    avatar={
                      item.isMine
                        ? roleChat.senderRole == "SELLER"
                          ? storeAvatar
                          : userCurrent.avatar
                        : data.receiverAvatar
                    }
                    text={item.text}
                    isMine={item.isMine}
                  />
                ))}
              </div>
            </div>
          </div>
          {isTyping.isTyping && (
            <div className="flex items-center">
              <span className="text-gray-500 text-sm italic">
                {isTyping.name} đang soạn tin nhắn
              </span>
              <Image src={typing} alt="" width={40} height={40} />
            </div>
          )}

          <div className="flex items-center h-16 rounded-xl bg-white w-full">
            <input
              type="text"
              value={messages}
              placeholder="Nhập tin nhắn..."
              className="flex w-full border rounded-xl focus:outline-none border-indigo-300 pl-4 ml-2 h-10"
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  SendMessage(messages);
                  setMessages("");
                  socketChat.emit("isTyping", {
                    senderRole: roleChat.senderRole,
                    receiverId: data.receiverId,
                    isTyping: false,
                  });
                }
              }}
              onFocus={() => {
                socketChat.emit("focusChat", {
                  senderRole: roleChat.senderRole,
                  receiverId: data.receiverId,
                  receiverRole: roleChat.receiverRole,
                });

                socketChat.emit("isTyping", {
                  senderRole: roleChat.senderRole,
                  receiverId: data.receiverId,
                  isTyping: true,
                });
              }}
              onBlur={() => {
                socketChat.emit("isTyping", {
                  senderRole: roleChat.senderRole,
                  receiverId: data.receiverId,
                  isTyping: false,
                });
              }}
              onChange={(e) => {
                setMessages(e.currentTarget.value);
              }}
            />
            <div className="ml-4 mr-2">
              <button
                className="flex items-center justify-center bg-indigo-500 hover:bg-indigo-600 rounded-xl text-white px-4 py-1 flex-shrink-0"
                onClick={(e) => {
                  SendMessage(messages);
                  setMessages("");
                  socketChat.emit("isTyping", {
                    senderRole: roleChat.senderRole,
                    isTyping: false,
                  });
                }}
              >
                <span>Gửi</span>
                <span className="ml-2">
                  <svg
                    className="w-4 h-4 transform rotate-45 -mt-px"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                    ></path>
                  </svg>
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
    // </div>
  );
}

export default Chat;
