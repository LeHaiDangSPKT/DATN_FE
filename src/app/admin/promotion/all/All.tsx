import SortTable from "@/components/SortTable";
import FormatMoney from "@/utils/FormatMoney";
import formatToDDMMYYYY from "@/utils/formatToDDMMYYYY";
import { Select, Option, Typography, Switch } from "@material-tailwind/react";
import React from "react";

function All() {
  const arrTitlePromotion = [
    {
      title: "STT",
      sort: false,
      name: "index",
    },
    {
      title: "Mã",
      sort: false,
      name: "code",
    },
    {
      title: "Số lượng còn lại",
      sort: false,
      name: "quantity",
    },
    {
      title: "Phần trăm giảm giá",
      sort: false,
      name: "percent",
    },
    {
      title: "Số tiền giảm tối đa",
      sort: false,
      name: "maxDiscountValue",
    },
    {
      title: "Ngày hết hạn",
      sort: false,
      name: "endTime",
    },
    {
      title: "",
      sort: false,
      name: "",
    },
  ];
  const listStore = [
    {
      _id: "65f5ee13ff37ad301b196d05",
      avatar:
        "http://res.cloudinary.com/dl3b2j3td/image/upload/v1711198507/DATN2024/dsklyrk92hod81zcbys2.png",
      voucherCode: "DCJWSKQ4",
      minSpend: 10000,
      quantity: 7,
      value: 15,
      storeIds: [
        "65f314993331cabe697a318f",
        "65f314993331cabe697a3194",
        "65f314993331cabe697a318b",
        "65f58c56b251f220ecef0e83",
      ],
      userSaves: ["65f3147f3331cabe697a314b"],
      userUses: ["65f3147f3331cabe697a315f"],
      startTime: "2024-03-17T00:00:00.000Z",
      endTime: "2024-05-29T00:00:00.000Z",
      isActive: true,
      maxDiscountValue: 30000,
    },
    {
      _id: "65f5edefff37ad301b196cdd",
      avatar:
        "http://res.cloudinary.com/dl3b2j3td/image/upload/v1711198507/DATN2024/dsklyrk92hod81zcbys2.png",
      voucherCode: "KEQUDPOI",
      minSpend: 40000,
      quantity: 8,
      value: 20,
      storeIds: [
        "65f314993331cabe697a318f",
        "65f58c56b251f220ecef0e83",
        "65f314993331cabe697a3194",
        "65f314993331cabe697a318b",
      ],
      userSaves: [],
      userUses: ["65f3147f3331cabe697a315f"],
      startTime: "2024-03-17T00:00:00.000Z",
      endTime: "2024-03-29T00:00:00.000Z",
      isActive: false,
      maxDiscountValue: 50000,
    },
    {
      _id: "65f5ee13ff37ad301b196d05",
      avatar:
        "http://res.cloudinary.com/dl3b2j3td/image/upload/v1711198507/DATN2024/dsklyrk92hod81zcbys2.png",
      voucherCode: "DCJWSKQ4",
      minSpend: 10000,
      quantity: 7,
      value: 15,
      storeIds: [
        "65f314993331cabe697a318f",
        "65f314993331cabe697a3194",
        "65f314993331cabe697a318b",
        "65f58c56b251f220ecef0e83",
      ],
      userSaves: ["65f3147f3331cabe697a314b"],
      userUses: ["65f3147f3331cabe697a315f"],
      startTime: "2024-03-17T00:00:00.000Z",
      endTime: "2024-05-29T00:00:00.000Z",
      isActive: true,
      maxDiscountValue: 30000,
    },
    {
      _id: "65f5edefff37ad301b196cdd",
      avatar:
        "http://res.cloudinary.com/dl3b2j3td/image/upload/v1711198507/DATN2024/dsklyrk92hod81zcbys2.png",
      voucherCode: "KEQUDPOI",
      minSpend: 40000,
      quantity: 8,
      value: 20,
      storeIds: [
        "65f314993331cabe697a318f",
        "65f58c56b251f220ecef0e83",
        "65f314993331cabe697a3194",
        "65f314993331cabe697a318b",
      ],
      userSaves: [],
      userUses: ["65f3147f3331cabe697a315f"],
      startTime: "2024-03-17T00:00:00.000Z",
      endTime: "2024-03-29T00:00:00.000Z",
      isActive: false,
      maxDiscountValue: 50000,
    },
    {
      _id: "65f5ee13ff37ad301b196d05",
      avatar:
        "http://res.cloudinary.com/dl3b2j3td/image/upload/v1711198507/DATN2024/dsklyrk92hod81zcbys2.png",
      voucherCode: "DCJWSKQ4",
      minSpend: 10000,
      quantity: 7,
      value: 15,
      storeIds: [
        "65f314993331cabe697a318f",
        "65f314993331cabe697a3194",
        "65f314993331cabe697a318b",
        "65f58c56b251f220ecef0e83",
      ],
      userSaves: ["65f3147f3331cabe697a314b"],
      userUses: ["65f3147f3331cabe697a315f"],
      startTime: "2024-03-17T00:00:00.000Z",
      endTime: "2024-05-29T00:00:00.000Z",
      isActive: true,
      maxDiscountValue: 30000,
    },
    {
      _id: "65f5edefff37ad301b196cdd",
      avatar:
        "http://res.cloudinary.com/dl3b2j3td/image/upload/v1711198507/DATN2024/dsklyrk92hod81zcbys2.png",
      voucherCode: "KEQUDPOI",
      minSpend: 40000,
      quantity: 8,
      value: 20,
      storeIds: [
        "65f314993331cabe697a318f",
        "65f58c56b251f220ecef0e83",
        "65f314993331cabe697a3194",
        "65f314993331cabe697a318b",
      ],
      userSaves: [],
      userUses: ["65f3147f3331cabe697a315f"],
      startTime: "2024-03-17T00:00:00.000Z",
      endTime: "2024-03-29T00:00:00.000Z",
      isActive: false,
      maxDiscountValue: 50000,
    },
    {
      _id: "65f5ee13ff37ad301b196d05",
      avatar:
        "http://res.cloudinary.com/dl3b2j3td/image/upload/v1711198507/DATN2024/dsklyrk92hod81zcbys2.png",
      voucherCode: "DCJWSKQ4",
      minSpend: 10000,
      quantity: 7,
      value: 15,
      storeIds: [
        "65f314993331cabe697a318f",
        "65f314993331cabe697a3194",
        "65f314993331cabe697a318b",
        "65f58c56b251f220ecef0e83",
      ],
      userSaves: ["65f3147f3331cabe697a314b"],
      userUses: ["65f3147f3331cabe697a315f"],
      startTime: "2024-03-17T00:00:00.000Z",
      endTime: "2024-05-29T00:00:00.000Z",
      isActive: true,
      maxDiscountValue: 30000,
    },
    {
      _id: "65f5edefff37ad301b196cdd",
      avatar:
        "http://res.cloudinary.com/dl3b2j3td/image/upload/v1711198507/DATN2024/dsklyrk92hod81zcbys2.png",
      voucherCode: "KEQUDPOI",
      minSpend: 40000,
      quantity: 8,
      value: 20,
      storeIds: [
        "65f314993331cabe697a318f",
        "65f58c56b251f220ecef0e83",
        "65f314993331cabe697a3194",
        "65f314993331cabe697a318b",
      ],
      userSaves: [],
      userUses: ["65f3147f3331cabe697a315f"],
      startTime: "2024-03-17T00:00:00.000Z",
      endTime: "2024-03-29T00:00:00.000Z",
      isActive: false,
      maxDiscountValue: 50000,
    },
    {
      _id: "65f5ee13ff37ad301b196d05",
      avatar:
        "http://res.cloudinary.com/dl3b2j3td/image/upload/v1711198507/DATN2024/dsklyrk92hod81zcbys2.png",
      voucherCode: "DCJWSKQ4",
      minSpend: 10000,
      quantity: 7,
      value: 15,
      storeIds: [
        "65f314993331cabe697a318f",
        "65f314993331cabe697a3194",
        "65f314993331cabe697a318b",
        "65f58c56b251f220ecef0e83",
      ],
      userSaves: ["65f3147f3331cabe697a314b"],
      userUses: ["65f3147f3331cabe697a315f"],
      startTime: "2024-03-17T00:00:00.000Z",
      endTime: "2024-05-29T00:00:00.000Z",
      isActive: true,
      maxDiscountValue: 30000,
    },
    {
      _id: "65f5edefff37ad301b196cdd",
      avatar:
        "http://res.cloudinary.com/dl3b2j3td/image/upload/v1711198507/DATN2024/dsklyrk92hod81zcbys2.png",
      voucherCode: "KEQUDPOI",
      minSpend: 40000,
      quantity: 8,
      value: 20,
      storeIds: [
        "65f314993331cabe697a318f",
        "65f58c56b251f220ecef0e83",
        "65f314993331cabe697a3194",
        "65f314993331cabe697a318b",
      ],
      userSaves: [],
      userUses: ["65f3147f3331cabe697a315f"],
      startTime: "2024-03-17T00:00:00.000Z",
      endTime: "2024-03-29T00:00:00.000Z",
      isActive: false,
      maxDiscountValue: 50000,
    },
    {
      _id: "65f5ee13ff37ad301b196d05",
      avatar:
        "http://res.cloudinary.com/dl3b2j3td/image/upload/v1711198507/DATN2024/dsklyrk92hod81zcbys2.png",
      voucherCode: "DCJWSKQ4",
      minSpend: 10000,
      quantity: 7,
      value: 15,
      storeIds: [
        "65f314993331cabe697a318f",
        "65f314993331cabe697a3194",
        "65f314993331cabe697a318b",
        "65f58c56b251f220ecef0e83",
      ],
      userSaves: ["65f3147f3331cabe697a314b"],
      userUses: ["65f3147f3331cabe697a315f"],
      startTime: "2024-03-17T00:00:00.000Z",
      endTime: "2024-05-29T00:00:00.000Z",
      isActive: true,
      maxDiscountValue: 30000,
    },
    {
      _id: "65f5edefff37ad301b196cdd",
      avatar:
        "http://res.cloudinary.com/dl3b2j3td/image/upload/v1711198507/DATN2024/dsklyrk92hod81zcbys2.png",
      voucherCode: "KEQUDPOI",
      minSpend: 40000,
      quantity: 8,
      value: 20,
      storeIds: [
        "65f314993331cabe697a318f",
        "65f58c56b251f220ecef0e83",
        "65f314993331cabe697a3194",
        "65f314993331cabe697a318b",
      ],
      userSaves: [],
      userUses: ["65f3147f3331cabe697a315f"],
      startTime: "2024-03-17T00:00:00.000Z",
      endTime: "2024-03-29T00:00:00.000Z",
      isActive: false,
      maxDiscountValue: 50000,
    },
    {
      _id: "65f5ee13ff37ad301b196d05",
      avatar:
        "http://res.cloudinary.com/dl3b2j3td/image/upload/v1711198507/DATN2024/dsklyrk92hod81zcbys2.png",
      voucherCode: "DCJWSKQ4",
      minSpend: 10000,
      quantity: 7,
      value: 15,
      storeIds: [
        "65f314993331cabe697a318f",
        "65f314993331cabe697a3194",
        "65f314993331cabe697a318b",
        "65f58c56b251f220ecef0e83",
      ],
      userSaves: ["65f3147f3331cabe697a314b"],
      userUses: ["65f3147f3331cabe697a315f"],
      startTime: "2024-03-17T00:00:00.000Z",
      endTime: "2024-05-29T00:00:00.000Z",
      isActive: true,
      maxDiscountValue: 30000,
    },
    {
      _id: "65f5edefff37ad301b196cdd",
      avatar:
        "http://res.cloudinary.com/dl3b2j3td/image/upload/v1711198507/DATN2024/dsklyrk92hod81zcbys2.png",
      voucherCode: "KEQUDPOI",
      minSpend: 40000,
      quantity: 8,
      value: 20,
      storeIds: [
        "65f314993331cabe697a318f",
        "65f58c56b251f220ecef0e83",
        "65f314993331cabe697a3194",
        "65f314993331cabe697a318b",
      ],
      userSaves: [],
      userUses: ["65f3147f3331cabe697a315f"],
      startTime: "2024-03-17T00:00:00.000Z",
      endTime: "2024-03-29T00:00:00.000Z",
      isActive: false,
      maxDiscountValue: 50000,
    },
    {
      _id: "65f5ee13ff37ad301b196d05",
      avatar:
        "http://res.cloudinary.com/dl3b2j3td/image/upload/v1711198507/DATN2024/dsklyrk92hod81zcbys2.png",
      voucherCode: "DCJWSKQ4",
      minSpend: 10000,
      quantity: 7,
      value: 15,
      storeIds: [
        "65f314993331cabe697a318f",
        "65f314993331cabe697a3194",
        "65f314993331cabe697a318b",
        "65f58c56b251f220ecef0e83",
      ],
      userSaves: ["65f3147f3331cabe697a314b"],
      userUses: ["65f3147f3331cabe697a315f"],
      startTime: "2024-03-17T00:00:00.000Z",
      endTime: "2024-05-29T00:00:00.000Z",
      isActive: true,
      maxDiscountValue: 30000,
    },
    {
      _id: "65f5edefff37ad301b196cdd",
      avatar:
        "http://res.cloudinary.com/dl3b2j3td/image/upload/v1711198507/DATN2024/dsklyrk92hod81zcbys2.png",
      voucherCode: "KEQUDPOI",
      minSpend: 40000,
      quantity: 8,
      value: 20,
      storeIds: [
        "65f314993331cabe697a318f",
        "65f58c56b251f220ecef0e83",
        "65f314993331cabe697a3194",
        "65f314993331cabe697a318b",
      ],
      userSaves: [],
      userUses: ["65f3147f3331cabe697a315f"],
      startTime: "2024-03-17T00:00:00.000Z",
      endTime: "2024-03-29T00:00:00.000Z",
      isActive: false,
      maxDiscountValue: 50000,
    },
    {
      _id: "65f5ee13ff37ad301b196d05",
      avatar:
        "http://res.cloudinary.com/dl3b2j3td/image/upload/v1711198507/DATN2024/dsklyrk92hod81zcbys2.png",
      voucherCode: "DCJWSKQ4",
      minSpend: 10000,
      quantity: 7,
      value: 15,
      storeIds: [
        "65f314993331cabe697a318f",
        "65f314993331cabe697a3194",
        "65f314993331cabe697a318b",
        "65f58c56b251f220ecef0e83",
      ],
      userSaves: ["65f3147f3331cabe697a314b"],
      userUses: ["65f3147f3331cabe697a315f"],
      startTime: "2024-03-17T00:00:00.000Z",
      endTime: "2024-05-29T00:00:00.000Z",
      isActive: true,
      maxDiscountValue: 30000,
    },
    {
      _id: "65f5edefff37ad301b196cdd",
      avatar:
        "http://res.cloudinary.com/dl3b2j3td/image/upload/v1711198507/DATN2024/dsklyrk92hod81zcbys2.png",
      voucherCode: "KEQUDPOI",
      minSpend: 40000,
      quantity: 8,
      value: 20,
      storeIds: [
        "65f314993331cabe697a318f",
        "65f58c56b251f220ecef0e83",
        "65f314993331cabe697a3194",
        "65f314993331cabe697a318b",
      ],
      userSaves: [],
      userUses: ["65f3147f3331cabe697a315f"],
      startTime: "2024-03-17T00:00:00.000Z",
      endTime: "2024-03-29T00:00:00.000Z",
      isActive: false,
      maxDiscountValue: 50000,
    },
    {
      _id: "65f5ee13ff37ad301b196d05",
      avatar:
        "http://res.cloudinary.com/dl3b2j3td/image/upload/v1711198507/DATN2024/dsklyrk92hod81zcbys2.png",
      voucherCode: "DCJWSKQ4",
      minSpend: 10000,
      quantity: 7,
      value: 15,
      storeIds: [
        "65f314993331cabe697a318f",
        "65f314993331cabe697a3194",
        "65f314993331cabe697a318b",
        "65f58c56b251f220ecef0e83",
      ],
      userSaves: ["65f3147f3331cabe697a314b"],
      userUses: ["65f3147f3331cabe697a315f"],
      startTime: "2024-03-17T00:00:00.000Z",
      endTime: "2024-05-29T00:00:00.000Z",
      isActive: true,
      maxDiscountValue: 30000,
    },
    {
      _id: "65f5edefff37ad301b196cdd",
      avatar:
        "http://res.cloudinary.com/dl3b2j3td/image/upload/v1711198507/DATN2024/dsklyrk92hod81zcbys2.png",
      voucherCode: "KEQUDPOI",
      minSpend: 40000,
      quantity: 8,
      value: 20,
      storeIds: [
        "65f314993331cabe697a318f",
        "65f58c56b251f220ecef0e83",
        "65f314993331cabe697a3194",
        "65f314993331cabe697a318b",
      ],
      userSaves: [],
      userUses: ["65f3147f3331cabe697a315f"],
      startTime: "2024-03-17T00:00:00.000Z",
      endTime: "2024-03-29T00:00:00.000Z",
      isActive: false,
      maxDiscountValue: 50000,
    },
    {
      _id: "65f5ee13ff37ad301b196d05",
      avatar:
        "http://res.cloudinary.com/dl3b2j3td/image/upload/v1711198507/DATN2024/dsklyrk92hod81zcbys2.png",
      voucherCode: "DCJWSKQ4",
      minSpend: 10000,
      quantity: 7,
      value: 15,
      storeIds: [
        "65f314993331cabe697a318f",
        "65f314993331cabe697a3194",
        "65f314993331cabe697a318b",
        "65f58c56b251f220ecef0e83",
      ],
      userSaves: ["65f3147f3331cabe697a314b"],
      userUses: ["65f3147f3331cabe697a315f"],
      startTime: "2024-03-17T00:00:00.000Z",
      endTime: "2024-05-29T00:00:00.000Z",
      isActive: true,
      maxDiscountValue: 30000,
    },
    {
      _id: "65f5edefff37ad301b196cdd",
      avatar:
        "http://res.cloudinary.com/dl3b2j3td/image/upload/v1711198507/DATN2024/dsklyrk92hod81zcbys2.png",
      voucherCode: "KEQUDPOI",
      minSpend: 40000,
      quantity: 8,
      value: 20,
      storeIds: [
        "65f314993331cabe697a318f",
        "65f58c56b251f220ecef0e83",
        "65f314993331cabe697a3194",
        "65f314993331cabe697a318b",
      ],
      userSaves: [],
      userUses: ["65f3147f3331cabe697a315f"],
      startTime: "2024-03-17T00:00:00.000Z",
      endTime: "2024-03-29T00:00:00.000Z",
      isActive: false,
      maxDiscountValue: 50000,
    },
    {
      _id: "65f5ee13ff37ad301b196d05",
      avatar:
        "http://res.cloudinary.com/dl3b2j3td/image/upload/v1711198507/DATN2024/dsklyrk92hod81zcbys2.png",
      voucherCode: "DCJWSKQ4",
      minSpend: 10000,
      quantity: 7,
      value: 15,
      storeIds: [
        "65f314993331cabe697a318f",
        "65f314993331cabe697a3194",
        "65f314993331cabe697a318b",
        "65f58c56b251f220ecef0e83",
      ],
      userSaves: ["65f3147f3331cabe697a314b"],
      userUses: ["65f3147f3331cabe697a315f"],
      startTime: "2024-03-17T00:00:00.000Z",
      endTime: "2024-05-29T00:00:00.000Z",
      isActive: true,
      maxDiscountValue: 30000,
    },
    {
      _id: "65f5edefff37ad301b196cdd",
      avatar:
        "http://res.cloudinary.com/dl3b2j3td/image/upload/v1711198507/DATN2024/dsklyrk92hod81zcbys2.png",
      voucherCode: "KEQUDPOI",
      minSpend: 40000,
      quantity: 8,
      value: 20,
      storeIds: [
        "65f314993331cabe697a318f",
        "65f58c56b251f220ecef0e83",
        "65f314993331cabe697a3194",
        "65f314993331cabe697a318b",
      ],
      userSaves: [],
      userUses: ["65f3147f3331cabe697a315f"],
      startTime: "2024-03-17T00:00:00.000Z",
      endTime: "2024-03-29T00:00:00.000Z",
      isActive: false,
      maxDiscountValue: 50000,
    },
  ];
  const [page, setPage] = React.useState<number>(1);
  const [storeId, setStoreId] = React.useState<string>("all");
  return (
    <div>
      <div className="mb-4">
        <Select
          label="Chọn cửa hàng"
          value={storeId}
          onChange={(val) => setStoreId(val || "")}
        >
          <Option value="all">Tất cả các cửa hàng</Option>
          <Option value="1">Material Tailwind HTML</Option>
          <Option value="2">Material Tailwind React</Option>
          <Option value="3">Material Tailwind Vue</Option>
          <Option value="4">Material Tailwind Angular</Option>
          <Option value="5">Material Tailwind Svelte</Option>
        </Select>
      </div>
      <SortTable
        title={arrTitlePromotion}
        totalPage={10}
        currentPage={page}
        setPage={(data) => setPage(data)}
        perPage={20}
      >
        {listStore?.map((item, index) => (
          <tr
            className="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
            key={index}
          >
            <td className="px-6 py-4 text-center">
              {(page - 1) * 10 + index + 1}
            </td>
            <td className="px-6 py-4 text-center">{item.voucherCode}</td>
            <td className="px-6 py-4 text-center">
              {item.quantity + item.userUses.length}
            </td>
            <td className="px-6 py-4 text-center">{item.value} %</td>
            <td className="px-6 py-4 text-center">
              {FormatMoney(item.maxDiscountValue)}
            </td>
            <td className="px-6 py-4 text-center">
              {formatToDDMMYYYY(item.endTime)}
            </td>
            <td>
              <div
                className="px-6 text-center font-medium text-blue-600 dark:text-blue-500 hover:underline cursor-pointer"
                onClick={(e) => console.log(item)}
              >
                Xem chi tiết
              </div>
            </td>
          </tr>
        ))}
      </SortTable>

      <div className="my-10">
        <Typography className="text-center mb-2" variant="h5">
          Danh sách khuyến mãi chưa có lượt sử dụng
        </Typography>
        <SortTable
          title={arrTitlePromotion}
          totalPage={10}
          currentPage={page}
          setPage={(data) => setPage(data)}
          perPage={20}
        >
          {listStore?.map((item, index) => (
            <tr
              className="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
              key={index}
            >
              <td className="px-6 py-4 text-center">
                {(page - 1) * 10 + index + 1}
              </td>
              <td className="px-6 py-4 text-center">{item.voucherCode}</td>
              <td className="px-6 py-4 text-center">
                {item.quantity + item.userUses.length}
              </td>
              <td className="px-6 py-4 text-center">{item.value} %</td>
              <td className="px-6 py-4 text-center">
                {FormatMoney(item.maxDiscountValue)}
              </td>
              <td className="px-6 py-4 text-center">
                {formatToDDMMYYYY(item.endTime)}
              </td>
              <td>
                <div
                  className="px-6 text-center font-medium text-blue-600 dark:text-blue-500 hover:underline cursor-pointer"
                  onClick={(e) => console.log(item)}
                >
                  Xem chi tiết
                </div>
              </td>
            </tr>
          ))}
        </SortTable>
      </div>
      <div className="my-10">
        <Typography className="text-center mb-2" variant="h5">
          Danh sách khuyến mãi chưa mở
        </Typography>
        <SortTable
          title={arrTitlePromotion}
          totalPage={10}
          currentPage={page}
          setPage={(data) => setPage(data)}
          perPage={20}
        >
          {listStore?.map((item, index) => (
            <tr
              className="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
              key={index}
            >
              <td className="px-6 py-4 text-center">
                {(page - 1) * 10 + index + 1}
              </td>
              <td className="px-6 py-4 text-center">{item.voucherCode}</td>
              <td className="px-6 py-4 text-center">
                {item.quantity + item.userUses.length}
              </td>
              <td className="px-6 py-4 text-center">{item.value} %</td>
              <td className="px-6 py-4 text-center">
                {FormatMoney(item.maxDiscountValue)}
              </td>
              <td className="px-6 py-4 text-center">
                {formatToDDMMYYYY(item.endTime)}
              </td>
              <td>
                <div className="px-6 py-4">
                  <Switch
                    onChange={(e) => alert("Mày có muốn đổi hông")}
                    label="Chưa mở"
                    color="green"
                    crossOrigin={undefined}
                  />
                </div>
              </td>
            </tr>
          ))}
        </SortTable>
      </div>
    </div>
  );
}

export default All;
