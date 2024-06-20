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
import React from "react";
import { BiSolidMessageRounded } from "react-icons/bi";
import { ConservationInterface } from "@/types/Conversation";
import ClockIcon from "../ClockIcon";
import DifferenceTime from "@/utils/DifferenceTime";
import { useInView } from "react-intersection-observer";
import { PiStorefrontFill } from "react-icons/pi";
interface Props {
  countUnread: number;
  data: ConservationInterface[];
  fetchData: () => void;
  dataCheck: ConservationInterface[];
  OpenConversation: (
    id: string,
    idConversation: string,
    senderRole: string,
    receiverRole: string
  ) => void;
  role: string;
}

function Popup(props: Props) {
  const { countUnread, data, fetchData, dataCheck, OpenConversation, role } =
    props;
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const handleMenuOpen = () => setIsMenuOpen(!isMenuOpen);
  const { ref, inView } = useInView();
  React.useEffect(() => {
    if (inView) {
      fetchData();
    }
  }, [inView]);
  console.log();
  return (
    <Menu open={isMenuOpen} handler={handleMenuOpen}>
      <Badge withBorder content={countUnread} invisible={!countUnread}>
        <MenuHandler>
          <IconButton variant="text">
            {role == "USER" ? (
              <BiSolidMessageRounded className="w-[24px] h-[24px] cursor-pointer hover:fill-[#59595b]" />
            ) : (
              <PiStorefrontFill className="w-[24px] h-[24px] cursor-pointer hover:fill-[#59595b]" />
            )}
          </IconButton>
        </MenuHandler>
        <MenuList className={`max-h-96 sm:mt-3 -mt-3`}>
          <div className="outline-none">
            {data.map((item: ConservationInterface, index: number) => (
              <MenuItem
                key={index}
                className={`flex items-center justify-between gap-4 py-2 pl-2 pr-8 w-96 ${
                  index != 0 && "my-2"
                } ${!item.isReadLastMessage && !item.isMine && "bg-[#D2E0FB]"}`}
                onClick={(e) =>
                  OpenConversation(
                    item.receiverId,
                    item.conversationId,
                    item.senderRole,
                    item.receiverRole
                  )
                }
              >
                <div className="flex items-center">
                  <Avatar
                    variant="circular"
                    alt="tania andrew"
                    src={item.receiverAvatar}
                  />
                  <div className="ml-2 flex flex-col gap-1">
                    <Typography
                      variant="small"
                      color="gray"
                      className="font-semibold"
                    >
                      {item.receiverName}
                    </Typography>
                    <p
                      className={`${
                        !item.isReadLastMessage &&
                        !item.isMine &&
                        "font-semibold"
                      } line-clamp-1`}
                    >
                      {item.isMine && "Bạn: "} {item.lastMessageText}
                    </p>

                    <Typography className="flex items-center gap-1 text-sm font-medium text-blue-gray-500">
                      <ClockIcon />
                      <span>{DifferenceTime(new Date(item.lastTime))}</span>
                    </Typography>
                  </div>
                </div>

                {!item.isReadLastMessage && !item.isMine && (
                  <Badge
                    placement="top-end"
                    color="blue"
                    className="justify-self-end"
                  >
                    <p></p>
                  </Badge>
                )}
              </MenuItem>
            ))}
            {data.length == 0 && (
              <MenuItem className="flex items-center gap-4 py-2 pl-2 pr-8">
                <div className="flex flex-col gap-1">
                  <Typography
                    variant="small"
                    color="gray"
                    className="font-semibold"
                  >
                    Bạn chưa có tin nhắn
                  </Typography>
                </div>
              </MenuItem>
            )}
            {data.length >= 10 && dataCheck.length > 0 && (
              <div
                className="flex justify-center items-center p-4 col-span-1 sm:col-span-2 md:col-span-3"
                ref={ref}
              >
                <Spinner />
              </div>
            )}
          </div>
        </MenuList>
      </Badge>
    </Menu>
  );
}

export default Popup;
