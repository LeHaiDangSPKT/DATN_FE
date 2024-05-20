import React from "react";
import { ConversationDetailInterface } from "@/types/Conversation";
import Message from "./Message";
import { UserInterface } from "@/types/User";

interface ChatProps {
  data: ConversationDetailInterface;
  userCurrent: UserInterface;
  SendMessage: (text: string) => void;
}

function Chat(props: ChatProps) {
  const { data, userCurrent, SendMessage } = props;
  const [messages, setMessages] = React.useState("");
  React.useEffect(() => {
    const element = document.querySelector(".overflow-y-scroll");
    element?.scrollTo(0, element.scrollHeight);
  }, [data]);
  return (
    <div>
      <div className="flex flex-col overflow-x-auto mb-4">
        <div className="overflow-y-scroll h-[25rem]">
          <div className="grid grid-cols-12 gap-y-2">
            {data.data.map((item, index) => (
              <Message
                key={index}
                avatar={item.isMine ? userCurrent.avatar : data.receiverAvatar}
                text={item.text}
                isMine={item.isMine}
              />
            ))}
          </div>
        </div>
      </div>
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
