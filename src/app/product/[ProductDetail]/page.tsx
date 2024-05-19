"use client";
import { addItemtoCartPopup } from "@/redux/features/cart/cartpopup-slice";
import { AppDispatch, useAppSelector } from "@/redux/store";
import { APIAddProductInCart } from "@/services/Cart";
import { APIGetEvaluation, APIGetEvaluationUser } from "@/services/Evaluation";
import { APIGetProduct } from "@/services/Product";
import { UserInterface } from "@/types/User";
import ConvertToShortFormat from "@/utils/ConvertToShortFormat";
import Toast from "@/utils/Toast";
import Link from "next/link";
import { useParams } from "next/navigation";
import React from "react";
import { FaHeart, FaShareAlt, FaShopify, FaShoppingCart } from "react-icons/fa";
import { useDispatch } from "react-redux";
import {
  FacebookShareButton,
  FacebookIcon,
  FacebookMessengerShareButton,
  FacebookMessengerIcon,
} from "next-share";
import { APIGetFeedbackStar } from "@/services/Feedback";

import Store from "./Store";
import Feedback from "./Feedback";
import Modal from "@/components/Modal";
import Form from "@/app/login/Form";
import Image from "next/image";

import { APIReportUser } from "@/services/Report";
import Promotion from "@/components/Promotion";

