"use client";
import React from "react";
import { CATEGORYSTORE } from "@/constants/CategoryStore";
import { setCategoryStore } from "@/redux/features/categoryStore/categoryStore-slice";
import { AppDispatch, useAppSelector } from "@/redux/store";
import { useDispatch } from "react-redux";

function MyStore() {
  const dispatch = useDispatch<AppDispatch>();
  const dataCarts = useAppSelector((state) => state.categoryStoreReducer.items);

  return (
    <div className="min-h-screen px-[150px] my-4 grid grid-cols-10 gap-4">
      <div className="flex flex-col bg-white rounded-md p-2 mb-5 col-span-2">
        {CATEGORYSTORE.map((item: { value: string; title: string }, index) => (
          <div
            key={index}
            className={`${
              dataCarts.value === item.value
                ? "bg-blue-300 font-bold text-white"
                : "bg-blue-100"
            } cursor-pointer hover:bg-blue-300 transition-all rounded-sm py-3 px-2 mb-2`}
            onClick={(e) => dispatch(setCategoryStore(item))}
          >
            {item.title}
          </div>
        ))}
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
