"use client";
import CardProduct from "@/components/CardProduct";
import Category from "@/components/Category";
import FrameMainContent from "@/components/FrameMainContent";
import ListProductRandomHomePage from "@/components/ListProductRandomHomePage";
import Paging from "@/components/Paging";
import { useAppSelector } from "@/redux/store";
import { APIGetListProductForUser } from "@/services/Product";
import React from "react";

function Search() {
  const [lstProduct, setLstProduct] = React.useState<any[]>([]); // Update the type of lstProduct to any[]
  const [page, setPage] = React.useState<any>(1);
  const [search, setSearch] = React.useState<any>("");
  const [totalPage, setTotalPage] = React.useState<any>(1);
  React.useEffect(() => {
    const fetchData = async (searchParam: any) => {
      await APIGetListProductForUser(page || 1, 20, searchParam).then(
        (res: any) => {
          setLstProduct(res?.metadata.data);
          setTotalPage(res?.metadata.total);
        }
      );
    };
    const search = window.location.search;
    const params = new URLSearchParams(search);
    setSearch(params.get("search"));
    fetchData(params.get("search"));
  }, [page]);
  return (
    <FrameMainContent>
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
          <div className="flex flex-col bg-white p-4 rounded-xl mb-2">
            <div className="flex justify-between">
              <div>
                Các sản phẩm liên quan đến &ldquo;
                <i className="font-bold text-">{search}</i>&ldquo;
              </div>
            </div>
            <div className="grid grid-cols-4 gap-y-4 mt-5">
              {lstProduct &&
                lstProduct.map((item: any, index: any) => {
                  return <CardProduct key={index} data={item} />;
                })}
            </div>
            <Paging
              totalPage={totalPage}
              currentPage={page}
              setPage={setPage}
              perPage={20}
            />
          </div>
        </div>
      </div>
      <div className="mt-5">
        <ListProductRandomHomePage showButton={false} />
      </div>
    </FrameMainContent>
  );
}

export default Search;
