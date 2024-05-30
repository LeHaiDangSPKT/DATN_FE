import React from "react";
import SortTable from "./SortTable";
import {
  APIDeleteReport,
  APIReportAdmin,
  APIUpdateReport,
} from "@/services/Report";
import ConvertDate from "@/utils/ConvertDate";
import Modal from "./Modal";
import Toast from "@/utils/Toast";
import { exportExcel } from "@/utils/ExportExcel";
interface Props {
  type: string;
  status: boolean;
}

interface Report {
  _id: string;
  userName: string;
  name: string;
  content: string;
  createdAt: string;
}
interface TypeObject {
  [key: string]: {
    mes: string;
    func: () => void;
  };
}

function Report(props: Props) {
  const { type, status } = props;
  const [page, setPage] = React.useState<any>(1);
  const [total, setTotal] = React.useState<any>(0);
  const [listReport, setListReport] = React.useState<Report[]>([]);
  const [isShow, setIsShow] = React.useState<boolean>(false);
  const [currentId, setCurrentId] = React.useState<string>("");
  const [typeMes, setTypeMes] = React.useState<string>("");
  const [search, setSearch] = React.useState<string>("");

  React.useEffect(() => {
    const fetchData = async () => {
      await APIReportAdmin(page || 1, 20, type, status, search).then((res) => {
        setTotal(res?.total);
        setListReport(
          res.data.map((item: any) => {
            return {
              ...item,
              name: item.productName || item.storeName,
            };
          })
        );
      });
    };
    fetchData();
  }, [page, status]);
  const arrTitle = [
    {
      title: "STT",
      sort: false,
      name: "index",
    },
    {
      title: "Người báo cáo",
      sort: false,
      name: "user",
    },
    {
      title: type == "PRODUCT" ? "Sản phẩm bị báo cáo" : "Cửa hàng bị báo cáo",
      sort: false,
      name: "product",
    },
    {
      title: "Lý do",
      sort: false,
      name: "reason",
    },
    {
      title: "Ngày tạo",
      sort: false,
      name: "createdAt",
    },
    {
      title: "Thao tác",
      sort: false,
      name: "action",
    },
  ];
  const typeOb: TypeObject = {
    ok: {
      mes: "Bạn chắn chắn ĐỒNG Ý báo cáo này?",
      func: () => OK(),
    },
    refuse: {
      mes: "Bạn chắn chắn TỪ CHỐI báo cáo này?",
      func: () => Refuse(),
    },
  };
  const OK = async () => {
    await APIUpdateReport(currentId).then((res) => {
      if (res?.status == 200 || res?.status == 201) {
        setIsShow(false);
        Toast("success", res.data.message, 2000);
        setListReport(listReport.filter((item) => item._id != currentId));
      }
    });
  };
  const Refuse = async () => {
    await APIDeleteReport(currentId).then((res) => {
      if (res?.status == 200 || res?.status == 201) {
        setIsShow(false);
        Toast("success", res.data.message, 2000);
        setListReport(listReport.filter((item) => item._id != currentId));
      }
    });
  };

  const ExportExcel = async () => {
    if (type == "PRODUCT") {
      // if (status) exportExcel("reports/excel");
      // else exportExcel("stores/excel/being-reported");
      console.log("Đang làm");
    } else {
      if (status) exportExcel("reports/excel");
      else exportExcel("stores/excel/being-reported");
    }
  };
  return (
    <>
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
            placeholder="Nhập thông tin tìm kiếm..."
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
        title={arrTitle}
        totalPage={total}
        currentPage={page}
        setPage={(data) => setPage(data)}
        perPage={20}
      >
        {listReport?.map((item, index) => (
          <tr
            className="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
            key={index}
          >
            <td className="px-6 py-4 text-center">
              {(page - 1) * 10 + index + 1}
            </td>
            <td className="px-6 py-4 text-center">{item.userName}</td>
            <td className="px-6 py-4 text-center">{item.name}</td>
            <td className="px-6 py-4 text-center">{item.content}</td>
            <td className="px-6 py-4 text-center">
              {ConvertDate(item.createdAt)}
            </td>
            <td>
              {!status && (
                <div
                  className="px-6 text-center font-medium text-blue-600 dark:text-blue-500 hover:underline cursor-pointer m-1"
                  onClick={(e) => {
                    setTypeMes("ok");
                    setIsShow(true);
                    setCurrentId(item._id);
                  }}
                >
                  Đồng ý
                </div>
              )}
              <div
                className="px-6 text-center font-medium text-red-600 dark:text-red-500 hover:underline cursor-pointer m-1"
                onClick={(e) => {
                  setTypeMes("refuse");
                  setIsShow(true);
                  setCurrentId(item._id);
                }}
              >
                {status ? "Xoá" : "Từ chối"}{" "}
              </div>
            </td>
          </tr>
        ))}
      </SortTable>
      <Modal
        isShow={isShow}
        setIsShow={(data: any) => setIsShow(data)}
        confirm={() => {
          typeOb[typeMes]?.func();
        }}
        title="Thông báo xác nhận"
      >
        <div className="font-bold text-lg text-center">
          {typeOb[typeMes]?.mes}
        </div>
      </Modal>
    </>
  );
}

export default Report;
