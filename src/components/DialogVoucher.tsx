import { APIUserPromotion } from "@/services/Promotion";
import FormatMoney from "@/utils/FormatMoney";
import formatToDDMMYYYY from "@/utils/formatToDDMMYYYY";
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  Dialog,
  DialogBody,
  DialogFooter,
  DialogHeader,
  Progress,
  Radio,
  Typography,
} from "@material-tailwind/react";
import React from "react";
interface DialogVoucherProps {
  isOpen: boolean;
  handleOpen: (value: any) => void;
  handleSubmit: (value: any) => void;
  storeIds: string[];
  totalPriceGeneral: number;
}

function DialogVoucher(props: DialogVoucherProps) {
  const { isOpen, handleOpen, handleSubmit, storeIds, totalPriceGeneral } =
    props;
  const [voucherListSaved, setVoucherListSaved] = React.useState([] as any);
  const [voucherList, setVoucherList] = React.useState([] as any);
  const [selectedVoucher, setSelectedVoucher] = React.useState({} as any);
  React.useEffect(() => {
    const fetchData = async () => {
      const res = await APIUserPromotion(storeIds);
      console.log("res", res.data.metadata.data);
      let voucherListSaved: any = [];
      let voucherList: any = [];
      res.data.metadata.data.map((item: any) => {
        if (item.isSaved) {
          voucherListSaved.push(item);
        } else {
          voucherList.push(item);
        }
      });
      setVoucherListSaved(voucherListSaved);
      setVoucherList(voucherList);
    };
    fetchData();
  }, [storeIds]);
  return (
    <Dialog open={isOpen} size={"sm"} handler={handleOpen}>
      <DialogHeader>Chọn voucher đang có</DialogHeader>
      <DialogBody>
        <Typography variant="h6" color="blue-gray" className="mb-2">
          Voucher đã lưu
        </Typography>
        {voucherListSaved?.map((item: any, index: number) => (
          <Card key={index}>
            {/* Radio */}
            <div className="flex">
              <div className="pl-6 my-auto">
                <Radio
                  disabled={item.minSpend > totalPriceGeneral}
                  name="type"
                  onChange={(e) => setSelectedVoucher(item)}
                  crossOrigin={undefined}
                />
              </div>
              <CardBody>
                {/* Image */}
                <div className="flex items-center">
                  <img src={item.avatar} alt="" height={50} width={50} />
                  <Typography variant="h6" color="blue-gray" className="ml-2">
                    Giảm {item.value}% tối đa{" "}
                    {FormatMoney(item.maxDiscountValue)}
                  </Typography>
                </div>
                <Typography>
                  Hạn sử dụng: {formatToDDMMYYYY(item.endTime)}
                </Typography>
                <Progress
                  className="mt-2"
                  value={item.usagePercent}
                  label={item.usagePercent >= 50 ? "Đã sử dụng" : ""}
                />
              </CardBody>
            </div>
          </Card>
        ))}
        <Typography variant="h6" color="blue-gray" className="mt-4 mb-2">
          Voucher khác
        </Typography>
        {voucherList?.map((item: any, index: number) => (
          <Card key={index}>
            {/* Radio */}
            <div className="flex">
              <div className="pl-6 my-auto">
                <Radio
                  disabled={item.minSpend > totalPriceGeneral}
                  name="type"
                  onChange={(e) => setSelectedVoucher(item)}
                  crossOrigin={undefined}
                />
              </div>
              <CardBody>
                {/* Image */}
                <div className="flex items-center">
                  <img src={item.avatar} alt="" height={50} width={50} />
                  <Typography variant="h6" color="blue-gray" className="ml-2">
                    Giảm {item.value}% tối đa{" "}
                    {FormatMoney(item.maxDiscountValue)}
                  </Typography>
                </div>
                <Typography>
                  Hạn sử dụng: {formatToDDMMYYYY(item.endTime)}
                </Typography>
                <Progress
                  className="mt-2"
                  value={item.usagePercent}
                  label={item.usagePercent >= 50 ? "Đã sử dụng" : ""}
                />
              </CardBody>
            </div>
          </Card>
        ))}
      </DialogBody>
      <DialogFooter>
        <Button
          variant="text"
          color="red"
          onClick={() => handleOpen(false)}
          className="mr-1"
        >
          <span>Đóng</span>
        </Button>
        <Button
          variant="gradient"
          color="green"
          onClick={() => handleSubmit(selectedVoucher)}
        >
          <span>Xác nhận</span>
        </Button>
      </DialogFooter>
    </Dialog>
  );
}

export default DialogVoucher;
