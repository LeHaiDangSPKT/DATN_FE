import { APIPromotion, APISaveVoucher } from "@/services/Promotion";
import React from "react";
import {
  Card,
  CardBody,
  CardFooter,
  Typography,
  Button,
  Progress,
} from "@material-tailwind/react";
import formatToDDMMYYYY from "@/utils/formatToDDMMYYYY";
import Toast from "@/utils/Toast";
import Modal from "@/components/Modal";
import Form from "@/app/login/Form";
import FormatMoney from "@/utils/FormatMoney";
interface PromotionInterface {
  storeId: string;
}

function Promotion(props: PromotionInterface) {
  const { storeId } = props;
  const [promotion, setPromotion] = React.useState<any>([]);
  const [loading, setLoading] = React.useState<boolean>(false);
  const [currentId, setCurrentId] = React.useState<string>("");
  const [user, setUser] = React.useState<any>({});
  const [showLogin, setShowLogin] = React.useState(false);

  React.useEffect(() => {
    const fetchPromotion = async () => {
      const res = await APIPromotion(storeId);
      setPromotion(res?.data.metadata.data);
    };
    fetchPromotion();
  }, [storeId]);
  React.useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") as string);
    setUser(user);
  }, []);
  const SavePromotion = async (id: string) => {
    setLoading(true);
    setCurrentId(id);
    if (!user) {
      Toast("error", "Bạn cần đăng nhập để báo cáo sản phẩm này", 2000);
      setShowLogin(true);
      return;
    }
    const res = await APISaveVoucher(id);
    if (res?.status === 200 || res?.status === 201) {
      Toast("success", res.data.message, 2000);
      const newPromotion = promotion.map((item: any) => {
        if (item.id === id) {
          item.isSaved = !item.isSaved;
        }
        return item;
      });
      setPromotion(newPromotion);
    } else {
      Toast("error", "Thất bại", 2000);
    }
    setLoading(false);
  };
  return (
    <>
      {promotion.length > 0 && (
        <div className="mb-3 bg-white rounded-md p-4 w-full col-span-4 flex flex-col border-solid">
          <p className="text-lg font-bold mb-2">Các mã khuyến mãi:</p>
          <div className="block sm:grid grid-cols-4 gap-2">
            {promotion.map((item: any, index: number) => (
              <Card className="" key={index}>
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
                <CardFooter className="pt-0 mx-auto">
                  <Button
                    loading={loading && item.id == currentId}
                    onClick={(e) => SavePromotion(item.id)}
                  >
                    {item.isSaved ? "Đã lưu mã" : "Lưu mã"}
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
          <Modal
            isShow={showLogin}
            setIsShow={(e) => setShowLogin(false)}
            confirm={() => console.log("sss")}
            title={"Đăng nhập để tiếp tục"}
            fastLogin={true}
          >
            <Form fastLogin={true} />
          </Modal>
        </div>
      )}
    </>
  );
}

export default Promotion;
