import React from "react";
import Image from "next/image";
import bgSignup from "../../public/bgSignup.png";
import logo from "../../public/logo.png";

function FrameInit() {
  return (
    <>
      <Image
        src={bgSignup}
        alt={""}
        className="bg-cover absolute top-0 left-0 w-screen h-screen z-20 object-fill"
      />
      <Image
        src={logo}
        alt=""
        width={300}
        height={300}
        className="absolute top-0 right-5 sm:right-52 z-20"
      />
    </>
  );
}

export default FrameInit;
