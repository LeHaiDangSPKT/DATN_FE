import CardProduct from "@/components/CardProduct";
import { APIGetListProductOtherInStore } from "@/services/Product";
import {
  APIFollowStore,
  APIGetStoreById,
  APIGetStoreReputation,
} from "@/services/Store";
import Toast from "@/utils/Toast";
import { useParams } from "next/navigation";
import Image from "next/image";
import React from "react";
import { FaPlus, FaTelegramPlane } from "react-icons/fa";
interface Props {
  product: any;
  setShowLogin: (data: boolean) => void;
  setShowReport: (data: boolean) => void;
  setType: (data: string) => void;
}

function Store(props: Props) {
  const { product, setShowLogin, setShowReport, setType } = props;
  const params = useParams();
  const [productsOrderCurrent, setProductsOrderCurrent] = React.useState([]);
  const [user, setUser] = React.useState<any>(null);
  const [storeInfo, setStoreInfo] = React.useState({
    id: "",
    avatar: "",
    averageStar: 0,
    isFollow: false,
    totalFeedback: 0,
    totalFollow: 0,
    name: "",
  });
  React.useEffect(() => {
    // Promise all
    const user = localStorage.getItem("user")
      ? JSON.parse(localStorage.getItem("user") ?? "").providerData[0]
      : null;
    setUser(user);
    const fectData = async () => {
      product.storeId &&
        (await Promise.all([
          APIGetStoreReputation(product.storeId, user?._id || ""),
          APIGetStoreById(product.storeId),
        ]).then((res: any) => {
          setStoreInfo({
            id: res[1].metadata.data.store._id,
            avatar: res[1].metadata.data.store.avatar,
            name: res[1].metadata.data.store.name,
            isFollow: res[0].metadata.data.isFollow,
            averageStar: res[0].metadata.data.averageStar,
            totalFeedback: res[0].metadata.data.totalFeedback,
            totalFollow: res[0].metadata.data.totalFollow,
          });
        }));
    };
    fectData();
  }, [product.storeId]);
  React.useEffect(() => {
    const fetchData = async () => {
      await APIGetListProductOtherInStore(
        product.storeId,
        params.ProductDetail
      ).then((res) => {
        setProductsOrderCurrent(res?.metadata.data);
      });
    };
    fetchData();
  }, [product.storeId, params.ProductDetail]);
  const FollowStore = async (status: boolean) => {
    setStoreInfo({
      ...storeInfo,
      isFollow: status,
      totalFollow: status
        ? storeInfo.totalFollow + 1
        : storeInfo.totalFollow - 1,
    });
    await APIFollowStore(product.storeId);
  };
  return (
    <div className="mb-3 bg-white rounded-md p-4 w-full col-span-4 flex flex-col border-solid ">
      <p className="text-lg font-bold mb-2">Thông tin người bán:</p>
      <div className="mb-2 flex items-center justify-between border-[#D2E0FB] border-2 p-2 rounded-md">
        <div className="flex items-center">
          <Image
            src={storeInfo.avatar!}
            width={50}
            height={50}
            className="rounded-full mr-2"
            alt=""
          />
          <div className="flex flex-col">
            <div
              className="font-bold cursor-pointer"
              onClick={(e) => (window.location.href = `/shop/${storeInfo.id}`)}
            >
              {storeInfo.name}
            </div>
            <div className="flex items-center justify-center">
              <svg
                className="w-4 h-4 text-yellow-300 mr-1 mb-1"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 0 22 20"
              >
                <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
              </svg>
              <p className="ml-1  text-gray-900 dark:text-white">
                {storeInfo.averageStar || 0}
              </p>
              <span className="w-1 h-1 mx-1.5 bg-gray-500 rounded-full dark:bg-gray-400"></span>
              <div className=" text-gray-900 dark:text-white">
                {storeInfo.totalFeedback} đánh giá
              </div>
              <span className="mx-2">|</span>
              <span className="">Theo dõi: {storeInfo.totalFollow}</span>
              <div
                className="ml-3 text-center font-medium text-blue-600 dark:text-blue-500 hover:underline cursor-pointer"
                onClick={(e) => {
                  if (!user) {
                    e.preventDefault();
                    Toast(
                      "error",
                      "Bạn cần đăng nhập để báo cáo cửa hàng này",
                      2000
                    );
                    setShowLogin(true);
                  } else {
                    setType("STORE");
                    setShowReport(true);
                  }
                }}
              >
                (Báo cáo cửa hàng)
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col">
          <button
            type="button"
            className="flex justify-center text-white mb-2 items-center w-full bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-1.5  dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
          >
            <FaTelegramPlane className="mr-3" />
            <span>Chat</span>
          </button>
          <button
            type="button"
            className={`${
              storeInfo.isFollow
                ? "text-white bg-blue-700 hover:bg-blue-800"
                : "bg-white"
            } flex justify-center items-center w-full py-1.5 px-5 text-sm font-medium text-gray-900 focus:outline-none  rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 `}
            onClick={(e) => {
              if (user) {
                if (!storeInfo.isFollow) {
                  FollowStore(true);
                } else {
                  FollowStore(false);
                }
              } else {
                setShowLogin(true);
              }
            }}
          >
            {!storeInfo.isFollow && <FaPlus className="mr-3" />}
            <span>{storeInfo.isFollow ? "Đã theo dõi" : "Theo dõi"}</span>
          </button>
        </div>
      </div>
      <p className="text-lg font-bold mb-2">Các sản phẩm khác của cửa hàng:</p>
      <div className="grid grid-cols-4 gap-4">
        {productsOrderCurrent.map((item: any, index: number) => (
          <CardProduct key={index} data={item} />
        ))}
      </div>
    </div>
  );
}

export default Store;
