"use client";
import React from "react";
import { CATEGORYSTORE } from "@/constants/CategoryStore";
import { setCategoryStore } from "@/redux/features/categoryStore/categoryStore-slice";
import { AppDispatch, useAppSelector } from "@/redux/store";
import { useDispatch } from "react-redux";
import { Card, List, ListItem, ListItemPrefix } from "@material-tailwind/react";

function MyStore() {
  const dispatch = useDispatch<AppDispatch>();
  const dataCarts = useAppSelector((state) => state.categoryStoreReducer.items);
  React.useEffect(() => {
    document.getElementById("loading-page")?.classList.add("hidden");
  }, []);
  return (
    <div className="min-h-screen px-[150px] my-4 flex">
      <Card className="mr-4">
        {CATEGORYSTORE.map(
          (item: { value: string; title: string; icon: any }, index) => (
            <List key={index} className="">
              <ListItem
                onClick={(e) => dispatch(setCategoryStore(item))}
                className={
                  dataCarts.value === item.value ? "bg-blue-gray-50" : ""
                }
              >
                <ListItemPrefix>{item.icon}</ListItemPrefix>
                {item.title}
              </ListItem>
            </List>
          )
        )}
      </Card>
      <div className=" overflow-scroll scrollbar-hide max-h-screen w-full">
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
