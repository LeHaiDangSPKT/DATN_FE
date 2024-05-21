"use client";
import SortTable from "@/components/SortTable";
import { APIGetListStoreFollow } from "@/services/User";
import formatToDDMMYYYY from "@/utils/formatToDDMMYYYY";
import { useRouter } from "next/navigation";
import React from "react";
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
interface ListStore {
  total: number;
  data: Store[];
}
function StoreFollow() {
  const router = useRouter();
  const [page, setPage] = React.useState<number>(1);
  const [search, setSearch] = React.useState<string>("");

  const [listStore, setListStore] = React.useState<ListStore>({} as ListStore);

  const arrTitleUser = [
    {
      title: "STT",
      sort: false,
      name: "index",
    },
    {
      title: "Tên cửa hàng",
      sort: false,
      name: "name",
    },
    {
      title: "Địa chỉ",
      sort: false,
      name: "email",
    },
    {
      title: "Ngày tham gia",
      sort: false,
      name: "date",
    },
  ];

  React.useEffect(() => {
    const getListStore = async () => {
      const res = await APIGetListStoreFollow(page, 20, search);
      setListStore(res?.data.metadata);
    };
    getListStore();
  }, [page, search]);
  return (
    <div className="min-h-screen my-5 px-3">
      <div className="text-2xl font-bold text-center mb-5">
        Danh sách của hàng đã theo dõi
      </div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          const search = document.getElementById(
            "default-search"
          ) as HTMLInputElement;
          setSearch(search.value);
          setPage(1);
        }}
        className="mb-5 "
      >
        <div className="">
          <div className="absolute top-[150px] flex items-center ps-3 pointer-events-none">
            <svg
              className="w-4 h-4 text-gray-500 dark:text-gray-400"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 20 20"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
              />
            </svg>
          </div>
          <input
            type="search"
            id="default-search"
            className="block w-full p-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 outline-none "
            placeholder="Nhập thông tin tìm kiếm theo tên sản phẩm, mô tả, thể loại..."
          ></input>
          <button
            type="submit"
            className="text-white absolute top-[140px] right-[18px] py-2 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          >
            Tìm kiếm
          </button>
        </div>
      </form>
      <SortTable
        title={arrTitleUser}
        totalPage={listStore.total}
        currentPage={page}
        setPage={(data) => setPage(data)}
        perPage={20}
      >
        {listStore.data?.map((item, index) => (
          <tr
            className="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
            key={index}
          >
            <td className="px-6 py-4 text-center">
              {(page - 1) * 10 + index + 1}
            </td>
            <td
              className="px-6 py-4 text-center cursor-pointer"
              onClick={(e) => {
                document
                  .getElementById("loading-page")
                  ?.classList.add("hidden");
                router.push(`/shop/${item._id}`);
              }}
            >
              {item.name}
            </td>
            <td className="px-6 py-4 text-center">{item.address}</td>
            <td className="px-6 py-4 text-center">
              {formatToDDMMYYYY(item.createdAt)}
            </td>
          </tr>
        ))}
      </SortTable>
    </div>
  );
}

export default StoreFollow;