function ProductDetail() {
  const [product, setProduct] = React.useState({} as any);
  const [currentImage, setCurrentImage] = React.useState(0);
  const [user, setUser] = React.useState<UserInterface>();
  const [quantityDelivered, setQuantityDelivered] = React.useState(0);
  const [totalFeedback, setTotalFeedback] = React.useState(0);
  const [showLogin, setShowLogin] = React.useState(false);
  const params = useParams();
  const [showReport, setShowReport] = React.useState(false);
  const [contentReport, setContentReport] = React.useState("");
  const [type, setType] = React.useState("");
  const dispatch = useDispatch<AppDispatch>();
  const [evaluation, setEvaluation] = React.useState({
    total: 0,
    isReaction: false,
    isPurchased: false,
  });
  const [star, setStar] = React.useState({} as any);

  React.useEffect(() => {
    const user = localStorage.getItem("user")
      ? JSON.parse(localStorage.getItem("user") ?? "").providerData[0]
      : null;
    setUser(user);
    const fetchData = async () => {
      const pd = await APIGetProduct(params.ProductDetail).then((res) => res);
      setQuantityDelivered(pd.metadata.data.quantityDelivered);
      setProduct({
        ...pd.metadata.data.data,
        storeName: pd.metadata.data.storeName,
      });
    };
    fetchData();
  }, [params.ProductDetail]);

  React.useEffect(() => {
    const fetchData = async () => {
      await APIGetEvaluation(params.ProductDetail).then((res) => {
        // console.log("APIGetEvaluation", res);
        setEvaluation({
          total: res.metadata.data.total,
          isReaction: res.metadata.data.isReaction,
          isPurchased: res.metadata.data.isPurchased,
        });
      });
    };
    fetchData();
  }, [params.ProductDetail]);

  React.useEffect(() => {
    const fetchData = async () => {
      await APIGetFeedbackStar(params.ProductDetail).then((res) => {
        setStar(res?.metadata);
      });
    };
    fetchData();
  }, [params.ProductDetail]);

  const carts = useAppSelector((state) => state.cartPopupReducer.items);
  const AddToCart = async (buyNow?: boolean) => {
    console.log(product);
    let isProductInCart = false;
    carts?.store?.map((data) => {
      if (data.id == product.storeId) {
        data?.product?.map((item) => {
          if (item.id == product._id) {
            isProductInCart = true;
          }
        });
      }
    });

    if (!isProductInCart) {
      if (!buyNow) {
        Toast("success", "Đã thêm sản phẩm vào giỏ hàng", 2000);
      }
      dispatch(
        addItemtoCartPopup({
          product: {
            id: product._id,
            name: product.name,
            avatar: product.avatar[0],
            price: product.newPrice,
            quantity: 1,
            quantityInStock: product.quantity,
            isChecked: false,
          },
          store: {
            id: product.storeId,
            name: product.storeName,
            avatar: product.storeAvatar,
            isChecked: false,
          },
        })
      );
      await APIAddProductInCart(product._id);
      if (buyNow) {
        window.location.href = "/cart";
      }
    } else {
      if (buyNow) {
        window.location.href = "/cart";
      } else {
        Toast("success", "Sản phẩm đã có trong giỏ hàng", 2000);
      }
    }
  };

  const Heart = async () => {
    await APIGetEvaluationUser(params.ProductDetail, {
      name: "Love",
    }).then((res) => {
      if (res) {
        setEvaluation({
          ...evaluation,
          isReaction: !evaluation.isReaction,
          total: evaluation.isReaction
            ? evaluation.total - 1
            : evaluation.total + 1,
        });
      }
    });
  };

  const Report = async () => {
    if (contentReport == "") {
      Toast("warning", "Vui lòng nhập nội dung báo cáo", 2000);
      return;
    }
    await APIReportUser({
      subjectId: type == "PRODUCT" ? params.ProductDetail : product.storeId,
      content: contentReport,
      type: type,
    }).then((res) => {
      setShowReport(false);
      if (res?.status == 200 || res?.status == 201) {
        Toast("success", res.data.message, 2000);
      } else {
        Toast("error", res?.data.message, 2000);
      }
    });
  };

  return (
    <div className="min-h-screen flex flex-col px-[160px] my-4">
      {product._id && (
        <>
          <div className="mb-3 w-full">
            <div className="grid grid-flow-col grid-cols-10 gap-2">
              <div className="bg-white rounded-md p-4 col-span-4 flex flex-col">
                <div className="rounded-md mb-2 border-solid border-[#D2E0FB] border-2">
                  <Image
                    src={product?.avatar[currentImage]}
                    className="w-full h-full object-cover rounded-md"
                    alt=""
                    width={100}
                    height={100}
                  />
                </div>
                <div className="mb-2 flex justify-between">
                  {/* Create a loop 4 times */}
                  {[1, 2, 3, 4].map((item, index) => {
                    return (
                      <div
                        className={`rounded-md mx-1 border-solid border-[#D2E0FB] border-2 cursor-pointer ${
                          currentImage == index && "border-blue-500"
                        }`}
                        onClick={(e) => {
                          if (product.avatar[index]) {
                            setCurrentImage(index);
                          }
                        }}
                        key={index}
                      >
                        <Image
                          src={product.avatar[index]}
                          className="w-full h-full min-w-[100px] object-cover rounded-md"
                          alt=""
                          width={100}
                          height={100}
                        />
                      </div>
                    );
                  })}
                </div>
                <hr className="my-2" />
                <div className="flex justify-around items-center my-2">
                  <div
                    className="flex cursor-pointer"
                    onClick={(e) => {
                      if (!user) {
                        e.preventDefault();
                        Toast(
                          "error",
                          "Bạn cần đăng nhập để yêu thích sản phẩm này",
                          2000
                        );
                        setShowLogin(true);
                      } else {
                        Heart();
                      }
                    }}
                  >
                    <FaHeart
                      className={`${
                        evaluation.isReaction && "text-red-500"
                      } text-lg`}
                    />
                    <span className="text-sm ms-2">
                      ({ConvertToShortFormat(evaluation.total)})
                    </span>
                  </div>
                  <div>
                    <div className="flex cursor-pointer items-center justify-center">
                      <FaShareAlt className="text-blue-500 text-lg" />
                      <span className="text-sm ml-2 mr-2">Chia sẻ</span>
                      <div className="mr-2">
                        <FacebookShareButton
                          url={window.location.href}
                          hashtag={"#DTExchange"}
                        >
                          <FacebookIcon size={32} round />
                        </FacebookShareButton>
                      </div>
                      <div>
                        <FacebookMessengerShareButton
                          url={window.location.href}
                          appId={"285854217141142"}
                        >
                          <FacebookMessengerIcon size={32} round />
                        </FacebookMessengerShareButton>
                      </div>
                    </div>
                  </div>
                  <div
                    className="text-center font-medium text-blue-600 dark:text-blue-500 hover:underline cursor-pointer"
                    onClick={(e) => {
                      if (!user) {
                        e.preventDefault();
                        Toast(
                          "error",
                          "Bạn cần đăng nhập để báo cáo sản phẩm này",
                          2000
                        );
                        setShowLogin(true);
                      } else {
                        setType("PRODUCT");
                        setShowReport(true);
                      }
                    }}
                  >
                    Báo cáo sản phẩm
                  </div>
                </div>
                <hr className="my-2" />

                <div className="mt-2 flex items-center">
                  <button
                    type="button"
                    className="flex justify-center mr-2 text-white items-center w-full bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg py-3  dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
                    onClick={(e) => {
                      if (!user) {
                        e.preventDefault();
                        Toast("error", "Bạn cần đăng nhập để mua hàng", 2000);
                        setShowLogin(true);
                      } else {
                        AddToCart();
                      }
                    }}
                  >
                    <FaShoppingCart className="mr-3" />
                    <span>Thêm vào giỏ hàng</span>
                  </button>
                  <button
                    type="button"
                    className="w-full text-center py-3 font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
                  >
                    <div
                      className="flex justify-center items-center "
                      onClick={(e) => {
                        if (!user) {
                          e.preventDefault();
                          Toast("error", "Bạn cần đăng nhập để mua hàng", 2000);
                          setShowLogin(true);
                        } else {
                          AddToCart(true);
                        }
                      }}
                    >
                      <FaShopify className="mr-3" />
                      <span>Mua ngay</span>
                    </div>
                  </button>
                </div>
              </div>
              <div className="bg-white rounded-md p-4 col-span-6 flex flex-col">
                <div className="text-xl font-bold text-justify">
                  {product.name}
                </div>
                <div className="flex items-center mt-4">
                  <svg
                    className="w-4 h-4 text-yellow-300 mr-1 mb-1"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    viewBox="0 0 22 20"
                  >
                    <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
                  </svg>
                  <p className="ml-1 font-bold text-gray-900 dark:text-white">
                    {star?.averageStar || 0}
                  </p>
                  <span className="w-1 h-1 mx-1.5 bg-gray-500 rounded-full dark:bg-gray-400"></span>
                  <a
                    href="#"
                    className="font-medium text-gray-900 underline hover:no-underline dark:text-white"
                  >
                    {totalFeedback} đánh giá
                  </a>
                  <span className="mx-2">|</span>
                  {product.newPrice > 0 ? (
                    <span className="">Đã bán: {quantityDelivered}</span>
                  ) : (
                    <span className="">Đã tặng: {quantityDelivered}</span>
                  )}
                </div>
                <div className="flex items-center mt-4 text-3xl font-bold">
                  {Number(product.newPrice).toLocaleString("vi-VN", {})}
                  <sup>đ</sup>
                </div>
                <div className="flex flex-col mt-4">
                  <div className="font-bold">Mô tả sản phẩm:</div>
                  <div
                    className="text-justify indent-8"
                    dangerouslySetInnerHTML={{ __html: product.description }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
          <Promotion storeId={product.storeId} />
          <Store
            product={product}
            setType={(data: string) => setType(data)}
            setShowLogin={(data: boolean) => setShowLogin(data)}
            setShowReport={(data: boolean) => setShowReport(data)}
          />
          <div className="mb-3 bg-white rounded-md p-4 w-full">
            <div className="text-lg font-bold mb-2">Đánh giá sản phẩm:</div>
            <div className="flex flex-col items-center justify-center w-full">
              <div className="flex items-center mb-2">
                <svg
                  className="w-4 h-4 text-yellow-300 me-1"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 22 20"
                >
                  <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
                </svg>

                <p className="ms-1 text-sm font-medium text-gray-500 dark:text-gray-400">
                  {star?.averageStar || 0} / 5
                </p>
              </div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                {totalFeedback} lượt đánh giá
              </p>
              <div className="flex items-end mt-4 justify-center w-full">
                <a
                  href="#"
                  className="text-sm font-medium text-blue-600 dark:text-blue-500 hover:underline"
                >
                  5 sao
                </a>
                <div className="w-2/4 h-5 mx-4 bg-gray-200 rounded dark:bg-gray-700">
                  <div
                    className="h-5 bg-yellow-300 rounded"
                    style={{
                      width: `${
                        star?.startPercent?.["5"]
                          ? star?.startPercent?.["5"]
                          : 0
                      }%`,
                    }}
                  ></div>
                </div>
              </div>
              <div className="flex items-end mt-4 justify-center w-full">
                <a
                  href="#"
                  className="text-sm font-medium text-blue-600 dark:text-blue-500 hover:underline"
                >
                  4 sao
                </a>
                <div className="w-2/4 h-5 mx-4 bg-gray-200 rounded dark:bg-gray-700">
                  <div
                    className="h-5 bg-yellow-300 rounded"
                    style={{
                      width: `${
                        star?.startPercent?.["4"]
                          ? star?.startPercent?.["4"]
                          : 0
                      }%`,
                    }}
                  ></div>
                </div>
              </div>
              <div className="flex items-end mt-4 justify-center w-full">
                <a
                  href="#"
                  className="text-sm font-medium text-blue-600 dark:text-blue-500 hover:underline"
                >
                  3 sao
                </a>

                <div className="w-2/4 h-5 mx-4 bg-gray-200 rounded dark:bg-gray-700">
                  <div
                    className="h-5 bg-yellow-300 rounded"
                    style={{
                      width: `${
                        star?.startPercent?.["3"]
                          ? star?.startPercent?.["3"]
                          : 0
                      }%`,
                    }}
                  ></div>
                </div>
              </div>
              <div className="flex items-end mt-4 justify-center w-full">
                <a
                  href="#"
                  className="text-sm font-medium text-blue-600 dark:text-blue-500 hover:underline"
                >
                  2 sao
                </a>

                <div className="w-2/4 h-5 mx-4 bg-gray-200 rounded dark:bg-gray-700">
                  <div
                    className="h-5 bg-yellow-300 rounded"
                    style={{
                      width: `${
                        star?.startPercent?.["2"]
                          ? star?.startPercent?.["2"]
                          : 0
                      }%`,
                    }}
                  ></div>
                </div>
              </div>
              <div className="flex items-end mt-4 justify-center w-full">
                <a
                  href="#"
                  className="text-sm font-medium text-blue-600 dark:text-blue-500 hover:underline"
                >
                  1 sao
                </a>

                <div className="w-2/4 h-5 mx-4 bg-gray-200 rounded dark:bg-gray-700">
                  <div
                    className="h-5 bg-yellow-300 rounded"
                    style={{
                      width: `${
                        star?.startPercent?.["1"]
                          ? star?.startPercent?.["1"]
                          : 0
                      }%`,
                    }}
                  ></div>
                </div>
              </div>
            </div>
            <hr className="my-6 w-full" />

            <Feedback
              isPurchase={evaluation.isPurchased}
              setTotalFeedback={setTotalFeedback}
              setShowLogin={(data: boolean) => setShowLogin(data)}
            />
          </div>
        </>
      )}
      <Modal
        isShow={showLogin}
        setIsShow={(e) => setShowLogin(false)}
        confirm={() => console.log("sss")}
        title={"Đăng nhập để tiếp tục"}
        fastLogin={true}
      >
        <Form fastLogin={true} />
      </Modal>
      <Modal
        isShow={showReport}
        setIsShow={(e) => setShowReport(false)}
        confirm={() => Report()}
        title={`Báo cáo ${type == "product" ? "sản phẩm" : "cửa hàng"}`}
      >
        <div> Nội dung báo cáo:</div>
        <textarea
          className="w-full h-32 border border-gray-300 rounded-md mt-2 p-2 outline-none"
          onChange={(e) => setContentReport(e.target.value)}
        ></textarea>
      </Modal>
    </div>
  );
}

export default ProductDetail;
