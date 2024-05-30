"use client";
import Cart from "@/components/Cart";
import FrameCart from "@/components/FrameCart";
import { clickAll } from "@/redux/features/cart/cartpopup-slice";
import { AppDispatch, useAppSelector } from "@/redux/store";
import FormatMoney from "@/utils/FormatMoney";
import Toast from "@/utils/Toast";
import { useRouter } from "next/navigation";
import React from "react";
import { useDispatch } from "react-redux";

function CartPage() {
  const dispatch = useDispatch<AppDispatch>();
  const dataCarts = useAppSelector((state) => state.cartPopupReducer.items);
  const totalCart = useAppSelector((state) => state.cartPopupReducer.totalCart);
  React.useEffect(() => {
    document.getElementById("loading-page")?.classList.add("hidden");
    localStorage.removeItem("listProductIdChecked");
  }, []);
  const router = useRouter();
  const totalChecked = useAppSelector(
    (state) => state.cartPopupReducer.totalChecked
  );
  const totalMoney = useAppSelector(
    (state) => state.cartPopupReducer.totalMoney
  );
  return (
    <div className="min-h-screen px-[10%]">
      {totalCart > 0 ? (
        <>
          <div className="flex items-center px-8 py-5 mt-[2%] rounded-lg bg-white text-center font-bold text-sm">
            <div className="flex items-center w-[35%] mr-[5%]">
              <input
                className="w-4 h-5 border-2 border-slate-400 rounded-full mr-[4%] checkbox-cart-all"
                type="checkbox"
                checked={dataCarts.isCheckAll}
                onChange={(e) => dispatch(clickAll(e.target.checked))}
              ></input>
              <span className="text-left"> Sản Phẩm</span>
            </div>
            <span className="w-[20%]"> Đơn Giá </span>
            <span className="w-[20%]"> Số Lượng </span>
            <span className="w-[20%]"> Số Tiền </span>
            <span className="w-[15%]"> Thao Tác </span>
          </div>

          {dataCarts.store?.length > 0 &&
            dataCarts.store.map((data: any, i) => (
              <FrameCart
                storeId={data.id}
                storeName={data.name}
                storeAvatar={data.avatar}
                isChecked={dataCarts.store[i]?.isChecked}
                key={i}
              >
                {data.product.map((item: any, index: number) => (
                  <Cart key={index} data={item} />
                ))}
              </FrameCart>
            ))}
          <div className="flex flex-col rounded-lg bg-white p-4 mb-[5%]">
            <div className="flex items-center justify-between px-4">
              <div className="flex items-center min-w-[200px]">
                <input
                  className="w-4 h-5 border-2 border-slate-400 rounded-full mr-[6%]"
                  type="checkbox"
                  checked={dataCarts.isCheckAll}
                  onChange={(e) => dispatch(clickAll(e.target.checked))}
                ></input>
                <span className="text-[16px] ">Chọn Tất Cả</span>
              </div>

              <p className="text-[16px] mr-[-25%]">
                Tổng thanh toán ({totalChecked} Sản Phẩm):{" "}
                <span>{FormatMoney(totalMoney)}</span>
              </p>

              <button
                className="w-[15%] h-[10%] bg-[#648fe3] rounded-lg p-2"
                onClick={(e) => {
                  if (totalChecked === 0) {
                    Toast("warning", "Vui lòng chọn sản phẩm", 2000);
                  } else {
                    document
                      .getElementById("loading-page")
                      ?.classList.remove("hidden");

                    router.push("/payment");
                  }
                }}
              >
                Đặt Hàng
              </button>
            </div>
          </div>
        </>
      ) : (
        <div className="flex justify-center items-center hover:bg-[#c1d2f6] p-2 rounded-lg">
          <span className="text-[14px] cursor-default">
            Không có sản phẩm nào
          </span>
        </div>
      )}
    </div>
  );
}

export default CartPage;
