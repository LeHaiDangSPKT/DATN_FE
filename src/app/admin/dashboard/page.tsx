"use client";
import React from "react";
import Sidebar from "../Sidebar";
import Home from "./Home";

function page() {
  return (
    <div className="min-h-screen px-[10px] grid grid-cols-10 gap-4">
      <div className="col-span-2">
        <Sidebar code="dashboard" />
      </div>
      <div className=" col-span-8 my-2 ">
        <Home />
      </div>
    </div>
  );
}

export default page;
