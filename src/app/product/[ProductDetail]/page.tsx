"use client";
import { addItemtoCartPopup } from "@/redux/features/cart/cartpopup-slice";
import { AppDispatch, useAppSelector } from "@/redux/store";
import { APIAddProductInCart } from "@/services/Cart";
import { APIGetEvaluation, APIGetEvaluationUser } from "@/services/Evaluation";
import { APIGetProduct } from "@/services/Product";
import { UserInterface } from "@/types/User";
import ConvertToShortFormat from "@/utils/ConvertToShortFormat";
import Toast from "@/utils/Toast";
import { useParams, useRouter } from "next/navigation";
import React from "react";
import {
  FaHeart,
  FaLongArrowAltRight,
  FaShareAlt,
  FaShopify,
  FaShoppingCart,
} from "react-icons/fa";
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
import noProductImage from "../../../../public/noProductImage.png";

import { APIReportUser } from "@/services/Report";
import Promotion from "@/components/Promotion";
import {
  Button,
  Dialog,
  DialogBody,
  DialogFooter,
  DialogHeader,
  Textarea,
} from "@material-tailwind/react";

function ProductDetail() {
  const router = useRouter();
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
      ? JSON.parse(localStorage.getItem("user") ?? "")?.providerData[0]
      : null;
    setUser(user);
    const fetchData = async () => {
      const pd = await APIGetProduct(params.ProductDetail).then((res) => res);
      setQuantityDelivered(pd.metadata.data.quantityDelivered);
      setProduct(pd.metadata.data.data);
    };
    fetchData();
  }, [params.ProductDetail]);

  React.useEffect(() => {
    const fetchData = async () => {
      await APIGetEvaluation(params.ProductDetail).then((res) => {
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
        console.log("res", res?.metadata.data.starPercent["4"]);
        setStar(res?.metadata.data);
      });
    };
    fetchData();
  }, [params.ProductDetail]);

  const carts = useAppSelector((state) => state.cartPopupReducer.items);
  const AddToCart = async (buyNow?: boolean) => {
    console.log("AddToCart", product);
    let isProductInCart = false;
    carts?.store?.map((data: any) => {
      if (data.id == product.storeId) {
        data?.product?.map((item: any) => {
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
            oldPrice: product.oldPrice,
            newPrice: product.newPrice,
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
    } else {
      if (!buyNow) {
        Toast("success", "Sản phẩm đã có trong giỏ hàng", 2000);
      }
    }
    if (buyNow) {
      document.getElementById("loading-page")?.classList.remove("hidden");
      router.push("/cart");
    }
  };

  const Heart = async () => {
    setEvaluation({
      ...evaluation,
      isReaction: !evaluation.isReaction,
      total: evaluation.isReaction
        ? evaluation.total - 1
        : evaluation.total + 1,
    });
    const res = await APIGetEvaluationUser(params.ProductDetail, {
      name: "Love",
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
    <div className="min-h-screen flex flex-col px-0 sm:px-[160px] my-0 sm:my-4">
      {product._id && (
        <>
          <div className="mb-3 w-full">
            <div className="block sm:grid grid-flow-col grid-cols-10 gap-2">
              <div className="bg-white rounded-md p-4 col-span-4 flex flex-col">
                <div className="rounded-md mb-2 border-solid border-[#D2E0FB] border-2 ">
                  <Image
                    src={product?.avatar[currentImage]}
                    className=" w-full h-full rounded-md object-cover"
                    alt=""
                    width={1000}
                    height={1000}
                  />
                </div>
                <div className="mb-2 flex justify-between">
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
                          src={product.avatar[index] || noProductImage}
                          className="w-full h-full min-w-[50px] sm:min-w-[100px] object-cover rounded-md"
                          width={100}
                          height={100}
                          alt=""
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
                    <span className="sm:text-base text-sm">
                      Thêm vào giỏ hàng
                    </span>
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
                      <span className="sm:text-base text-sm">Mua ngay</span>
                    </div>
                  </button>
                </div>
              </div>
              <div className="bg-white rounded-md p-4 col-span-6 flex flex-col">
                <div className="text-xl font-bold text-justify">
                  {product.name}
                </div>
                <div className="flex items-center mt-4 text-xl font-bold">
                  <span>Giá bán:</span>
                  <span className="ml-2 line-through text-red-500">
                    {Number(product.oldPrice).toLocaleString("vi-VN", {})}
                    <sup>đ</sup>
                  </span>
                  <FaLongArrowAltRight className="mx-2" />
                  <span className="text-blue-500">
                    {Number(product.newPrice).toLocaleString("vi-VN", {})}
                    <sup>đ</sup>
                  </span>
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
                  <span className="ml-1 font-bold text-gray-900 dark:text-white">
                    {star?.averageStar || 0}
                  </span>
                  <span className="w-1 h-1 mx-1.5 bg-gray-500 rounded-full dark:bg-gray-400"></span>
                  <a
                    href="#feedback"
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
            currentUser={user || ({} as any)}
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

                <span className="ms-1 text-sm font-medium text-gray-500 dark:text-gray-400">
                  {star?.averageStar || 0} / 5
                </span>
              </div>
              <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                {totalFeedback} lượt đánh giá
              </span>
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
                        star?.starPercent["4"] ? star?.starPercent?.["5"] : 0
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
                        star?.starPercent?.["4"] ? star?.starPercent?.["4"] : 0
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
                        star?.starPercent?.["3"] ? star?.starPercent?.["3"] : 0
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
                        star?.starPercent?.["2"] ? star?.starPercent?.["2"] : 0
                      }%`,
                    }}
                  ></div>
                </div>
              </div>
              <div
                id="feedback"
                className="flex items-end mt-4 justify-center w-full"
              >
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
                        star?.starPercent?.["1"] ? star?.starPercent?.["1"] : 0
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
      <Dialog open={showLogin} handler={() => setShowLogin(false)}>
        <DialogHeader>Đăng nhập để tiếp tục</DialogHeader>
        <DialogBody>
          <Form fastLogin={true} />
        </DialogBody>
        <DialogFooter>
          <Button
            variant="text"
            color="red"
            onClick={() => setShowLogin(false)}
            className="mr-1"
          >
            <span>Đóng</span>
          </Button>
        </DialogFooter>
      </Dialog>
      <Dialog open={showReport} handler={() => setShowReport(false)}>
        <DialogHeader>{`Báo cáo ${
          type == "PRODUCT" ? "sản phẩm" : "cửa hàng"
        }`}</DialogHeader>
        <DialogBody>
          <Textarea
            onChange={(e) => setContentReport(e.target.value)}
            rows={4}
            label="Nội dung báo cáo"
          />
        </DialogBody>
        <DialogFooter>
          <Button
            variant="text"
            color="red"
            onClick={() => setShowReport(false)}
            className="mr-1"
          >
            <span>Đóng</span>
          </Button>
          <Button variant="gradient" color="green" onClick={() => Report()}>
            <span>Xác nhận</span>
          </Button>
        </DialogFooter>
      </Dialog>
    </div>
  );
}

export default ProductDetail;
