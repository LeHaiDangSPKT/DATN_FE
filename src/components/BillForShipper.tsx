import React from "react";
import { APIUpdateBehaviorBill } from "@/services/Shipper";
import FormatMoney from "@/utils/FormatMoney";
import Toast from "@/utils/Toast";
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Typography,
  Button,
  Rating,
} from "@material-tailwind/react";
import DialogReasonCancel from "./DialogReasonCancel";

function CheckIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={2}
      stroke="currentColor"
      className="h-3 w-3"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M4.5 12.75l6 6 9-13.5"
      />
    </svg>
  );
}

function CheckIconFail() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={2}
      stroke="white"
      className="h-3 w-3"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M6 18L18 6M6 6l12 12"
      />
    </svg>
  );
}

type BillForShipper = {
  _id: string;
  storeAddress: string;
  address: string;
  storePhone: string[];
  fullName: string;
  phoneNumber: string;
  name: string;
  price: number;
  totalPriceReceive: number;
  paymentMethod: string;
  isFeedbackShipper: boolean;
  star: number;
  content: string;
  reason: string;
};

interface BillForShipperProps {
  data: BillForShipper;
  setListBill?: (value: string) => void;
  statusBill: string;
  isComponent?: boolean;
  closeModal?: () => void;
}

export function BillForShipper(props: BillForShipperProps) {
  const { data, setListBill, statusBill, isComponent, closeModal } = props;
  const ChangeStateOrther = async () => {
    if (action === "REFUSE" && contentPopup === "") {
      setAlert({ open: true, message: "Vui lòng nhập lý do trả hàng" });
      setTimeout(() => {
        setAlert({
          open: false,
          message: "",
        });
      }, 2000);
      return;
    }
    setIsShow(false);
    const res = await APIUpdateBehaviorBill(data._id, action, contentPopup);
    if (res?.status === 200 || res?.status === 201) {
      Toast("success", res?.data.message, 2000);
      if (setListBill) {
        setListBill(data._id);
      }
    } else {
      Toast("error", res?.data.message, 2000);
    }
  };
  const [isShow, setIsShow] = React.useState(false);
  const [title, setTitle] = React.useState("");
  const [contentPopup, setContentContentPopup] = React.useState("");
  const [alert, setAlert] = React.useState({
    open: false,
    message: "",
  });
  const [action, setAction] = React.useState("");
  const [isChangeStateBill, setIsChangeStateBill] = React.useState(false);
  const [contentChangeStateBill, setContentChangeStateBill] =
    React.useState("");
  return (
    <>
      <Card
        color="gray"
        variant="gradient"
        className={`${!isComponent && "w-full max-w-[20rem]"} p-8 m-2`}
      >
        <CardHeader
          floated={false}
          shadow={false}
          color="transparent"
          className="m-0 mb-2 rounded-none border-b border-white/10 pb-2 text-center"
        >
          <Typography
            variant="small"
            color="white"
            className="font-normal uppercase"
          >
            Tiền nhận được
          </Typography>
          <Typography variant="h1" color="white" className="mt-2 font-normal">
            {FormatMoney(data.totalPriceReceive)}
          </Typography>
        </CardHeader>
        <CardBody className="p-0">
          <ul className="flex flex-col gap-4">
            <li className="flex items-start gap-4">
              <span className="rounded-full border border-white/20 bg-white/20 p-1 mt-1">
                <CheckIcon />
              </span>
              <Typography className="font-normal">
                <span className="font-bold underline">Nơi lấy hàng</span>:{" "}
                {data.storeAddress}
              </Typography>
            </li>
            <li className="flex items-center gap-4">
              <span className="rounded-full border border-white/20 bg-white/20 p-1 mt-1">
                <CheckIcon />
              </span>
              <Typography className="font-normal">
                <span className="font-bold underline">Nơi giao hàng</span>:{" "}
                {data.address}
              </Typography>
            </li>
            <li className="flex items-center gap-4">
              <span className="rounded-full border border-white/20 bg-white/20 p-1 mt-1">
                <CheckIcon />
              </span>
              <Typography className="font-normal">
                <span className="font-bold underline">SĐT cửa hàng</span>:{" "}
                {data.storePhone.map((item: any, index: number) => {
                  if (index === data.storePhone.length - 1) return item;
                  return item + " - ";
                })}
              </Typography>
            </li>
            <li className="flex items-center gap-4">
              <span className="rounded-full border border-white/20 bg-white/20 p-1 mt-1">
                <CheckIcon />
              </span>
              <Typography className="font-normal">
                <span className="font-bold underline">Tên người nhận</span>:{" "}
                {data.fullName}
              </Typography>
            </li>
            <li className="flex items-center gap-4">
              <span className="rounded-full border border-white/20 bg-white/20 p-1 mt-1">
                <CheckIcon />
              </span>
              <Typography className="font-normal">
                <span className="font-bold underline">SĐT người nhận</span>:{" "}
                {data.phoneNumber}
              </Typography>
            </li>
            <li className="flex items-center gap-4">
              <span className="rounded-full border border-white/20 bg-white/20 p-1 mt-1">
                <CheckIcon />
              </span>
              <Typography className="font-normal">
                <span className="font-bold underline">Sản phẩm</span>:{" "}
                {data.name}
              </Typography>
            </li>
            <li className="flex items-center gap-4">
              <span className="rounded-full border border-white/20 bg-white/20 p-1 mt-1">
                <CheckIcon />
              </span>
              <Typography className="font-normal text-blue-500">
                <span className="font-bold underline ">Số tiền thu</span>:{" "}
                {data.paymentMethod == "CASH"
                  ? FormatMoney(data.price)
                  : FormatMoney(0)}
              </Typography>
            </li>
            {statusBill == "BACK" && (
              <li className="flex items-center gap-4">
                <span className="rounded-full border border-red-500 bg-red-500 p-1 mt-1">
                  <CheckIconFail />
                </span>
                <Typography className="font-normal text-red-500">
                  <span className="font-bold underline ">Lý do trả hàng</span>:{" "}
                  {data.reason}
                </Typography>
              </li>
            )}
          </ul>
          {statusBill == "DELIVERED" && data.isFeedbackShipper && (
            <Card className="mt-6">
              <CardBody className="text-center">
                <Typography variant="h6" color="blue-gray" className="mb-2">
                  Bạn được khách hàng đánh giá
                </Typography>
                <Typography variant="h5" color="blue-gray">
                  <Rating value={data.star} readonly={true} />
                </Typography>
                <Typography>{data.content}</Typography>
              </CardBody>
            </Card>
          )}
        </CardBody>
        <CardFooter className="mt-10 p-0 flex">
          {!isComponent ? (
            statusBill == "CONFIRMED" ? (
              <>
                <Button
                  size="md"
                  color="white"
                  className="hover:scale-[1.02] focus:scale-[1.02] active:scale-100 mr-3"
                  ripple={false}
                  fullWidth={true}
                  onClick={(e) => {
                    setTitle("Bỏ qua đơn hàng");
                    setContentChangeStateBill(
                      "Tôi không thể nhận đơn hàng này"
                    );
                    setIsShow(true);
                    setIsChangeStateBill(true);
                    setAction("REFUSE");
                  }}
                >
                  Bỏ qua
                </Button>
                <Button
                  size="md"
                  color="blue"
                  className="hover:scale-[1.02] focus:scale-[1.02] active:scale-100"
                  ripple={false}
                  fullWidth={true}
                  onClick={(e) => {
                    setTitle("Xác nhận nhận đơn");
                    setContentChangeStateBill("Tôi xác nhận đơn hàng này");
                    setIsShow(true);
                    setIsChangeStateBill(true);
                    setAction("ACCEPT");
                  }}
                >
                  Nhận đơn
                </Button>
              </>
            ) : (
              <>
                <Button
                  size="md"
                  color="white"
                  className="hover:scale-[1.02] focus:scale-[1.02] active:scale-100 mr-3"
                  ripple={false}
                  fullWidth={true}
                  onClick={(e) => {
                    setTitle("Lý do trả hàng");
                    setContentContentPopup("");
                    setIsShow(true);
                    setIsChangeStateBill(false);
                    setAction("BACK");
                  }}
                >
                  Trả hàng
                </Button>
                <Button
                  size="md"
                  color="blue"
                  className="hover:scale-[1.02] focus:scale-[1.02] active:scale-100"
                  ripple={false}
                  fullWidth={true}
                  onClick={(e) => {
                    setTitle("Xác nhận giao hàng thành công");
                    setContentChangeStateBill(
                      "Đơn hàng đã được giao thành công"
                    );
                    setIsShow(true);
                    setIsChangeStateBill(true);
                    setAction("CONFIRM_DELIVERED");
                  }}
                >
                  Giao thành công
                </Button>
              </>
            )
          ) : (
            <Button
              size="md"
              color="white"
              className="hover:scale-[1.02] focus:scale-[1.02] active:scale-100"
              ripple={false}
              fullWidth={true}
              onClick={(e) => closeModal && closeModal()}
            >
              Đóng
            </Button>
          )}
        </CardFooter>
      </Card>
      <DialogReasonCancel
        isShow={isShow}
        setIsShow={setIsShow}
        title={title}
        alert={alert}
        content={contentPopup}
        setContent={(data) => setContentContentPopup(data)}
        submit={() => ChangeStateOrther()}
        isChangeStateBill={isChangeStateBill}
        contentChangeStateBill={contentChangeStateBill}
        currentCustomer={data.fullName}
      />
    </>
  );
}
