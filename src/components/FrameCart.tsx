import { clickStore } from "@/redux/features/cart/cartpopup-slice";
import { AppDispatch } from "@/redux/store";
import Link from "next/link";
import React from "react";
import { FaComments } from "react-icons/fa";
import { useDispatch } from "react-redux";
interface FrameCartProps {
  storeAvatar: string;
  storeId: string;
  storeName: string;
  isChecked: boolean;
  children: any;
}

function FrameCart(props: FrameCartProps) {
  const { storeAvatar, storeId, storeName, isChecked, children } = props;
  const dispatch = useDispatch<AppDispatch>();
  return (
    <div
      className={`flex flex-col my-[1%] border-b-2 max-w-full bg-white rounded-lg px-6 py-3 `}
    >
      <div className="flex items-center  rounded-lg">
        <input
          className={`w-4 h-4 border-2 border-slate-400 rounded-full min-w-[30px] mr-2 `}
          type="checkbox"
          checked={isChecked}
          onChange={(e) =>
            dispatch(
              clickStore({ storeId: storeId, isChecked: e.target.checked })
            )
          }
        ></input>
        <Link href={`/shop/user/${storeId}`} className="flex items-center mr-8">
          <img
            className="rounded-full w-[54px] h-[54px] mr-4"
            src={storeAvatar}
          />
          <span className="text-[14px] font-bold min-w-fit">{storeName}</span>
        </Link>
      </div>
      <div className="border-b-2 border-[#9cb6eb] m-4"></div>

      {children}
    </div>
  );
}

export default FrameCart;
