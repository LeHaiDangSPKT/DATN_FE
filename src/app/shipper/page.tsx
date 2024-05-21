"use client";
import React from "react";
import Image from "next/image";
import {
  Avatar,
  Button,
  Dialog,
  DialogBody,
  DialogFooter,
  DialogHeader,
  Drawer,
  IconButton,
  Input,
  List,
  ListItem,
  ListItemPrefix,
  Menu,
  MenuHandler,
  MenuItem,
  MenuList,
  Select,
  Typography,
  Option,
  Alert,
  Spinner,
} from "@material-tailwind/react";
import { FaAlignJustify, FaClipboardList } from "react-icons/fa";
import {
  FaFileCircleCheck,
  FaFileCirclePlus,
  FaFileCircleXmark,
} from "react-icons/fa6";
import { BillForShipper } from "@/components/BillForShipper";
import {
  APIGetListBills,
  APIGetProfileShipper,
  APIUpdateProfileShipper,
} from "@/services/Shipper";
import FormatMoney from "@/utils/FormatMoney";
import ConvertDate from "@/utils/ConvertDate";
import Toast from "@/utils/Toast";
import { APIUploadImage } from "@/services/UploadImage";
import TableBillShipper from "./table";
import { useRouter } from "next/navigation";

type Shipper = {
  id: string;
  avatar: string;
  fullName: string;
  email: string;
  emailShipper: string;
  address: string;
  phone: string;
  gender: string;
  status: boolean;
  wallet: number;
  createdAt: string;
};
type BillForShipperProps = {
  _id: string;
  storeAddress: string;
  address: string;
  storePhone: string[];
  fullName: string;
  phoneNumber: string;
  name: string;
  price: number;
  totalPriceReceive: number;
  paymentMethod: string;
  isUserConfirmed: boolean;
  deliveredDate: Date;
  isFeedbackShipper: boolean;
  star: number;
  content: string;
  reason: string;
};

