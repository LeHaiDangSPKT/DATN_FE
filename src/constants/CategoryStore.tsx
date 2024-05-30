// Trang chủ
// Đơn mới
// Đơn đang chuẩn bị
// Đơn đang giao
// Đơn giao thành công
// Đơn hoàn
// Đơn huỷ
// Quản lý kho

<<<<<<< HEAD
import Cancel from "@/app/shop/seller/[MyStore]/Cancel";
import Back from "@/app/shop/seller/[MyStore]/Back";
=======
import Cancel from "@/app/shop/seller/[MyStore]/Back";
>>>>>>> origin/dev
import Create from "@/app/shop/seller/[MyStore]/Create";
import Home from "@/app/shop/seller/[MyStore]/Home";
import Info from "@/app/shop/seller/[MyStore]/Info";
import Init from "@/app/shop/seller/[MyStore]/Init";
import Rebill from "@/app/shop/seller/[MyStore]/Rebill";
import Shipped from "@/app/shop/seller/[MyStore]/Shipped";
import Shipping from "@/app/shop/seller/[MyStore]/Shipping";
import Warehouse from "@/app/shop/seller/[MyStore]/Warehouse";

export const CATEGORYSTORE = [
  {
    title: "Trang chủ",
    value: "home",
    element: Home,
  },
  {
    title: "Tạo sản phẩm",
    value: "create",
    element: Create,
  },
  {
    title: "Đơn mới",
    value: "new",
    element: () => <Init state="new" />,
  },
  {
    title: "Đơn đang chuẩn bị",
    value: "confirmed",
    element: () => <Init state="confirmed" />,
  },
  {
    title: "Đơn đang giao",
    value: "shipping",
    element: Shipping,
  },
  {
    title: "Đơn giao thành công",
    value: "shipped",
    element: Shipped,
  },
  {
    title: "Đơn hoàn",
    value: "rebill",
    element: Rebill,
  },
  {
    title: "Đơn trả",
    value: "back",
<<<<<<< HEAD
    element: Back,
  },
  {
    title: "Đơn huỷ",
    value: "cancel",
=======
>>>>>>> origin/dev
    element: Cancel,
  },
  {
    title: "Quản lý kho",
    value: "warehouse",
    element: Warehouse,
  },
  {
    title: "Thông tin cửa hàng",
    value: "info",
    element: Info,
  },
];
