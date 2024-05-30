import SortTable from "@/components/SortTable";
import { APIGetListBill } from "@/services/Bill";
import ConvertDate from "@/utils/ConvertDate";
import FormatMoney from "@/utils/FormatMoney";
import {
  Button,
  Dialog,
  DialogBody,
  DialogFooter,
  DialogHeader,
  Typography,
} from "@material-tailwind/react";
import React from "react";

interface ArrBill {
  id: string;
  fullName: string;
  phoneNumber: string;
  address: string;
  infoProduct: string[];
  date: string;
  reason: string;
  totalPrice: number;
}

function Cancel() {
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
      title: "Lý do",
      sort: false,
      name: "reason",
    },
  ];
  const [data, setData] = React.useState<ArrBill[]>();
  const [page, setPage] = React.useState<number>(1);
  const [total, setTotal] = React.useState<number>(0);
  const [reason, setReason] = React.useState<string>("");

  React.useEffect(() => {
    const fetchData = async () => {
      const data = await APIGetListBill(page || 1, 20, "CANCELLED").then(
        (res) => res
      );
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
        arrBill.reason = lstProduct.reason;
        arrBill.infoProduct = [] as string[];
        lstProduct.products.map((item: any, index: number) =>
          arrBill.infoProduct?.push(item.name + " x " + item.quantity)
        );
        arr.push(arrBill);
      });
      setData(arr);
    };
    fetchData();
  }, [page]);
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
            <td className="px-6 py-4 text-center">
              <div
                className="font-medium text-blue-600 dark:text-blue-500 hover:underline cursor-pointer mb-2"
                onClick={(e) => {
                  setReason(item.reason);
                }}
              >
                Xem
              </div>
            </td>
          </tr>
        ))}
      </SortTable>
      <Dialog open={reason ? true : false} handler={(e) => false}>
        <DialogHeader>Lý do chi tiết</DialogHeader>
        <DialogBody className="text-center">
          <Typography>{reason}</Typography>
        </DialogBody>
        <DialogFooter>
          <Button
            variant="text"
            color="red"
            onClick={(e: any) => setReason("")}
            className="mr-1"
          >
            <span>Đóng</span>
          </Button>
        </DialogFooter>
      </Dialog>
    </>
  );
}

export default Cancel;
