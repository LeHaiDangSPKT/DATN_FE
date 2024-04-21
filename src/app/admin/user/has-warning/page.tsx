"use client";
import React from "react";
import Sidebar from "../../Sidebar";
import ManagerUser from "./ManagerUser";

function page() {
  return (
    <div className="min-h-screen px-[10px] my-2 grid grid-cols-10 gap-4">
      <div className="col-span-2">
        <Sidebar code="user_has_warning" />
      </div>
      <div className=" col-span-8 ">
        <ManagerUser />
      </div>
    </div>
  );
}

export default page;
