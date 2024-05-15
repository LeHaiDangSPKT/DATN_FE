import { BillForShipper } from "@/components/BillForShipper";
import SortTable from "@/components/SortTable";
import ConvertDate from "@/utils/ConvertDate";
import {
  Button,
  Dialog,
  DialogBody,
  DialogFooter,
  Typography,
} from "@material-tailwind/react";
import React from "react";
type BillForShipperProps = {
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
  isUserConfirmed: boolean;
  deliveredDate: Date;
  isFeedbackShipper: boolean;
  star: number;
  content: string;
  reason: string;
};
interface props {
  listBill: BillForShipperProps[];
  total: number;
  statusBill: string;
}

function TableBillShipper(props: props) {
  const { listBill, total, statusBill } = props;
  const arrTitleUser = [
    {
      title: "Khách hàng",
      sort: false,
      name: "username",
    },
    {
      title: "Số tiền nhận được",
      sort: false,
      name: "money",
    },
    {
      title: "Ngày giao",
      sort: false,
      name: "data",
    },
    {
      title: "",
      sort: false,
      name: "",
    },
  ];
  const [page, setPage] = React.useState(1);
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(!open);
  const [curentBill, setCurentBill] = React.useState<BillForShipperProps>();

  return (
    <div>
      <SortTable
        title={arrTitleUser}
        totalPage={total}
        currentPage={page}
        setPage={(data) => setPage(data)}
        perPage={20}
      >
        {listBill.map((item, index) => (
          <tr
            className="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
            key={index}
          >
            <td className="px-6 py-4 text-center">{item.fullName}</td>
            <td className="px-6 py-4 text-center">{item.totalPriceReceive}</td>
            <td className="px-6 py-4 text-center">
              {ConvertDate(item.deliveredDate)}
            </td>
            <td
              className="px-6 py-4 text-center font-medium text-blue-600 dark:text-blue-500 hover:underline cursor-pointer"
              onClick={(e) => {
                setCurentBill(item);
                handleOpen();
              }}
            >
              Xem chi tiết
            </td>
          </tr>
        ))}
      </SortTable>
      <Dialog open={open} handler={handleOpen}>
        <DialogBody className="h-[42rem] overflow-scroll -p-4">
          <BillForShipper
            statusBill={statusBill}
            data={curentBill!}
            isComponent={true}
            closeModal={handleOpen}
          />
        </DialogBody>
      </Dialog>
    </div>
  );
}

export default TableBillShipper;
