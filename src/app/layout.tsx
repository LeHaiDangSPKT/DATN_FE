import React from "react";
import { Metadata } from "next";
import { Roboto } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import ReduxProvider from "@/redux/provider";
import "react-quill/dist/quill.snow.css";
import ProtectRoute from "./ProtectRoute";
import { Providers } from "./providers";
import FullPageLoader from "./FullPageLoader";
import Authprovider from "./Authprovider";
import AlertMobile from "@/components/AlertMobile";

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
        <ReduxProvider>
          <Providers>
            <ProtectRoute>
              <Authprovider>
                <Header />
                {children}
                <Footer />
              </Authprovider>
            </ProtectRoute>
          </Providers>
        </ReduxProvider>
        <ToastContainer />
        <FullPageLoader />
      </body>
    </html>
  );
}
