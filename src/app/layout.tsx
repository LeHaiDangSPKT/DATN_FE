import React from "react";
import { Metadata } from "next";
import { AuthContextProvider } from "../app/authContext";
import { Roboto, Lora } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Loading from "@/components/Loading";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import ReduxProvider from "@/redux/provider";
import "react-quill/dist/quill.snow.css";
import ProtectRoute from "./ProtectRoute";

const lora = Roboto({
  weight: ["400", "500", "700"],
  style: ["normal", "italic"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "DTExchange",
  description: "This is a website for DTExchange",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${lora.className} bg-[#EFEFEF]`}>
        <AuthContextProvider>
          <ReduxProvider>
            <ProtectRoute>
              <Header />
              {children}
              <Footer />
            </ProtectRoute>
          </ReduxProvider>
          <ToastContainer />
          <Loading />
        </AuthContextProvider>
      </body>
    </html>
  );
}
