"use client";
import React from "react";
import { HiChevronDown, HiChevronRight, HiUserCircle } from "react-icons/hi2";
import { GrUserWorker } from "react-icons/gr";
import { IoIosSettings } from "react-icons/io";
import { GiShoppingBag } from "react-icons/gi";
import {
  Accordion,
  AccordionBody,
  AccordionHeader,
  Avatar,
  Card,
  List,
  ListItem,
  ListItemPrefix,
  Typography,
} from "@material-tailwind/react";
import { FaInbox, FaStore } from "react-icons/fa";

import { PowerIcon } from "@heroicons/react/24/solid";
interface ChildrenProps {
  code: string;
}

function Sidebar(props: ChildrenProps) {
  const { code } = props;
  const [user, setUser] = React.useState<any>();
  const [open, setOpen] = React.useState(0);
  const [role, setRole] = React.useState([]);

  const handleOpen = (value: number) => {
    setOpen(open === value ? 0 : value);
  };
  React.useEffect(() => {
    const user = localStorage.getItem("user")
      ? JSON.parse(localStorage.getItem("user") as string)
      : null;
    user && setUser(user.providerData[0]);
    user && setRole(user.role || []);

    if (code.startsWith("user")) {
      setOpen(1);
    } else if (code.startsWith("store")) {
      setOpen(2);
    }
  }, [code]);
  return (
    <Card className="min-h-[calc(100vh-2rem)] h-[calc(100vh-2rem)] w-[19%] p-4 shadow-xl shadow-blue-gray-900/5 fixed overflow-y-auto hidden-scrollbar my-2 ">
      <div className="mb-2 p-4">
        <Typography variant="h5" color="blue-gray">
          <Avatar src={user?.avatar} alt="avatar" className="mr-4" />
          Hi, {user?.fullName}
        </Typography>
      </div>
      <List>
        {role?.some((item) => item == "ADMIN") && (
          <a href="/admin/dashboard" className="text-initial">
            <ListItem selected={code == "dashboard"}>
              <ListItemPrefix>
                <IoIosSettings className="h-6 w-6" />
              </ListItemPrefix>
              Thống kê
            </ListItem>
          </a>
        )}

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
                <HiUserCircle className="h-6 w-6" />
              </ListItemPrefix>
              <Typography color="blue-gray" className="mr-auto font-normal">
                Quản lý người dùng
              </Typography>
            </AccordionHeader>
          </ListItem>
          <AccordionBody className="py-1">
            <List className="p-0">
              <a href="/admin/user/all" className="text-initial">
                <ListItem
                  className={code == "user_all" ? "bg-blue-gray-50" : ""}
                >
                  <ListItemPrefix>
                    <HiChevronRight strokeWidth={3} className="h-3 w-5" />
                  </ListItemPrefix>
                  Tất cả người dùng của hệ thống
                </ListItem>
              </a>
              <a href="/admin/user/has-store" className="text-initial">
                <ListItem
                  className={code == "user_has_store" ? "bg-blue-gray-50" : ""}
                >
                  <ListItemPrefix>
                    <HiChevronRight strokeWidth={3} className="h-3 w-5" />
                  </ListItemPrefix>
                  Danh sách người dùng có cửa hàng
                </ListItem>
              </a>
              <a href="/admin/user/has-warning" className="text-initial">
                <ListItem
                  className={
                    code == "user_has_warning" ? "bg-blue-gray-50" : ""
                  }
                >
                  <ListItemPrefix>
                    <HiChevronRight strokeWidth={3} className="h-3 w-5" />
                  </ListItemPrefix>
                  Danh sách người dùng đang bị cảnh cáo
                </ListItem>
              </a>
              <a href="/admin/user/has-ban" className="text-initial">
                <ListItem
                  className={code == "user_has_ban" ? "bg-blue-gray-50" : ""}
                >
                  <ListItemPrefix>
                    <HiChevronRight strokeWidth={3} className="h-3 w-5" />
                  </ListItemPrefix>
                  Danh sách người dùng bị vô hiệu hoá
                </ListItem>
              </a>
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
                <FaStore className="h-5 w-5" />
              </ListItemPrefix>
              <Typography color="blue-gray" className="mr-auto font-normal">
                Quản lý cửa hàng
              </Typography>
            </AccordionHeader>
          </ListItem>
          <AccordionBody className="py-1">
            <List className="p-0">
              <a href="/admin/store/all" className="text-initial">
                <ListItem
                  className={code == "store_all" ? "bg-blue-gray-50" : ""}
                >
                  <ListItemPrefix>
                    <HiChevronRight strokeWidth={3} className="h-3 w-5" />
                  </ListItemPrefix>
                  Tất cả cửa hàng của hệ thống
                </ListItem>
              </a>
              <a href="/admin/store/has-warning" className="text-initial">
                <ListItem
                  className={code == "store_warning" ? "bg-blue-gray-50" : ""}
                >
                  <ListItemPrefix>
                    <HiChevronRight strokeWidth={3} className="h-3 w-5" />
                  </ListItemPrefix>
                  Danh sách cửa hàng đang bị báo cáo
                </ListItem>
              </a>
              <a href="/admin/store/report-approval" className="text-initial">
                <ListItem
                  className={
                    code == "store_report_approval" ? "bg-blue-gray-50" : ""
                  }
                >
                  <ListItemPrefix>
                    <HiChevronRight strokeWidth={3} className="h-3 w-5" />
                  </ListItemPrefix>
                  Danh sách báo cáo đã phê duyệt
                </ListItem>
              </a>
            </List>
          </AccordionBody>
        </Accordion>
        <a href="/admin/shipper" className="text-initial">
          <ListItem selected={code == "shipper"}>
            <ListItemPrefix>
              <GrUserWorker className="h-5 w-5" />
            </ListItemPrefix>
            Shipper
          </ListItem>
        </a>
        {role?.some((item) => item == "ADMIN") && (
          <a href="/admin/policy" className="text-initial">
            <ListItem selected={code == "policy"}>
              <ListItemPrefix>
                <FaInbox className="h-5 w-5" />
              </ListItemPrefix>
              Chính sách
            </ListItem>
          </a>
        )}
        <a href="/admin/promotion" className="text-initial">
          <ListItem selected={code == "promotion"}>
            <ListItemPrefix>
              <GiShoppingBag className="h-5 w-5" />
            </ListItemPrefix>
            Khuyến mãi
          </ListItem>
        </a>

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
  );
}

export default Sidebar;
