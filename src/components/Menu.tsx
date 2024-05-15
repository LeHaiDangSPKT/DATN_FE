import { UserAuth } from "@/app/authContext";
import { UserInterface } from "@/types/User";
import {
  Menu,
  MenuHandler,
  Button,
  MenuList,
  MenuItem,
  Checkbox,
} from "@material-tailwind/react";

import Link from "next/link";

interface MenuHeaderInfoUserProps {
  user: UserInterface;
}

export function MenuHeaderInfoUser(props: MenuHeaderInfoUserProps) {
  const { logOut } = UserAuth();
  const { user } = props;
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
        <MenuItem>
          <a href="/user/profile">Tài khoản của tôi</a>
        </MenuItem>
        <MenuItem>
          <a href="/user/store/follow">Cửa hàng theo dõi</a>
        </MenuItem>
        <MenuItem>
          <a href="/user/product/favorite">Sản phẩm yêu thích</a>
        </MenuItem>
        <MenuItem>
          <a href="/user/invoice">Đơn mua</a>
        </MenuItem>
        <MenuItem>
          <a href="/shipper/fill-form">Trở thành shipper</a>
        </MenuItem>
        <hr className="my-3" />
        <MenuItem>
          <span className="text-red-500" onClick={(e) => logOut()}>
            Đăng xuất
          </span>
        </MenuItem>
      </MenuList>
    </Menu>
  );
}
