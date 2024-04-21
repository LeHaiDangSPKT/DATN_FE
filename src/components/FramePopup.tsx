"use client";
import { APIGetAllNotification } from "@/services/Notification";
import React, { useState, useEffect } from "react";
import Notification from "./Notification";
import LoadingPopup from "./LoadingPopup";
import { APIGetAllCartPaging } from "@/services/Cart";

function FramePopup({ children }: { children: any }) {
  return (
    <div
      id="frame-popup"
      className={`flex flex-col absolute right-[25%] top-16 rounded-lg p-2 bg-[#D2E0FB] overflow-y-scroll scrollbar-hide min-h-[150%] max-h-[600%]`}
    >
      {children}
    </div>
  );
}

export default FramePopup;
