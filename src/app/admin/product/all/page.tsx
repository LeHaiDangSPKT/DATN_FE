"use client";
import React from "react";
import Sidebar from "../../Sidebar";
import ManagerProduct from "./ManagerProduct";

function page() {
  return (
    <div className="min-h-screen px-[10px] grid grid-cols-10 gap-4">
      <div className="col-span-2">
        <Sidebar code="product_all" />
      </div>
      <div className=" col-span-8 my-2 ">
        <ManagerProduct />
      </div>
    </div>
  );
}

export default page;
