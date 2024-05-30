"use client";
import DialogReasonCancel from "@/components/DialogReasonCancel";
import SortTable from "@/components/SortTable";
import {
  APIGetListBill,
  APISellerCancelBill,
  APISellerUpdateStatus,
} from "@/services/Bill";
import { APIUpdateStatusBill } from "@/services/Shipper";
import ConvertDate from "@/utils/ConvertDate";
import FormatMoney from "@/utils/FormatMoney";
import Toast from "@/utils/Toast";
import React from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/store";
import { setCategoryStore } from "@/redux/features/categoryStore/categoryStore-slice";
import { CATEGORYSTORE } from "@/constants/CategoryStore";

interface TypeObject {
  [key: string]: {
    mes: string;
    func: () => void;
  };
}

interface ArrBill {
  id: string;
  fullName: string;
  phoneNumber: string;
  address: string;
  infoProduct: string[];
  date: string;
  totalPrice: number;
  isFindShipper: boolean;
}
// Includes New and Preparing
function Init(props: { state: string }) {
  const { state } = props;
  const dispatch = useDispatch<AppDispatch>();

  const arrTitle = [
    {
      title: "STT",
      sort: false,
      name: "index",
    },
    {
      title: "Tên người đặt hàng",
      sort: true,
      name: "fullName",
    },
    {
      title: "Số điện thoại",
      sort: false,
      name: "phoneNumber",
    },
    {
      title: "Địa chỉ",
      sort: false,
      name: "address",
    },
    {
      title: "Sản phẩm",
      sort: false,
      name: "infoProduct",
    },
    {
      title: "Ngày đặt",
      sort: false,
      name: "date",
    },
    {
      title: "Tổng tiền",
      sort: true,
      name: "totalPrice",
    },
    {
      title: "Thao tác",
      sort: false,
      name: "action",
    },
  ];
  const [content, setContent] = React.useState<string>("");
  const [alert, setAlert] = React.useState({
    open: false,
    message: "",
  });
  const [data, setData] = React.useState<ArrBill[]>();
  const [changed, setChanged] = React.useState<boolean>(false);
  const [page, setPage] = React.useState<number>(1);
  const [total, setTotal] = React.useState<number>(0);
  const [isShow, setIsShow] = React.useState<boolean>(false);
  const [isChangeStateBill, setIsChangeStateBill] =
    React.useState<boolean>(false);
  const [typeMes, setTypeMes] = React.useState<string>("");
  const [currentId, setCurrentId] = React.useState<string>("");
  const [currentCustomer, setCurrentCustomer] = React.useState<string>("");
  const UpGrade = async () => {
    setIsShow(false);
    if (state == "new") {
      const res = await APISellerUpdateStatus(currentId, "CONFIRMED");
      if (res?.status == 200 || res?.status == 201) {
        Toast("success", res.data.message, 2000);
        setChanged(!changed);
        setIsChangeStateBill(false);
      } else {
        Toast("error", res.data.message, 2000);
      }
    } else {
      const res = await APIUpdateStatusBill(currentId);
      if (res?.status == 200 || res?.status == 201) {
        Toast("success", res.data.message, 2000);
        setChanged(!changed);
        setIsChangeStateBill(false);
      } else {
        Toast("error", res?.data.message, 2000);
      }
    }
  };
  const Cancel = async () => {
    if (content.trim() == "") {
      setAlert({
        open: true,
        message: "Nội dung không được để trống",
      });
      setTimeout(() => {
        setAlert({
          open: false,
          message: "",
        });
      }, 2000);
      return;
    }
    setIsShow(false);
    const res = await APISellerCancelBill(currentId, content);
    if (res?.status == 200 || res?.status == 201) {
      Toast("success", res.data.message, 2000);
      setChanged(!changed);
      setContent("");
      setTimeout(() => {
        dispatch(setCategoryStore(CATEGORYSTORE[CATEGORYSTORE.length - 3]));
      }, 2000);
    } else {
      Toast("error", "Chuyển thất bại", 2000);
    }
  };
  const type: TypeObject = {
    upGrade: {
      mes: "CHUYỂN ĐƠN",
      func: () => UpGrade(),
    },
    cancel: {
      mes: "LÝ DO HUỶ ĐƠN",
      func: () => Cancel(),
    },
  };
  React.useEffect(() => {
    const fetchData = async () => {
      const data = await APIGetListBill(
        page || 1,
        20,
        state.toLocaleUpperCase()
      ).then((res) => res);
      var arr = [] as ArrBill[];
      setTotal(data.metadata.total);
      data.metadata.data.map((lstProduct: any, index: number) => {
        var arrBill = {} as ArrBill;
        arrBill.id = lstProduct._id;
        arrBill.fullName = lstProduct.receiverInfo.fullName;
        arrBill.phoneNumber = lstProduct.receiverInfo.phoneNumber;
        arrBill.address = lstProduct.receiverInfo.address;
        arrBill.date = ConvertDate(lstProduct.createdAt);
        arrBill.totalPrice = lstProduct.totalPriceInit;
        arrBill.isFindShipper = lstProduct.isFindShipper;
        arrBill.infoProduct = [] as string[];
        lstProduct.products.map((item: any, index: number) =>
          arrBill.infoProduct?.push(item.name + " x " + item.quantity)
        );
        arr.push(arrBill);
      });
      setData(arr);
    };
    fetchData();
  }, [page, changed]);
  return (
    <>
      <SortTable
        title={arrTitle}
        totalPage={total}
        currentPage={page}
        setPage={(data) => setPage(data)}
      >
        {data?.map((item, index) => (
          <tr
            className="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
            key={index}
          >
            <td
              scope="row"
              className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white text-center"
            >
              {index + 1 + (page - 1) * 3}
            </td>
            <td
              scope="row"
              className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white text-center"
            >
              {item.fullName}
            </td>
            <td className="px-6 py-4 text-center">{item.phoneNumber}</td>
            <td className="px-6 py-4 text-center">{item.address}</td>
            <td className="px-6 py-4 text-center">
              <div className="flex flex-col">
                {item.infoProduct?.map((item, index) => (
                  <div key={index}>{item}</div>
                ))}
              </div>
            </td>
            <td className="px-6 py-4 text-center">{item.date}</td>
            <td className="px-6 py-4 text-center">
              {FormatMoney(item.totalPrice)}
            </td>
            {state == "confirmed" && item.isFindShipper ? (
              <td className="px-6 py-4 text-center">
                <div className="font-medium text-blue-600 dark:text-blue-500">
                  Đang tìm shipper
                </div>
              </td>
            ) : (
              <td className="px-6 py-4 text-center">
                <div
                  className="font-medium text-red-600 dark:text-red-500 hover:underline cursor-pointer mb-2"
                  onClick={(e) => {
                    setIsShow(true);
                    setTypeMes("cancel");
                    setCurrentId(item.id);
                    setIsChangeStateBill(false);
                  }}
                >
                  Huỷ đơn
                </div>
                <div
                  className="font-medium text-blue-600 dark:text-blue-500 hover:underline cursor-pointer"
                  onClick={(e) => {
                    setIsShow(true);
                    setTypeMes("upGrade");
                    setCurrentId(item.id);
                    setIsChangeStateBill(true);
                    setCurrentCustomer(
                      item.fullName + " - " + FormatMoney(item.totalPrice)
                    );
                  }}
                >
                  Chuyển đơn
                </div>
              </td>
            )}
          </tr>
        ))}
      </SortTable>
      <DialogReasonCancel
        isChangeStateBill={isChangeStateBill}
        contentChangeStateBill={`${
          state == "new"
            ? "Chuyển thành đơn đang chuẩn bị"
            : "Chuyển đơn cho shipper"
        }`}
        isShow={isShow}
        setIsShow={setIsShow}
        title={type[typeMes]?.mes}
        alert={alert}
        content={content}
        setContent={(data) => setContent(data)}
        submit={() => type[typeMes]?.func()}
        currentCustomer={currentCustomer}
      />
    </>
  );
}

export default Init;
