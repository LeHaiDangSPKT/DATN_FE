import { UserInterface } from "@/types/User";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";

import {
  Menu,
  MenuHandler,
  MenuList,
  MenuItem,
} from "@material-tailwind/react";

interface MenuHeaderInfoUserProps {
  user: UserInterface;
  role: string;
}

export function MenuHeaderInfoUser(props: MenuHeaderInfoUserProps) {
  const { user, role } = props;
  const router = useRouter();
  const Singout = async () => {
    localStorage.removeItem("user");
    localStorage.removeItem("marketing");

    await signOut({
      callbackUrl: "/login",
    });
  };
  return (
    <Menu>
      <MenuHandler>
        <div className="flex items-center">
          <img
            className="rounded-full w-[40px] h-[40px] sm:w-[50px] sm:h-[50px] cursor-pointer"
            src={user.avatar || user.photoURL}
            alt="Loading..."
          />
          <span className="pl-3 hidden sm:block">{user.fullName}</span>
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
        {!role.includes("SELLER") && (
          <MenuItem
            onClick={() => {
              document
                .getElementById("loading-page")
                ?.classList.remove("hidden");
              router.push("/shipper/fill-form");
            }}
          >
            Trở thành shipper
          </MenuItem>
        )}
        <hr className="my-3" />
        <MenuItem
          onClick={() => {
            Singout();
          }}
        >
          <span className="text-red-500">Đăng xuất</span>
        </MenuItem>
      </MenuList>
    </Menu>
  );
}
