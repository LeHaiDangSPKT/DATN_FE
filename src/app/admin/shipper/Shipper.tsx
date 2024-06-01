"use client";
import SortTable from "@/components/SortTable";
import React from "react";
import Image from "next/image";
import { APIActiveShippers, APIGetListShippers } from "@/services/Shipper";
import {
  Button,
  Dialog,
  DialogBody,
  DialogFooter,
  DialogHeader,
  Input,
} from "@material-tailwind/react";
import Toast from "@/utils/Toast";
import { exportExcel } from "@/utils/ExportExcel";

interface ListUser {
  total: number;
  data: {
    address: string;
    avatar: string;
    createdAt: string;
    emailShipper: string;
    gender: string;
    id: string;
    name: string;
    phone: string;
  }[];
}
function Shipper(props: { state: boolean }) {
  const { state } = props;

  const arrTitleUser = [
    {
      title: "",
      sort: false,
      name: "index",
    },
    {
      title: "Giới tính",
      sort: false,
      name: "gender",
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
      title: "Số điện thoại",
      sort: false,
      name: "phone",
    },
    {
      title: "Địa chỉ",
      sort: false,
      name: "address",
    },
    {
      title: "",
      sort: false,
      name: "",
    },
  ];
  const [listUser, setListUser] = React.useState<ListUser>({} as ListUser);
  const [page, setPage] = React.useState<number>(1);
  const [search, setSearch] = React.useState<string>("");
  const [open, setOpen] = React.useState(false);
  const [curentUser, setCurentUser] = React.useState<any>({} as any);
  const handleOpen = () => setOpen(!open);
  const [userName, setUserName] = React.useState<string>("" as string);
  React.useEffect(() => {
    const fetchData = async () => {
      const res = await APIGetListShippers(page, 20, search, state);
      setListUser({
        total: res.total,
        data: res.data,
      });
    };
    fetchData();
  }, [page, search]);
  const ExportExcel = async () => {
    exportExcel("shippers/excel");
  };
  const Approval = async () => {
    if (!userName) {
      return;
    }
    handleOpen();
    const res = await APIActiveShippers(curentUser.id, userName);
    if (res?.status == 200 || res?.status == 201) {
      Toast("success", res.data.message, 2000);
      // Lọc lại listUser
      const newListUser = listUser.data.filter(
        (item) => item.id !== curentUser.id
      );
      setListUser({
        total: listUser.total - 1,
        data: newListUser,
      });
    } else {
      Toast("error", res?.data.message, 2000);
    }
  };
  return (
    <div className="min-h-screen my-5">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          const search = document.getElementById(
            "default-search"
          ) as HTMLInputElement;
          setSearch(search.value);
          setPage(1);
        }}
        className="mb-5"
      >
        <div className="relative">
          <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
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
            placeholder="Nhập thông tin tìm kiếm theo tên, email, số điện thoại..."
          ></input>
          <button
            type="submit"
            className="text-white absolute end-2.5 bottom-2.5 py-2 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          >
            Tìm kiếm
          </button>
        </div>
      </form>
      {state && (
        <div className="flex justify-end mb-5">
          <button
            className="px-4 py-2 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            onClick={() => ExportExcel()}
          >
            Xuất file excel
          </button>
        </div>
      )}
      <SortTable
        title={state ? arrTitleUser.slice(0, 6) : arrTitleUser}
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
                width={200}
                height={200}
                className="rounded-full mx-auto w-[50px] h-[50px]"
                alt=""
              />
            </td>
            <td className="px-6 py-4 text-center">{item.gender}</td>
            <td className="px-6 py-4 text-center">{item.name}</td>
            <td className="px-6 py-4 text-center">{item.emailShipper}</td>
            <td className="px-6 py-4 text-center">{item.phone}</td>
            <td className="px-6 py-4 text-center">{item.address}</td>

            {!state && (
              <td>
                <div
                  className="px-6 text-center font-medium text-blue-600 dark:text-blue-500 hover:underline cursor-pointer"
                  onClick={(e) => {
                    handleOpen();
                    setCurentUser(item);
                  }}
                >
                  Chưa duyệt
                </div>
              </td>
            )}
          </tr>
        ))}
      </SortTable>
      <Dialog open={open} handler={handleOpen}>
        <DialogHeader>Duyệt hồ sơ</DialogHeader>
        <DialogBody>
          <div className="text-center">
            <Input
              error={userName === "" ? true : false}
              label="Nhập username"
              type="text"
              className="w-full p-2 border border-gray-300 rounded-lg"
              onChange={(e) => setUserName(e.target.value)}
              crossOrigin={undefined}
            />
            <span className="text-sm italic">
              Sau khi duyệt, người dùng sẽ được chuyển sang trạng thái hoạt động
              là một shipper !
            </span>
          </div>
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
          <Button variant="gradient" color="green" onClick={(e) => Approval()}>
            <span>Duyệt</span>
          </Button>
        </DialogFooter>
      </Dialog>
    </div>
  );
}

export default Shipper;
