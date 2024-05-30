"use client";
import React from "react";

import FrameInit from "@/components/FrameInit";

import Form from "./Form";

function Login() {
  React.useEffect(() => {
    document.getElementById("loading-page")?.classList.add("hidden");
  }, []);
  return (
    <div>
      <FrameInit />
      <div className="absolute top-0 left-[5%] z-20">
        <div className="flex flex-col items-center justify-center h-screen">
          <Form />
        </div>
      </div>
    </div>
  );
}

export default Login;
