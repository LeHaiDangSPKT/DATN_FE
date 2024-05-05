"use client";
import React from "react";
import Sidebar from "../../Sidebar";
import ManagerStore from "./ManagerStore";

function page() {
  return (
    <div className="min-h-screen px-[10px] grid grid-cols-10 gap-4">
      <div className="col-span-2">
        <Sidebar code="store_all" />
      </div>
      <div className=" col-span-8 my-2 ">
        <ManagerStore />
      </div>
    </div>
  );
}

export default page;
