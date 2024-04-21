import React from "react";
import { Line, Pie } from "react-chartjs-2";
import {
  Chart,
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  Tooltip,
  Title,
  ArcElement,
} from "chart.js";
import Image from "next/image";
import {
  APIGetCharityByYear,
  APIGetCountBillAdmin,
  APIGetCountBillByStatus,
  APIGetRevenueByYear,
  APIGetRevenueByYearAdmin,
  APIGetUserMostBill,
} from "@/services/Bill";
import FormatMoney from "@/utils/FormatMoney";
import { FaBoxOpen, FaKaaba, FaStore, FaUser } from "react-icons/fa";
import { MdAttachMoney } from "react-icons/md";
import FormatDecimal from "@/utils/FormatDecimal";
import SortTable from "@/components/SortTable";
import { APIGetStoreMostProduct } from "@/services/Store";
import { set } from "firebase/database";
import formatToDDMMYYYY from "@/utils/formatToDDMMYYYY";

Chart.register(
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  Tooltip,
  Title,
  ArcElement
);

interface ChartData {
  labels: string[];
  datasets: {
    data: number[];
    backgroundColor: string;
    borderColor: string;
  }[];
  maxRevenue: {
    month: string;
    revenue: number;
  };
  minRevenue: {
    month: string;
    revenue: number;
  };
  revenueTotalAllTime: number;
  revenueTotalInYear: number;
}

interface StoreHasMostProduct {
  store: {
    _id: string;
    avatar: string;
    name: string;
    address: string;
    phoneNumber: string[];
    description: string;
    warningCount: number;
    createdAt: string;
    userId: string;
  };
  totalProducts: number;
}

interface UserHasMostBill {
  user: {
    _id: string;
    fullName: string;
    email: string;
    password: string;
    address: {
      receiverName: string;
      receiverPhone: string;
      address: string;
      default: boolean;
    }[];
    friends: string[];
    followStores: string[];
    wallet: number;
    warningCount: number;
    avatar: string;
    gender: string;
    createdAt: string;
  };
  totalBills: number;
}

