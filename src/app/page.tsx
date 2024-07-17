"use client";
import FrameMainContent from "@/components/FrameMainContent";
import Image from "next/image";
import Test1 from "../../public/Test1.jpg";
import Test2 from "../../public/Test2.jpg";
import Test3 from "../../public/Test3.jpg";
import Test4 from "../../public/Test4.jpg";
import Slick from "@/components/Slick";
import Category from "@/components/Category";
import ListProductHomePage from "@/components/ListProductHomePage";
import React from "react";
import {
  APIGetListProducMostInStore,
  APIGetListProductLasted,
} from "@/services/Product";
import ListProductRandomHomePage from "@/components/ListProductRandomHomePage";
import ListProductHot from "@/components/ListProductHot";

export default function Home() {
  const [listProduct, setListProduct] = React.useState([]);
  const [listProductMost, setListProductMost] = React.useState([]);
  React.useEffect(() => {
    document.getElementById("loading-page")?.classList.add("hidden");
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
          <div className="sm:h-80 h-32 w-full">
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
                src={Test1}
                alt={""}
                className="rounded-xl w-full sm:h-80 h-32"
              />
              <Image
                src={Test2}
                alt={""}
                className="rounded-xl w-full sm:h-80 h-32"
              />
              <Image
                src={Test3}
                alt={""}
                className="rounded-xl w-full sm:h-80 h-32"
              />
              <Image
                src={Test4}
                alt={""}
                className="rounded-xl w-full sm:h-80 h-32"
              />
            </Slick>
          </div>
        </div>
        <div className="sm:hidden block w-full mt-2">
          <div className="bg-white p-2 rounded-xl">
            <Category />
          </div>
        </div>
        <div className="flex mt-2 justify-between">
          <div className="flex-col sm:flex hidden w-2/12 mr-2 ">
            <div className="bg-white p-2 rounded-xl">
              <div className="flex flex-col">
                <div className="font-bold py-2">Danh mục</div>
                <div className="flex flex-col">
                  <Category />
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-col w-full sm:w-10/12">
            <ListProductHomePage
              title="Có thể bạn sẽ thích"
              listProduct={listProduct}
            />
            {/* <ListProductHomePage
              title="Các sản phảm nổi bật"
              listHighLight={listProductMost}
            /> */}
            <ListProductHot />
            <ListProductRandomHomePage />
          </div>
        </div>
      </FrameMainContent>
    </main>
  );
}
