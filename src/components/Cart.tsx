"use client";

import { AppDispatch, useAppSelector } from "@/redux/store";
import FormatMoney from "@/utils/FormatMoney";
import Toast from "@/utils/Toast";
import Link from "next/link";
import React from "react";
import { useDispatch } from "react-redux";
import Modal from "./Modal";
import {
  changeQuantity,
  changeQuantityType,
  clickItem,
  deleteProduct,
} from "@/redux/features/cart/cartpopup-slice";
import { APIRemoveProductInCart } from "@/services/Cart";
import {
  Button,
  Dialog,
  DialogBody,
  DialogFooter,
  DialogHeader,
} from "@material-tailwind/react";
interface CartProps {
  data: {
    id: string;
    name: string;
    avatar: string;
    newPrice: number;
    oldPrice: number;
    quantity: number;
    quantityInStock: number;
    isChecked: boolean;
  };
}

function Cart(props: CartProps) {
  const {
    id,
    name,
    avatar,
    newPrice,
    oldPrice,
    quantity,
    quantityInStock,
    isChecked,
  } = props.data;
  console.log("props.data", props.data);
  const dispatch = useDispatch<AppDispatch>();
  const [isShow, setIsShow] = React.useState(false);
  const [currentQuantity, setCurrentQuantity] = React.useState(quantity + "");
  const ConfirmDel = (productId: string, dispatch: AppDispatch) => {
    dispatch(deleteProduct({ productId: productId }));
    APIRemoveProductInCart(productId);
    setIsShow(false);
  };

  const Element = () => {
    return (
      <>
        <div className="flex items-center">
          <div className="mr-4 text-[14px]">Số lượng: </div>
          <div className="flex items-center my-4">
            <button
              className="px-2 border border-[#b6caf2] rounded-l-lg"
              onClick={(e) => {
                if (+currentQuantity <= 1) {
                  Toast("warning", "Phải có tối thiểu 01 sản phẩm", 3000);
                  return;
                }
                setCurrentQuantity(+currentQuantity - 1 + "");
                dispatch(changeQuantity({ productId: id, iSincrease: false }));
              }}
            >
              -
            </button>

            <input
              className="px-3 text-[14px] pb-[2px] pt-[1px] border-t border-b border-[#b6caf2] text-center w-[20%] outline-none"
              type="text"
              value={currentQuantity}
              onChange={(e) => {
                if (+e.target.value > quantityInStock) {
                  Toast(
                    "warning",
                    `Chỉ còn ${quantityInStock} sản phẩm trong kho`,
                    3000
                  );
                  return;
                }
                setCurrentQuantity(e.target.value);
              }}
              onBlur={(e) => {
                if (e.target.value == "") {
                  setCurrentQuantity("1");
                  return;
                }
                dispatch(
                  changeQuantityType({
                    productId: id,
                    quantity: +currentQuantity,
                  })
                );
              }}
            />

            <button
              className="px-2 border border-[#b6caf2] rounded-r-lg"
              onClick={(e) => {
                if (+currentQuantity >= quantityInStock) {
                  Toast(
                    "warning",
                    `Chỉ còn ${quantityInStock} sản phẩm trong kho`,
                    3000
                  );
                  return;
                }
                setCurrentQuantity(+currentQuantity + 1 + "");
                dispatch(changeQuantity({ productId: id, iSincrease: true }));
              }}
            >
              +
            </button>
          </div>
        </div>

        <div className="text-[14px] mb-4">
          Thành tiền: {FormatMoney(newPrice * quantity)}
        </div>

        <div className="text-center">
          <Button size="sm" color="red" onClick={(e) => setIsShow(true)}>
            Xóa
          </Button>
        </div>
        <Dialog open={isShow} handler={() => setIsShow(false)}>
          <DialogHeader>Xoá sản phẩm</DialogHeader>
          <DialogBody>
            Bạn có chắc chắn muốn xoá sản phẩm này khỏi giỏ hàng?
          </DialogBody>
          <DialogFooter>
            <Button
              variant="text"
              color="red"
              onClick={() => setIsShow(false)}
              className="mr-1"
            >
              <span>Đóng</span>
            </Button>
            <Button
              variant="gradient"
              color="red"
              onClick={() => ConfirmDel(id, dispatch)}
            >
              <span>Xoá</span>
            </Button>
          </DialogFooter>
        </Dialog>
      </>
    );
  };

  return (
    <div className="flex sm:flex-row flex-col sm:justify-between sm:items-center rounded-lg sm:text-center my-3">
      <div className="flex items-center sm:w-[35%]">
        <input
          className={`w-4 h-4 border-2 border-slate-400 rounded-full mr-2 sm:mr-[2%] min-w-[30px]`}
          type="checkbox"
          checked={isChecked}
          onChange={(e) =>
            dispatch(
              clickItem({
                productId: id,
                isChecked: e.target.checked,
              })
            )
          }
          min={1}
        ></input>
        <img
          className="rounded-full w-[30px] h-[30px]  sm:w-[54px] sm:h-[54px] mr-4"
          src={avatar}
          alt="Loading..."
        />
        <Link
          href={`/product/${id}`}
          className="text-[14px] mr-2 text-ellipsis line-clamp-2 text-left"
        >
          {name}
        </Link>
      </div>
      <span className="hidden sm:text-[14px] w-[15%] text-end">
        {FormatMoney(newPrice)}
      </span>

      <div className="hidden sm:flex items-center w-[15%] justify-end">
        <button
          className="px-2 py-1 border border-[#b6caf2] rounded-l-lg"
          onClick={(e) => {
            if (+currentQuantity <= 1) {
              Toast("warning", "Phải có tối thiểu 01 sản phẩm", 3000);
              return;
            }
            setCurrentQuantity(+currentQuantity - 1 + "");
            dispatch(changeQuantity({ productId: id, iSincrease: false }));
          }}
        >
          -
        </button>

        <input
          className="px-3 py-1 border-t border-b border-[#b6caf2] text-center w-[20%] outline-none"
          type="text"
          value={currentQuantity}
          onChange={(e) => {
            if (+e.target.value > quantityInStock) {
              Toast(
                "warning",
                `Chỉ còn ${quantityInStock} sản phẩm trong kho`,
                3000
              );
              return;
            }
            setCurrentQuantity(e.target.value);
          }}
          onBlur={(e) => {
            if (e.target.value == "") {
              setCurrentQuantity("1");
              return;
            }
            dispatch(
              changeQuantityType({
                productId: id,
                quantity: +currentQuantity,
              })
            );
          }}
        />

        <button
          className="px-2 py-1 border border-[#b6caf2] rounded-r-lg"
          onClick={(e) => {
            if (+currentQuantity >= quantityInStock) {
              Toast(
                "warning",
                `Chỉ còn ${quantityInStock} sản phẩm trong kho`,
                3000
              );
              return;
            }
            setCurrentQuantity(+currentQuantity + 1 + "");
            dispatch(changeQuantity({ productId: id, iSincrease: true }));
          }}
        >
          +
        </button>
      </div>

      <span className="hidden sm:block text-[14px] w-[20%] text-end">
        {FormatMoney(newPrice * quantity)}
      </span>

      <div className="hidden sm:flex flex-col items-center justify-end w-[15%]">
        <span
          className="text-[14px] text-red-500 hover:text-[#648fe3] cursor-pointer hover:font-bold"
          onClick={(e) => setIsShow(true)}
        >
          Xóa
        </span>
        <Modal
          isShow={isShow}
          setIsShow={(data: any) => setIsShow(data)}
          confirm={() => ConfirmDel(id, dispatch)}
          title="Xoá sản phẩm"
        >
          <p className="my-4 text-blueGray-500 text-lg leading-relaxed">
            Bạn có chắc chắn muốn xoá sản phẩm này khỏi giỏ hàng?
          </p>
        </Modal>
      </div>
      <div className="block sm:hidden">
        <Element />
      </div>
    </div>
  );
}

export default Cart;
