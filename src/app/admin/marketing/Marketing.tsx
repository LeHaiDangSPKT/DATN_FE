import React from "react";
import SortTable from "@/components/SortTable";
import { APIProposeStores } from "@/services/Propose";
import { Typography } from "@material-tailwind/react";
import { fetchData } from "next-auth/client/_utils";
import Image from "next/image";
import formatToDDMMYYYY from "@/utils/formatToDDMMYYYY";
import FormatMoney from "@/utils/FormatMoney";
import ConvertDate from "@/utils/ConvertDate";

function Marketing() {
  const arrTitle = [
    {
      title: "",
      sort: false,
      name: "index",
    },
    {
      title: "Tên cửa hàng",
      sort: false,
      name: "name",
    },
    {
      title: "Số điện thoại",
      sort: false,
      name: "email",
    },
    {
      title: "Giá gói",
      sort: false,
      name: "price",
    },
    {
      title: "Thời gian",
      sort: false,
      name: "time",
    },
    // {
    //   title: "Ngày tham gia",
    //   sort: false,
    //   name: "date",
    // },
  ];
  const [listStore, setListStore] = React.useState<any>();

  React.useEffect(() => {
    const fetchData = async () => {
      const res = await APIProposeStores();
      setListStore(res);
    };
    fetchData();
  }, []);
  return (
    <>
      <Typography color="blue-gray" className="text-center mb-4" variant="h4">
        Danh sách cửa hàng đã đăng ký quảng cáo
      </Typography>
      <SortTable title={arrTitle}>
        {listStore?.map((item: any, index: number) => (
          <tr
            className="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
            key={index}
          >
            <td className="px-6 py-4 text-center flex justify-center items-center">
              <Typography color="gray">{index + 1} .</Typography>
              <Image
                src={item.storeAvatar}
                width={50}
                height={50}
                className="rounded-full mx-auto"
                alt=""
              />
            </td>
            <td className="px-6 py-4 text-center">{item.storeName}</td>
            <td className="px-6 py-4 text-center">
              {item.storePhoneNumber[0]}
            </td>
            <td className="px-6 py-4 text-center">{FormatMoney(item.price)}</td>
            <td className="px-6 py-4 text-center">
              {ConvertDate(item.startTime)} - {ConvertDate(item.endTime)}
            </td>
          </tr>
        ))}
      </SortTable>
    </>
  );
}

export default Marketing;
