"use client";
import React from "react";
import {
  HiChevronDown,
  HiChevronRight,
  HiUserCircle,
  HiUserGroup,
} from "react-icons/hi2";
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
import { FaBoxes, FaInbox, FaStore } from "react-icons/fa";
import { useRouter } from "next/navigation";
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
  const router = useRouter();

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
    } else if (code.startsWith("shipper")) {
      setOpen(3);
    } else if (code.startsWith("product")) {
      setOpen(4);
    }
  }, [code]);

  return (
    <Card className="min-h-[calc(100vh-2rem)] h-[calc(100vh-2rem)] w-[19%] p-4 shadow-xl shadow-blue-gray-900/5 fixed overflow-y-auto hidden-scrollbar my-2 ">
      <div className="mb-2 p-4 flex items-center">
        <Avatar src={user?.avatar} alt="avatar" className="mr-4" />
        <Typography variant="h5" color="blue-gray">
          Hi, {user?.fullName}
        </Typography>
      </div>
      <List>
        {role?.some((item) => item == "ADMIN") && (
          <ListItem
            selected={code == "dashboard"}
            onClick={() => router.push("/admin/dashboard")}
          >
            <ListItemPrefix>
              <IoIosSettings className="h-6 w-6" />
            </ListItemPrefix>
            Thống kê
          </ListItem>
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
              <ListItem
                onClick={() => router.push("/admin/user/all")}
                className={code == "user_all" ? "bg-blue-gray-50" : ""}
              >
                <ListItemPrefix>
                  <HiChevronRight strokeWidth={3} className="h-3 w-5" />
                </ListItemPrefix>
                Tất cả người dùng của hệ thống
              </ListItem>
              <ListItem
                onClick={() => router.push("/admin/user/has-store")}
                className={code == "user_has_store" ? "bg-blue-gray-50" : ""}
              >
                <ListItemPrefix>
                  <HiChevronRight strokeWidth={3} className="h-3 w-5" />
                </ListItemPrefix>
                Danh sách người dùng có cửa hàng
              </ListItem>
              <ListItem
                onClick={() => router.push("/admin/user/has-warning")}
                className={code == "user_has_warning" ? "bg-blue-gray-50" : ""}
              >
                <ListItemPrefix>
                  <HiChevronRight strokeWidth={3} className="h-3 w-5" />
                </ListItemPrefix>
                Danh sách người dùng đang bị cảnh cáo
              </ListItem>
              <ListItem
                onClick={() => router.push("/admin/user/has-ban")}
                className={code == "user_has_ban" ? "bg-blue-gray-50" : ""}
              >
                <ListItemPrefix>
                  <HiChevronRight strokeWidth={3} className="h-3 w-5" />
                </ListItemPrefix>
                Danh sách người dùng bị vô hiệu hoá
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
                <FaStore className="h-5 w-5" />
              </ListItemPrefix>
              <Typography color="blue-gray" className="mr-auto font-normal">
                Quản lý cửa hàng
              </Typography>
            </AccordionHeader>
          </ListItem>
          <AccordionBody className="py-1">
            <List className="p-0">
              <ListItem
                onClick={() => router.push("/admin/store/all")}
                className={code == "store_all" ? "bg-blue-gray-50" : ""}
              >
                <ListItemPrefix>
                  <HiChevronRight strokeWidth={3} className="h-3 w-5" />
                </ListItemPrefix>
                Tất cả cửa hàng của hệ thống
              </ListItem>
              <ListItem
                onClick={() => router.push("/admin/store/has-warning")}
                className={code == "store_warning" ? "bg-blue-gray-50" : ""}
              >
                <ListItemPrefix>
                  <HiChevronRight strokeWidth={3} className="h-3 w-5" />
                </ListItemPrefix>
                Danh sách cửa hàng đang bị báo cáo
              </ListItem>
              <ListItem
                onClick={() => router.push("/admin/store/report-approval")}
                className={
                  code == "store_report_approval" ? "bg-blue-gray-50" : ""
                }
              >
                <ListItemPrefix>
                  <HiChevronRight strokeWidth={3} className="h-3 w-5" />
                </ListItemPrefix>
                Danh sách báo cáo đã phê duyệt
              </ListItem>
            </List>
          </AccordionBody>
        </Accordion>
        <Accordion
          open={open === 4}
          icon={
            <HiChevronDown
              strokeWidth={2.5}
              className={`mx-auto h-4 w-4 transition-transform ${
                open === 2 ? "rotate-180" : ""
              }`}
            />
          }
        >
          <ListItem className="p-0" selected={open === 4}>
            <AccordionHeader
              onClick={() => handleOpen(4)}
              className="border-b-0 p-3"
            >
              <ListItemPrefix>
                <FaBoxes className="h-5 w-5" />
              </ListItemPrefix>
              <Typography color="blue-gray" className="mr-auto font-normal">
                Quản lý sản phẩm
              </Typography>
            </AccordionHeader>
          </ListItem>
          <AccordionBody className="py-1">
            <List className="p-0">
              <ListItem
                onClick={() => router.push("/admin/product/all")}
                className={code == "product_all" ? "bg-blue-gray-50" : ""}
              >
                <ListItemPrefix>
                  <HiChevronRight strokeWidth={3} className="h-3 w-5" />
                </ListItemPrefix>
                Tất cả sản phẩm của hệ thống
              </ListItem>
              <ListItem
                onClick={() => router.push("/admin/product/has-warning")}
                className={code == "product_warning" ? "bg-blue-gray-50" : ""}
              >
                <ListItemPrefix>
                  <HiChevronRight strokeWidth={3} className="h-3 w-5" />
                </ListItemPrefix>
                Danh sách sản phẩm đang bị báo cáo
              </ListItem>
              <ListItem
                onClick={() => router.push("/admin/product/report-approval")}
                className={
                  code == "product_report_approval" ? "bg-blue-gray-50" : ""
                }
              >
                <ListItemPrefix>
                  <HiChevronRight strokeWidth={3} className="h-3 w-5" />
                </ListItemPrefix>
                Danh sách báo cáo đã phê duyệt
              </ListItem>
            </List>
          </AccordionBody>
        </Accordion>
        <Accordion
          open={open === 3}
          icon={
            <HiChevronDown
              strokeWidth={2.5}
              className={`mx-auto h-4 w-4 transition-transform ${
                open === 3 ? "rotate-180" : ""
              }`}
            />
          }
        >
          <ListItem className="p-0" selected={open === 3}>
            <AccordionHeader
              onClick={() => handleOpen(3)}
              className="border-b-0 p-3"
            >
              <ListItemPrefix>
                <HiUserGroup className="h-5 w-5 " />
              </ListItemPrefix>
              <Typography color="blue-gray" className="mr-auto font-normal">
                Quản lý shipper
              </Typography>
            </AccordionHeader>
          </ListItem>
          <AccordionBody className="py-1">
            <List className="p-0">
              <ListItem
                onClick={() => router.push("/admin/shipper")}
                className={code == "shipper" ? "bg-blue-gray-50" : ""}
              >
                <ListItemPrefix>
                  <HiChevronRight strokeWidth={3} className="h-3 w-5" />
                </ListItemPrefix>
                Danh sách shipper
              </ListItem>
              <ListItem
                onClick={() => router.push("/admin/shipper/not-yet-approval")}
                className={
                  code == "shipper-not-yet-approval" ? "bg-blue-gray-50" : ""
                }
              >
                <ListItemPrefix>
                  <HiChevronRight strokeWidth={3} className="h-3 w-5" />
                </ListItemPrefix>
                Danh sách đơn đăng ký trở thành shipper
              </ListItem>
            </List>
          </AccordionBody>
        </Accordion>
        <ListItem
          onClick={() => router.push("/admin/promotion")}
          selected={code == "promotion"}
        >
          <ListItemPrefix>
            <GiShoppingBag className="h-5 w-5" />
          </ListItemPrefix>
          Khuyến mãi
        </ListItem>
        {role?.some((item) => item == "ADMIN") && (
          <ListItem
            onClick={() => router.push("/admin/policy")}
            selected={code == "policy"}
          >
            <ListItemPrefix>
              <FaInbox className="h-5 w-5" />
            </ListItemPrefix>
            Chính sách
          </ListItem>
        )}

        <ListItem
          className="text-red-500 hover:text-red-500"
          onClick={(e) => {
            localStorage.removeItem("user");
            document.getElementById("loading-page")?.classList.remove("hidden");
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
