"use client";
import SortTable from "@/components/SortTable";
import {
  APIGetCountBillByStatusUser,
  APIGetListBillUser,
  APIUpdateBill,
  APIUpdateBillUser,
  APIUserCancelBill,
} from "@/services/Bill";
import Toast from "@/utils/Toast";
import formatToDDMMYYYY from "@/utils/formatToDDMMYYYY";
import React from "react";
import Review from "./review";
import FormatMoney from "@/utils/FormatMoney";
import {
  Alert,
  Button,
  Dialog,
  DialogBody,
  DialogFooter,
  DialogHeader,
  Textarea,
  Typography,
} from "@material-tailwind/react";
import ConvertDate from "@/utils/ConvertDate";
import DialogReasonCancel from "@/components/DialogReasonCancel";
interface Invoice {
  status: string;
  title: string;
  count: number;
}
interface TableInvoice {
  id: string;
  productName: string[];
  storeName: string;
  storeAvatar: string;
  storeId: string;
  price: number;
  totalPricePayment: number;
  recievedDate: string;
  paymentMethod: string;
  createdAt: string;
  reason: string;
  receiverInfo: {
    name: string;
    phone: string;
    address: string;
  };
  data: any;
  deliveryFee: number;
}

function Info() {
  const [status, setStatus] = React.useState("NEW");
  const [invoice, setInvoice] = React.useState<Invoice[]>([]);
  const [page, setPage] = React.useState(1);
  const [totalPage, setTotalPage] = React.useState(1);
  const [data, setData] = React.useState<TableInvoice[]>([] as TableInvoice[]);
  const [isShow, setIsShow] = React.useState(false);
  const [changed, setChanged] = React.useState(false);
  const [isReview, setIsReview] = React.useState(false);
  const [currentBill, setCurrentBill] = React.useState<any>({});
  const [typeMes, setTypeMes] = React.useState<string>("");
  const [content, setContent] = React.useState<string>("");
  const [reason, setReason] = React.useState<string>("");
  const [alert, setAlert] = React.useState({
    open: false,
    message: "",
  });
  const [currentId, setCurrentId] = React.useState("");
  interface TypeObject {
    [key: string]: {
      mes: string;
      func: () => void;
    };
  }

  const type: TypeObject = {
    upGrade: {
      mes: "Bạn có chắc chắn muốn HOÀN ĐƠN này không?",
      func: () => UpGrade(),
    },
    cancel: {
      mes: "LÝ DO HUỶ ĐƠN",
      func: () => Cancel(),
    },
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
    const res = await APIUserCancelBill(currentId, content);
    if (res?.status == 200 || res?.status == 201) {
      Toast("success", res.data.message, 2000);
      setChanged(!changed);
      setStatus("CANCELLED");
      setContent("");
    } else {
      Toast("error", res.data.message, 2000);
    }
  };
  const UpGrade = async () => {
    await APIUpdateBillUser(currentId, "RETURNED").then((res) => {
      if (res?.status == 200 || res?.status == 201) {
        Toast("success", "Hoàn đơn thành công", 2000);
        setIsShow(false);
        setChanged(!changed);
      } else {
        Toast("error", "Hoàn đơn thất bại", 2000);
      }
    });
  };
  React.useEffect(() => {
    const getInvoice = async () => {
      const res = await APIGetCountBillByStatusUser();
      console.log("res", res);
      setInvoice(res?.data.metadata.data);
    };
    getInvoice();
  }, [changed]);

  const arrTitle = [
    {
      title: "STT",
      sort: false,
      name: "index",
    },
    {
      title: "Tên sản phẩm",
      sort: false,
      name: "productName",
    },
    {
      title: "Tên cửa hàng",
      sort: false,
      name: "storeName",
    },
    {
      title: "Giá",
      sort: false,
      name: "price",
    },
    {
      title: "Ngày đặt",
      sort: false,
      name: "orderDate",
    },
    {
      title: "Dự kiến nhận hàng",
      sort: false,
      name: "recievedDate",
    },
    {
      title: "Lý do",
      sort: false,
      name: "reason",
    },
    {
      title: "Thao tác",
      sort: false,
      name: "action",
    },
  ];
  React.useEffect(() => {
    const getBill = async () => {
      const res = await APIGetListBillUser(page || 1, 20, status);
      setTotalPage(res?.metadata.total);
      var arr = [] as TableInvoice[];
      res.metadata.data?.map((lstProduct: any, index: number) => {
        var arrBill = {} as TableInvoice;
        arrBill.id = lstProduct._id;
        const createdAtDate = new Date(lstProduct.createdAt);
        createdAtDate.setDate(createdAtDate.getDate() + 3);
        arrBill.recievedDate = formatToDDMMYYYY(createdAtDate);
        arrBill.createdAt = ConvertDate(lstProduct.createdAt);
        arrBill.totalPricePayment = lstProduct.totalPricePayment;
        arrBill.price = lstProduct.totalPricePayment + lstProduct.deliveryFee;
        arrBill.paymentMethod = lstProduct.paymentMethod;
        arrBill.productName = [] as string[];
        arrBill.storeName = lstProduct.storeName;
        arrBill.storeId = lstProduct.storeId;
        arrBill.storeAvatar = lstProduct.storeAvatar;
        arrBill.receiverInfo = lstProduct.receiverInfo;
        arrBill.reason = lstProduct.reason;
        arrBill.data = lstProduct.products;
        lstProduct.products?.map((product: any) => {
          arrBill.productName.push(product.name + " x " + product.quantity);
        });
        arrBill.deliveryFee = lstProduct.deliveryFee;
        arr.push(arrBill);
      });
      setData(arr);
    };
    getBill();
  }, [status, page]);

  return (
    <div className="min-h-screen px-[150px] my-4">
      <div className=" bg-white rounded-md py-2 px-4 mb-5">
        <div className="flex justify-center items-center my-5">
          {invoice.map((item, index) => (
            <div
              className="flex flex-col relative group cursor-pointer"
              key={index}
              onClick={() => setStatus(item.status)}
            >
              <div className="flex items-center">
                <div className="relative w-24 h-24 rounded-full border-2 border-gray-500 flex items-center justify-center">
                  <div
                    className={`${
                      item.status == status && "animate-ping"
                    } absolute w-24 h-24 rounded-full border-2 border-gray-200 flex items-center justify-center group-hover:animate-ping`}
                  ></div>
                  <div className="text-2xl font-bold text-gray-500">
                    {item.count}
                  </div>
                </div>
                {index != invoice.length - 1 && (
                  <>
                    <div
                      className={`border-t-2 w-[50px] h-1 group-hover:hidden`}
                    ></div>
                    <div className="w-[50px] h-[2px] hidden group-hover:bg-gray-500 group-hover:block"></div>
                  </>
                )}
              </div>
              <div className="text-sm text-gray-500 text-center w-24">
                {item.title}
              </div>
            </div>
          ))}
        </div>
        <SortTable
          currentPage={page}
          setPage={(data) => setPage(data)}
          title={
            status == "NEW"
              ? arrTitle.filter((item) => item.name != "reason")
              : status == "CANCELLED" || status == "REFUND" || status == "BACK"
              ? arrTitle.slice(0, 7)
              : arrTitle.slice(0, 6)
          }
          totalPage={totalPage}
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
                {index + 1 + (page - 1) * 20}
              </td>
              <td
                scope="row"
                className="cursor-pointer px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white text-center"
                onClick={(e) => {
                  setIsReview(true);
                  setCurrentBill(item);
                }}
              >
                <div className="flex flex-col">
                  {item.productName?.map((item, index) => (
                    <div key={index}>{item}</div>
                  ))}
                </div>
              </td>
              <td
                className="px-6 py-4 text-center cursor-pointer"
                onClick={(e) => window.open(`/shop/${item.storeId}`)}
              >
                {item.storeName}
              </td>
              <td className="px-6 py-4 text-center">
                {FormatMoney(item.price)}
              </td>
              <td className="px-6 py-4 text-center">{item.createdAt}</td>
              <td className="px-6 py-4 text-center">{item.recievedDate}</td>

              {(status == "CANCELLED" ||
                status == "REFUND" ||
                status == "BACK") && (
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
              )}
              {status == "NEW" && (
                <td className="px-6 py-4 text-center">
                  <div
                    className="font-medium text-red-600 dark:text-red-500 hover:underline cursor-pointer mb-2"
                    onClick={(e) => {
                      setIsShow(true);
                      setCurrentId(item.id);
                      setTypeMes("cancel");
                    }}
                  >
                    Huỷ đơn
                  </div>
                </td>
              )}
            </tr>
          ))}
        </SortTable>
        <DialogReasonCancel
          isShow={isShow}
          setIsShow={setIsShow}
          title={type[typeMes]?.mes}
          alert={alert}
          content={content}
          setContent={(data) => setContent(data)}
          submit={() => type[typeMes]?.func()}
        />
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
        {isReview && (
          <Review setChanged={(data) => setIsReview(data)} bill={currentBill} />
        )}
      </div>
    </div>
  );
}

export default Info;
