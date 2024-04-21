import SortTable from "@/components/SortTable";
import formatToDDMMYYYY from "@/utils/formatToDDMMYYYY";
import React from "react";
import {
  APIGetAllStore,
  APIGetListStore,
  APIGetStoreAdmin,
} from "@/services/Store";
import Info from "../shop/seller/[MyStore]/Info";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import Report from "@/components/Report";
import Toast from "@/utils/Toast";
import FormatMoney from "@/utils/FormatMoney";
import { exportExcel } from "@/utils/ExportExcel";
import ConvertDate from "@/utils/ConvertDate";

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

interface ListStore {
  total: number;
  stores: Store[];
}

function ManagerStore() {
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
    {
      title: "",
      sort: false,
      name: "",
    },
  ];
  const ref = React.useRef<HTMLDivElement | null>(null);
  const [page, setPage] = React.useState<number>(1);
  const [search, setSearch] = React.useState<string>("");
  // "", current, approve
  const [reportState, setReportState] = React.useState("");
  const [currentStore, setCurrentStore] = React.useState<Store>({} as Store);
  const [listStore, setListStore] = React.useState<ListStore>({} as ListStore);
  const [isShowDetail, setIsShowDetail] = React.useState<boolean>(false);
  const [detailStore, setDetailStore] = React.useState({} as DetailStore);
  React.useEffect(() => {
    const fetchData = async () => {
      await APIGetListStore(page || 1, 20, search).then((res) => {
        setListStore(res?.metadata.data);
      });
    };
    fetchData();
  }, [page, search]);
  const DetailStore = async (store: Store) => {
    setCurrentStore(store);
    setIsShowDetail(true);
    ref.current?.scrollIntoView({ behavior: "smooth" });
    // get api APIGetProductAdmin
    await APIGetStoreAdmin(store._id).then((res) => {
      const data = res.metadata;
      setDetailStore({
        averageStar: data.averageStar || 0,
        totalFeedback: data.totalFeedback || 0,
        totalFollow: data.totalFollow || 0,
        totalRevenue: data.totalRevenue || 0,
        totalDelivered: data.totalDelivered || 0,
      });
    });
  };

  const ExportExcel = async () => {
    Toast("success", "File sẽ được tải về sau 2 giây nữa...", 2000);
    setTimeout(async () => {
      const data = await APIGetAllStore();
      const dataExcel = data.metadata.data?.map((item: any, index: any) => {
        return {
          STT: index + 1,
          "Tên cửa hàng": item.store.name,
          "Địa chỉ": item.store.address,
          "Số điện thoại 1": item.store.phoneNumber[0] || "",
          "Số điện thoại 2": item.store.phoneNumber[1] || "",
          "Đánh giá trung bình (sao)": item.averageStar,
          "Người theo dõi": item.totalFollow,
          "Đơn bán": item.totalDelivered,
          "Bình luận": item.totalFeedback,
          "Doanh thu": FormatMoney(item.totalRevenue),
          "Cảnh báo": item.store.warningCount,
          "Ngày tham gia": ConvertDate(item.store.createdAt),
        };
      });
      exportExcel(dataExcel, "Danh sách cửa hàng", "Danh sách cửa hàng");
    }, 2000);
  };
  return (
    <div className="min-h-screen my-5">
      <div
        className={`${
          !reportState && "flex-row-reverse"
        } justify-between flex items-center mt-5 mb-3 z-10`}
      >
        {reportState == "" && (
          <div
            className="flex items-center cursor-pointer"
            onClick={(e) => {
              setReportState("current");
            }}
          >
            Xem các báo cáo <FaArrowRight className="ml-2" />
          </div>
        )}
        {reportState == "current" && (
          <>
            <div
              className="flex items-center cursor-pointer "
              onClick={(e) => {
                setReportState("");
              }}
            >
              <FaArrowLeft className="mr-2" /> Trở về trang tổng quan
            </div>
            <div
              className="flex items-center cursor-pointer"
              onClick={(e) => {
                setReportState("approve");
              }}
            >
              Xem các báo cáo đã chấp thuận <FaArrowRight className="ml-2" />
            </div>
          </>
        )}
        {reportState == "approve" && (
          <>
            <div
              className="flex items-center cursor-pointer "
              onClick={(e) => {
                setReportState("current");
              }}
            >
              <FaArrowLeft className="mr-2" /> Xem các báo cáo
            </div>
          </>
        )}
      </div>
      {reportState ? (
        <Report type="store" status={reportState == "current" ? false : true} />
      ) : (
        <>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const search = document.getElementById(
                "default-search"
              ) as HTMLInputElement;
              setIsShowDetail(false);
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
                placeholder="Nhập thông tin tìm kiếm theo tên, email, số điện thoại"
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
            totalPage={listStore.total}
            currentPage={page}
            setPage={(data) => setPage(data)}
            perPage={20}
          >
            {listStore.stores?.map((item, index) => (
              <tr
                className="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
                key={index}
              >
                <td className="px-6 py-4 text-center">
                  {(page - 1) * 10 + index + 1}
                </td>
                <td className="px-6 py-4 text-center">{item.name}</td>
                <td className="px-6 py-4 text-center">{item.address}</td>
                <td className="px-6 py-4 text-center">
                  {formatToDDMMYYYY(item.createdAt)}
                </td>
                <td>
                  <div
                    className="px-6 text-center font-medium text-blue-600 dark:text-blue-500 hover:underline cursor-pointer"
                    onClick={(e) => {
                      DetailStore(item);
                    }}
                  >
                    Xem chi tiết
                  </div>
                </td>
              </tr>
            ))}
          </SortTable>
          <div ref={ref} className="mb-5"></div>
          {currentStore && isShowDetail && (
            <Info
              storeProps={currentStore}
              detailStore={detailStore}
              setIsShowDetail={(data) => setIsShowDetail(data)}
            />
          )}
        </>
      )}
    </div>
  );
}

export default ManagerStore;
