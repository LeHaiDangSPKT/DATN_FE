"use client";
import React from "react";
import Sidebar from "../Sidebar";
import Marketing from "./Marketing";

function Page() {
  return (
    <div className="min-h-screen px-[10px] grid grid-cols-10 gap-4">
      <div className="col-span-2">
        <Sidebar code="marketing" />
      </div>
      <div className=" col-span-8 my-2 ">
        <Marketing />
      </div>
    </div>
  );
}

export default Page;
