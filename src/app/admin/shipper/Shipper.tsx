"use client";
import SortTable from "@/components/SortTable";
import React from "react";
import Image from "next/image";
import formatToDDMMYYYY from "@/utils/formatToDDMMYYYY";

interface ListUser {
  total: number;
  data: [
    {
      _id: string;
      avatar: string;
      fullName: string;
      email: string;
      password: string;
      address: [];
      phone: string;
      friends: [];
      followStores: [];
      wallet: number;
      warningCount: number;
      status: boolean;
      createdAt: string;
      updatedAt: string;
      __v: number;
    }
  ];
}
function Shipper() {
  const arrTitleUser = [
    {
      title: "",
      sort: false,
      name: "index",
    },
    {
      title: "Tên người dùng",
      sort: false,
      name: "name",
    },
    {
      title: "Email",
      sort: false,
      name: "email",
    },
    {
      title: "Ngày tham gia",
      sort: false,
      name: "date",
    },
    {
      title: "",
      sort: false,
      name: "",
    },
  ];
  const [listUser, setListUser] = React.useState<ListUser>({} as ListUser);
  const [page, setPage] = React.useState<number>(1);

  return (
    <div className="min-h-screen my-5">
      <SortTable
        title={arrTitleUser}
        totalPage={listUser.total}
        currentPage={page}
        setPage={(data) => setPage(data)}
        perPage={20}
      >
        {listUser.data?.map((item, index) => (
          <tr
            className="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
            key={index}
          >
            <td className="px-6 py-4 text-center">
              <Image
                src={item.avatar}
                width={50}
                height={50}
                className="rounded-full mx-auto"
                alt=""
              />
            </td>
            <td className="px-6 py-4 text-center">{item.fullName}</td>
            <td className="px-6 py-4 text-center">{item.email}</td>
            <td className="px-6 py-4 text-center">
              {formatToDDMMYYYY(item.createdAt)}
            </td>
            <td>
              <div className="px-6 text-center font-medium text-blue-600 dark:text-blue-500 hover:underline cursor-pointer">
                Xem chi tiết
              </div>
            </td>
          </tr>
        ))}
      </SortTable>
    </div>
  );
}

export default Shipper;
