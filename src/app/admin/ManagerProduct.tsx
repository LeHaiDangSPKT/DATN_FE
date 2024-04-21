"use client";
import SortTable from "@/components/SortTable";
import React from "react";
import {
  APIGetAllProductAdmin,
  APIGetListProductAdmin,
  APIGetProductAdmin,
} from "@/services/Product";
import FormatMoney from "@/utils/FormatMoney";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa6";
import Report from "@/components/Report";
import { exportExcel } from "@/utils/ExportExcel";
import Toast from "@/utils/Toast";
import ConvertDate from "@/utils/ConvertDate";
import Image from "next/image";

interface Product {
  _id: string;
  avatar: string[];
  quantity: number;
  productName: string;
  price: number;
  description: string;
  categoryId: string;
  keywords: string[];
  status: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
  storeId: string;
  categoryName: string;
  storeName: string;
  quantitySold: number;
  quantityGive: number;
  revenue: number;
}

interface ListProduct {
  total: number;
  data: Product[];
}

interface DetailProduct {
  averageStar: number;
  totalFeedback: number;
  totalReaction: number;
}

function ManagerProduct() {
  const arrTitleProduct = [
    {
      title: "STT",
      sort: false,
      name: "index",
    },
    {
      title: "Sản phẩm",
      sort: false,
      name: "name",
    },
    {
      title: "Số lượng còn lại",
      sort: false,
      name: "quantity",
    },
    {
      title: "Số lượng đã bán",
      sort: false,
      name: "quantity_sell",
    },
    {
      title: "Số lượng đã tặng",
      sort: false,
      name: "quantity_give",
    },
    {
      title: "Giá",
      sort: false,
      name: "price",
    },
    {
      title: "Danh mục",
      sort: false,
      name: "category",
    },
    {
      title: "Cửa hàng",
      sort: false,
      name: "store",
    },
    {
      title: "",
      sort: false,
      name: "",
    },
  ];
  const ref = React.useRef<HTMLDivElement | null>(null);
  const [page, setPage] = React.useState<number>(1);
  // "", current, approve
  const [reportState, setReportState] = React.useState("");
  const [search, setSearch] = React.useState<string>("");
  const [isShowDetail, setIsShowDetail] = React.useState<boolean>(false);
  const [detailProduct, setDetailProduct] = React.useState<DetailProduct>(
    {} as DetailProduct
  );
  const [currentProduct, setCurrentProduct] = React.useState<Product>(
    {} as Product
  );
  const [listProduct, setListProduct] = React.useState<ListProduct>(
    {} as ListProduct
  );
  React.useEffect(() => {
    const fetchData = async () => {
      await APIGetListProductAdmin(page || 1, 20, search).then((res) =>
        setListProduct(res?.metadata)
      );
    };
    fetchData();
  }, [page, search]);

  const DetailProduct = async (product: Product) => {
    setCurrentProduct(product);
    setIsShowDetail(true);
    ref.current?.scrollIntoView({ behavior: "smooth" });
    // get api APIGetProductAdmin
    await APIGetProductAdmin(product._id).then((res) => {
      const data = res.metadata;
      setDetailProduct({
        averageStar: data.averageStar || 0,
        totalFeedback: data.totalFeedback || 0,
        totalReaction: data.emojis.total || 0,
      });
    });
  };

  const ExportExcel = async () => {
    Toast("success", "File sẽ được tải về sau 2 giây nữa...", 2000);
    setTimeout(async () => {
      const data = await APIGetAllProductAdmin();
      const dataExcel = data.metadata.data?.map((item: any, index: any) => {
        return {
          STT: index + 1,
          "Tên sản phẩm": item.product.productName,
          "Số lượng còn lại": item.product.quantity,
          "Số lượng đã bán": item.product.quantitySold,
          "Số lượng đã tặng": item.product.quantityGive,
          Giá: FormatMoney(item.product.price),
          "Danh mục": item.product.categoryName,
          "Cửa hàng": item.product.storeName,
          "Đánh giá trung bình (sao)": item.averageStar,
          "Bình luận": item.totalFeedback,
          "Số lượng cảm xúc": item.emojis.total,
          "Ngày đăng bán": ConvertDate(item.product.createdAt),
        };
      });
      exportExcel(dataExcel, "Danh sách sản phẩm", "Danh sách sản phẩm");
    }, 2000);
  };
  return (
    <div className="min-h-screen my-5">
      <div
        className={`${
          !reportState && "flex-row-reverse"
        } justify-between flex items-center mt-5 mb-3 z-10`}
      >
        {reportState == "" && (
          <div
            className="flex items-center cursor-pointer"
            onClick={(e) => {
              setReportState("current");
            }}
          >
            Xem các báo cáo <FaArrowRight className="ml-2" />
          </div>
        )}
        {reportState == "current" && (
          <>
            <div
              className="flex items-center cursor-pointer "
              onClick={(e) => {
                setReportState("");
              }}
            >
              <FaArrowLeft className="mr-2" /> Trở về trang tổng quan
            </div>
            <div
              className="flex items-center cursor-pointer"
              onClick={(e) => {
                setReportState("approve");
              }}
            >
              Xem các báo cáo đã chấp thuận <FaArrowRight className="ml-2" />
            </div>
          </>
        )}
        {reportState == "approve" && (
          <>
            <div
              className="flex items-center cursor-pointer "
              onClick={(e) => {
                setReportState("current");
              }}
            >
              <FaArrowLeft className="mr-2" /> Xem các báo cáo
            </div>
          </>
        )}
      </div>
      {reportState ? (
        <Report
          type="product"
          status={reportState == "current" ? false : true}
        />
      ) : (
        <>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const search = document.getElementById(
                "default-search"
              ) as HTMLInputElement;
              setIsShowDetail(false);
              setSearch(search.value);
              setPage(1);
            }}
            className="mb-5 "
          >
            <div className="">
              <div className="absolute top-[84px] flex items-center ps-3 pointer-events-none">
                <svg
                  className="w-4 h-4 text-gray-500 dark:text-gray-400"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 20 20"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                  />
                </svg>
              </div>
              <input
                type="search"
                id="default-search"
                className="block w-full p-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 outline-none "
                placeholder="Nhập thông tin tìm kiếm theo tên sản phẩm, mô tả, thể loại..."
              ></input>
              <button
                type="submit"
                className="text-white absolute top-[72px] right-[18px] py-2 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
              >
                Tìm kiếm
              </button>
            </div>
          </form>
          {/* Button export excel */}
          <div className="flex justify-end mb-5">
            <button
              className="px-4 py-2 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
              onClick={() => ExportExcel()}
            >
              Xuất file excel
            </button>
          </div>
          <SortTable
            title={arrTitleProduct}
            totalPage={listProduct.total}
            currentPage={page}
            setPage={(data) => setPage(data)}
            perPage={20}
          >
            {listProduct.data?.map((item, index) => (
              <tr
                className="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
                key={index}
              >
                <td className="px-6 py-4 text-center">
                  {(page - 1) * 10 + index + 1}
                </td>
                <td className="px-6 py-4 text-center">{item.productName}</td>
                <td className="px-6 py-4 text-center">{item.quantity}</td>
                <td className="px-6 py-4 text-center">{item.quantitySold}</td>
                <td className="px-6 py-4 text-center">{item.quantityGive}</td>
                <td className="px-6 py-4 text-center">
                  {FormatMoney(item.price)}
                </td>
                <td className="px-6 py-4 text-center">{item.categoryName}</td>
                <td className="px-6 py-4 text-center">{item.storeName}</td>

                <td>
                  <div
                    className="px-6 text-center font-medium text-blue-600 dark:text-blue-500 hover:underline cursor-pointer"
                    onClick={(e) => {
                      DetailProduct(item);
                    }}
                  >
                    Xem chi tiết
                  </div>
                </td>
              </tr>
            ))}
          </SortTable>
          <div ref={ref}></div>
          {isShowDetail && currentProduct && (
            <div className="bg-white rounded-md p-4 my-5">
              <div className="flex justify-end">
                <button
                  type="button"
                  className="flex-shrink-0 flex justify-center items-center h-8 w-8 rounded-lg text-white bg-gray-400 hover:bg-gray-300 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 focus:ring-offset-gray-900 transition-all text-sm dark:focus:ring-gray-700 dark:focus:ring-offset-gray-800"
                  onClick={() => setIsShowDetail(false)}
                >
                  <span className="sr-only">Close</span>
                  <svg
                    className="flex-shrink-0 w-4 h-4 text-center"
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M18 6 6 18" />
                    <path d="m6 6 12 12" />
                  </svg>
                </button>
              </div>
              <div className="text-center text-blue-500 font-bold text-2xl mb-2">
                {currentProduct.productName}
              </div>
              <div className="text-gray-500 italic text-lg text-center">
                (Cửa hàng: {currentProduct.storeName})
              </div>
              <div className="flex justify-center flex-wrap">
                {currentProduct.avatar.map((ava, ind) => (
                  <>
                    <div className="w-1/4 m-2" key={ind}>
                      <Image src={ava} className="w-full" alt="" />
                    </div>
                  </>
                ))}
              </div>
              <div className="text-2xl font-bold text-blue-600 mt-10">
                Mô tả sản phẩm:
              </div>
              <div
                className="text-justify indent-8"
                dangerouslySetInnerHTML={{ __html: currentProduct.description }}
              ></div>
              <div className="text-2xl font-bold text-blue-600 mt-10">
                Thông tin khác
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 pb-5">
                <div className="flex flex-col items-center justify-center p-4 bg-white shadow-md rounded-md cursor-pointer hover:shadow-xl hover:scale-105 transition-all ease-in">
                  <p className=" font-semibold">Số lượng tồn kho</p>
                  <p className="">{currentProduct.quantity}</p>
                </div>
                <div className="flex flex-col items-center justify-center p-4 bg-white shadow-md rounded-md cursor-pointer hover:shadow-xl hover:scale-105 transition-all ease-in">
                  <p className=" font-semibold">Giá bán hiện tại</p>
                  <p className="">{FormatMoney(currentProduct.price)}</p>
                </div>
                <div className="flex flex-col items-center justify-center p-4 bg-white shadow-md rounded-md cursor-pointer hover:shadow-xl hover:scale-105 transition-all ease-in">
                  <p className=" font-semibold">Số lượng đã bán</p>
                  <p className="">{currentProduct.quantitySold}</p>
                </div>
                <div className="flex flex-col items-center justify-center p-4 bg-white shadow-md rounded-md cursor-pointer hover:shadow-xl hover:scale-105 transition-all ease-in">
                  <p className=" font-semibold">Số lượng đã tặng</p>
                  <p className="">{currentProduct.quantityGive}</p>
                </div>

                <div className="flex flex-col items-center justify-center p-4 bg-white shadow-md rounded-md cursor-pointer hover:shadow-xl hover:scale-105 transition-all ease-in">
                  <p className=" font-semibold">Đánh giá trung bình</p>
                  <p className="">{detailProduct.averageStar}</p>
                </div>
                <div className="flex flex-col items-center justify-center p-4 bg-white shadow-md rounded-md cursor-pointer hover:shadow-xl hover:scale-105 transition-all ease-in">
                  <p className=" font-semibold">Bình luận</p>
                  <p className="">{detailProduct.totalFeedback}</p>
                </div>
                <div className="flex flex-col items-center justify-center p-4 bg-white shadow-md rounded-md cursor-pointer hover:shadow-xl hover:scale-105 transition-all ease-in">
                  <p className=" font-semibold">Số lượng cảm xúc</p>
                  <p className="">{detailProduct.totalReaction}</p>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default ManagerProduct;
