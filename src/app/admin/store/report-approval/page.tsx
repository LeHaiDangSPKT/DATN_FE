"use client";
import React from "react";
import Sidebar from "../../Sidebar";
import Report from "@/components/Report";

function page() {
  return (
    <div className="min-h-screen px-[10px] grid grid-cols-10 gap-4">
      <div className="col-span-2">
        <Sidebar code="store_report_approval" />
      </div>
      <div className=" col-span-8 my-2 ">
        <Report type="STORE" status={true} />
      </div>
    </div>
  );
}

export default page;
