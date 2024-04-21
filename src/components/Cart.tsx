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
  const dispatch = useDispatch<AppDispatch>();
  const [isShow, setIsShow] = React.useState(false);
  const [currentQuantity, setCurrentQuantity] = React.useState(quantity + "");
  const ConfirmDel = (productId: string, dispatch: AppDispatch) => {
    dispatch(deleteProduct({ productId: productId }));
    APIRemoveProductInCart(productId);
    setIsShow(false);
  };

  return (
    <div className="flex justify-between items-center rounded-lg text-center my-3">
      <div className="flex items-center w-[35%] mr-[5%]">
        <input
          className={`w-4 h-4 border-2 border-slate-400 rounded-full mr-[2%] min-w-[30px]`}
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
          className="rounded-full w-[54px] h-[54px] mr-4"
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

      <span className="text-[14px] w-[20%]">{FormatMoney(newPrice)}</span>

      <div className="flex items-center justify-center">
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
              changeQuantityType({ productId: id, quantity: +currentQuantity })
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

      <span className="text-[14px] w-[20%]">
        {FormatMoney(newPrice * quantity)}
      </span>

      <div className="flex flex-col items-center w-[15%]">
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
    </div>
  );
}

export default Cart;
