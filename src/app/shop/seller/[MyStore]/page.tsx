"use client";
import React from "react";
import { CATEGORYSTORE } from "@/constants/CategoryStore";
import { setCategoryStore } from "@/redux/features/categoryStore/categoryStore-slice";
import { AppDispatch, useAppSelector } from "@/redux/store";
import { useDispatch } from "react-redux";
import {
  Card,
  Drawer,
  List,
  ListItem,
  ListItemPrefix,
} from "@material-tailwind/react";
import { FaAlignJustify } from "react-icons/fa";

function MyStore() {
  const dispatch = useDispatch<AppDispatch>();
  const dataCarts = useAppSelector((state) => state.categoryStoreReducer.items);
  const [open, setOpen] = React.useState(true);
  React.useEffect(() => {
    document.getElementById("loading-page")?.classList.add("hidden");
  }, []);
  return (
    <div className="min-h-screen sm:px-[150px] sm:my-4 flex">
      <Card className="hidden sm:block mr-4">
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
      <div
        className="sm:hidden block fixed text-white m-2 p-2 rounded-md bg-current"
        onClick={() => setOpen(true)}
      >
        <FaAlignJustify />
      </div>
      <Drawer open={open} onClose={() => setOpen(false)}>
        {CATEGORYSTORE.map(
          (item: { value: string; title: string; icon: any }, index) => (
            <List key={index} className="">
              <ListItem
                onClick={(e) => {
                  dispatch(setCategoryStore(item));
                  setOpen(false);
                }}
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
      </Drawer>
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
