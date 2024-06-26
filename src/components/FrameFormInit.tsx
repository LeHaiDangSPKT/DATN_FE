import Image from "next/image";
import React from "react";
interface FrameFormInitProps {
  children: React.ReactNode;
  title: string;
  fastLogin?: boolean;
}

function FrameFormInit({ children, title, fastLogin }: FrameFormInitProps) {
  return (
    <div
      className={`${
        fastLogin ? "w-[300px] p-0" : "w-[320px] px-10 py-5"
      } sm:w-[580px]  ${
        !fastLogin && "bg-opacity-80 bg-gray-200 rounded-[20px] shadow-2xl"
      } flex flex-col justify-center items-center `}
    >
      <div className="text-3xl font-bold">{title}</div>
      <div className="text-xl mt-2 text-center">
        Trải nghiệm mua sắm và thiện nguyện
      </div>

      {children}
    </div>
  );
}

export default FrameFormInit;