function Page() {
  const router = useRouter();
  const [open, setOpen] = React.useState(false);
  const [totalPage, setTotalPage] = React.useState(0);
  const [openDialog, setOpenDialog] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const handleOpenDialog = () => setOpenDialog(!openDialog);
  const openDrawer = () => setOpen(true);
  const closeDrawer = () => setOpen(false);
  const [code, setCode] = React.useState(1);
  const [statusBill, setStatusBill] = React.useState<string>("CONFIRMED");
  const [profile, setProfile] = React.useState({} as Shipper);
  const [section, setSection] = React.useState({
    state: false,
    title: "",
  });
  const [alert, setAlert] = React.useState({
    open: false,
    message: "",
  });
  const [listBill, setListBill] = React.useState([] as BillForShipperProps[]);
  const fieldsSubmit = [
    {
      label: "Họ và tên",
      name: "fullName",
    },
    {
      label: "Email cá nhân",
      name: "emailShipper",
    },
    {
      label: "Số điện thoại",
      name: "phone",
    },
    {
      label: "Địa chỉ",
      name: "address",
    },
  ];
  React.useEffect(() => {
    const fetchData = async () => {
      const res = await APIGetProfileShipper();
      setProfile(res);
    };
    fetchData();
  }, []);

  React.useEffect(() => {
    const fetchData = async () => {
      const res = await APIGetListBills(1, 1, statusBill);
      setTotalPage(res.total);
      setListBill(
        res.data.map((item: any) => {
          return {
            _id: item._id,
            storeAddress: item.storeAddress,
            address: item.receiverInfo.address,
            storePhone: item.storePhone,
            fullName: item.receiverInfo.fullName,
            phoneNumber: item.receiverInfo.phoneNumber,
            name: item.products.map((product: any) => {
              return product.name + "(" + product.quantity + ")";
            }),
            totalPriceReceive: item.totalPriceReceive,
            price: item.totalPricePayment + item.deliveryFee,
            paymentMethod: item.paymentMethod,
            isUserConfirmed: item.isUserConfirmed,
            isFeedbackShipper: item.isFeedbackShipper,
            star: item.star,
            content: item.content,
            reason: item.reason,
          };
        })
      );
    };
    fetchData();
  }, [statusBill]);

  const Submit = async () => {
    if (
      profile.fullName == "" ||
      profile.emailShipper == "" ||
      profile.phone == "" ||
      profile.address == ""
    ) {
      setAlert({
        open: true,
        message: "Vui lòng nhập đủ thông tin",
      });
      setTimeout(() => {
        setAlert({
          open: false,
          message: "",
        });
      }, 2000);
      return;
    }
    if (
      !profile.emailShipper.match(/^[a-zA-Z0-9]+@(?:[a-zA-Z0-9]+\.)+[A-Za-z]+$/)
    ) {
      setAlert({
        open: true,
        message: "Email không hợp lệ",
      });
      setTimeout(() => {
        setAlert({
          open: false,
          message: "",
        });
      }, 2000);
      return;
    }
    if (!profile.phone.match(/^[0-9]+$/)) {
      setAlert({
        open: true,
        message: "Số điện thoại không hợp lệ",
      });
      setTimeout(() => {
        setAlert({
          open: false,
          message: "",
        });
      }, 2000);
      return;
    }
    if (profile.phone.length !== 10) {
      setAlert({
        open: true,
        message: "Số điện thoại phải có 10 số",
      });
      setTimeout(() => {
        setAlert({
          open: false,
          message: "",
        });
      }, 2000);
      return;
    }
    if (typeof profile.avatar != "string") {
      let formData = new FormData();
      formData.append("file", profile.avatar);
      setLoading(true);
      const res = await APIUploadImage(formData);
      setLoading(false);

      if (res?.status == 200 || res?.status == 201) {
        profile.avatar = res.data.url;
      } else {
        setAlert({
          open: true,
          message: "Ảnh có kích thước quá lớn",
        });
        setTimeout(() => {
          setAlert({
            open: false,
            message: "",
          });
        }, 2000);
        return;
      }
    }
    setOpenDialog(false);
    const res = await APIUpdateProfileShipper(profile);
    if (res?.status == 200 || res?.status == 201) {
      Toast("success", res.data.message, 2000);
      setProfile(res.data.metadata.data);
    } else {
      Toast("error", res?.data.message, 2000);
    }
  };

  const RefreshList = (data: string) => {
    setListBill(listBill.filter((item) => item._id !== data));
  };

  const handleSetCode = (iCode: number) => {
    setCode(iCode);
    setOpen(false);
    if (iCode == code) return;
    if (iCode == 1) {
      setStatusBill("CONFIRMED");
    } else if (iCode == 2) {
      setStatusBill("DELIVERING");
    } else if (iCode == 3) {
      setStatusBill("DELIVERED");
    } else {
      setStatusBill("BACK");
    }
  };

  return (
    <div className="min-h-screen">
      <div className="flex justify-around items-center ">
        <div onClick={openDrawer}>
          <FaAlignJustify />
        </div>
        <Drawer open={open} onClose={closeDrawer} className="p-4">
          <div className="mb-6">
            <div onClick={closeDrawer} className="absolute right-2 top-2">
              <IconButton variant="text" color="blue-gray">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  className="h-5 w-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </IconButton>
            </div>
            <List className="mt-4">
              <ListItem selected={code == 1} onClick={(e) => handleSetCode(1)}>
                <ListItemPrefix>
                  <FaClipboardList className="h-6 w-6" />
                </ListItemPrefix>
                Đơn mới
              </ListItem>
              <ListItem selected={code == 2} onClick={(e) => handleSetCode(2)}>
                <ListItemPrefix>
                  <FaFileCirclePlus className="h-6 w-6" />
                </ListItemPrefix>
                Đơn đã nhận
              </ListItem>
              <ListItem selected={code == 3} onClick={(e) => handleSetCode(3)}>
                <ListItemPrefix>
                  <FaFileCircleCheck className="h-6 w-6" />
                </ListItemPrefix>
                Đơn đã giao
              </ListItem>
              <ListItem selected={code == 4} onClick={(e) => handleSetCode(4)}>
                <ListItemPrefix>
                  <FaFileCircleXmark className="h-6 w-6" />
                </ListItemPrefix>
                Đơn đã trả
              </ListItem>
            </List>
          </div>
        </Drawer>
        <div
          onClick={(e) => {
            document.getElementById("loading-page")?.classList.remove("hidden");
            router.push("/shipper");
          }}
        >
          <Image src="/logo.png" alt="logo" width={100} height={100} />
        </div>
        <div>
          <Menu>
            <MenuHandler>
              <Avatar
                variant="circular"
                alt="tania andrew"
                className="cursor-pointer"
                src={profile?.avatar}
              />
            </MenuHandler>
            <MenuList>
              <MenuItem
                className="flex items-center gap-2"
                onClick={(e) => {
                  setSection({ state: false, title: "Thông tin cá nhân" });
                  setOpenDialog(true);
                }}
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M16 8C16 10.1217 15.1571 12.1566 13.6569 13.6569C12.1566 15.1571 10.1217 16 8 16C5.87827 16 3.84344 15.1571 2.34315 13.6569C0.842855 12.1566 0 10.1217 0 8C0 5.87827 0.842855 3.84344 2.34315 2.34315C3.84344 0.842855 5.87827 0 8 0C10.1217 0 12.1566 0.842855 13.6569 2.34315C15.1571 3.84344 16 5.87827 16 8ZM10 5C10 5.53043 9.78929 6.03914 9.41421 6.41421C9.03914 6.78929 8.53043 7 8 7C7.46957 7 6.96086 6.78929 6.58579 6.41421C6.21071 6.03914 6 5.53043 6 5C6 4.46957 6.21071 3.96086 6.58579 3.58579C6.96086 3.21071 7.46957 3 8 3C8.53043 3 9.03914 3.21071 9.41421 3.58579C9.78929 3.96086 10 4.46957 10 5ZM8 9C7.0426 8.99981 6.10528 9.27449 5.29942 9.7914C4.49356 10.3083 3.85304 11.0457 3.454 11.916C4.01668 12.5706 4.71427 13.0958 5.49894 13.4555C6.28362 13.8152 7.13681 14.0009 8 14C8.86319 14.0009 9.71638 13.8152 10.5011 13.4555C11.2857 13.0958 11.9833 12.5706 12.546 11.916C12.147 11.0457 11.5064 10.3083 10.7006 9.7914C9.89472 9.27449 8.9574 8.99981 8 9Z"
                    fill="#90A4AE"
                  />
                </svg>

                <Typography variant="small" className="font-medium">
                  Thông tin cá nhân
                </Typography>
              </MenuItem>
              <MenuItem
                className="flex items-center gap-2"
                onClick={(e) => {
                  setSection({
                    state: true,
                    title: "Chỉnh sửa thông tin cá nhân",
                  });
                  setOpenDialog(true);
                }}
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M9.48999 1.17C9.10999 -0.39 6.88999 -0.39 6.50999 1.17C6.45326 1.40442 6.34198 1.62213 6.18522 1.80541C6.02845 1.9887 5.83063 2.13238 5.60784 2.22477C5.38505 2.31716 5.1436 2.35564 4.90313 2.33709C4.66266 2.31854 4.42997 2.24347 4.22399 2.118C2.85199 1.282 1.28199 2.852 2.11799 4.224C2.65799 5.11 2.17899 6.266 1.17099 6.511C-0.390006 6.89 -0.390006 9.111 1.17099 9.489C1.40547 9.54581 1.62322 9.65719 1.80651 9.81407C1.98979 9.97096 2.13343 10.1689 2.22573 10.3918C2.31803 10.6147 2.35639 10.8563 2.33766 11.0968C2.31894 11.3373 2.24367 11.5701 2.11799 11.776C1.28199 13.148 2.85199 14.718 4.22399 13.882C4.42993 13.7563 4.66265 13.6811 4.90318 13.6623C5.14371 13.6436 5.38527 13.682 5.60817 13.7743C5.83108 13.8666 6.02904 14.0102 6.18592 14.1935C6.34281 14.3768 6.45419 14.5945 6.51099 14.829C6.88999 16.39 9.11099 16.39 9.48899 14.829C9.54599 14.5946 9.65748 14.377 9.8144 14.1939C9.97132 14.0107 10.1692 13.8672 10.3921 13.7749C10.6149 13.6826 10.8564 13.6442 11.0969 13.6628C11.3373 13.6815 11.57 13.7565 11.776 13.882C13.148 14.718 14.718 13.148 13.882 11.776C13.7565 11.57 13.6815 11.3373 13.6628 11.0969C13.6442 10.8564 13.6826 10.6149 13.7749 10.3921C13.8672 10.1692 14.0107 9.97133 14.1939 9.81441C14.377 9.65749 14.5946 9.546 14.829 9.489C16.39 9.11 16.39 6.889 14.829 6.511C14.5945 6.45419 14.3768 6.34281 14.1935 6.18593C14.0102 6.02904 13.8666 5.83109 13.7743 5.60818C13.682 5.38527 13.6436 5.14372 13.6623 4.90318C13.681 4.66265 13.7563 4.42994 13.882 4.224C14.718 2.852 13.148 1.282 11.776 2.118C11.5701 2.24368 11.3373 2.31895 11.0968 2.33767C10.8563 2.35639 10.6147 2.31804 10.3918 2.22574C10.1689 2.13344 9.97095 1.9898 9.81407 1.80651C9.65718 1.62323 9.5458 1.40548 9.48899 1.171L9.48999 1.17ZM7.99999 11C8.79564 11 9.55871 10.6839 10.1213 10.1213C10.6839 9.55871 11 8.79565 11 8C11 7.20435 10.6839 6.44129 10.1213 5.87868C9.55871 5.31607 8.79564 5 7.99999 5C7.20434 5 6.44128 5.31607 5.87867 5.87868C5.31606 6.44129 4.99999 7.20435 4.99999 8C4.99999 8.79565 5.31606 9.55871 5.87867 10.1213C6.44128 10.6839 7.20434 11 7.99999 11Z"
                    fill="#90A4AE"
                  />
                </svg>

                <Typography variant="small" className="font-medium">
                  Chỉnh sửa thông tin
                </Typography>
              </MenuItem>

              <MenuItem
                className="flex items-center gap-2"
                onClick={(e) => {
                  document
                    .getElementById("loading-page")
                    ?.classList.remove("hidden");

                  router.push("/shipper/change-password");
                }}
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M16 8C16 10.1217 15.1571 12.1566 13.6569 13.6569C12.1566 15.1571 10.1217 16 8 16C5.87827 16 3.84344 15.1571 2.34315 13.6569C0.842855 12.1566 0 10.1217 0 8C0 5.87827 0.842855 3.84344 2.34315 2.34315C3.84344 0.842855 5.87827 0 8 0C10.1217 0 12.1566 0.842855 13.6569 2.34315C15.1571 3.84344 16 5.87827 16 8ZM14 8C14 8.993 13.759 9.929 13.332 10.754L11.808 9.229C12.0362 8.52269 12.0632 7.76679 11.886 7.046L13.448 5.484C13.802 6.249 14 7.1 14 8ZM8.835 11.913L10.415 13.493C9.654 13.8281 8.83149 14.0007 8 14C7.13118 14.0011 6.27257 13.8127 5.484 13.448L7.046 11.886C7.63267 12.0298 8.24426 12.039 8.835 11.913ZM4.158 9.117C3.96121 8.4394 3.94707 7.72182 4.117 7.037L4.037 7.117L2.507 5.584C2.1718 6.34531 1.99913 7.16817 2 8C2 8.954 2.223 9.856 2.619 10.657L4.159 9.117H4.158ZM5.246 2.667C6.09722 2.22702 7.04179 1.99825 8 2C8.954 2 9.856 2.223 10.657 2.619L9.117 4.159C8.34926 3.93538 7.53214 3.94687 6.771 4.192L5.246 2.668V2.667ZM10 8C10 8.53043 9.78929 9.03914 9.41421 9.41421C9.03914 9.78929 8.53043 10 8 10C7.46957 10 6.96086 9.78929 6.58579 9.41421C6.21071 9.03914 6 8.53043 6 8C6 7.46957 6.21071 6.96086 6.58579 6.58579C6.96086 6.21071 7.46957 6 8 6C8.53043 6 9.03914 6.21071 9.41421 6.58579C9.78929 6.96086 10 7.46957 10 8Z"
                    fill="#90A4AE"
                  />
                </svg>
                <Typography variant="small" className="font-medium">
                  Đổi mật khẩu
                </Typography>
              </MenuItem>
              <hr className="my-2 border-blue-gray-50" />
              <MenuItem className="flex items-center gap-2 text-red-600">
                <svg
                  width="16"
                  height="14"
                  viewBox="0 0 16 14"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M1 0C0.734784 0 0.48043 0.105357 0.292893 0.292893C0.105357 0.48043 0 0.734784 0 1V13C0 13.2652 0.105357 13.5196 0.292893 13.7071C0.48043 13.8946 0.734784 14 1 14C1.26522 14 1.51957 13.8946 1.70711 13.7071C1.89464 13.5196 2 13.2652 2 13V1C2 0.734784 1.89464 0.48043 1.70711 0.292893C1.51957 0.105357 1.26522 0 1 0ZM11.293 9.293C11.1108 9.4816 11.01 9.7342 11.0123 9.9964C11.0146 10.2586 11.1198 10.5094 11.3052 10.6948C11.4906 10.8802 11.7414 10.9854 12.0036 10.9877C12.2658 10.99 12.5184 10.8892 12.707 10.707L15.707 7.707C15.8945 7.51947 15.9998 7.26516 15.9998 7C15.9998 6.73484 15.8945 6.48053 15.707 6.293L12.707 3.293C12.6148 3.19749 12.5044 3.12131 12.3824 3.0689C12.2604 3.01649 12.1292 2.9889 11.9964 2.98775C11.8636 2.9866 11.7319 3.0119 11.609 3.06218C11.4861 3.11246 11.3745 3.18671 11.2806 3.2806C11.1867 3.3745 11.1125 3.48615 11.0622 3.60905C11.0119 3.73194 10.9866 3.86362 10.9877 3.9964C10.9889 4.12918 11.0165 4.2604 11.0689 4.3824C11.1213 4.50441 11.1975 4.61475 11.293 4.707L12.586 6H5C4.73478 6 4.48043 6.10536 4.29289 6.29289C4.10536 6.48043 4 6.73478 4 7C4 7.26522 4.10536 7.51957 4.29289 7.70711C4.48043 7.89464 4.73478 8 5 8H12.586L11.293 9.293Z"
                    fill="#E53935"
                  />
                </svg>
                <Typography
                  variant="small"
                  className="font-medium"
                  onClick={(e) => {
                    localStorage.removeItem("user");
                    document
                      .getElementById("loading-page")
                      ?.classList.remove("hidden");
                    router.push("/login");
                  }}
                >
                  Đăng xuất
                </Typography>
              </MenuItem>
            </MenuList>
          </Menu>
        </div>
      </div>

      {code < 3 && (
        <div className="flex flex-col justify-center items-center bg-white">
          {listBill.length ? (
            listBill.map((item: BillForShipperProps) => {
              return (
                <BillForShipper
                  key={item._id}
                  data={item}
                  setListBill={(data: string) => RefreshList(data)}
                  statusBill={statusBill}
                />
              );
            })
          ) : (
            <Typography variant="small" className="text-center mt-4">
              Không có đơn hàng nào
            </Typography>
          )}
        </div>
      )}

      {code > 2 && (
        <TableBillShipper
          listBill={listBill}
          total={totalPage}
          statusBill={statusBill}
        />
      )}

      <Dialog open={openDialog} handler={handleOpenDialog}>
        <DialogHeader className="text-center">{section.title}</DialogHeader>
        <DialogBody>
          <div className="mb-3 text-center">
            <div
              className="w-[50px] h-[50px] border border-[#d9d9d9] rounded-full flex justify-center items-center cursor-pointer mx-auto"
              onClick={(e) => {
                console.log("click", section.state);
                if (!section.state) return;
                const input = document.getElementById("upload-avatar");
                if (input) {
                  input.click();
                }
              }}
            >
              <Image
                src={profile?.avatar}
                width={50}
                height={50}
                id="avatar-preview"
                alt=""
                className="rounded-full h-full fit-cover w-full"
              />
            </div>
            {/* Ẩn */}
            <input
              id="upload-avatar"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={async (e) => {
                const file = e.target.files?.[0];
                if (file) {
                  setProfile({ ...profile, avatar: file as any });
                  const reader = new FileReader();
                  reader.onloadend = function () {
                    const avatar = document.getElementById("avatar-preview");
                    console.log("ava", avatar);
                    if (avatar) {
                      avatar.setAttribute("src", reader.result as string);
                    }
                  };
                  reader.readAsDataURL(file);
                }
              }}
            />
            <Typography variant="small" className="text-gray-500 mt-2">
              Tham gia từ: {ConvertDate(profile.createdAt)}
            </Typography>
            <Typography variant="small" className="text-blue-500">
              Tổng tiền trong ví: {FormatMoney(profile.wallet)}
            </Typography>
          </div>
          {fieldsSubmit.map((item) => (
            <div className="mb-3" key={item.name}>
              <Input
                name={item.name}
                label={item.label}
                value={profile[item.name as keyof Shipper] as any}
                crossOrigin={undefined}
                disabled={!section.state}
                onChange={(e) => {
                  setProfile({ ...profile, [item.name]: e.target.value });
                }}
              />
            </div>
          ))}
          <div className="mb-3">
            <Select
              label="Giới tính"
              onChange={(val) => setProfile({ ...profile, gender: val! })}
              value={profile.gender}
              disabled={!section.state}
            >
              <Option value="Nam">Nam</Option>
              <Option value="Nữ">Nữ</Option>
              <Option value="Khác">Khác</Option>
            </Select>
          </div>

          <div className="mb-3">
            <Input
              label="Tài khoản"
              value={profile.email}
              crossOrigin={undefined}
              disabled={true}
            />
          </div>
          {alert.open && (
            <Alert color="red" className="mb-4">
              {alert.message}
            </Alert>
          )}
        </DialogBody>
        <DialogFooter>
          <Button
            variant="text"
            color="red"
            onClick={handleOpenDialog}
            className="mr-1"
          >
            <span>Đóng</span>
          </Button>
          {section.state && (
            <Button variant="gradient" color="blue" onClick={(e) => Submit()}>
              {loading ? <Spinner /> : <span>Lưu</span>}
            </Button>
          )}
        </DialogFooter>
      </Dialog>
    </div>
  );
}

export default Page;
