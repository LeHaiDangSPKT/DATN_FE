"use client";
import SortTable from "@/components/SortTable";
import { APIGetListStoreFollow } from "@/services/User";
import formatToDDMMYYYY from "@/utils/formatToDDMMYYYY";
import { Button, Input } from "@material-tailwind/react";
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
  const [click, setClick] = React.useState<boolean>(false);
  const onChange = ({ target }: any) => setSearch(target.value);

  React.useEffect(() => {
    document.getElementById("loading-page")?.classList.add("hidden");
    const getListStore = async () => {
      const res = await APIGetListStoreFollow(page, 20, search);
      setListStore(res?.data.metadata);
    };
    getListStore();
  }, [page, click]);
  return (
    <div className="min-h-screen my-5 px-3">
      <div className="text-xl sm:text-2xl font-bold text-center mb-5">
        Danh sách của hàng đã theo dõi
      </div>
      <div className="relative flex w-full mb-4">
        <Input
          type="text"
          label="Tìm kiếm..."
          value={search}
          onChange={onChange}
          className="pr-20"
          containerProps={{
            className: "min-w-0",
          }}
          crossOrigin={undefined}
        />
        <Button
          size="sm"
          color={search ? "gray" : "blue-gray"}
          disabled={!search}
          className="!absolute right-1 top-1 rounded"
          onClick={() => {
            if (page == 1) {
              setClick(!click);
            } else {
              setPage(1);
            }
          }}
        >
          Tìm kiếm
        </Button>
      </div>
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
