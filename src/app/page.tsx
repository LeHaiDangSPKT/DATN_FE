"use client";
import FrameMainContent from "@/components/FrameMainContent";
import Image from "next/image";
import Test from "../../public/Test.jpg";
import Slick from "@/components/Slick";
import Category from "@/components/Category";
import ListProductHomePage from "@/components/ListProductHomePage";
import React from "react";
import {
  APIGetListProducMostInStore,
  APIGetListProductLasted,
} from "@/services/Product";
import ListProductRandomHomePage from "@/components/ListProductRandomHomePage";

export default function Home() {
  const [listProduct, setListProduct] = React.useState([]);
  const [listProductMost, setListProductMost] = React.useState([]);
  React.useEffect(() => {
    const fetchData = async () => {
      const lst = await APIGetListProductLasted().then((res) => res);
      const lst1 = await APIGetListProducMostInStore().then((res) => res);
      setListProduct(lst.metadata.data);
      setListProductMost(lst1.metadata.data);
    };
    fetchData();
  }, []);
  return (
    <main>
      <FrameMainContent>
        <div className="bg-white p-2 rounded-xl">
          <div className="grid gap-2 grid-cols-4 grid-rows-2 grid-flow-col">
            <div className="col-span-3 row-span-2">
              <Slick
                config={{
                  dots: true,
                  infinite: true,
                  slidesToShow: 1,
                  slidesToScroll: 1,
                  autoplay: true,
                  dotsClass: "custom-dots-container",
                  customPaging: function (i: any) {
                    return (
                      <div className="w-2 h-2 rounded-full bg-slate-900 hover:bg-slate-300 transition-all ease-linear delay-75 mx-[2px]"></div>
                    );
                  },
                }}
              >
                <Image
                  src={Test}
                  alt={""}
                  className="rounded-xl w-[-webkit-fill-available]"
                />
                <Image
                  src={Test}
                  alt={""}
                  className="rounded-xl w-[-webkit-fill-available]"
                />
              </Slick>
              {/* <div className="custom-dots-container flex justify-between items-center"></div> */}
            </div>
            <Image
              src={Test}
              alt={""}
              className="rounded-xl h-[-webkit-fill-available] col-span-1 row-span-1"
            />
            <Image
              src={Test}
              alt={""}
              className="rounded-xl h-[-webkit-fill-available] col-span-1 row-span-1"
            />
          </div>
        </div>
        <div className="flex mt-2 justify-between">
          <div className="flex flex-col w-2/12 mr-2 ">
            <div className="bg-white p-2 rounded-xl">
              <div className="flex flex-col">
                <div className="font-bold py-2">Danh mục</div>
                <div className="flex flex-col">
                  <Category />
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-col w-10/12">
            <ListProductHomePage
              title="Có thể bạn sẽ thích"
              listProduct={listProduct}
            />
            <ListProductHomePage
              title="Cửa hàng nổi bật"
              listHighLight={listProductMost}
            />
            <ListProductRandomHomePage />
          </div>
        </div>
      </FrameMainContent>
    </main>
  );
}
