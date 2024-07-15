"use client";
import SortTable from "@/components/SortTable";
import {
  APIGetCountBillByStatusUser,
  APIGetListBillUser,
  APIRefundBill,
  APIUserCancelBill,
  APIUserConfirmDelivered,
} from "@/services/Bill";
import Toast from "@/utils/Toast";
import formatToDDMMYYYY from "@/utils/formatToDDMMYYYY";
import React from "react";
import Review from "./review";
import FormatMoney from "@/utils/FormatMoney";
import {
  Button,
  Dialog,
  DialogBody,
  DialogFooter,
  DialogHeader,
  Rating,
  Textarea,
  Tooltip,
  Typography,
} from "@material-tailwind/react";
import ConvertDate from "@/utils/ConvertDate";
import DialogReasonCancel from "@/components/DialogReasonCancel";
import { APIFeedbackShipper } from "@/services/Shipper";
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
  totalPricePayment: number;
  recievedDate: string;
  paymentMethod: string;
  createdAt: string;
  reason: string;
  isUserConfirmed: boolean;
  isFeedbackShipper: boolean;
  star: number;
  content: string;
  receiverInfo: {
    name: string;
    phone: string;
    address: string;
  };
  data: any;
  deliveryFee: number;
  isRefundSuccess: boolean;
  isSuccess: boolean;
}

