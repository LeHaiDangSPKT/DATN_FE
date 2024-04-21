"use client";
import React from "react";
import Sidebar from "../../Sidebar";
import Report from "@/components/Report";

function page() {
  return (
    <div className="min-h-screen px-[10px] my-2 grid grid-cols-10 gap-4">
      <div className="col-span-2">
        <Sidebar code="store_warning" />
      </div>
      <div className=" col-span-8 ">
        <Report type="STORE" status={false} />
      </div>
    </div>
  );
}

export default page;
