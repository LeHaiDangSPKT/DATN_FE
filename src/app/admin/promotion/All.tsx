import SortTable from "@/components/SortTable";
import {
  Select as SelectUI,
  SelectItem,
  DateRangePicker,
} from "@nextui-org/react";
import { parseAbsoluteToLocal } from "@internationalized/date";
import {
  APICreatePromotion,
  APIDeletePromotion,
  APIManagerPromotion,
  APIPromotionNotUsed,
  APIUpdatePromotion,
} from "@/services/Promotion";
import { APISelectStore } from "@/services/Store";
import FormatMoney from "@/utils/FormatMoney";
import Toast from "@/utils/Toast";
import formatToDDMMYYYY from "@/utils/formatToDDMMYYYY";
import { PlusIcon } from "@heroicons/react/24/solid";
import {
  Select,
  Option,
  Typography,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Button,
  Tooltip,
  IconButton,
  Input,
  Collapse,
  Card,
  CardBody,
  SpeedDial,
  SpeedDialHandler,
} from "@material-tailwind/react";
import React from "react";
import { FaPencilAlt } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { TbLockOpenOff } from "react-icons/tb";

type Single = {
  _id: string;
  name: string;
};

type Promotion = {
  data: PromotionDetail[];
  total: number;
};

type PromotionDetail = {
  _id?: string;
  avatar?: string;
  voucherCode?: string;
  minSpend: number;
  quantity: number;
  value: number;
  storeIds: string[];
  userSaves?: string[];
  userUses?: string[];
  startTime: string;
  endTime: string;
  isActive?: boolean;
  maxDiscountValue: number;
};

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
  const [open, setOpen] = React.useState(false);
  const [isPublic, setIsPublic] = React.useState(false);
  const [isViewDetail, setIsViewDetail] = React.useState(false);
  const [openDel, setOpenDel] = React.useState(false);
  const [openAdd, setOpenAdd] = React.useState(false);
  const handleOpen = () => setOpen(!open);
  const handleOpenDel = () => setOpenDel(!openDel);
  const ClearPromotion = () => {
    setPromotion({
      avatar:
        "http://res.cloudinary.com/dl3b2j3td/image/upload/v1711198507/DATN2024/dsklyrk92hod81zcbys2.png",
      minSpend: 0,
      quantity: 0,
      value: 0,
      maxDiscountValue: 0,
      storeIds: [],
      startTime: new Date().toISOString(),
      endTime: new Date(Date.now() + 86400000).toISOString(),
    });
  };
  const handleOpenAdd = (state: boolean, type?: string) => {
    if (type == "add" && state) {
      ClearPromotion();
    }
    setOpenAdd(state);
  };
  const [isEdit, setIsEdit] = React.useState(false);
  const [page, setPage] = React.useState<number>(1);
  const [pageNotUse, setPageNotUse] = React.useState<number>(1);
  const [storeId, setStoreId] = React.useState<string>("");
  const [storeSingleAll, setStoreSingleAll] = React.useState<Single[]>([]);
  const [storeSingle, setStoreSingle] = React.useState<Single[]>([]);
  const [listPromotion, setListPromotion] = React.useState<Promotion>();
  const [promotion, setPromotion] = React.useState<PromotionDetail>({
    avatar:
      "http://res.cloudinary.com/dl3b2j3td/image/upload/v1711198507/DATN2024/dsklyrk92hod81zcbys2.png",
    minSpend: 0,
    quantity: 0,
    value: 0,
    maxDiscountValue: 0,
    storeIds: [],
    startTime: new Date().toISOString(),
    endTime: new Date(Date.now() + 86400000).toISOString(),
  });
  const [listPromotionUnlock, setListPromotionUnlock] =
    React.useState<Promotion>();
  const [listPromotionNotUse, setListPromotionNotUse] =
    React.useState<Promotion>();
  const [curentPromo, setCurentPromo] = React.useState<any>();

  React.useEffect(() => {
    const fetchData = async () => {
      const res = await APISelectStore();
      setStoreSingle(res);
      const clonedRes = JSON.parse(JSON.stringify(res));
      clonedRes.unshift({ _id: "", name: "Tất cả cửa hàng" });
      setStoreSingleAll(clonedRes);
    };
    fetchData();
  }, []);
  React.useEffect(() => {
    const fetchData = async () => {
      const res = await APIManagerPromotion(storeId, true);
      setListPromotion(res);
    };
    fetchData();
  }, [storeId]);
  React.useEffect(() => {
    const fetchData = async () => {
      const res = await APIManagerPromotion("", false);
      setListPromotionUnlock(res);
    };
    fetchData();
  }, []);
  React.useEffect(() => {
    const fetchData = async () => {
      const res = await APIPromotionNotUsed(pageNotUse, 20);
      setListPromotionNotUse(res);
    };
    fetchData();
  }, []);

  const Public = async () => {
    handleOpen();
    const res = await APIUpdatePromotion(curentPromo._id, {
      isActive: isPublic,
      endTime: isPublic ? new Date().toISOString() : curentPromo.endTime,
    });
    if (res?.status == 200 || res?.status == 201) {
      if (isPublic) {
        setListPromotionUnlock((prevPromotion) => {
          if (prevPromotion) {
            return {
              total: prevPromotion.total - 1,
              data: prevPromotion.data.filter(
                (item) => item._id !== curentPromo._id
              ),
            };
          }
          return prevPromotion;
        });
        // Set lại list promotion not use
        setListPromotionNotUse((prevPromotion) => {
          if (prevPromotion) {
            return {
              total: prevPromotion.total + 1,
              data: [...prevPromotion.data, curentPromo],
            };
          }
          return prevPromotion;
        });
      } else {
        setListPromotionNotUse((prevPromotion) => {
          if (prevPromotion) {
            return {
              total: prevPromotion.total - 1,
              data: prevPromotion.data.filter(
                (item) => item._id !== curentPromo._id
              ),
            };
          }
          return prevPromotion;
        });
        // Set lại list promotion unlock
        setListPromotionUnlock((prevPromotion) => {
          if (prevPromotion) {
            return {
              total: prevPromotion.total + 1,
              data: [...prevPromotion.data, curentPromo],
            };
          }
          return prevPromotion;
        });
      }
      Toast("success", "Công bố khuyến mãi thành công", 2000);
    } else {
      Toast("error", "Công bố khuyến mãi thất bại", 2000);
    }
  };

  const Del = async (state: string) => {
    const res = await APIDeletePromotion(curentPromo._id);
    console.log(res);
    handleOpenDel();
    if (res?.status == 200 || res?.status == 201) {
      if (state == "unlock") {
        setListPromotionUnlock((prevPromotion) => {
          if (prevPromotion) {
            return {
              total: prevPromotion.total - 1,
              data: prevPromotion.data.filter(
                (item) => item._id !== curentPromo._id
              ),
            };
          }
          return prevPromotion;
        });
      } else {
        setListPromotionNotUse((prevPromotion) => {
          if (prevPromotion) {
            return {
              total: prevPromotion.total - 1,
              data: prevPromotion.data.filter(
                (item) => item._id !== curentPromo._id
              ),
            };
          }
          return prevPromotion;
        });
      }
      Toast("success", "Xoá khuyến mãi thành công", 2000);
    } else {
      Toast("error", "Xoá khuyến mãi thất bại", 2000);
    }
  };

  const Add = async () => {
    // Kiểm tra các trường có giá trị không
    if (
      promotion.value == 0 ||
      promotion.quantity == 0 ||
      promotion.maxDiscountValue == 0 ||
      promotion.storeIds.length == 0 ||
      document.querySelector('[data-slot="helper-wrapper"]')
    ) {
      Toast("error", "Vui lòng kiểm tra lại thông tin", 2000);
      return;
    }
    const res = await APICreatePromotion(promotion);
    if (res?.status == 200 || res?.status == 201) {
      handleOpenAdd(false, "add");
      ClearPromotion();
      setListPromotionUnlock((prevPromotion) => {
        return {
          total: prevPromotion!.total + 1,
          data: [...prevPromotion!.data, res.data],
        };
      });
      Toast("success", "Thêm khuyến mãi thành công", 2000);
    } else {
      Toast("error", "Thêm khuyến mãi thất bại", 2000);
    }
  };

  const Edit = async () => {
    // Kiểm tra các trường có giá trị không
    if (
      promotion.value == 0 ||
      promotion.quantity == 0 ||
      promotion.maxDiscountValue == 0 ||
      promotion.storeIds.length == 0 ||
      document.querySelector('[data-slot="helper-wrapper"]')
    ) {
      Toast("error", "Vui lòng kiểm tra lại thông tin", 2000);
      return;
    }
    const res = await APIUpdatePromotion(promotion._id!, promotion);
    if (res?.status == 200 || res?.status == 201) {
      handleOpenAdd(false, "edit");
      setIsEdit(false);
      ClearPromotion();
      // Set lại list promotion unlock theo id đã chỉnh sửa thành công
      setListPromotionUnlock((prevPromotion) => {
        if (prevPromotion) {
          return {
            total: prevPromotion.total,
            data: prevPromotion.data.map((item) => {
              if (item._id == promotion._id) {
                return promotion;
              }
              return item;
            }),
          };
        }
        return prevPromotion;
      });
      Toast("success", "Sửa khuyến mãi thành công", 2000);
    } else {
      Toast("error", "Sửa khuyến mãi thất bại", 2000);
    }
  };

  return (
    <div>
      <div className="fixed bottom-3 right-3 z-10">
        <SpeedDial>
          <SpeedDialHandler>
            <IconButton
              size="lg"
              className="rounded-full"
              onClick={(e) => {
                // Sroll top
                window.scrollTo(0, 0);
                handleOpenAdd(true, "add");
              }}
            >
              <PlusIcon className="h-5 w-5 transition-transform group-hover:rotate-45" />
            </IconButton>
          </SpeedDialHandler>
        </SpeedDial>
      </div>
      <div className="mb-3">
        <Collapse open={openAdd}>
          <Card className="my-4">
            <CardBody>
              <div className="mb-1 grid grid-cols-2 gap-4 ">
                <div>
                  <Typography variant="h6" color="blue-gray" className="mb-2">
                    Phần trăm giảm
                  </Typography>
                  <Input
                    max={100}
                    type="number"
                    value={promotion.value}
                    onChange={(e) => {
                      if (Number(e.target.value) > 100) {
                        setPromotion({
                          ...promotion,
                          value: 100,
                        });
                      } else {
                        setPromotion({
                          ...promotion,
                          value: Number(e.target.value),
                        });
                      }
                    }}
                    size="lg"
                    className=" !border-t-blue-gray-200 focus:!border-t-gray-900"
                    labelProps={{
                      className: "before:content-none after:content-none",
                    }}
                    crossOrigin={undefined}
                  />
                </div>
                <div>
                  <Typography variant="h6" color="blue-gray" className="mb-2">
                    Số lượng
                  </Typography>
                  <Input
                    type="number"
                    value={promotion.quantity}
                    onChange={(e) =>
                      setPromotion({
                        ...promotion,
                        quantity: Number(e.target.value),
                      })
                    }
                    size="lg"
                    className=" !border-t-blue-gray-200 focus:!border-t-gray-900"
                    labelProps={{
                      className: "before:content-none after:content-none",
                    }}
                    crossOrigin={undefined}
                  />
                </div>

                <div>
                  <Typography variant="h6" color="blue-gray" className="mb-2">
                    Đơn tối thiểu (đồng)
                  </Typography>
                  <Input
                    type="number"
                    value={promotion.minSpend}
                    onChange={(e) =>
                      setPromotion({
                        ...promotion,
                        minSpend: Number(e.target.value),
                      })
                    }
                    size="lg"
                    className=" !border-t-blue-gray-200 focus:!border-t-gray-900"
                    labelProps={{
                      className: "before:content-none after:content-none",
                    }}
                    crossOrigin={undefined}
                  />
                </div>
                <div>
                  <Typography variant="h6" color="blue-gray" className="mb-2">
                    Giảm tối đa (đồng)
                  </Typography>
                  <Input
                    type="number"
                    value={promotion.maxDiscountValue}
                    onChange={(e) =>
                      setPromotion({
                        ...promotion,
                        maxDiscountValue: Number(e.target.value),
                      })
                    }
                    size="lg"
                    className=" !border-t-blue-gray-200 focus:!border-t-gray-900"
                    labelProps={{
                      className: "before:content-none after:content-none",
                    }}
                    crossOrigin={undefined}
                  />
                </div>
                <div>
                  <Typography variant="h6" color="blue-gray" className="mb-2">
                    Thời gian áp dụng (mm/dd/yyyy)
                  </Typography>
                  <DateRangePicker
                    label="Chọn thời gian"
                    value={{
                      start: parseAbsoluteToLocal(
                        new Date(promotion.startTime).toISOString()
                      ),
                      end: parseAbsoluteToLocal(
                        new Date(promotion.endTime).toISOString()
                      ),
                    }}
                    minValue={parseAbsoluteToLocal(
                      new Date(new Date().setHours(0, 0, 0, 0)).toISOString()
                    )}
                    onChange={(val: any) => {
                      const start = new Date(
                        val.start.year,
                        val.start.month - 1,
                        val.start.day,
                        val.start.hour,
                        val.start.minute,
                        val.start.second,
                        val.start.millisecond
                      ).toISOString();
                      const end = new Date(
                        val.end.year,
                        val.end.month - 1,
                        val.end.day,
                        val.end.hour,
                        val.end.minute,
                        val.end.second,
                        val.end.millisecond
                      ).toISOString();
                      setPromotion({
                        ...promotion,
                        startTime: start,
                        endTime: end,
                      });
                    }}
                    hideTimeZone
                    visibleMonths={2}
                  />
                </div>
                <div>
                  <Typography variant="h6" color="blue-gray" className="mb-2">
                    Các cửa hàng áp dụng
                  </Typography>
                  <div className="flex justify-between items-center">
                    {/* Time picker */}
                    <SelectUI
                      label="Chọn cửa hàng"
                      placeholder="Chọn cửa hàng"
                      selectionMode="multiple"
                      selectedKeys={new Set(promotion.storeIds)}
                      onChange={(val: any) =>
                        setPromotion({
                          ...promotion,
                          storeIds: val.target.value.split(","),
                        })
                      }
                    >
                      {storeSingle.map((item) => (
                        <SelectItem key={item._id} value={item._id}>
                          {item.name}
                        </SelectItem>
                      ))}
                    </SelectUI>
                  </div>
                </div>
              </div>
              <div className="text-center mt-4">
                <Button
                  color="blue-gray"
                  className="mr-2"
                  onClick={(e) => {
                    setIsEdit(false);
                    handleOpenAdd(false, "add");
                  }}
                >
                  Đóng
                </Button>
                <Button
                  color="blue"
                  onClick={(e) => {
                    isEdit ? Edit() : Add();
                  }}
                >
                  Xác nhận
                </Button>
              </div>
            </CardBody>
          </Card>
        </Collapse>
      </div>
      {storeSingleAll && (
        <div className="mb-4">
          <Select
            label="Chọn cửa hàng"
            onChange={(val) => {
              setStoreId(val || "");
            }}
          >
            {storeSingleAll.map((item) => (
              <Option key={item._id} value={item._id}>
                {item.name}
              </Option>
            ))}
          </Select>
        </div>
      )}
      <SortTable
        title={arrTitlePromotion}
        totalPage={listPromotion?.total}
        currentPage={page}
        setPage={(data) => setPage(data)}
        perPage={20}
      >
        {listPromotion?.data.map((item, index) => (
          <tr
            className="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
            key={index}
          >
            <td className="px-6 py-4 text-center">
              {(page - 1) * 10 + index + 1}
            </td>
            <td className="px-6 py-4 text-center">{item.voucherCode}</td>
            <td className="px-6 py-4 text-center">
              {item.quantity + item.userUses!.length}
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
                onClick={(e) => {
                  setCurentPromo(item);
                  setOpen(true);
                  setIsViewDetail(true);
                }}
              >
                Xem chi tiết
              </div>
            </td>
          </tr>
        ))}
      </SortTable>

      <div className="my-10">
        <p className="text-center mb-2 font-bold text-lg">
          Danh sách khuyến mãi chưa có lượt sử dụng
        </p>
        <SortTable
          title={arrTitlePromotion}
          totalPage={10}
          currentPage={pageNotUse}
          setPage={(data) => setPageNotUse(data)}
          perPage={20}
        >
          {listPromotionNotUse?.data?.map((item, index) => (
            <tr
              className="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
              key={index}
            >
              <td className="px-6 py-4 text-center">
                {(page - 1) * 10 + index + 1}
              </td>
              <td className="px-6 py-4 text-center">{item.voucherCode}</td>
              <td className="px-6 py-4 text-center">
                {item.quantity + item.userUses!.length}
              </td>
              <td className="px-6 py-4 text-center">{item.value} %</td>
              <td className="px-6 py-4 text-center">
                {FormatMoney(item.maxDiscountValue)}
              </td>
              <td className="px-6 py-4 text-center">
                {formatToDDMMYYYY(item.endTime)}
              </td>
              <td>
                <div className="flex justify-center px-6 py-4">
                  <Tooltip content="Ngừng mở">
                    <div
                      className="font-bold cursor-pointer text-gray-600 mr-2"
                      onClick={() => {
                        setCurentPromo(item);
                        setOpen(true);
                        setIsPublic(false);
                      }}
                    >
                      <TbLockOpenOff size={25} />
                    </div>
                  </Tooltip>
                  <Tooltip content="Xoá">
                    <div
                      className="font-bold cursor-pointer text-red-600 mr-2"
                      onClick={() => {
                        setCurentPromo(item);
                        setOpenDel(true);
                      }}
                    >
                      <MdDelete size={25} />
                    </div>
                  </Tooltip>
                </div>
              </td>
            </tr>
          ))}
        </SortTable>
      </div>
      <div className="my-10">
        <p className="text-center mb-2 font-bold text-lg">
          Danh sách khuyến mãi chưa công bố
        </p>
        <SortTable
          title={arrTitlePromotion}
          totalPage={listPromotionUnlock?.total}
          currentPage={page}
          setPage={(data) => setPage(data)}
          perPage={20}
          noPaging={true}
        >
          {listPromotionUnlock?.data?.map((item, index) => (
            <tr
              className="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
              key={index}
            >
              <td className="px-6 py-4 text-center">
                {(page - 1) * 10 + index + 1}
              </td>
              <td className="px-6 py-4 text-center">{item.voucherCode}</td>
              <td className="px-6 py-4 text-center">{item.quantity}</td>
              <td className="px-6 py-4 text-center">{item.value} %</td>
              <td className="px-6 py-4 text-center">
                {FormatMoney(item.maxDiscountValue)}
              </td>
              <td className="px-6 py-4 text-center">
                {formatToDDMMYYYY(item.endTime)}
              </td>
              <td>
                <div className="flex justify-center px-6 py-4">
                  <Tooltip content="Chỉnh sửa">
                    <div
                      className="cursor-pointer font-bold text-yellow-600 mr-2"
                      onClick={() => {
                        console.log(item);
                        window.scrollTo(0, 0);
                        handleOpenAdd(true, "edit");
                        setPromotion({
                          ...item,
                          startTime: new Date(item.startTime).toISOString(),
                          endTime: new Date(item.endTime).toISOString(),
                        });
                        setIsEdit(true);
                      }}
                    >
                      <FaPencilAlt size={23} />
                    </div>
                  </Tooltip>
                  <Tooltip content="Công bố">
                    <div
                      className="cursor-pointer font-bold text-green-600 mr-2"
                      onClick={() => {
                        setCurentPromo(item);
                        setOpen(true);
                        setIsPublic(true);
                      }}
                    >
                      <TbLockOpenOff size={25} />
                    </div>
                  </Tooltip>
                  <Tooltip content="Xoá">
                    <div
                      className="cursor-pointer font-bold text-red-600 mr-2"
                      onClick={() => {
                        setCurentPromo(item);
                        setOpenDel(true);
                      }}
                    >
                      <MdDelete size={25} />
                    </div>
                  </Tooltip>
                </div>
              </td>
            </tr>
          ))}
        </SortTable>
      </div>
      <Dialog open={open} handler={handleOpen}>
        <DialogHeader>
          {isViewDetail
            ? "Chi tiết khuyến mãi"
            : isPublic
            ? "Công bố"
            : "Ngừng mở" + "khuyến mãi"}
        </DialogHeader>
        <DialogBody
          className={`${isViewDetail && "h-[32rem] overflow-y-scroll"}`}
        >
          <div className="flex flex-col justify-center items-center mb-4">
            <Typography color="blue-gray" className="font-bold " variant="h5">
              {curentPromo?.voucherCode || ""}
            </Typography>
            <span className="ml-2 text-base italic opacity-70">
              ({formatToDDMMYYYY(curentPromo?.startTime)} -
              {formatToDDMMYYYY(curentPromo?.endTime)})
            </span>
          </div>
          <div className="mb-2  bg-[#F9F9F9] rounded-lg p-4">
            {/* Hiện thị các thông tin còn lại chia thành 3 cột*/}
            <div className="grid grid-cols-3 text-center gap-4">
              <div className="flex flex-col items-center">
                <Typography color="blue-gray" className="font-bold">
                  Đơn tối thiểu
                </Typography>
                <Typography color="blue-gray" className="font-medium">
                  {FormatMoney(curentPromo?.minSpend)}
                </Typography>
              </div>
              <div className="flex flex-col items-center">
                <Typography color="blue-gray" className="font-bold">
                  Số lượng
                </Typography>
                <Typography color="blue-gray" className="font-medium">
                  {curentPromo?.quantity || ""}
                </Typography>
              </div>
              <div className="flex flex-col items-center">
                <Typography color="blue-gray" className="font-bold">
                  Giảm giá
                </Typography>
                <Typography color="blue-gray" className="font-medium">
                  {curentPromo?.value}% tối đa{" "}
                  {FormatMoney(curentPromo?.maxDiscountValue)}
                </Typography>
              </div>
              {isViewDetail && (
                <>
                  <div className="flex flex-col items-center">
                    <Typography color="blue-gray" className="font-bold">
                      Số cửa háng áp dụng
                    </Typography>
                    <Typography color="blue-gray" className="font-medium">
                      {curentPromo?.storeIds.length}
                    </Typography>
                  </div>
                  <div className="flex flex-col items-center">
                    <Typography color="blue-gray" className="font-bold">
                      Số người đã lưu
                    </Typography>
                    <Typography color="blue-gray" className="font-medium">
                      {curentPromo?.userSaves.length}
                    </Typography>
                  </div>
                  <div className="flex flex-col items-center">
                    <Typography color="blue-gray" className="font-bold">
                      Số người đã sử dụng
                    </Typography>
                    <Typography color="blue-gray" className="font-medium">
                      {curentPromo?.userUses.length}
                    </Typography>
                  </div>
                </>
              )}
            </div>
          </div>
          {!isViewDetail && (
            <Typography
              variant="small"
              color="gray"
              className="font-normal opacity-75 italic text-sm"
            >
              * Thật cẩn thận trước khi công bố khuyến mãi vì nó sẽ ảnh hưởng
              đến tài chính của công ty.
            </Typography>
          )}
        </DialogBody>
        <DialogFooter>
          <Button
            variant="text"
            color="red"
            onClick={() => {
              handleOpen();
              setIsViewDetail(false);
            }}
            className="mr-1"
          >
            <span>Đóng</span>
          </Button>
          {!isViewDetail && (
            <Button variant="gradient" color="green" onClick={(e) => Public()}>
              <span>{isPublic ? "Công bố" : "Ngừng mở"}</span>
            </Button>
          )}
        </DialogFooter>
      </Dialog>

      <Dialog open={openDel} handler={setOpenDel}>
        <DialogHeader>Xoá khuyến mãi</DialogHeader>
        <DialogBody>
          <Typography color="blue-gray" className="text-center font-medium">
            Bạn có chắc chắn xoá khuyến mãi này không?
          </Typography>
        </DialogBody>
        <DialogFooter>
          <Button
            variant="text"
            color="red"
            onClick={handleOpenDel}
            className="mr-1"
          >
            <span>Huỷ</span>
          </Button>
          <Button variant="gradient" color="red" onClick={(e) => Del("unlock")}>
            <span>Xoá</span>
          </Button>
        </DialogFooter>
      </Dialog>
    </div>
  );
}

export default All;
