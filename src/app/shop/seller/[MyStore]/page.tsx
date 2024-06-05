"use client";
import React from "react";
import { CATEGORYSTORE } from "@/constants/CategoryStore";
import { setCategoryStore } from "@/redux/features/categoryStore/categoryStore-slice";
import { AppDispatch, useAppSelector } from "@/redux/store";
import { useDispatch } from "react-redux";

function MyStore() {
  const dispatch = useDispatch<AppDispatch>();
  const dataCarts = useAppSelector((state) => state.categoryStoreReducer.items);
  React.useEffect(() => {
    document.getElementById("loading-page")?.classList.add("hidden");
  }, []);
  return (
    <div className="min-h-screen px-[150px] my-4 grid grid-cols-10 gap-4">
      <div className="flex flex-col min-h-screen justify-around bg-white rounded-md p-2 col-span-2">
        {CATEGORYSTORE.map(
          (item: { value: string; title: string; icon: any }, index) => (
            <div
              key={index}
              className={`${
                dataCarts.value === item.value
                  ? "bg-blue-300 font-bold text-white"
                  : "bg-blue-100"
              } cursor-pointer hover:bg-blue-300 transition-all rounded-sm py-3 px-2`}
              onClick={(e) => dispatch(setCategoryStore(item))}
            >
              <div className="flex items-center">
                <div className="mr-2">{item.icon}</div>

                {item.title}
              </div>
            </div>
          )
        )}
      </div>
      <div className=" col-span-8 overflow-scroll scrollbar-hide max-h-screen">
        {dataCarts.value === "home" ? (
          <dataCarts.element
            setActive={(data: string) => {
              const selectedCategory = CATEGORYSTORE.find(
                (item) => item.value === data
              );
              if (selectedCategory) {
                dispatch(setCategoryStore(selectedCategory));
              }
            }}
          />
        ) : (
          <dataCarts.element />
        )}
      </div>
    </div>
  );
}

export default MyStore;
