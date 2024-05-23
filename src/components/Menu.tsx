import { UserInterface } from "@/types/User";
import { usePathname, useRouter } from "next/navigation";

import {
  Menu,
  MenuHandler,
  MenuList,
  MenuItem,
} from "@material-tailwind/react";

interface MenuHeaderInfoUserProps {
  user: UserInterface;
}

export function MenuHeaderInfoUser(props: MenuHeaderInfoUserProps) {
  const { user } = props;
  const router = useRouter();

  return (
    <Menu>
      <MenuHandler>
        <div className="flex items-center">
          <img
            className="rounded-full w-[50px] h-[50px] cursor-pointer"
            src={user.avatar || user.photoURL}
            alt="Loading..."
          />
          <span className="pl-3">{user.fullName}</span>
        </div>
      </MenuHandler>
      <MenuList>
        <MenuItem
          onClick={() => {
            document.getElementById("loading-page")?.classList.remove("hidden");
            router.push("/user/profile");
          }}
        >
          Tài khoản của tôi
        </MenuItem>
        <MenuItem
          onClick={() => {
            document.getElementById("loading-page")?.classList.remove("hidden");
            router.push("/user/store/follow");
          }}
        >
          Cửa hàng theo dõi
        </MenuItem>
        <MenuItem
          onClick={() => {
            document.getElementById("loading-page")?.classList.remove("hidden");
            router.push("/user/product/favorite");
          }}
        >
          Sản phẩm yêu thích
        </MenuItem>
        <MenuItem
          onClick={() => {
            document.getElementById("loading-page")?.classList.remove("hidden");
            router.push("/user/invoice");
          }}
        >
          Đơn mua
        </MenuItem>
        <MenuItem
          onClick={() => {
            document.getElementById("loading-page")?.classList.remove("hidden");
            router.push("/shipper/fill-form");
          }}
        >
          Trở thành shipper
        </MenuItem>
        <hr className="my-3" />
        <MenuItem
          onClick={() => {
            document.getElementById("loading-page")?.classList.remove("hidden");
            localStorage.removeItem("user");
            window.location.href = "/login";
          }}
        >
          <span className="text-red-500">Đăng xuất</span>
        </MenuItem>
      </MenuList>
    </Menu>
  );
}
