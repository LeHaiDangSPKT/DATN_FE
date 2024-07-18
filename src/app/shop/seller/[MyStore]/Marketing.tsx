import { APIGetPropose, APIPurchasePropose } from "@/services/Propose";
import FormatMoney from "@/utils/FormatMoney";
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Dialog,
  DialogBody,
  DialogFooter,
  DialogHeader,
  Typography,
} from "@material-tailwind/react";
import Image from "next/image";
import React from "react";
import { useRouter } from "next/navigation";
import Toast from "@/utils/Toast";

function Marketing() {
  const router = useRouter();
  const [listPrice, setListPrice] = React.useState([]);
  const [open, setOpen] = React.useState(false);

  const handleOpen = () => setOpen(!open);
  React.useEffect(() => {
    const fetchData = async () => {
      const res = await APIGetPropose();
      setListPrice(res);
    };
    fetchData();
  }, []);
  const [info, setInfo] = React.useState({
    id: "",
    paymentMethod: "",
  });
  const HandleBuy = async (id?: string, paymentMethod?: string) => {
    if (!id || !paymentMethod) {
      id = info.id;
      paymentMethod = info.paymentMethod;
    }
    const res = await APIPurchasePropose(id, paymentMethod);
    if (res?.status == 200 || res?.status == 201) {
      router.push(res.data.metadata.data.urlPayment);
    } else {
      Toast("error", "Đã xảy ra lỗi, vui lòng thử lại", 2000);
    }
  };
  const CheckValid = (id: string, paymentMethod: string) => {
    if (localStorage.getItem("marketing") == "true") {
      handleOpen();
    } else {
      HandleBuy(id, paymentMethod);
    }
  };

  return (
    <div>
      <div className="grid grid-cols-3 gap-4">
        {listPrice.map((item: any, index: number) => (
          <Card key={index} className="mb-4">
            <CardHeader color="blue-gray" floated={false} className="h-56">
              <Image src={item.image} alt="..." layout="fill" />
            </CardHeader>
            <CardBody>
              <Typography
                variant="h4"
                color="blue-gray"
                className="text-center mb-2"
              >
                {item.title}
              </Typography>
              <Typography className="text-center" color="red" variant="h5">
                {FormatMoney(item.price)}
              </Typography>
            </CardBody>
            <CardFooter className="pt-0 text-center flex">
              <Button
                color="blue"
                className="mr-4"
                onClick={() => {
                  setInfo({
                    id: item.id,
                    paymentMethod: "VNPAY",
                  });
                  CheckValid(item.id, "VNPAY");
                }}
              >
                Thanh toán VNPAY
              </Button>
              <Button
                color="blue"
                onClick={() => {
                  setInfo({
                    id: item.id,
                    paymentMethod: "PAYPAL",
                  });
                  CheckValid(item.id, "PAYPAL");
                }}
              >
                Thanh toán PAYPAL
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
      <Dialog open={open} handler={handleOpen}>
        <DialogHeader>Xác nhận thông tin</DialogHeader>
        <DialogBody>
          Nếu bạn mua gói này, gói cũ sẽ bị mất và chỉ tồn tại gói mới. Bạn vui
          lòng liên hệ Admin để được hỗ trợ thanh toán tiền của gói cũ nhé !!!
        </DialogBody>
        <DialogFooter>
          <Button
            variant="text"
            color="red"
            onClick={handleOpen}
            className="mr-1"
          >
            <span>Đóng</span>
          </Button>
          <Button variant="gradient" color="blue" onClick={() => HandleBuy()}>
            <span>Xác nhận</span>
          </Button>
        </DialogFooter>
      </Dialog>
    </div>
  );
}

export default Marketing;
