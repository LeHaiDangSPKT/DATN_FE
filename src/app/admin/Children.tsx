"use client";
import React from "react";
import { CATEGORYADMIN } from "@/constants/CategoryAdmin";
import {
  HiChevronDown,
  HiChevronRight,
  HiCog6Tooth,
  HiPresentationChartBar,
  HiUserCircle,
} from "react-icons/hi2";
import { GrPowerShutdown } from "react-icons/gr";
import { IoIosSettings } from "react-icons/io";
import { GiShoppingBag } from "react-icons/gi";
import {
  Accordion,
  AccordionBody,
  AccordionHeader,
  Avatar,
  Card,
  Chip,
  List,
  ListItem,
  ListItemPrefix,
  ListItemSuffix,
  Typography,
} from "@material-tailwind/react";
import { FaInbox } from "react-icons/fa";

import { PowerIcon } from "@heroicons/react/24/solid";
import Home from "./dashboard/Home";

interface ChildrenProps {
  role: string;
}

interface DataAdmin {
  title: string;
  value: string;
  element: any;
}

function Children(props: ChildrenProps) {
  const { role } = props;
  const [category, setCategory] = React.useState<DataAdmin[]>();
  const [dataAdmin, setDataAdmin] = React.useState<any>({
    title: "",
    value: "",
    element: () => <></>,
  });
  const [user, setUser] = React.useState<any>();
  React.useEffect(() => {
    // if (role == "Manager_User") {
    //   setCategory(CATEGORYADMIN.filter((item) => item.value == "user"));
    // } else if (role == "Manager_Store") {
    //   setCategory(CATEGORYADMIN.filter((item) => item.value == "store"));
    // } else if (role == "Manager_Product") {
    //   setCategory(CATEGORYADMIN.filter((item) => item.value == "product"));
    // } else {
    //   setCategory(CATEGORYADMIN);
    // }
    // Lấy biến user từ localStorage
    const user = localStorage.getItem("user")
      ? JSON.parse(localStorage.getItem("user") as string).providerData[0]
      : null;
    console.log(user);
    setUser(user);
  }, [role]);
  const [open, setOpen] = React.useState(0);

  const handleOpen = (value: number) => {
    setOpen(open === value ? 0 : value);
  };

  return (
    <div className="min-h-screen px-[10px] my-2 grid grid-cols-10 gap-4">
      <Card className="h-[calc(100vh-2rem)] w-full p-4 shadow-xl shadow-blue-gray-900/5 col-span-2">
        <div className="mb-2 p-4">
          <Typography variant="h5" color="blue-gray">
            <Avatar src={user?.avatar} alt="avatar" className="mr-4" />
            Hi, {user?.fullName}
          </Typography>
        </div>
        <List>
          <ListItem>
            <ListItemPrefix>
              <IoIosSettings className="h-5 w-5" />
            </ListItemPrefix>
            Thống kê
          </ListItem>
          <Accordion
            open={open === 1}
            icon={
              <HiChevronDown
                strokeWidth={2.5}
                className={`mx-auto h-4 w-4 transition-transform ${
                  open === 1 ? "rotate-180" : ""
                }`}
              />
            }
          >
            <ListItem className="p-0" selected={open === 1}>
              <AccordionHeader
                onClick={() => handleOpen(1)}
                className="border-b-0 p-3"
              >
                <ListItemPrefix>
                  <HiPresentationChartBar className="h-5 w-5" />
                </ListItemPrefix>
                <Typography color="blue-gray" className="mr-auto font-normal">
                  Dashboard
                </Typography>
              </AccordionHeader>
            </ListItem>
            <AccordionBody className="py-1">
              <List className="p-0">
                <ListItem>
                  <ListItemPrefix>
                    <HiChevronRight strokeWidth={3} className="h-3 w-5" />
                  </ListItemPrefix>
                  Analytics
                </ListItem>
                <ListItem>
                  <ListItemPrefix>
                    <HiChevronRight strokeWidth={3} className="h-3 w-5" />
                  </ListItemPrefix>
                  Reporting
                </ListItem>
                <ListItem>
                  <ListItemPrefix>
                    <HiChevronRight strokeWidth={3} className="h-3 w-5" />
                  </ListItemPrefix>
                  Projects
                </ListItem>
              </List>
            </AccordionBody>
          </Accordion>
          <Accordion
            open={open === 2}
            icon={
              <HiChevronDown
                strokeWidth={2.5}
                className={`mx-auto h-4 w-4 transition-transform ${
                  open === 2 ? "rotate-180" : ""
                }`}
              />
            }
          >
            <ListItem className="p-0" selected={open === 2}>
              <AccordionHeader
                onClick={() => handleOpen(2)}
                className="border-b-0 p-3"
              >
                <ListItemPrefix>
                  <GiShoppingBag className="h-5 w-5" />
                </ListItemPrefix>
                <Typography color="blue-gray" className="mr-auto font-normal">
                  E-Commerce
                </Typography>
              </AccordionHeader>
            </ListItem>
            <AccordionBody className="py-1">
              <List className="p-0">
                <ListItem>
                  <ListItemPrefix>
                    <HiChevronRight strokeWidth={3} className="h-3 w-5" />
                  </ListItemPrefix>
                  Orders
                </ListItem>
                <ListItem>
                  <ListItemPrefix>
                    <HiChevronRight strokeWidth={3} className="h-3 w-5" />
                  </ListItemPrefix>
                  Products
                </ListItem>
              </List>
            </AccordionBody>
          </Accordion>
          <ListItem>
            <ListItemPrefix>
              <FaInbox className="h-5 w-5" />
            </ListItemPrefix>
            Inbox
            <ListItemSuffix>
              <Chip
                value="14"
                size="sm"
                variant="ghost"
                color="blue-gray"
                className="rounded-full"
              />
            </ListItemSuffix>
          </ListItem>
          <ListItem>
            <ListItemPrefix>
              <HiUserCircle className="h-5 w-5" />
            </ListItemPrefix>
            Profile
          </ListItem>
          <ListItem>
            <ListItemPrefix>
              <HiCog6Tooth className="h-5 w-5" />
            </ListItemPrefix>
            Settings
          </ListItem>
          <ListItem
            className="text-red-500 hover:text-red-500"
            onClick={(e) => {
              localStorage.removeItem("user");
              window.location.href = "/login";
            }}
          >
            <ListItemPrefix>
              <PowerIcon className="h-5 w-5 text-red-500" />
            </ListItemPrefix>
            Đăng xuất
          </ListItem>
        </List>
      </Card>
      <div className=" col-span-8 ">
        <Home />
      </div>
    </div>
  );
}

export default Children;
