import {
  Tab,
  TabPanel,
  Tabs,
  TabsBody,
  TabsHeader,
} from "@material-tailwind/react";
import React from "react";
import Sidebar from "../Sidebar";
import Policy from "./Policy";

function page() {
  return (
    <div className="min-h-screen px-[10px] my-2 grid grid-cols-10 gap-4">
      <div className="col-span-2">
        <Sidebar code="policy" />
      </div>
      <div className="col-span-8 ">
        <Policy />
      </div>
    </div>
  );
}

export default page;
