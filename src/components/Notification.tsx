"use client";
import { APIUpdateNotification } from "@/services/Notification";
import { NotificationInterface } from "@/types/Notification";
import { IoNotificationsSharp } from "react-icons/io5";
import DifferenceTime from "@/utils/DifferenceTime";
import Link from "next/link";
import React from "react";
import {
  FaAngry,
  FaCommentMedical,
  FaGrinSquint,
  FaHeart,
  FaSadTear,
  FaSurprise,
  FaThumbsUp,
  FaUserPlus,
} from "react-icons/fa";

interface NotificationProps {
  data: NotificationInterface;
  setCountNewNoti?: () => void;
}

function Notification(props: NotificationProps) {
  const { _id, sub, content, type, updatedAt, userIdFrom, status } = props.data;
  const { setCountNewNoti } = props;

  const [isRead, setIsRead] = React.useState(status);

  const [isClickAddFriend, setIsClickAddFriend] = React.useState(false);
  const [typeClick, setTypeClick] = React.useState("");
  const [contentData, setContentData] = React.useState(content);
  const [fullNameData, setFullNameData] = React.useState(sub.fullName);
  const [isChangeContent, setIsChangeContent] = React.useState(false);

  const textAccept: string = `Đã chấp nhận lời mời kết bạn`;
  const textDecline: string = `Đã từ chối lời mời kết bạn`;

  const iconType: any = {
    Haha: <FaGrinSquint className="w-[14px] h-[14px] fill-[#e2b53c]" />,
    Love: <FaHeart className="w-[14px] h-[14px] fill-[#EF4D74]" />,
    Wow: <FaSurprise className="w-[14px] h-[14px] fill-[#e2b53c]" />,
    Sad: <FaSadTear className="w-[14px] h-[14px] fill-[#e2b53c]" />,
    Angry: <FaAngry className="w-[14px] h-[14px] fill-[#e2b53c]" />,
    Like: <FaThumbsUp className="w-[14px] h-[14px] fill-[#6499FF]" />,
    "Kết bạn": <FaUserPlus className="w-[14px] h-[14px] fill-[#6499FF]" />,
    "Thêm sản phẩm": (
      <FaCommentMedical className="w-[14px] h-[14px] fill-[#6499FF]" />
    ),
    Orther: (
      <IoNotificationsSharp className="w-[14px] h-[14px] fill-[#6499FF]" />
    ),
  };

  const handleClick = async (
    e: any,
    id: string,
    typeClickInput: string,
    fullName: string
  ): Promise<void> => {
    e.preventDefault();
    await APIUpdateNotification(id, {
      content:
        typeClickInput === "Chấp nhận"
          ? `${textAccept} của ${fullName}`
          : `${textDecline} của ${fullName}`,
      status: true,
      sub: {
        fullName: "",
        avatar: sub.avatar,
        productId: sub.productId,
      },
    });
    setTypeClick(typeClickInput);
    setIsClickAddFriend(true);
    setIsChangeContent(true);
  };

  // const navigation = (typeInput: string) => {
  //   return typeInput === "Kết bạn" ? `/user/user/${userIdFrom}` : `/product/${sub.productId}`
  // }

  const splitContent = (contentInput: string): any => {
    const arr = contentInput.split(" của ");
    setContentData(`${arr[0]} của`);
    setFullNameData(arr[1]);
    setIsChangeContent(true);
  };

  React.useEffect(() => {
    if (!sub.fullName) {
      splitContent(content);
    }
  }, [isClickAddFriend]);

  React.useEffect(() => {
    if (isClickAddFriend) {
      setContentData(
        typeClick === "Chấp nhận"
          ? `${textAccept} của ${sub.fullName}`
          : `${textDecline} của ${sub.fullName}`
      );
      setFullNameData("");
    }
  }, [isClickAddFriend]);
  const ClickToSeen = async () => {
    if (isRead == false) {
      await APIUpdateNotification(_id, {
        status: true,
      });
      setIsRead(true);
      if (setCountNewNoti) {
        setCountNewNoti();
      }
    }
  };

  return (
    <div className="">
      <div
        className={`${
          isRead == false && "bg-[#c1d2f6]"
        } flex items-center w-[300px] cursor-pointer hover:bg-[#c1d2f6] p-2 rounded-lg mt-2`}
        onClick={() => ClickToSeen()}
      >
        <div className="flex flex-col justify-center items-center">
          <img
            className="rounded-full w-[54px] h-[54px]"
            src={sub.avatar}
            alt="Loading..."
          />
          <div
            className={`flex justify-center items-center w-[20px] h-[20px] bg-white rounded-full mt-[-16px] ml-[40px]`}
          >
            {iconType[type] ? iconType[type] : iconType.Orther}
          </div>
        </div>

        <div className="flex flex-col justify-start item-start ml-2">
          <p
            className={`text-[12px] text-ellipsis line-clamp-2 max-w-[90%] overflow-hidden`}
          >
            {!isChangeContent && (
              <span className="text-[12px] font-bold mr-1">{fullNameData}</span>
            )}
            {contentData}
            {isChangeContent && (
              <span className="text-[12px] font-bold ml-1">{fullNameData}</span>
            )}
          </p>
          <p className="text-[10px]">
            <span className="text-[10px] mr-1">
              {DifferenceTime(updatedAt)}
            </span>
          </p>
          {type === "Kết bạn" && sub.fullName && !isClickAddFriend && (
            <>
              <p className="text-[10px]">
                <span className="text-[10px] mr-1">3</span>
                bạn chung
              </p>
              <div className="flex items-center">
                <button
                  className="w-[70px] h-[23px] bg-[#6499FF] text-[10px] font-bold text-white rounded-[5px] mr-2 hover:bg-[#75a0f0]"
                  onClick={(e) =>
                    handleClick(e, _id, "Chấp nhận", sub.fullName)
                  }
                >
                  Chấp nhận
                </button>
                <button
                  className="w-[70px] h-[23px] bg-[#8A919F] text-[10px] font-bold text-white rounded-[5px] hover:bg-[#9398a1]"
                  onClick={(e) => handleClick(e, _id, "Từ chối", sub.fullName)}
                >
                  Từ chối
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default Notification;
