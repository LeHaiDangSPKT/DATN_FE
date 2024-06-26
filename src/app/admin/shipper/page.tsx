import React from "react";
import Sidebar from "../Sidebar";
import Shipper from "./Shipper";

function page() {
  return (
    <div className="min-h-screen px-[10px] grid grid-cols-10 gap-4">
      <div className="col-span-2">
        <Sidebar code="shipper" />
      </div>
      <div className="col-span-8 my-2 ">
        <Shipper state={true} />
      </div>
    </div>
  );
}

export default page;
