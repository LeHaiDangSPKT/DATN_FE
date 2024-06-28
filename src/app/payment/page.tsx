"use client";
import DialogVoucher from "@/components/DialogVoucher";
import CustomInput from "@/components/Input";
import Modal from "@/components/Modal";
import ModalRequired from "@/components/ModalRequired";
import { useAppSelector } from "@/redux/store";
import { APICreateBill } from "@/services/Bill";
import { APIGetUserById, APIUpdateUser } from "@/services/User";
import CheckValidInput from "@/utils/CheckValidInput";
import FormatMoney from "@/utils/FormatMoney";
import Image from "next/image";
import Toast from "@/utils/Toast";
import {
  Button,
  Checkbox,
  Dialog,
  DialogBody,
  DialogFooter,
  DialogHeader,
  Input,
} from "@material-tailwind/react";
import React from "react";
import { FaCartPlus, FaTruckFast, FaTruckField } from "react-icons/fa6";
import { useRouter } from "next/navigation";
function Payment() {
  const router = useRouter();
  const [isShow, setIsShow] = React.useState(false);
  const [isUpdate_Add, setIsUpdate_Add] = React.useState({
    state: false,
    add: false,
    edit: false,
  });
  const [showModalRequied, setShowModalRequied] = React.useState(false);
  const [isGift, setIsGift] = React.useState(false);
  const [indexAddressPicked, setIndexAddressPicked] = React.useState(0);
  const [coin, setCoin] = React.useState(0);
  const [isDetail, setIsDetail] = React.useState(false);
  const [data, setData] = React.useState([] as any[]);
  const [user, setUser] = React.useState({} as any);
  const [addressPopup, setAddressPopup] = React.useState({
    receiverName: "",
    receiverPhone: "",
    address: "",
  });
  const [deliveryMethod, setDeliveryMethod] = React.useState([
    {
      name: "Giao hàng nhanh",
      value: "Express",
      icon: <FaTruckFast className="w-8 h-8 mr-2" />,
      checked: true,
      price: 30000,
    },
    {
      name: "Giao hàng tiết kiệm",
      value: "Economical",
      icon: <FaTruckField className="w-8 h-8 mr-2" />,
      checked: false,
      price: 15000,
    },
  ]);
  const [paymentMethod, setPaymentMethod] = React.useState([
    {
      name: "Thanh toán tiền mặt khi nhận hàng",
      value: "CASH",
      icon: (
        <Image
          src="https://salt.tikicdn.com/ts/upload/92/b2/78/1b3b9cda5208b323eb9ec56b84c7eb87.png"
          className="w-8 h-8 mr-2"
          alt=""
          width={20}
          height={20}
        />
      ),
      checked: true,
    },
    {
      name: "Thanh toán bằng paypal",
      value: "PAYPAL",
      icon: (
        <Image
          src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAADpklEQVR4Ae2XA7D0VhSAv3uD9TNq27Zt27Ztux1PbQ1qd9RhbVvP9nqTe4pUedrU+r+ZZXC+HARKRPg7mSOgiYQhOgakDHi/PQMiwi677MLXX38NCLRstC8Nq56CqVQRVjn8fCeFntcY+/Apsp99AhqUBuD+++9nmWWW4ZfYwLQCb7/9NoEAsOC6x5PsWgVToSpKgUrtiax8KYOl6xh85gIIyGazANUFAOLxOAA46SSZpnmwNYhNdJwEC251PjE9TtdT1wForX9DDzj13wZPzoUYfh0CfgEa1jgTu7b+tzdhrGkRtOOAMDXVevYXAnayCbducWbAphrx5qVAEUZBOQd+hRkIBCwH7CSU8jkAUL8hA27j0iDh4OKjCsOo4uhMr2D5RB+qPAS7nbQfbkJjKtEzAAJBCZbEmFB8fA9EQFXx9zzIxIWdjzmLVKyM710YOQNBUDuOW7swGEIGxqN6UwYCssTigleENXY4nvmWaowugAGdmRs7NXdYAJRfoSq+DzUZYZUVFZUy2G49qdoFowuIAbdpYbQbQ4QQpgIoZs1exUM231hoblL4PiAgmF+XgXjrkqCmihkP1AyBSyWQb9l2C8Naq2vKZUBBpTxOMdtN9CbUEGuePAFB8EIh+PylhdaQTAiLLyay/lqw6CJBcBGwXej69F36cv3MWx9BQAQsF2KNS4UmAAGNsOaqQioJRkArI4mEor5W0doCTY0aRZAJCHAT8Pqz97LxDkTMgAEr5eLULRJqwLIHyyzsy26b2/gGEAANBNKeD55HqGfiSej5/G2eu/Nezt0zooAYcNKteMl5QMKZaWkQPA9KZWZFW5BIw3DPF9xw9F7kxwpYDtEz4DYuTCmWCB2NVlCXCUQmn3ZjSVAqeInwbcBBXnr0QR666hK6P+8FAImcgWACsgoQgODDsQ11aYUx4eBeaYTXn76NYm6cwY5xRvs/5bPX3qT3y37CRBRQCuItS0+SCro8nVSYSTV+4Zn7uPHYM/64e0LlQqx5WcQAKngZgUwK4jEVKoGyoO399wD+QAFLYSVaQIOygpdoqE2DY+uQgPGg54tP+Y3YzHQiaLt/d9q+nAulBIK/WPm4g7Dcw6Dyc/2LuQJ9bV//wQIg2bbPyX/7+iXNTUdhACHAsmB0aIChzp4/XADtEEZBTfMCGB8UAbYDnR+/QDFb/sOfjD7++GOKxWJ4Mprmn59kTSNifj7ZDHV9xsRwjggsscQSJJPJOc+G/yyBbwD59pkN5OE4OwAAAABJRU5ErkJggg=="
          className="w-8 h-8 mr-2"
          alt=""
          width={20}
          height={20}
        />
      ),
      checked: false,
    },
    // {
    //   name: "Thanh toán bằng ví MoMo",
    //   value: "MoMo",
    //   icon: (
    //     <img
    //       src="https://salt.tikicdn.com/ts/upload/ce/f6/e8/ea880ef285856f744e3ffb5d282d4b2d.jpg"
    //       alt=""
    //       className="w-8 h-8 mr-2 "
    //     />
    //   ),
    //   checked: false,
    // },
    {
      name: "Thanh toán bằng VNPAY",
      value: "VNPAY",
      icon: (
        <Image
          src="https://salt.tikicdn.com/ts/upload/77/6a/df/a35cb9c62b9215dbc6d334a77cda4327.png"
          className="w-8 h-8 mr-2"
          alt=""
          width={20}
          height={20}
        />
      ),
      checked: false,
    },
  ]);
  const [receiverInfo, setReceiverInfo] = React.useState({
    receiverName: "",
    receiverPhone: "",
    address: "",
  });
  const [giveInfo, setGiveInfo] = React.useState({
    senderName: "",
    wish: "",
  });
  const [storeIds, setStoreIds] = React.useState([] as any[]);
  const [open, setOpen] = React.useState(false);
  const [useCoin, setUseCoin] = React.useState(false);
  const [voucher, setVoucher] = React.useState({
    base: 0,
    amount: 0,
    id: "",
  });
  const [totalPrice, setTotalPrice] = React.useState({
    general: 0,
    afterDisscount: 0,
  });
  const store = useAppSelector((state) => state?.cartPopupReducer.items);
  React.useEffect(() => {
    setTotalPrice({
      general: data?.reduce((total, item) => total + item.totalPrice, 0),
      afterDisscount:
        data?.reduce((total, item) => total + item.totalPrice, 0) +
        deliveryMethod?.reduce(
          (total, item) => (item.checked ? total + item.price : total),
          0
        ) *
          data?.length -
        coin * 1 -
        voucher.amount,
    });
  }, [data, coin, deliveryMethod, voucher.amount]);
  React.useEffect(() => {
    let listProducts = [] as any[];
    let listStoreIds = [] as any[];

    const listProductIdChecked = JSON.parse(
      localStorage.getItem("listProductIdChecked") || "[]"
    );

    listProductIdChecked.map((item: any) => {
      store?.store?.map((store: any) => {
        var obj = {
          storeId: store.id,
          storeName: store.name,
          products: [] as any[],
          totalPrice: 0,
        };
        store.product?.map((product: any) => {
          if (product.id === item.id) {
            obj.products.push({
              ...product,
              quantity: item.quantity,
              notes: "",
            });
            obj.totalPrice += product.newPrice * item.quantity;
          }
        });

        obj.products.length > 0 && listProducts.push(obj);
        obj.products.length > 0 && listStoreIds.push(store.id);
      });
    });
    setStoreIds(listStoreIds);
    setData(listProducts);
  }, [store]);
  React.useEffect(() => {
    document.getElementById("loading-page")?.classList.add("hidden");
    const fetchData = async () => {
      const res = await APIGetUserById(
        JSON.parse(localStorage.getItem("user")!).providerData[0]._id
      );
      if (res?.metadata.data) {
        const user = res.metadata.data;
        const address = user.address?.filter((item: any) => item.default);
        if (address.length > 0) {
          setReceiverInfo({
            receiverName: address[0].receiverName || "Không xác định",
            receiverPhone: address[0].receiverPhone || "Không xác định",
            address: address[0].address || "Không xác định",
          });
        }
        if (!user.address?.length) {
          setShowModalRequied(true);
        }
        console.log("user", user);
        setUser(user);
      } else {
        document.getElementById("loading-page")?.classList.remove("hidden");
        router.push("/login");
      }
    };
    fetchData();
  }, []);

  const ConfirmChangeAddress = async () => {
    user.address.map((item: any) => {
      if (item.default) {
        item.default = false;
      }
    });
    user.address[indexAddressPicked].default = true;
    await APIUpdateUser(user._id, {
      address: user.address,
    });
    setReceiverInfo({
      receiverName: user.address[indexAddressPicked].receiverName || "",
      receiverPhone: user.address[indexAddressPicked].receiverPhone || "",
      address: user.address[indexAddressPicked].address || "",
    });
    setIsShow(false);
  };

  const ChangeAddress = async () => {
    if (
      addressPopup.receiverName === "" ||
      addressPopup.receiverPhone === "" ||
      addressPopup.address === ""
    ) {
      Toast("error", "Vui lòng nhập đầy đủ thông tin", 2000);
      return;
    }

    if (CheckValidInput({ phone: addressPopup.receiverPhone }) !== "") {
      Toast("error", "Số điện thoại không hợp lệ", 2000);
      return;
    }
    if (isUpdate_Add.add) {
      // Tìm địa chỉ mặc định và set default = false
      user.address.map((item: any) => {
        if (item.default) {
          item.default = false;
        }
      });
      // Thêm địa chỉ mới vào user trong đầu mảng address
      user.address.unshift({
        receiverName: addressPopup.receiverName,
        receiverPhone: addressPopup.receiverPhone,
        address: addressPopup.address,
        default: true,
      });
      setIndexAddressPicked(0);
      Toast("success", "Thêm địa chỉ thành công", 2000);
    } else {
      // Edit address to user in localStorage and set default and setUser
      const defaultValue = user.address[indexAddressPicked]?.default;
      user.address[indexAddressPicked] = {
        receiverName: addressPopup.receiverName,
        receiverPhone: addressPopup.receiverPhone,
        address: addressPopup.address,
        default: defaultValue || true,
      };
      if (showModalRequied) {
        setReceiverInfo({
          receiverName: addressPopup.receiverName,
          receiverPhone: addressPopup.receiverPhone,
          address: addressPopup.address,
        });
      }
      setShowModalRequied(false);

      Toast("success", "Sửa địa chỉ thành công", 2000);
    }
    // setUser(userLocal.providerData[0]);
    setIsUpdate_Add({ state: false, add: false, edit: false });

    await APIUpdateUser(user._id, {
      address: user.address,
    });
  };

  const HandleOrder = async () => {
    if (isGift) {
      if (
        giveInfo.senderName === "" ||
        giveInfo.wish === "" ||
        receiverInfo.receiverName === ""
      ) {
        Toast("error", "Vui lòng nhập đầy đủ thông tin", 2000);
        return;
      }
    }
    CraeteBill();
  };

  const CraeteBill = async () => {
    const listProducts = [] as any[];
    data?.map((item) => {
      const obj = {
        storeId: item.storeId,
        products: [] as any[],
        notes: item.notes || "",
        deliveryFee: deliveryMethod.find((item) => item.checked)?.price,
        totalPrice: item.totalPrice,
      };
      item.products.map((product: any) => {
        obj.products.push({
          name: product.name,
          oldPrice: product.oldPrice,
          newPrice: product.newPrice,
          id: product.id,
          avatar: product.avatar,
          quantity: product.quantity,
          type: product.newPrice === 0 ? "GIVE" : "SELL",
        });
      });
      // Tìm xem nếu cửa hàng đã tồn tại thì push vào listProducts
      const index = listProducts.findIndex(
        (item) => item.storeId === obj.storeId
      );
      if (index !== -1) {
        listProducts[index].listProducts.push(...obj.products);
        listProducts[index].totalPrice += obj.totalPrice;
      } else {
        listProducts.push(obj);
      }
    });
    const obj = {
      data: listProducts,
      deliveryMethod: deliveryMethod.find((item) => item.checked)?.value,
      paymentMethod: paymentMethod.find((item) => item.checked)?.value,
      receiverInfo: {
        fullName: receiverInfo.receiverName,
        phoneNumber: receiverInfo.receiverPhone,
        address: receiverInfo.address,
      },
      giveInfo: isGift
        ? {
            senderName: giveInfo.senderName,
            wish: giveInfo.wish,
          }
        : {},
      coins: coin,
      promotionId: voucher.id,
      totalPayment: totalPrice.afterDisscount,
    };
    console.log(obj);
    const res = await APICreateBill(obj);
    if (res?.status == 200 || res?.status == 201) {
      if (res?.data.metadata.data.urlPayment) {
        router.push(res.data.metadata.data.urlPayment);
        localStorage.removeItem("listProductIdChecked");
      }
    } else {
      Toast("error", "Đặt hàng thất bại", 2000);
    }
  };

  const AddVoucher = (selectedVoucher: any) => {
    setOpen(false);
    console.log("selectedVoucher", selectedVoucher);
    if (Object.keys(selectedVoucher).length !== 0) {
      const amount = Math.floor(
        (selectedVoucher.value / 100) * totalPrice.general >
          selectedVoucher.maxDiscountValue
          ? selectedVoucher.maxDiscountValue
          : (selectedVoucher.value / 100) * totalPrice.general
      );
      console.log("amount", amount);
      setVoucher({
        base: amount,
        amount: amount,
        id: selectedVoucher.id,
      });

      if (totalPrice.general - coin - amount < 0) {
        setTotalPrice({
          ...totalPrice,
          afterDisscount:
            deliveryMethod.find((item) => item.checked)?.price! * data.length,
        });
        setCoin(totalPrice.general - amount);
        return;
      }
    } else {
      setTotalPrice({
        ...totalPrice,
        afterDisscount:
          totalPrice.general -
          coin +
          deliveryMethod.find((item) => item.checked)?.price! * data.length,
      });
      setVoucher({
        base: 0,
        amount: 0,
        id: "",
      });
    }
  };

  return (
    <div className="min-h-screen sm:flex sm:px-[160px] sm:my-4">
      <div className="sm:w-[70%] sm:mr-4 rounded-sm">
        {data?.map((item, index) => (
          <div key={index} className="bg-white rounded-md p-4 mb-5">
            {/* List store */}
            <div className="text-lg font-bold">{item.storeName}</div>
            <div className="">
              {/* List product */}
              {item.products?.map((product: any, index: number) => (
                <div
                  key={index}
                  className="flex justify-between mt-2 pr-2 items-center outline-1 outline-double outline-gray-300 rounded-sm "
                >
                  <div className="flex items-center">
                    <div className="w-[100px] h-[100px]">
                      <Image
                        src={product.avatar}
                        className="w-full h-full"
                        alt="Loading..."
                        width={100}
                        height={100}
                      />
                    </div>
                    <div className="ml-4">
                      <div className="max-w-[80%] text-ellipsis line-clamp-1 text-">
                        {product.name}
                      </div>
                      <div className="text-sm font-bold">
                        {FormatMoney(product.newPrice)}
                      </div>
                    </div>
                  </div>
                  <div className="text-sm text-right min-w-[5%]">
                    x {product.quantity}
                  </div>
                </div>
              ))}
            </div>
            <CustomInput label="Lưu ý cho người bán">
              <textarea
                cols={30}
                rows={1}
                className="w-full outline-none border-solid border-2 border-gray-300 rounded-md p-2"
                value={item.notes}
                onChange={(e) => {
                  let newData = [...data];
                  newData[index].notes = e.target.value;
                  setData(newData);
                }}
              ></textarea>
            </CustomInput>
            <div className="mt-2 font-bold text-right">
              Tổng tiền: {FormatMoney(item.totalPrice)}
            </div>
          </div>
        ))}
      </div>
      <div className="sm:w-[30%] rounded-sm flex flex-col">
        <div className="bg-white rounded-md p-4 mb-4">
          <div className="text-lg font-bold mb-3">
            Chọn phương thức giao hàng
          </div>
          {deliveryMethod.map((item, index) => (
            <div key={index} className="flex items-center mb-3">
              <input
                type="radio"
                checked={item.checked}
                className="w-5 h-5 mr-2 border-2 border-slate-400 rounded-full"
                onChange={(e) => {
                  let newData = [...deliveryMethod];
                  newData.map((item) => {
                    item.checked = false;
                  });
                  newData[index].checked = true;
                  setDeliveryMethod(newData);
                }}
              />
              {item.icon}
              <div>{item.name}</div>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-md p-4 mb-4">
          <div className="text-lg font-bold mb-3">
            Chọn phương thức thanh toán
          </div>
          {paymentMethod.map((item, index) => (
            <div
              key={index}
              className={`flex items-center mb-3 ${
                isGift && index == 0 ? "hidden" : ""
              }`}
            >
              <input
                type="radio"
                checked={item.checked}
                className="w-5 h-5 mr-2 border-2 border-slate-400 rounded-full"
                onChange={(e) => {
                  let newData = [...paymentMethod];
                  newData.map((item) => {
                    item.checked = false;
                  });
                  newData[index].checked = true;
                  setPaymentMethod(newData);
                }}
              />
              {item.icon}
              <div>{item.name}</div>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-md p-4 mb-4">
          <div className="flex justify-between">
            <div className="text-lg font-bold mb-3">Giao đến</div>
            <div
              className="text-blue-400 cursor-pointer"
              onClick={(e) => {
                setIsShow(true),
                  setIsUpdate_Add({ state: false, add: false, edit: false });
              }}
            >
              Thay đổi
            </div>
          </div>
          <div className="font-medium">
            {receiverInfo.receiverName} | {receiverInfo.receiverPhone}
          </div>
          <div className="text-gray-500">{receiverInfo.address}</div>
        </div>
        <Dialog open={isShow} handler={() => setIsShow(false)}>
          <DialogHeader>Thay đổi địa chỉ giao hàng</DialogHeader>
          <DialogBody className="sm:h-auto h-[30rem]  sm:overflow-auto overflow-scroll">
            {isUpdate_Add.state && (
              <div className="flex flex-col w-full">
                <CustomInput label="Họ và tên">
                  <input
                    type="text"
                    className="w-full outline-none border-solid border-2 border-gray-300 rounded-md p-2"
                    value={addressPopup.receiverName}
                    onChange={(e) => {
                      setAddressPopup({
                        ...addressPopup,
                        receiverName: e.target.value,
                      });
                    }}
                  />
                </CustomInput>
                <CustomInput label="Số điện thoại">
                  <input
                    type="text"
                    className="w-full outline-none border-solid border-2 border-gray-300 rounded-md p-2"
                    value={addressPopup.receiverPhone}
                    onChange={(e) => {
                      setAddressPopup({
                        ...addressPopup,
                        receiverPhone: e.target.value,
                      });
                    }}
                  />
                </CustomInput>
                <CustomInput label="Địa chỉ">
                  <input
                    type="text"
                    className="w-full outline-none border-solid border-2 border-gray-300 rounded-md p-2"
                    value={addressPopup.address}
                    onChange={(e) => {
                      setAddressPopup({
                        ...addressPopup,
                        address: e.target.value,
                      });
                    }}
                  />
                </CustomInput>
                <div className="flex justify-between my-3">
                  <button
                    className="bg-blue-500 text-white px-4 py-2 rounded-md w-full mr-2"
                    onClick={() => ChangeAddress()}
                  >
                    Lưu
                  </button>
                  <button
                    className="bg-gray-500 text-white px-4 py-2 rounded-md w-full ml-2"
                    onClick={() =>
                      setIsUpdate_Add({ state: false, add: false, edit: false })
                    }
                  >
                    Đóng
                  </button>
                </div>
              </div>
            )}
            {user.address?.length > 0 && (
              <>
                <div className="sm:grid grid-cols-5 gap-3 my-3">
                  {user.address.map((item: any, index: number) => (
                    <div
                      key={index}
                      className={`hover:shadow-lg cursor-pointer rounded-md  sm:my-0 my-2 ease-linear transition-all duration-150 p-3 ${
                        indexAddressPicked == index
                          ? "bg-blue-500 text-white"
                          : "bg-gray-200 text-black"
                      }`}
                      onClick={() => {
                        setAddressPopup({
                          receiverName: item.receiverName,
                          receiverPhone: item.receiverPhone,
                          address: item.address,
                        });
                        setIsUpdate_Add({
                          state: true,
                          add: false,
                          edit: true,
                        });
                        setIndexAddressPicked(index);
                      }}
                    >
                      <div className="font-bold">{item.receiverName}</div>
                      <div>{item.address}</div>
                      <div>{item.receiverPhone}</div>
                      {item.default && (
                        <div
                          className={`${
                            indexAddressPicked == index
                              ? "text-white"
                              : "text-black"
                          }`}
                        >
                          (Mặc định)
                        </div>
                      )}
                    </div>
                  ))}
                  <div
                    className={`flex items-center justify-center cursor-pointer rounded-md p-3 bg-gray-100 outline-dashed opacity-50 hover:opacity-100 ease-linear transition-all duration-150`}
                    onClick={() => {
                      setIsUpdate_Add({ state: true, add: true, edit: false });
                      setAddressPopup({
                        receiverName: "",
                        receiverPhone: "",
                        address: "",
                      });
                    }}
                  >
                    <div className="flex items-center justify-center text-[65px] font-thin">
                      +
                    </div>
                  </div>
                </div>
              </>
            )}
          </DialogBody>
          <DialogFooter>
            <Button
              variant="text"
              color="red"
              onClick={() => setIsShow(false)}
              className="mr-1"
            >
              <span>Đóng</span>
            </Button>
            <Button
              variant="gradient"
              color="red"
              onClick={() => ConfirmChangeAddress()}
            >
              <span>Xác nhận</span>
            </Button>
          </DialogFooter>
        </Dialog>
        {/* <Modal
          isShow={isShow}
          setIsShow={(data: any) => setIsShow(data)}
          confirm={}
          title="Thay đổi địa chỉ giao hàng"
        >
        
        </Modal> */}

        <ModalRequired
          isShow={showModalRequied}
          confirm={() => ChangeAddress()}
          title="Thêm địa chỉ giao hàng"
        >
          <div className="flex flex-col w-full">
            <CustomInput label="Họ và tên">
              <input
                type="text"
                className="w-full outline-none border-solid border-2 border-gray-300 rounded-md p-2"
                value={addressPopup.receiverName}
                onChange={(e) => {
                  setAddressPopup({
                    ...addressPopup,
                    receiverName: e.target.value,
                  });
                }}
              />
            </CustomInput>
            <CustomInput label="Số điện thoại">
              <input
                type="text"
                className="w-full outline-none border-solid border-2 border-gray-300 rounded-md p-2"
                value={addressPopup.receiverPhone}
                onChange={(e) => {
                  setAddressPopup({
                    ...addressPopup,
                    receiverPhone: e.target.value,
                  });
                }}
              />
            </CustomInput>
            <CustomInput label="Địa chỉ">
              <input
                type="text"
                className="w-full outline-none border-solid border-2 border-gray-300 rounded-md p-2"
                value={addressPopup.address}
                onChange={(e) => {
                  setAddressPopup({
                    ...addressPopup,
                    address: e.target.value,
                  });
                }}
              />
            </CustomInput>
          </div>
        </ModalRequired>

        <div className="bg-white rounded-md p-4 mb-4">
          <div className="flex items-center">
            <input
              type="checkbox"
              name=""
              id=""
              className="w-5 h-5 mr-2 border-2 border-slate-400 rounded-full"
              onChange={(e) => {
                setIsGift(e.target.checked);
                let newData = [...paymentMethod];
                if (e.target.checked) {
                  newData.map((item) => {
                    item.checked = false;
                  });
                  newData[1].checked = true;
                }
                setPaymentMethod(newData);
              }}
            />
            <div className="text-lg font-bold">
              Gửi tặng đến người thân, bạn bè
            </div>
          </div>
          <div className={isGift ? "" : "hidden"}>
            <CustomInput label="Tên người gửi">
              <input
                type="text"
                value={giveInfo.senderName}
                onChange={(e) => {
                  setGiveInfo({ ...giveInfo, senderName: e.target.value });
                }}
                className="w-full outline-none border-solid border-2 border-gray-300 rounded-md p-2"
              />
            </CustomInput>
            <CustomInput label="Tên người nhận">
              <input
                type="text"
                value={receiverInfo.receiverName}
                disabled
                className="w-full outline-none border-solid border-2 border-gray-300 rounded-md p-2"
              />
            </CustomInput>
            <CustomInput label="Lời chúc">
              <input
                type="text"
                value={giveInfo.wish}
                onChange={(e) => {
                  setGiveInfo({ ...giveInfo, wish: e.target.value });
                }}
                className="w-full outline-none border-solid border-2 border-gray-300 rounded-md p-2"
              />
            </CustomInput>
          </div>
        </div>

        <div className="bg-white rounded-md p-4 mb-4">
          <div className="text-lg font-bold mb-3">Đơn hàng</div>
          <div className="flex">
            <div className="mr-2">{data.length} sản phẩm</div>
            <div
              className="text-blue-400 cursor-pointer"
              onClick={(e) => setIsDetail(!isDetail)}
            >
              Xem chi tiết
            </div>
          </div>
          <div className={isDetail ? "" : "hidden"}>
            <hr className="w-full my-4" />
            {/* List product */}
            {data?.map((item, index) =>
              item.products?.map((product: any, index: number) => (
                <div key={index} className="flex mt-2 items-center text-center">
                  <div className="w-[10%] text-left">x {product.quantity}</div>
                  <div className="w-[60%] text-ellipsis line-clamp-2">
                    {product.name}
                  </div>
                  <div className="w-[30%] text-right">
                    {FormatMoney(product.newPrice * product.quantity)}
                  </div>
                </div>
              ))
            )}
          </div>
          <div>
            <hr className="w-full my-4" />
            <div className="flex">
              <div className="w-[70%]">Tạm tính</div>
              {
                <div className="w-[30%] text-right">
                  {FormatMoney(
                    data?.reduce((total, item) => total + item.totalPrice, 0)
                  )}
                </div>
              }
            </div>
            <div className="flex">
              <div className="w-[70%]">Phí vận chuyển</div>
              <div className="w-[30%] text-right">
                {FormatMoney(
                  deliveryMethod?.reduce(
                    (total, item) =>
                      item.checked ? total + item.price : total,
                    0
                  ) * data?.length
                )}
              </div>
            </div>
            {voucher.amount > 0 && (
              <div className="flex">
                <div className="w-[70%]">Mã khuyến mãi</div>
                <div className="w-[30%] text-right">
                  - {FormatMoney(voucher.amount)}
                </div>
              </div>
            )}
            {coin > 0 && (
              <div className="flex">
                <div className="w-[70%]">Dùng xu</div>
                <div className="w-[30%] text-right">
                  - {FormatMoney(coin * 1)}
                </div>
              </div>
            )}
          </div>
          <div>
            <hr className="w-full my-4" />
            <div className="flex">
              <div className="w-[70%]">Tổng cộng</div>
              <div className="w-[30%] text-right text-red-500 font-bold text-lg">
                {FormatMoney(totalPrice.afterDisscount)}
              </div>
            </div>
          </div>
          <div className="flex items-center justify-between pt-4">
            <div className="-ml-2">
              <Checkbox
                label={`Dùng xu (${user.wallet})`}
                crossOrigin={undefined}
                checked={useCoin}
                onClick={(e) => {
                  setCoin(0);
                  setUseCoin((e.target as HTMLInputElement).checked);
                }}
              />
            </div>
            <div className="flex cursor-pointer" onClick={(e) => setOpen(true)}>
              <FaCartPlus className="w-[24px] h-[24px] fill-[#77a0f3] mr-2 fill-" />
              <span className="text-[16px] font-medium">DTEX Voucher</span>
            </div>
          </div>
          {useCoin && (
            <div className="flex items-center justify-between pt-4">
              <Input
                // Press Enter to onBlur
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    e.currentTarget.blur();
                  }
                }}
                label="Số xu"
                type="number"
                crossOrigin={undefined}
                max={user.wallet}
                min={0}
                value={coin}
                onChange={(e) => {
                  const coinChange = +e.target.value || 0;
                  console.log("eee", coinChange);
                  debugger;
                  if (coinChange > +user.wallet) {
                    Toast("warning", "Không được vượt quá xu hiện có", 2000);
                    if (coinChange > totalPrice.general - voucher.amount) {
                      setCoin(totalPrice.general - voucher.amount);
                    } else {
                      setCoin(+user.wallet);
                    }
                  } else if (coinChange > totalPrice.general - voucher.amount) {
                    Toast(
                      "warning",
                      "Không được vượt quá số tiền sản phẩm đã kết hợp các mã giảm giá",
                      2000
                    );
                    setCoin(totalPrice.general - voucher.amount);
                  } else {
                    setCoin(coinChange);
                    if (totalPrice.general - coinChange - voucher.base <= 0) {
                      setVoucher({
                        ...voucher,
                        amount: totalPrice.general - coinChange,
                      });
                    } else {
                      setVoucher({
                        ...voucher,
                        amount: voucher.base,
                      });
                    }
                  }
                }}
                defaultValue={0}
              />
            </div>
          )}

          <div>
            <hr className="w-full my-4" />
            {/* Button Đặt hàng */}
            <div className="flex justify-center">
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded-md w-full"
                onClick={(e) => HandleOrder()}
              >
                Đặt hàng
              </button>
            </div>
          </div>
          <DialogVoucher
            totalPriceGeneral={totalPrice.general}
            isOpen={open}
            idVoucher={voucher.id}
            handleOpen={setOpen}
            storeIds={storeIds}
            handleSubmit={(data) => AddVoucher(data)}
          />
        </div>
      </div>
    </div>
  );
}

export default Payment;
