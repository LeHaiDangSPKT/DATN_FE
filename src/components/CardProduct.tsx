import React from "react";
import Image from "next/image";
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Typography,
} from "@material-tailwind/react";
import { FaCartPlus } from "react-icons/fa";
import Toast from "@/utils/Toast";
import { AppDispatch, useAppSelector } from "@/redux/store";
import { useDispatch } from "react-redux";
import { addItemtoCartPopup } from "@/redux/features/cart/cartpopup-slice";
import { APIAddProductInCart } from "@/services/Cart";

function CardProduct(props: any) {
  const { data } = props;
  const DetailProduct = () => {
    window.location.href = "/product/" + data._id;
  };

  const [showLogin, setShowLogin] = React.useState(false);
  const [user, setUser] = React.useState(null);
  const dispatch = useDispatch<AppDispatch>();
  React.useEffect(() => {
    const user = localStorage.getItem("user")
      ? JSON.parse(localStorage.getItem("user") ?? "").providerData[0]
      : null;
    setUser(user);
  }, []);
  const carts = useAppSelector((state) => state.cartPopupReducer.items);
  const AddToCart = async (product?: any) => {
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
      Toast("success", "Đã thêm sản phẩm vào giỏ hàng", 2000);
      console.log("product", product);
      dispatch(
        addItemtoCartPopup({
          product: {
            id: product._id,
            name: product.name,
            avatar: product.avatar[0],
            oldPrice: product.oldPrice,
            newPrice: product.newPrice,
            type: product.newPrice == 0 ? "GIVE" : "SELL",
            quantity: 1,
            quantityInStock: product.quantity,
            isChecked: false,
          },
          store: {
            id: product.storeId,
            name: product.storeName,
            isChecked: false,
          },
        })
      );
      await APIAddProductInCart(product._id);
    } else {
      Toast("success", "Sản phẩm đã có trong giỏ hàng", 2000);
    }
  };
  return (
    <Card className="w-[17rem] mx-auto mb-2 cursor-pointer hover:shadow-xl">
      <CardHeader
        shadow={false}
        floated={false}
        className="h-60"
        onClick={(e) => DetailProduct()}
      >
        <img
          src={data.avatar[0]}
          alt=""
          className="h-full w-full object-cover"
        />
      </CardHeader>
      <CardBody>
        <div className="font-semibold text-base text-center line-clamp-2 h-12">
          {data.productName}
        </div>
        <Typography color="blue-gray" className="font-medium text-center">
          {data.price != 0 && Number(data.newPrice).toLocaleString("en-US", {})}{" "}
          <sup>đ</sup>
        </Typography>
        <div
          className="text-sm text-center opacity-75 pt-1 line-clamp-3 leading-[1.2rem] h-16"
          dangerouslySetInnerHTML={{ __html: data.description }}
        ></div>
      </CardBody>
      <CardFooter className="pt-0">
        <Button
          ripple={false}
          fullWidth={true}
          onClick={(e) => {
            if (!user) {
              e.preventDefault();
              Toast("error", "Bạn cần đăng nhập để mua hàng", 2000);
              setTimeout(() => {
                window.location.href = "/login";
              }, 2000);
            } else {
              AddToCart(data);
            }
          }}
          className="flex items-center justify-center bg-blue-gray-900/10 text-blue-gray-900 shadow-none hover:scale-105 hover:shadow-none focus:scale-105 focus:shadow-none active:scale-100"
        >
          <FaCartPlus className="w-[20px] h-[20px] mr-2 hover:fill-[#59595b] " />
          Thêm vào giỏ hàng
        </Button>
      </CardFooter>
    </Card>
  );
}

export default CardProduct;
