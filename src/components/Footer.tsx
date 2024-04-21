"use client";
import { usePathname } from "next/navigation";
import React from "react";
import {
  FaMapMarkerAlt,
  FaEnvelope,
  FaPhoneAlt,
  FaFacebook,
  FaGithub,
  FaLinkedin,
} from "react-icons/fa";

function Footer() {
  const arrPathName = [
    "/login",
    "/sign-up",
    "/forget-password",
    "/admin",
    "/manager",
    "/error",
  ];
  const pathname = usePathname();
  if (!arrPathName.some((path) => pathname.includes(path))) {
    return (
      <footer className="flex justify-between items-center h-[277px] w-full bg-[#A3C0FA] px-[10%] bottom-0">
        <div className="flex flex-col items-start">
          <span className="text-[16px] font-bold">VỀ DTEx</span>
          <span className="text-[16px]">Giới Thiệu Về DTEx</span>
          <span className="text-[16px]">Điều Khoản Về DTEx</span>
          <span className="text-[16px]">Chính Sách Bảo Mật</span>
        </div>

        <div className="flex flex-col items-start">
          <span className="text-[16px] font-bold">THANH TOÁN</span>
          <div className="flex">
            <img
              className="mr-2 w-[56px] h-[56px] rounded-md"
              src="/momo.jpg"
              alt="Loading..."
            />
            <img
              className="mr-2 w-[56px] h-[56px] rounded-md"
              src="/vnpay.png"
              alt="Loading..."
            />
            <img
              className="w-[56px] h-[56px] rounded-md"
              src="/paypal.png"
              alt="Loading..."
            />
          </div>
        </div>

        <div className="flex flex-col items-start">
          <span className="text-[16px] font-bold">TRUNG TÂM PHÁT TRIỂN</span>
          <div className="flex items-center">
            <FaMapMarkerAlt className="mr-2 w-[20px] h-[20px]" />
            <span className="text-[16px]">Thu Duc, HCM City</span>
          </div>
          <div className="flex items-center">
            <FaEnvelope className="mr-2 w-[20px] h-[20px]" />
            <span className="text-[16px]">dtex.helpdesk@gmail.com</span>
          </div>
          <div className="flex items-center">
            <FaPhoneAlt className="mr-2 w-[20px] h-[20px]" />
            <span className="text-[16px]">0987654321</span>
          </div>
        </div>

        <div className="flex flex-col items-center">
          <img className="mb-2 w-[80px]" src="/logo.png" alt="Loading..." />
          <div className="flex flex-col items-start mb-5">
            <span className="text-[16px] font-bold">THEO DÕI CHÚNG TÔI</span>
            <div className="flex items-center">
              <FaFacebook className="mr-2 w-[20px] h-[20px]" />
              <FaGithub className="mr-2 w-[20px] h-[20px]" />
              <FaLinkedin className="mr-2 w-[20px] h-[20px]" />
            </div>
          </div>
        </div>
      </footer>
    );
  }
}

export default Footer;
