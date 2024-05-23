import DifferenceTime from "@/utils/DifferenceTime";
import { Avatar, Tooltip } from "@material-tailwind/react";
import React from "react";
interface Props {
  avatar: string;
  text: string;
  isMine: boolean;
  time: string;
}

function Message(props: Props) {
  const { avatar, text, isMine, time } = props;
  return (
    <div
      className={`p-3 rounded-lg ${
        isMine ? "col-start-4 col-end-13" : "col-start-1 col-end-10"
      }`}
    >
      <div
        className={`${
          isMine ? "flex justify-start flex-row-reverse" : "flex flex-row"
        }`}
      >
        <Avatar src={avatar} className="rounded-full" />
        <Tooltip
          placement={isMine ? "left" : "right"}
          content={DifferenceTime(new Date(time))}
        >
          <div
            className={`relative text-sm ${
              isMine ? "bg-indigo-100 mr-3" : "bg-white ml-3"
            } py-2 px-4 shadow rounded-xl`}
          >
            <div>{text}</div>
          </div>
        </Tooltip>
      </div>
    </div>
  );
}

export default Message;
