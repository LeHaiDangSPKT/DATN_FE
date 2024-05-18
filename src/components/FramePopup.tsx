"use client";
import React from "react";

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
