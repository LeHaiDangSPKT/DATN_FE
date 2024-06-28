"use client";
import React from "react";
import Info from "../seller/[MyStore]/Info";
import { APIGetStoreById } from "@/services/Store";
import { useParams } from "next/navigation";
import { APIGetListProductInStore } from "@/services/Product";
import CardProduct from "@/components/CardProduct";
import Promotion from "@/components/Promotion";
interface DetailStore {
  averageStar: number;
  totalFeedback: number;
  totalFollow: number;
  totalRevenue: number;
  totalDelivered: number;
}

interface Store {
  _id: string;
  avatar: string;
  name: string;
  address: string;
  phoneNumber: string[];
  description: string;
  warningCount: number;
  status: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
  userId: string;
}
function DetailStore() {
  const [detailStore, setDetailStore] = React.useState<DetailStore>(
    {} as DetailStore
  );
  const [storeProps, setStoreProps] = React.useState<Store>({} as Store);
  const [productsOrderCurrent, setProductsOrderCurrent] = React.useState([]);
  const [user, setUser] = React.useState<any>();
  const params = useParams();

  React.useEffect(() => {
    const fetchData = async () => {
      const res = await APIGetStoreById(params.id as string);
      setStoreProps(res?.metadata.data.store);
      setDetailStore({
        averageStar: res.metadata.data.averageStar,
        totalFeedback: res.metadata.data.totalFeedback,
        totalFollow: res.metadata.data.totalFollow,
        totalRevenue: res.metadata.data.totalRevenue,
        totalDelivered: res.metadata.data.totalDelivered,
      });
    };
    fetchData();
  }, [params.id]);
  React.useEffect(() => {
    const fetchData = async () => {
      await APIGetListProductInStore(1, 20, "", params.id).then((res) => {
        setProductsOrderCurrent(res?.metadata.data);
      });
    };
    fetchData();
  }, [params.id]);

  React.useEffect(() => {
    const user = localStorage.getItem("user")
      ? JSON.parse(localStorage.getItem("user") ?? "")
      : null;
    user && setUser(user?.providerData[0]);
  }, []);
  return (
    <div className="min-h-screen sm:px-[150px] sm:my-4">
      {storeProps._id && (
        <Info detailStore={detailStore} storeProps={storeProps} />
      )}
      {user && <Promotion storeId={storeProps._id} />}

      <div className="flex flex-col w-full bg-white rounded-md py-2 px-4 mb-5">
        <p className="text-lg font-bold my-4">
          Các sản phẩm khác của cửa hàng:
        </p>
        <div className="sm:grid grid-cols-4 gap-4">
          {productsOrderCurrent.map((item: any, index: number) => (
            <CardProduct key={index} data={item} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default DetailStore;
