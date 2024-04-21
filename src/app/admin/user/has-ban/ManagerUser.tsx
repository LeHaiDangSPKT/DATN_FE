"use client";
import SortTable from "@/components/SortTable";
import {
  APIGetAllUser,
  APIGetListUser,
  APIGetListUserBanned,
  APIGetListUserWarning,
} from "@/services/User";
import ConvertDate from "@/utils/ConvertDate";
import { exportExcel } from "@/utils/ExportExcel";
import FormatMoney from "@/utils/FormatMoney";
import Toast from "@/utils/Toast";
import formatToDDMMYYYY from "@/utils/formatToDDMMYYYY";
import Image from "next/image";

import {
  Button,
  Card,
  CardBody,
  CardFooter,
  Collapse,
  Dialog,
  DialogBody,
  DialogFooter,
  DialogHeader,
  Radio,
  Typography,
} from "@material-tailwind/react";
import React from "react";
import { APIDeleteReport, APIGetReportUser } from "@/services/Report";

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

interface ListReport {
  content: string;
  createdAt: string;
  subjectId: string;
  type: string;
  _id: string;
}
function ManagerUser() {
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
  const [page, setPage] = React.useState<number>(1);
  const [currentReport, setCurrentReport] = React.useState<string>(
    "" as string
  );
  const [currentUser, setCurrentUser] = React.useState<string>("" as string);
  const [search, setSearch] = React.useState<string>("");
  const [listUser, setListUser] = React.useState<ListUser>({} as ListUser);
  const [open, setOpen] = React.useState(false);
  const [openCollapse, setOpenCollapse] = React.useState(false);
  const handleOpen = () => setOpen(!open);
  const [listReport, setListReport] = React.useState<ListReport[]>();
  React.useEffect(() => {
    const fetchData = async () => {
      await APIGetListUserBanned(page || 1, 20, search).then((res) =>
        setListUser(res)
      );
    };
    fetchData();
  }, [page, search]);
  const ExportExcel = async () => {
    Toast("success", "File sẽ được tải về sau 2 giây nữa...", 2000);
    setTimeout(async () => {
      const data = await APIGetAllUser();
      const dataExcel = data.metadata.data?.map((item: any, index: any) => {
        return {
          STT: index + 1,
          "Tên người dùng": item.fullName,
          Email: item.email,
          "Giới tính": item.gender || "Khác",
          "Số điện thoại": item.phone,
          "Số lượng cửa hàng đang theo dõi": item.followStores.length,
          "Số lượng bạn bè": item.friends.length,
          "Số lượng đơn hàng đã mua": item.totalBills,
          "Số số tiền đã mua": FormatMoney(item.totalPricePaid),
          "Số lượng quà đã nhận": item.totalReceived,
          "Số lần bị cảnh báo": item.warningCount,
          "Tổng xu hiện có": item.wallet,
          "Ngày tham gia": ConvertDate(item.createdAt),
        };
      });
      exportExcel(dataExcel, "Danh sách người dùng", "Danh sách người dùng");
    }, 2000);
  };

  const HandleOpenPopUp = async (id: string) => {
    setCurrentReport("");
    setCurrentUser(id);
    const response = await APIGetReportUser(id);
    const data = response as ListReport[];
    setListReport(data || []);
    setOpen(true);
  };

  const HandleUnbanned = async () => {
    if (currentReport) {
      await APIDeleteReport(currentReport);
      setOpen(false);
      setListUser({
        ...listUser,
        data: listUser.data?.filter((item) => item._id !== currentUser),
      } as ListUser);
      Toast("success", "Mở khoá tài khoản thành công", 2000);
      setCurrentUser("");
    } else {
      setOpenCollapse(true);
      setTimeout(() => {
        setOpenCollapse(false);
      }, 2000);
    }
  };
  return (
    <div className="min-h-screen my-5">
      {/* Search */}

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
      <div className="flex justify-end mb-5">
        <button
          className="px-4 py-2 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          onClick={() => ExportExcel()}
        >
          Xuất file excel
        </button>
      </div>
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
              <div
                className="px-6 text-center font-medium text-blue-600 dark:text-blue-500 hover:underline cursor-pointer"
                onClick={(e) => HandleOpenPopUp(item._id)}
              >
                Xem báo cáo
              </div>
            </td>
          </tr>
        ))}
      </SortTable>
      <Dialog open={open} handler={handleOpen}>
        <DialogHeader>Danh sách báo cáo</DialogHeader>
        <Collapse open={openCollapse}>
          <Card className="text-center my-4 mx-auto w-8/12">
            <CardBody>
              <Typography>
                Bạn chưa chọn báo cáo nào để mở khoá tài khoản
              </Typography>
            </CardBody>
          </Card>
        </Collapse>
        <DialogBody>
          {listReport?.map((item: ListReport, index: number) => (
            <div key={index} className="flex items-center justify-center">
              <Radio
                onChange={() => setCurrentReport(item._id)}
                name="type"
                label=""
                crossOrigin={undefined}
              />
              <Card className="mt-2 w-full">
                <CardBody>
                  <div className="flex justify-between items-center gap-7 pt-2">
                    <Typography variant="h6" color="blue-gray" className="mb-2">
                      Lần báo cáo {index + 1}
                    </Typography>
                    <Typography
                      variant="h6"
                      color="blue-gray"
                      className="italic mb-2"
                    >
                      {ConvertDate(item.createdAt)}
                    </Typography>
                  </div>
                  <Typography>{item.content}</Typography>
                </CardBody>
              </Card>
            </div>
          ))}
        </DialogBody>
        <DialogFooter>
          <Button
            variant="text"
            color="green"
            onClick={(e) => HandleUnbanned()}
            className="mr-1"
          >
            <span>Xoá báo cáo và mở khoá</span>
          </Button>
          <Button
            variant="text"
            color="red"
            onClick={(e) => {
              setOpen(false);
              setCurrentUser("");
            }}
            className="mr-1"
          >
            <span>Đóng</span>
          </Button>
        </DialogFooter>
      </Dialog>
    </div>
  );
}

export default ManagerUser;
