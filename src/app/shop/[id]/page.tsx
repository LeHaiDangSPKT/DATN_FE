"use client";
import React from "react";
import Info from "../seller/[MyStore]/Info";
import { APIGetStoreById } from "@/services/Store";
import { useParams } from "next/navigation";
import {
  APIGetListProductInStore,
  APIGetListProductOtherInStore,
} from "@/services/Product";
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

  const params = useParams();

  React.useEffect(() => {
    const fetchData = async () => {
      const res = await APIGetStoreById(params.id as string);
      console.log("ssss", res);
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
  return (
    <div className="min-h-screen px-[150px] my-4">
      {storeProps._id && (
        <Info detailStore={detailStore} storeProps={storeProps} />
      )}
      <Promotion storeId={storeProps._id} />

      <div className="flex flex-col w-full bg-white rounded-md py-2 px-4 mb-5">
        <p className="text-lg font-bold my-4">
          Các sản phẩm khác của cửa hàng:
        </p>
        <div className="grid grid-cols-4 gap-4">
          {productsOrderCurrent.map((item: any, index: number) => (
            <CardProduct key={index} data={item} />

            // <div
            //   key={index}
            //   className="p-1 rounded-sm flex flex-col hover:cursor-pointer hover:shadow-[0px_0px_20px_rgba(0,0,0,0.1)]"
            //   onClick={(e) => (window.location.href = `/product/${item._id}`)}
            // >
            //   <img
            //     src={item?.avatar[0]}
            //     className="rounded-t-md inset-0 w-full h-[214px] object-cover hover:shadow-xl"
            //     alt=""
            //   />
            //   <div className="px-2  mt-2">
            //     <div className="text-ellipsis line-clamp-3 h-[64px] mb-4 text-sm">
            //       {item.productName}
            //     </div>
            //     <div className="flex justify-between items-center font-bold mb-2">
            //       <div className={item.price != 0 ? "" : "hidden"}>
            //         {Number(item.price).toLocaleString("en-US", {})}{" "}
            //         <sup>đ</sup>
            //       </div>
            //       <div className="text-sm leading-7">
            //         Còn lại: {item.quantity}
            //       </div>
            //     </div>
            //     <hr />
            //     <div className="text-center my-2">
            //       {item.price != 0 ? "Hàng bán" : "Hàng tặng"}
            //     </div>
            //   </div>
            // </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default DetailStore;
