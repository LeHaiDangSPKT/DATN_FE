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
    <div className="min-h-screen px-[10px] grid grid-cols-10 gap-4">
      <div className="col-span-2">
        <Sidebar code="policy" />
      </div>
      <div className="col-span-8 my-2 ">
        <Policy />
      </div>
    </div>
  );
}

export default page;