function Info() {
  const [status, setStatus] = React.useState("NEW");
  const [openRating, setOpenRating] = React.useState(false);
  const [contentRating, setContentRating] = React.useState("");
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
  const [rating, setRating] = React.useState<number>(0);
  const [isChangeStateBill, setIsChangeStateBill] = React.useState(false);
  const [contentChangeStateBill, setContentChangeStateBill] =
    React.useState("");
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
    cancel: {
      mes: "LÝ DO HUỶ ĐƠN",
      func: () => Cancel(),
    },
    confirm: {
      mes: "NHẬN HÀNG THÀNH CÔNG",
      func: () => Confirm(),
    },
    refund: {
      mes: "LÝ DO HOÀN ĐƠN",
      func: () => Refund(),
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
  const Confirm = async () => {
    setIsShow(false);
    const res = await APIUserConfirmDelivered(currentId);
    if (res?.status == 200 || res?.status == 201) {
      setData((prev) =>
        prev.map((prevItem) =>
          prevItem.id == currentId
            ? { ...prevItem, isUserConfirmed: true }
            : prevItem
        )
      );
      Toast("success", res.data.message, 2000);
    } else {
      Toast("error", res.data.message, 2000);
    }
  };
  const Refund = async () => {
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
    const res = await APIRefundBill(currentId, content);
    if (res?.status == 200 || res?.status == 201) {
      Toast("success", res.data.message, 2000);
      setChanged(!changed);
      setStatus("REFUND");
      setContent("");
    } else {
      Toast("error", res.data.message, 2000);
    }
  };

  React.useEffect(() => {
    const getInvoice = async () => {
      const res = await APIGetCountBillByStatusUser();
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
    {
      title: "Đánh giá shipper",
      sort: false,
      name: "shipper",
    },
    {
      title: "Trạng thái",
      sort: false,
      name: "state",
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
        createdAtDate.setDate(createdAtDate.getDate() + 5);
        arrBill.recievedDate = formatToDDMMYYYY(createdAtDate);
        arrBill.createdAt = ConvertDate(lstProduct.createdAt);
        arrBill.totalPricePayment = lstProduct.totalPricePayment;
        arrBill.deliveryFee = lstProduct.deliveryFee;
        arrBill.paymentMethod = lstProduct.paymentMethod;
        arrBill.productName = [] as string[];
        arrBill.storeName = lstProduct.storeName;
        arrBill.storeId = lstProduct.storeId;
        arrBill.storeAvatar = lstProduct.storeAvatar;
        arrBill.receiverInfo = lstProduct.receiverInfo;
        arrBill.reason = lstProduct.reason;
        arrBill.isFeedbackShipper = lstProduct.isFeedbackShipper;
        arrBill.isUserConfirmed = lstProduct.isUserConfirmed;
        arrBill.star = lstProduct.star;
        arrBill.content = lstProduct.content;
        arrBill.isRefundSuccess = lstProduct.isRefundSuccess;
        arrBill.isSuccess = lstProduct.isSuccess;
        arrBill.data = lstProduct.products;
        lstProduct.products?.map((product: any) => {
          arrBill.productName.push(product.name + " x " + product.quantity);
        });
        arr.push(arrBill);
      });
      setData(arr);
    };
    getBill();
  }, [status, page]);

  const ChangeRating = async () => {
    setOpenRating(false);
    const res = await APIFeedbackShipper({
      billId: currentBill.id,
      star: rating,
      content: contentRating,
    });
    if (res?.status == 200 || res?.status == 201) {
      Toast("success", res.data.message, 2000);
      const dataRefresh = data.map((item) =>
        item.id == currentBill.id
          ? {
              ...item,
              star: 5,
              content: contentRating,
              isFeedbackShipper: true,
            }
          : item
      );
      setData(dataRefresh);
      document
        .getElementById("rating-shipper")
        ?.querySelectorAll("svg")
        ?.forEach((item, index) => {
          if (index < rating) item.setAttribute("fill", "currentColor");
        });
    } else {
      Toast("error", res?.data.message, 2000);
    }
  };

  return (
    <div className="min-h-screen sm:px-[150px] my-4">
      <div className=" bg-white rounded-md py-2 px-4 mb-5">
        <div className="flex justify-start sm:justify-center overflow-x-auto overflow-y-hidden items-center py-6 sm:py-12">
          {invoice?.map((item, index) => (
            <div
              className="flex flex-col relative group cursor-pointer"
              key={index}
              onClick={() => setStatus(item.status)}
            >
              <div className="flex items-center">
                <div
                  className={`relative w-12 sm:w-24 h-12 sm:h-24 rounded-full border-2 ${
                    item.status == status
                      ? "border-blue-300"
                      : "border-gray-500"
                  } flex items-center justify-center`}
                >
                  <div
                    className={`${
                      item.status == status && "animate-ping"
                    } absolute w-12 sm:w-24 h-12 sm:h-24 rounded-full border-2 ${
                      item.status == status && "border-blue-200"
                    }  flex items-center justify-center group-hover:animate-ping`}
                  ></div>
                  <div
                    className={`sm:text-2xl font-bold ${
                      item.status == status ? "text-blue-300" : "text-gray-500"
                    }`}
                  >
                    {item.count}
                  </div>
                </div>
                {index != invoice.length - 1 && (
                  <>
                    <div
                      className={`border-t-2 w-[25px] sm:w-[50px] ${
                        item.status == status && "border-blue-300"
                      } h-1 group-hover:hidden`}
                    ></div>
                    <div
                      className={`w-[25px] sm:w-[50px] h-[2px] hidden ${
                        item.status == status
                          ? "group-hover:bg-blue-300"
                          : "group-hover:bg-gray-500"
                      } group-hover:block`}
                    ></div>
                  </>
                )}
              </div>
              <div
                className={`text-[8px] sm:text-sm ${
                  item.status == status ? "text-blue-300" : "text-gray-500"
                } text-center w-12 sm:w-24 mt-2 line-clamp-1`}
              >
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
              ? arrTitle.filter(
                  (item) =>
                    item.name != "reason" &&
                    item.name != "state" &&
                    item.name != "shipper"
                )
              : status == "DELIVERED"
              ? arrTitle.filter(
                  (item) => item.name != "reason" && item.name != "state"
                )
              : status == "CANCELLED" || status == "BACK"
              ? arrTitle.filter(
                  (item) =>
                    item.name != "state" &&
                    item.name != "action" &&
                    item.name != "shipper"
                )
              : status == "REFUND"
              ? arrTitle.filter(
                  (item) => item.name != "action" && item.name != "shipper"
                )
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
                <div className="flex flex-col items-start">
                  {item.productName?.map((item, index) => (
                    <div key={index}>{item}</div>
                  ))}
                </div>
              </td>
              <td
                className="px-6 py-4  cursor-pointer"
                onClick={(e) => window.open(`/shop/${item.storeId}`)}
              >
                {item.storeName}
              </td>
              <td className="px-6 py-4 text-center">
                {FormatMoney(item.totalPricePayment + item.deliveryFee)}
              </td>
              <td className="px-6 py-4 text-center">{item.createdAt}</td>
              <td className="px-6 py-4 text-center">{item.recievedDate}</td>
              {status == "DELIVERED" && (
                <>
                  <td className="px-6 py-4 text-center">
                    <div
                      className={`font-medium text-blue-600 dark:text-blue-500 hover:underline cursor-pointer mb-2`}
                      onClick={(e) => {
                        if (item.isUserConfirmed) {
                          setIsShow(true);
                          setCurrentId(item.id);
                          setContent("");
                          setTypeMes("refund");
                          setIsChangeStateBill(false);
                        } else {
                          setIsShow(true);
                          setCurrentId(item.id);
                          setTypeMes("confirm");
                          setIsChangeStateBill(true);
                          setContentChangeStateBill("Xác nhận đã nhận hàng");
                        }
                      }}
                    >
                      {!item.isUserConfirmed && "Xác nhận đơn hàng"}
                      {item.isUserConfirmed && !item.isSuccess && "Hoàn đơn"}
                    </div>
                  </td>
                  {item.isUserConfirmed && (
                    <td className="px-6 py-4 text-center">
                      <Tooltip
                        open={
                          item.isFeedbackShipper && item.content
                            ? undefined
                            : false
                        }
                        content={
                          <div className="w-44">
                            <Typography color="white" className="font-medium">
                              Nội dung đánh giá
                            </Typography>
                            <Typography
                              variant="small"
                              color="white"
                              className="font-normal opacity-80"
                            >
                              {item.content}
                            </Typography>
                          </div>
                        }
                      >
                        <Rating
                          id="rating-shipper"
                          unratedColor="amber"
                          ratedColor="amber"
                          value={item.star}
                          readonly={item.isFeedbackShipper}
                          onChange={(value) => {
                            setRating(value);
                            setOpenRating(true);
                            setCurrentBill(item);
                            setContentRating("");
                          }}
                        />
                      </Tooltip>
                    </td>
                  )}
                </>
              )}

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
              {status == "REFUND" && (
                <td className="px-6 py-4 text-center">
                  <div
                    className={`font-medium ${
                      item.isRefundSuccess
                        ? "text-blue-600 dark:text-blue-500"
                        : "text-red-600 dark:text-red-500"
                    } mb-2`}
                  >
                    {item.isRefundSuccess
                      ? "Hoàn đơn thành công"
                      : "Đang chờ xác nhận"}
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
                      setContent("");
                      setIsChangeStateBill(false);
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
          isChangeStateBill={isChangeStateBill}
          contentChangeStateBill={contentChangeStateBill}
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

        <Dialog open={openRating} handler={(e) => false}>
          <DialogHeader>Đánh giá shipper</DialogHeader>
          <DialogBody className="text-center">
            <Rating
              unratedColor="amber"
              ratedColor="amber"
              value={rating}
              onChange={(value) => {
                setRating(value);
              }}
            />
            <Textarea
              label="Nội dung đánh giá"
              value={contentRating}
              onChange={(e) => setContentRating(e.target.value)}
            />
          </DialogBody>
          <DialogFooter>
            <Button
              variant="text"
              color="red"
              onClick={(e: any) => {
                setContentRating("");
                setOpenRating(false);
                setRating(0);
              }}
              className="mr-1"
            >
              <span>Đóng</span>
            </Button>
            <Button
              variant="gradient"
              color="green"
              onClick={(e) => ChangeRating()}
            >
              <span>Xác nhận</span>
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
