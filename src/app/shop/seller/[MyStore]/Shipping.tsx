import Modal from "@/components/Modal";
import SortTable from "@/components/SortTable";
import { APIGetListBill, APIUpdateBill } from "@/services/Bill";
import ConvertDate from "@/utils/ConvertDate";
import FormatMoney from "@/utils/FormatMoney";
import Toast from "@/utils/Toast";
import React from "react";

interface TypeObject {
  [key: string]: {
    mes: string;
    func: () => void;
  };
}

interface ArrBill {
  id: string;
  fullName: string;
  phoneNumber: string;
  address: string;
  infoProduct: string[];
  date: string;
  totalPrice: number;
}

function Shipping() {
  const arrTitle = [
    {
      title: "STT",
      sort: false,
      name: "index",
    },
    {
      title: "Tên người đặt hàng",
      sort: true,
      name: "fullName",
    },
    {
      title: "Số điện thoại",
      sort: false,
      name: "phoneNumber",
    },
    {
      title: "Địa chỉ",
      sort: false,
      name: "address",
    },
    {
      title: "Sản phẩm",
      sort: false,
      name: "infoProduct",
    },
    {
      title: "Ngày đặt",
      sort: false,
      name: "date",
    },
    {
      title: "Tổng tiền",
      sort: true,
      name: "totalPrice",
    },
    {
      title: "Thao tác",
      sort: false,
      name: "action",
    },
  ];
  const [data, setData] = React.useState<ArrBill[]>();
  const [changed, setChanged] = React.useState<boolean>(false);
  const [page, setPage] = React.useState<number>(1);
  const [total, setTotal] = React.useState<number>(0);
  const [isShow, setIsShow] = React.useState<boolean>(false);
  const [typeMes, setTypeMes] = React.useState<string>("");
  const [currentId, setCurrentId] = React.useState<string>("");
  const UpGrade = async () => {
    await APIUpdateBill(currentId, "DELIVERED").then((res) => {
      if (res?.status == 200 || res.status == 201) {
        Toast("success", "Chuyển thành thành công", 2000);
        setIsShow(false);
        setChanged(!changed);
      } else {
        Toast("error", "Chuyển thất bại", 2000);
      }
    });
  };
  const Cancel = async () => {
    await APIUpdateBill(currentId, "CANCELLED").then((res) => {
      if (res?.status == 200 || res.status == 201) {
        Toast("success", "Chuyển thành thành công", 2000);
        setIsShow(false);
        setChanged(!changed);
      } else {
        Toast("error", "Chuyển thất bại", 2000);
      }
    });
  };
  const type: TypeObject = {
    upGrade: {
      mes: "Khách hàng đã nhận được sản phẩm và chuyển thành đơn ĐÃ GIAO?",
      func: () => UpGrade(),
    },
    cancel: {
      mes: "Bạn có muốn HUỶ đơn này không?",
      func: () => Cancel(),
    },
  };
  React.useEffect(() => {
    const fetchData = async () => {
      const data = await APIGetListBill(page || 1, 20, "DELIVERING").then(
        (res) => res
      );
      var arr = [] as ArrBill[];
      setTotal(data.metadata.data.total);
      data.metadata.data.fullData.map((lstProduct: any, index: number) => {
        var arrBill = {} as ArrBill;
        arrBill.id = lstProduct._id;
        arrBill.fullName = lstProduct.receiverInfo.fullName;
        arrBill.phoneNumber = lstProduct.receiverInfo.phoneNumber;
        arrBill.address = lstProduct.receiverInfo.address;
        arrBill.date = ConvertDate(lstProduct.createdAt);
        arrBill.totalPrice = lstProduct.totalPrice;
        arrBill.infoProduct = [] as string[];
        lstProduct.listProductsFullInfo?.map((item: any, index: number) => {
          if (item.product) {
            arrBill.infoProduct?.push(
              item.product.productName + " x " + item.subInfo.quantity
            );
          }
        });
        arr.push(arrBill);
      });
      setData(arr);
    };
    fetchData();
  }, [page, changed]);
  return (
    <>
      <SortTable
        title={arrTitle}
        totalPage={total}
        currentPage={page}
        setPage={(data) => setPage(data)}
      >
        {data?.map((item, index) => (
          <tr
            className="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
            key={index}
          >
            <td
              scope="row"
              className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white text-center"
            >
              {index + 1 + (page - 1) * 3}
            </td>
            <td
              scope="row"
              className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white text-center"
            >
              {item.fullName}
            </td>
            <td className="px-6 py-4 text-center">{item.phoneNumber}</td>
            <td className="px-6 py-4 text-center">{item.address}</td>
            <td className="px-6 py-4 text-center">
              <div className="flex flex-col">
                {item.infoProduct?.map((item, index) => (
                  <div key={index}>{item}</div>
                ))}
              </div>
            </td>
            <td className="px-6 py-4 text-center">{item.date}</td>
            <td className="px-6 py-4 text-center">
              {FormatMoney(item.totalPrice)}
            </td>

            <td className="px-6 py-4 text-center">
              <div
                className="font-medium text-red-600 dark:text-red-500 hover:underline cursor-pointer mb-2"
                onClick={(e) => {
                  setIsShow(true);
                  setTypeMes("cancel");
                  setCurrentId(item.id);
                }}
              >
                Huỷ đơn
              </div>
              <div
                className="font-medium text-blue-600 dark:text-blue-500 hover:underline cursor-pointer"
                onClick={(e) => {
                  setIsShow(true);
                  setTypeMes("upGrade");
                  setCurrentId(item.id);
                }}
              >
                Chuyển đơn
              </div>
            </td>
          </tr>
        ))}
      </SortTable>
      <Modal
        isShow={isShow}
        setIsShow={(data: any) => setIsShow(data)}
        confirm={() => {
          type[typeMes]?.func();
        }}
        title="Thay đổi trạng thái"
      >
        <div className="font-bold text-lg text-center">
          {type[typeMes]?.mes}
        </div>
      </Modal>
    </>
  );
}

export default Shipping;
