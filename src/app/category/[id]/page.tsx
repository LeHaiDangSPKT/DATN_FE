"use client";
import CardProduct from "@/components/CardProduct";
import Category from "@/components/Category";
import Filter from "@/components/Filter";
import FrameMainContent from "@/components/FrameMainContent";
import { APIGetListProductWithCategory } from "@/services/Category";
import { APIGetListProductGive } from "@/services/Product";
import { Pagination } from "@nextui-org/react";
import { useParams } from "next/navigation";
import React from "react";

function CategoryPage() {
  const param = useParams() as any;
  // page?: any,
  // limit?: any,
  // search?: any,
  // priceMin?: any,
  // priceMax?: any,
  // quantityMin?: any,
  // quantityMax?: any,
  // createdAtMin?: any,
  // createdAtMax?: any
  const [page, setPage] = React.useState<any>(1);
  const [query, setQuery] = React.useState<any>({
    priceMin: "",
    priceMax: "",
    quantityMin: "",
    quantityMax: "",
    createdAtMin: "",
    createdAtMax: "",
  });

  const [lstProduct, setLstProduct] = React.useState<any[]>([]); // Update the type of lstProduct to any[]
  const [totalPage, setTotalPage] = React.useState<any>(1);
  const [categoryName, setCategoryName] = React.useState<any>("");
  const [idFree, setIdFree] = React.useState("65d20668b91436a3f359ad43");
  const ref = React.useRef<HTMLElement | null>(null);
  React.useEffect(() => {
    if (param.id === idFree) {
      const fetchData = async () => {
        await APIGetListProductGive(page, 20).then((res: any) => {
          setLstProduct(res?.metadata.data);
          const totalItem = res?.metadata.total;
          setTotalPage(
            (totalItem / 20) % 1 == 0
              ? totalItem / 20
              : Math.ceil(totalItem / 20)
          );
          setCategoryName("Cho tặng miễn phí");
        });
      };
      fetchData();
    } else {
      const fetchData = async () => {
        await APIGetListProductWithCategory(
          page,
          20,
          param.id,
          query.priceMin,
          query.priceMax,
          query.quantityMin,
          query.quantityMax,
          query.createdAtMin,
          query.createdAtMax
        ).then((res: any) => {
          setLstProduct(res?.metadata.data.products);
          const totalItem = res?.metadata.data.total;

          setTotalPage(
            (totalItem / 20) % 1 == 0
              ? totalItem / 20
              : Math.ceil(totalItem / 20)
          );
          setCategoryName(res?.metadata.data.categoryName);
        });
      };
      fetchData();
    }
    if (ref.current) {
      ref.current.scrollIntoView({ behavior: "smooth" });
    }

    // Scroll to "Các sản phẩm liên quan đến"
  }, [page, query, idFree, param.id]);
  return (
    <FrameMainContent>
      <div className="sm:flex sm:mt-2">
        <div className="sm:flex flex-col sm:mr-2 sm:w-[20%]">
          {param.id !== idFree && (
            <div className="bg-white p-2 sm:rounded-xl mb-5">
              <div className="font-bold sm:py-2">Bộ lọc</div>
              <Filter setQuery={setQuery} />
            </div>
          )}
          <div className="bg-white p-2 rounded-xl mb-5 sm:mb-0">
            <div className="font-bold py-2">Danh mục</div>
            <Category />
          </div>
        </div>

        <div
          ref={ref as any}
          className="flex flex-col bg-white p-4 rounded-xl mb-2 w-full"
        >
          <div>
            Các sản phẩm liên quan đến &ldquo;
            <i className="font-bold text-">{categoryName}</i>&ldquo;
          </div>
          <div className="sm:grid grid-cols-4 gap-y-4 mt-5">
            {lstProduct &&
              lstProduct.map((item: any, index: any) => {
                return <CardProduct key={index} data={item} />;
              })}
          </div>
          <div className="flex justify-center mt-4">
            {totalPage > 1 && (
              <Pagination
                onChange={setPage}
                total={totalPage}
                initialPage={1}
                size={"md"}
              />
            )}
          </div>
        </div>
      </div>
    </FrameMainContent>
  );
}

export default CategoryPage;
