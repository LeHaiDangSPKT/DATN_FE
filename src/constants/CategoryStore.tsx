// Trang chủ
// Đơn mới
// Đơn đang chuẩn bị
// Đơn đang giao
// Đơn giao thành công
// Đơn hoàn
// Đơn huỷ
// Quản lý kho

import Cancel from "@/app/shop/seller/[MyStore]/Cancel";
import Back from "@/app/shop/seller/[MyStore]/Back";
import Create from "@/app/shop/seller/[MyStore]/Create";
import Home from "@/app/shop/seller/[MyStore]/Home";
import Info from "@/app/shop/seller/[MyStore]/Info";
import Init from "@/app/shop/seller/[MyStore]/Init";
import Rebill from "@/app/shop/seller/[MyStore]/Rebill";
import Shipped from "@/app/shop/seller/[MyStore]/Shipped";
import Shipping from "@/app/shop/seller/[MyStore]/Shipping";
import Warehouse from "@/app/shop/seller/[MyStore]/Warehouse";
import {
  FaHome,
  FaInfoCircle,
  FaPlusCircle,
  FaShippingFast,
  FaWarehouse,
} from "react-icons/fa";
import {
  BsFillBookmarkCheckFill,
  BsFillBookmarkDashFill,
  BsFillBookmarkPlusFill,
  BsFillBookmarkXFill,
  BsFillBookmarksFill,
} from "react-icons/bs";
import { BiSolidBookmarkAlt } from "react-icons/bi";
import { FaRegHandshake } from "react-icons/fa6";
import Marketing from "@/app/shop/seller/[MyStore]/Marketing";
export const CATEGORYSTORE = [
  {
    title: "Trang chủ",
    value: "home",
    element: Home,
    icon: <FaHome />,
  },
  {
    title: "Tạo sản phẩm",
    value: "create",
    element: Create,
    icon: <FaPlusCircle />,
  },
  {
    title: "Đơn mới",
    value: "new",
    element: () => <Init state="new" />,
    icon: <BsFillBookmarkPlusFill />,
  },
  {
    title: "Đơn đang chuẩn bị",
    value: "confirmed",
    element: () => <Init state="confirmed" />,
    icon: <BiSolidBookmarkAlt />,
  },
  {
    title: "Đơn đang giao",
    value: "shipping",
    element: Shipping,
    icon: <FaShippingFast />,
  },
  {
    title: "Đơn giao thành công",
    value: "shipped",
    element: Shipped,
    icon: <BsFillBookmarkCheckFill />,
  },
  {
    title: "Đơn hoàn",
    value: "rebill",
    element: Rebill,
    icon: <BsFillBookmarksFill />,
  },
  {
    title: "Đơn trả",
    value: "back",
    element: Back,
    icon: <BsFillBookmarkDashFill />,
  },
  {
    title: "Đơn huỷ",
    value: "cancel",
    element: Cancel,
    icon: <BsFillBookmarkXFill />,
  },
  {
    title: "Quản lý kho",
    value: "warehouse",
    element: Warehouse,
    icon: <FaWarehouse />,
  },
  {
    title: "Tăng lượt tiếp cận",
    value: "marketing",
    element: Marketing,
    icon: <FaRegHandshake />,
  },
  {
    title: "Thông tin cửa hàng",
    value: "info",
    element: Info,
    icon: <FaInfoCircle />,
  },
];