function Home() {
  // useStates for dataSell, dataCharity, dataBill
  const [dataSellState, setDataSellState] = React.useState<ChartData>({
    labels: [],
    datasets: [
      {
        data: [],
        backgroundColor: "blue",
        borderColor: "#bfbfbf",
      },
    ],
    maxRevenue: {
      month: "",
      revenue: 0,
    },
    minRevenue: {
      month: "",
      revenue: 0,
    },
    revenueTotalAllTime: 0,
    revenueTotalInYear: 0,
  });
  const [storeHasMostProduct, setStoreHasMostProduct] = React.useState<
    StoreHasMostProduct[]
  >([]);
  const [userHasMostBill, setUserHasMostBill] = React.useState<
    UserHasMostBill[]
  >([]);
  const [yearFilter, setYearFilter] = React.useState(
    new Date().getFullYear() + ""
  );

  const optionsSell: any = {
    plugins: {
      title: {
        display: true,
        text: "Biểu đồ doanh thu năm",
        color: "#007aff",
        font: {
          size: 24,
        },
      },
      legend: {
        display: false,
      },
    },
    responsive: true,
    scales: {
      x: {
        type: "category",
        labels: [
          "Tháng 1",
          "Tháng 2",
          "Tháng 3",
          "Tháng 4",
          "Tháng 5",
          "Tháng 6",
          "Tháng 7",
          "Tháng 8",
          "Tháng 9",
          "Tháng 10",
          "Tháng 11",
          "Tháng 12",
        ],
      },
      y: {
        beginAtZero: true, // Example configuration for the y-axis
      },
    },
    type: "line",
  };

  React.useEffect(() => {
    const fetchData = async () => {
      const data = await APIGetRevenueByYearAdmin(yearFilter).then(
        (res) => res
      );
      // Set data for dataSellState
      console.log(data);
      const labels = Object.keys(data.metadata.data.data);
      const value = Object.values(data.metadata.data.data);

      const outputData = {
        labels: labels,
        datasets: [
          {
            data: value,
            backgroundColor: "blue",
            borderColor: "#bfbfbf",
          },
        ],
        maxRevenue: data.metadata.data.maxRevenue || 0,
        minRevenue: data.metadata.data.minRevenue || 0,
        revenueTotalAllTime: data.metadata.data.revenueTotalAllTime || 0,
        revenueTotalInYear: data.metadata.data.revenueTotalInYear || 0,
      };
      setDataSellState(outputData as ChartData);
    };
    fetchData();
  }, [yearFilter]);

  React.useEffect(() => {
    const fetchData = async () => {
      await APIGetStoreMostProduct(10).then((res) =>
        setStoreHasMostProduct(res?.metadata.data)
      );
    };
    fetchData();
  }, []);

  React.useEffect(() => {
    const fetchData = async () => {
      await APIGetUserMostBill(10).then((res) => {
        console.log(res);
        setUserHasMostBill(res?.metadata.data);
      });
    };
    fetchData();
  }, []);

  const [dataTotal, setDataTotal] = React.useState<any>({
    totalProduct: 0,
    totalRevenue: 0,
    totalStore: 0,
    totalUser: 0,
  });
  React.useEffect(() => {
    const fetchData = async () => {
      const data = await APIGetCountBillAdmin().then((res) => res);
      setDataTotal({
        totalProduct: data.metadata.data.totalProduct,
        totalRevenue: data.metadata.data.totalRevenue,
        totalStore: data.metadata.data.totalStore,
        totalUser: data.metadata.data.totalUser,
      });
    };
    fetchData();
  }, []);
  const arrTitleStore = [
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
      title: "Địa chỉ",
      sort: false,
      name: "address",
    },
    {
      title: "Ngày tham gia",
      sort: false,
      name: "date",
    },
    {
      title: "Tổng số sản phẩm",
      sort: false,
      name: "totalProducts",
    },
  ];
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
      title: "Tổng số đơn đã mua",
      sort: false,
      name: "totalBills",
    },
  ];
  return (
    <div>
      <div className="grid grid-cols-4 gap-4 mb-5">
        <div className="rounded-lg bg-white py-6 px-7.5 shadow-lg px-3">
          <div className="p-3 rounded-full bg-gray-400 bg-opacity-50 w-fit mb-3 mx-auto">
            <FaBoxOpen className="text-5xl text-[#3c50e0]" />
          </div>
          <div className="text-center font-bold text-3xl">
            {FormatDecimal(dataTotal.totalProduct)}
          </div>
          <div className="text-center text-gray-400">Tổng sản phẩm</div>
        </div>
        <div className="rounded-lg bg-white py-6 px-7.5 shadow-lg px-3">
          <div className="p-3 rounded-full bg-gray-400 bg-opacity-50 w-fit mb-3 mx-auto">
            <FaStore className="text-5xl text-[#3c50e0]" />
          </div>
          <div className="text-center font-bold text-3xl">
            {FormatDecimal(dataTotal.totalStore)}
          </div>
          <div className="text-center text-gray-400">Tổng cửa hàng</div>
        </div>
        <div className="rounded-lg bg-white py-6 px-7.5 shadow-lg px-3">
          <div className="p-3 rounded-full bg-gray-400 bg-opacity-50 w-fit mb-3 mx-auto">
            <FaUser className="text-5xl text-[#3c50e0]" />
          </div>
          <div className="text-center font-bold text-3xl">
            {FormatDecimal(dataTotal.totalUser)}
          </div>
          <div className="text-center text-gray-400">Tổng người dùng</div>
        </div>

        <div className="rounded-lg bg-white py-6 px-7.5 shadow-lg px-3">
          <div className="p-3 rounded-full bg-gray-400 bg-opacity-50 w-fit mb-3 mx-auto">
            <MdAttachMoney className="text-5xl text-[#3c50e0]" />
          </div>
          <div className="text-center font-bold text-3xl">
            {FormatDecimal(dataTotal.totalRevenue)}
          </div>
          <div className="text-center text-gray-400">Tổng doanh thu (VNĐ)</div>
        </div>
      </div>

      <div className="bg-white rounded-md p-4 mb-5">
        {/* For sell */}
        <div className="flex items-center">
          <div className=" text-lg font-bold">Chọn năm muốn xem thống kê:</div>
          <input
            type="number"
            defaultValue={yearFilter}
            id="yearFilter"
            className="border-2 border-gray-300 rounded-md p-2 ml-2"
          />
          <button
            className="border-2 border-gray-300 rounded-md p-2 ml-2"
            onClick={() => {
              const year = (
                document.getElementById("yearFilter") as HTMLInputElement
              ).value;
              setYearFilter(year);
            }}
          >
            Xem
          </button>
        </div>

        <Line data={dataSellState} options={optionsSell} />
        <div className="grid gap-2 grid-cols-2 mb-10 rounded-md border-2 p-2 border-red-400">
          <div className="font-bold text-red-500 text-center col-span-1">
            Tổng doanh thu: {FormatMoney(dataSellState.revenueTotalAllTime)}
          </div>
          <div className="font-bold text-red-500 text-center col-span-1">
            Tổng doanh thu của năm:{" "}
            {FormatMoney(dataSellState.revenueTotalInYear)}
          </div>
          <div className="font-bold text-red-500 text-center col-span-1">
            Doanh thu cao nhất:{" "}
            {FormatMoney(dataSellState.maxRevenue.revenue || 0)}
          </div>
          <div className="font-bold text-red-500 text-center col-span-1">
            Doanh thu thấp nhất:{" "}
            {FormatMoney(dataSellState.minRevenue.revenue || 0)}
          </div>
        </div>
      </div>
      <div className="bg-white rounded-md p-4 mb-5">
        {/* For sell */}
        <div className="text-center text-[#007aff] text-[24px] font-bold mb-3">
          Top các của hàng có nhiều sản phẩm trên hệ thống
        </div>
        <SortTable title={arrTitleStore} noPaging={true}>
          {storeHasMostProduct.map((item, index) => (
            <tr
              className="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
              key={index}
            >
              <td className="px-6 py-4 text-center">
                <Image
                  src={item.store.avatar}
                  width={50}
                  height={50}
                  className="rounded-full mx-auto"
                  alt=""
                />
              </td>
              <td className="px-6 py-4 text-center">{item.store.name}</td>
              <td className="px-6 py-4 text-center">{item.store.address}</td>
              <td className="px-6 py-4 text-center">
                {formatToDDMMYYYY(item.store.createdAt)}
              </td>
              <td className="px-6 py-4 text-center">
                {FormatDecimal(item.totalProducts)}
              </td>
            </tr>
          ))}
        </SortTable>
      </div>
      <div className="bg-white rounded-md p-4 mb-5">
        {/* For sell */}
        <div className="text-center text-[#007aff] text-[24px] font-bold mb-3">
          Top các người dùng mua hàng nhiều nhất trên hệ thống
        </div>
        <SortTable title={arrTitleUser} noPaging={true}>
          {userHasMostBill.map((item, index) => (
            <tr
              className="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
              key={index}
            >
              <td className="px-6 py-4 text-center">
                <Image
                  src={item.user.avatar}
                  width={50}
                  height={50}
                  className="rounded-full mx-auto"
                  alt=""
                />
              </td>
              <td className="px-6 py-4 text-center">{item.user.fullName}</td>
              <td className="px-6 py-4 text-center">{item.user.email}</td>
              <td className="px-6 py-4 text-center">
                {formatToDDMMYYYY(item.user.createdAt)}
              </td>
              <td className="px-6 py-4 text-center">
                {FormatDecimal(item.totalBills)}
              </td>
            </tr>
          ))}
        </SortTable>
      </div>
    </div>
  );
}

export default Home;
