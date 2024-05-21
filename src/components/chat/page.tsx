import React from "react";
import { ConversationDetailInterface } from "@/types/Conversation";
import Message from "./Message";
import { UserInterface } from "@/types/User";
import Image from "next/image";
import typing from "../../../public/typing.gif";
interface ChatProps {
  data: ConversationDetailInterface;
  userCurrent: UserInterface;
  SendMessage: (text: string) => void;
  storeAvatar: string;
  roleChat: {
    receiverRole: string;
    senderRole: string;
  };
  socketChat: any;
}

function Chat(props: ChatProps) {
  const { data, userCurrent, SendMessage, storeAvatar, roleChat, socketChat } =
    props;
  const [messages, setMessages] = React.useState("");
  const [isTyping, setIsTyping] = React.useState({
    isTyping: false,
    name: "",
  });
  React.useEffect(() => {
    const element = document.querySelector(".overflow-y-scroll");
    element?.scrollTo(0, element.scrollHeight);
  }, [data]);
  React.useEffect(() => {
    const handleIsTyping = (res: any) => {
      setIsTyping({ isTyping: true, name: res.name });
      setTimeout(() => {
        setIsTyping({ isTyping: false, name: res.name });
      }, 2000);
    };
    socketChat.on("isTyping", handleIsTyping);
    return () => {
      socketChat.off("isTyping", handleIsTyping);
    };
  }, []);
  return (
    <div>
      <div className="flex flex-col overflow-x-auto mb-4">
        <div className="overflow-y-scroll h-[25rem]">
          <div className="grid grid-cols-12 gap-y-2">
            {data.data.map((item, index) => (
              <Message
                key={index}
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
            }
          }}
          onFocus={() =>
            socketChat.emit("focusChat", {
              senderRole: roleChat.senderRole,
              receiverId: data.receiverId,
              receiverRole: roleChat.receiverRole,
            })
          }
          onChange={(e) => {
            setMessages(e.currentTarget.value);
            socketChat.emit("isTyping", {
              senderRole: roleChat.senderRole,
              isTyping: true,
            });
          }}
        />
        <div className="ml-4 mr-2">
          <button
            className="flex items-center justify-center bg-indigo-500 hover:bg-indigo-600 rounded-xl text-white px-4 py-1 flex-shrink-0"
            onClick={(e) => {
              SendMessage(messages);
              setMessages("");
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
  );
}

export default Chat;
