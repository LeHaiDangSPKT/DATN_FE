"use client";
import React from "react";
import Sidebar from "../../Sidebar";
import All from "./All";

function page() {
  return (
    <div className="min-h-screen px-[10px] my-2 grid grid-cols-10 gap-4">
      <div className="col-span-2">
        <Sidebar code="promotion_all" />
      </div>
      <div className=" col-span-8 ">
        <All />
      </div>
    </div>
  );
}

export default page;
