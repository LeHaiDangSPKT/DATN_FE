// Trang chủ
// Đơn mới
// Đơn đang chuẩn bị
// Đơn đang giao
// Đơn giao thành công
// Đơn hoàn
// Đơn huỷ
// Quản lý kho

import Cancel from "@/app/shop/seller/[MyStore]/Cancel";
import Create from "@/app/shop/seller/[MyStore]/Create";
import Home from "@/app/shop/seller/[MyStore]/Home";
import Info from "@/app/shop/seller/[MyStore]/Info";
import New from "@/app/shop/seller/[MyStore]/New";
import Preparing from "@/app/shop/seller/[MyStore]/Preparing";
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
    element: New,
  },
  {
    title: "Đơn đang chuẩn bị",
    value: "preparing",
    element: Preparing,
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
    title: "Đơn huỷ",
    value: "cancel",
    element: Cancel,
  },
  {
    title: "Quản lý kho",
    value: "warehouse",
    element: Warehouse,
  },
  {
    title: "Cài đặt thông tin",
    value: "info",
    element: Info,
  },
];
