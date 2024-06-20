import FormatMoney from "@/utils/FormatMoney";
import {
  Avatar,
  Badge,
  Drawer,
  IconButton,
  Menu,
  MenuHandler,
  MenuItem,
  MenuList,
  Typography,
} from "@material-tailwind/react";
import React from "react";
import { useRouter } from "next/navigation";
import { FaCartPlus } from "react-icons/fa";
interface CartPopupProps {
  totalCart: number;
  dataCarts: any;
  clickMenuItem: (store: any) => void;
}

function CartPopup(props: CartPopupProps) {
  const { totalCart, dataCarts, clickMenuItem } = props;

  const router = useRouter();

  return (
    <>
      <Menu>
        <Badge withBorder content={totalCart} invisible={totalCart == 0}>
          <MenuHandler>
            <IconButton variant="text">
              <FaCartPlus className="w-[24px] h-[24px] cursor-pointer hover:fill-[#59595b]" />
            </IconButton>
          </MenuHandler>
        </Badge>
        <MenuList className={`max-h-96 sm:mt-3 -mt-3`}>
          <MenuItem
            onClick={() => {
              document
                .getElementById("loading-page")
                ?.classList.remove("hidden");

              router.push("/cart");
            }}
          >
            <Typography
              variant="small"
              className="text-center font-bold"
              color="blue"
            >
              Đi đến giỏ hàng
            </Typography>
          </MenuItem>
          {dataCarts?.store?.length! > 0 &&
            dataCarts?.store.map((store: any, index: number) => (
              <MenuItem key={store.id} onClick={() => clickMenuItem(store)}>
                <div className="flex items-center gap-4 py-2 pl-2 pr-8">
                  <Avatar
                    variant="circular"
                    alt="tania andrew"
                    src={store.avatar}
                  />
                  <div className="flex flex-col gap-1">
                    <Typography
                      variant="small"
                      color="gray"
                      className="font-semibold"
                    >
                      {store.name}
                    </Typography>
                    <Typography
                      variant="small"
                      color="gray"
                      className="font-semibold"
                    >
                      {store.product.length} sản phẩm
                    </Typography>
                  </div>
                </div>
              </MenuItem>
            ))}
        </MenuList>
      </Menu>
    </>
  );
}

export default CartPopup;
