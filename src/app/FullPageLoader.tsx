import Image from "next/image";
import React from "react";

function FullPageLoader() {
  return (
    <>
      <section
        id="loading-page"
        className="bg-blue-200 fixed place-items-center grid h-screen w-screen max-w-screen gap-4 top-0 left-0 z-50"
      >
        <div className="bg-blue-500 w-48 h-48  absolute animate-ping rounded-full delay-5s shadow-xl"></div>
        <div className="bg-blue-400 w-32 h-32 absolute animate-ping rounded-full shadow-xl"></div>
        <div className="bg-white w-24 h-24 absolute animate-pulse rounded-full shadow-xl"></div>
        <Image
          src="/logo.png"
          alt=""
          width={60}
          height={60}
          className="absolute"
        />
      </section>
    </>
  );
}

export default FullPageLoader;
