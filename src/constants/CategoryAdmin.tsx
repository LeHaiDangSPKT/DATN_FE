import Home from "@/app/admin/dashboard/Home";
import ManagerProduct from "@/app/admin/ManagerProduct";
import ManagerStore from "@/app/admin/ManagerStore";
import ManagerUser from "@/app/admin/user/all/ManagerUser";

export const CATEGORYADMIN = [
  {
    title: "Thống kê",
    value: "home",
    element: Home,
  },
  {
    title: "Quản lý người dùng",
    value: "user",
    element: ManagerUser,
  },
  {
    title: "Quản lý sản phẩm",
    value: "product",
    element: ManagerProduct,
  },
  {
    title: "Quản lý cửa hàng",
    value: "store",
    element: ManagerStore,
  },
];
