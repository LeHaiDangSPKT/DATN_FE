"use client";
import Cart from "@/components/Cart";
import FrameCart from "@/components/FrameCart";
import { clickAll } from "@/redux/features/cart/cartpopup-slice";
import { AppDispatch, useAppSelector } from "@/redux/store";
import { setCartPopUp } from "@/redux/features/cart/cartpopup-slice";
import { useDispatch } from "react-redux";
import FormatMoney from "@/utils/FormatMoney";
import Toast from "@/utils/Toast";
import { useRouter } from "next/navigation";
import React from "react";
import { Button } from "@material-tailwind/react";

function CartPage() {
  const dispatch = useDispatch<AppDispatch>();
  const dataCarts = useAppSelector((state) => state.cartPopupReducer.items);
  const totalCart = useAppSelector((state) => state.cartPopupReducer.totalCart);
  React.useEffect(() => {
    document.getElementById("loading-page")?.classList.add("hidden");
    localStorage.removeItem("listProductIdChecked");
    dispatch(
      setCartPopUp({
        isCheckAll: false,
        store: dataCarts.store.map((item) => {
          return {
            ...item,
            isChecked: false,
            product: item.product.map((product) => {
              return {
                ...product,
                isChecked: false,
              };
            }),
          };
        }),
      })
    );
  }, []);
  const router = useRouter();
  const totalChecked = useAppSelector(
    (state) => state.cartPopupReducer.totalChecked
  );
  const totalMoney = useAppSelector(
    (state) => state.cartPopupReducer.totalMoney
  );
  return (
    <div className="min-h-screen sm:px-[10%]">
      {totalCart > 0 ? (
        <>
          <div className="hidden sm:flex items-center p-2 sm:px-8 sm:py-5 sm:mt-[2%] rounded-lg bg-white text-center font-bold text-sm">
            <div className="flex items-center sm:w-[35%]">
              <input
                className="w-4 h-5 border-2 border-slate-400 rounded-full mr-[4%] checkbox-cart-all"
                type="checkbox"
                checked={dataCarts.isCheckAll}
                onChange={(e) => dispatch(clickAll(e.target.checked))}
              ></input>
              <span className="text-left"> Sản Phẩm</span>
            </div>
            <div className="sm:w-[15%] text-end"> Đơn Giá </div>
            <div className="sm:w-[15%] text-end"> Số Lượng </div>
            <div className="sm:w-[20%] text-end"> Số Tiền </div>
            <div className="sm:w-[15%]"> Thao Tác </div>
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
          <div className="flex flex-col rounded-lg bg-white p-2 sm:p-4 mb-[5%]">
            <div className="flex items-center justify-between px-4">
              <div className="flex items-center min-w-[200px]">
                <input
                  className="w-4 h-5 border-2 border-slate-400 rounded-full mr-[6%]"
                  type="checkbox"
                  checked={dataCarts.isCheckAll}
                  onChange={(e) => dispatch(clickAll(e.target.checked))}
                ></input>
                <span className="text-sm sm:text-[16px] ">Chọn Tất Cả</span>
              </div>

              <div className="sm:block flex flex-col justify-center items-center  sm:mr-[-25%]">
                <span className="text-sm sm:text-[16px] text-center">
                  Tổng thanh toán ({totalChecked} Sản Phẩm):{" "}
                </span>
                <span className="font-bold">{FormatMoney(totalMoney)}</span>
              </div>

              <Button
                color="blue"
                className="hidden sm:block"
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
              </Button>
            </div>
            <Button
              className="sm:hidden"
              color="blue"
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
            </Button>
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
