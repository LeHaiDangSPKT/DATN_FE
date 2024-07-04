import { NotificationInterface } from "@/types/Notification";
import DifferenceTime from "@/utils/DifferenceTime";
import {
  Avatar,
  Badge,
  IconButton,
  Menu,
  MenuHandler,
  MenuItem,
  MenuList,
  Spinner,
  Typography,
} from "@material-tailwind/react";
import { InView } from "react-intersection-observer";
import React from "react";
import ClockIcon from "./ClockIcon";
import { FaBell } from "react-icons/fa";

interface NotificationProps {
  dataNoti: NotificationInterface[];
  dataNotiCheck: NotificationInterface[];
  fetchData: () => void;
  readNoti: (id: string, link: string, isRead: boolean) => void;
  countNewNoti: number;
}

// Use forwardRef to pass the ref to the parent component

function Notification(props: NotificationProps) {
  const { dataNoti, fetchData, dataNotiCheck, readNoti, countNewNoti } = props;
  return (
    <Menu>
      <Badge withBorder content={countNewNoti} invisible={countNewNoti == 0}>
        <MenuHandler>
          <IconButton variant="text">
            <FaBell className="w-[24px] h-[24px] cursor-pointer hover:fill-[#59595b]" />
          </IconButton>
        </MenuHandler>
      </Badge>
      <MenuList className="max-h-96 sm:mt-3 -mt-3 MenuList">
        {dataNoti.map((item: NotificationInterface, index: number) => (
          <MenuItem
            key={item.id}
            className={`flex items-center justify-between gap-4 py-2 pl-2 pr-8 ${
              index != 0 && "my-2"
            } ${!item.isRead && "bg-[#D2E0FB]"}`}
            onClick={() => readNoti(item.id, item.link, item.isRead)}
          >
            <div className="flex items-center">
              <Avatar
                variant="circular"
                alt="tania andrew"
                src={item.subjectAvatar}
              />
              <div className="ml-2 flex flex-col gap-1">
                <Typography
                  variant="small"
                  color="gray"
                  className="font-semibold"
                >
                  <p className="line-clamp-1 max-w-[360px]">
                    {item.type == "UPDATE_INFO" || item.type == "BILL"
                      ? item.content
                      : `${item.subjectName} ${item.content}`}
                  </p>
                </Typography>

                <Typography className="flex items-center gap-1 text-sm font-medium text-blue-gray-500">
                  <ClockIcon />
                  <span>{DifferenceTime(new Date(item.createdAt))}</span>
                </Typography>
              </div>
            </div>
            {!item.isRead && (
              <Badge placement="top-end" color="blue">
                <p></p>
              </Badge>
            )}
          </MenuItem>
        ))}
        {dataNoti.length === 0 && (
          <MenuItem className="flex items-center gap-4 py-2 pl-2 pr-8">
            <div className="flex flex-col gap-1">
              <Typography
                variant="small"
                color="gray"
                className="font-semibold"
              >
                Bạn chưa có thông báo
              </Typography>
            </div>
          </MenuItem>
        )}
        {dataNoti.length >= 10 && dataNotiCheck.length > 0 && (
          <InView
            as="div"
            className="flex justify-center items-center p-4 col-span-1 sm:col-span-2 md:col-span-3"
            onChange={(inView) => {
              if (inView) {
                fetchData();
              }
            }}
          >
            <Spinner />
          </InView>
        )}
      </MenuList>
    </Menu>
  );
}

export default Notification;
