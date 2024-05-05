"use client";
import {
  Alert,
  Button,
  Dialog,
  DialogBody,
  DialogFooter,
  DialogHeader,
  IconButton,
  Input,
  SpeedDial,
  SpeedDialAction,
  SpeedDialContent,
  SpeedDialHandler,
  Tab,
  TabPanel,
  Tabs,
  TabsBody,
  TabsHeader,
  Textarea,
  Tooltip,
} from "@material-tailwind/react";
import React from "react";
import CardPolicy from "./CardPolicy";
import {
  APIAddPolicy,
  APIGetAllPolicy,
  APIUpdatePolicy,
} from "@/services/Policy";
import {
  BuildingStorefrontIcon,
  PlusIcon,
  Square3Stack3DIcon,
  UserIcon,
} from "@heroicons/react/24/solid";
import Toast from "@/utils/Toast";

interface PolicyProps {
  label: string;
  value: string;
  desc: {
    _id: string;
    name: string;
    content: string;
  }[];
}

function Policy() {
  const [alert, setAlert] = React.useState({
    open: false,
    message: "",
  });
  const [policies, setPolicies] = React.useState<PolicyProps[]>([]);
  const [type, setType] = React.useState("USER");
  const [isFetchData, setIsFetchData] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const [policy, setPolicy] = React.useState<any>({
    name: "",
    content: "",
    type: "",
  });
  const dictType = {
    user: {
      label: "Người dùng",
      value: "user",
      icon: <UserIcon className="h-5 w-5" />,
    },
    product: {
      label: "Sản phẩm",
      value: "product",
      icon: <Square3Stack3DIcon className="h-5 w-5" />,
    },
    store: {
      label: "Cửa hàng",
      value: "store",
      icon: <BuildingStorefrontIcon className="h-5 w-5" />,
    },
  };

  const handleOpen = () => setOpen(!open);
  React.useEffect(() => {
    const fetchData = async () => {
      setIsFetchData(true);
      const res = await APIGetAllPolicy(type);
      setPolicies([
        {
          label: "Người dùng",
          value: "user",
          desc: type == "USER" ? res : [],
        },
        {
          label: "Sản phẩm",
          value: "product",
          desc: type == "PRODUCT" ? res : [],
        },
        {
          label: "Cửa hàng",
          value: "store",
          desc: type == "STORE" ? res : [],
        },
      ]);
      setIsFetchData(false);
    };
    fetchData();
  }, [type]);
  const handleEdit = (policy: any) => {
    setPolicies((cur) =>
      cur.map((item) => {
        if (item.value == type) {
          return {
            ...item,
            desc: item.desc.map((desc) => {
              if (desc._id == policy._id) {
                return policy;
              }
              return desc;
            }),
          };
        }
        return item;
      })
    );
  };

  const handleSpeedDial = (type: string) => {
    setPolicy({ ...policy, type: type.toUpperCase() });
    handleOpen();
  };

  const handleAdd = async () => {
    // Check if policy is empty
    if (!policy.name || !policy.content) {
      setAlert({
        open: true,
        message: "Vui lòng điền đầy đủ thông tin",
      });
      setTimeout(() => {
        setAlert({
          open: false,
          message: "",
        });
      }, 2000);
      return;
    }
    const res = await APIAddPolicy(policy);
    if (res?.status == 200 || res?.status == 201) {
      Toast("success", res.data.message, 2000);
      setType(policy.type);
      setPolicy({ name: "", content: "", type: "" });
      handleOpen();
      if (policy.type == type) {
        setPolicies((cur) => {
          return cur.map((item) => {
            if (item.value == policy.type.toLowerCase()) {
              return {
                ...item,
                desc: [res.data.metadata.data, ...item.desc],
              };
            }
            return item;
          });
        });
      } else {
        const tab = document
          .querySelector("ul[role='tablist']")
          ?.querySelectorAll(
            `li[data-value='${policy.type.toLowerCase()}']`
          )[0] as HTMLLIElement;
        tab?.click();
      }
    } else {
      setAlert({
        open: true,
        message: res?.data.message,
      });
      setTimeout(() => {
        setAlert({
          open: false,
          message: "",
        });
      }, 2000);
    }
  };

  const handleDel = (id: string) => {
    setPolicies((cur) =>
      cur.map((item: any) => {
        if (item.value == type.toLowerCase()) {
          return {
            ...item,
            desc: item.desc.filter((desc: any) => desc._id != id),
          };
        }
        return item;
      })
    );
  };

  return (
    <>
      <Tabs value={type.toLowerCase()}>
        <TabsHeader>
          {policies.map(({ label, value }) => (
            <Tab
              key={value}
              value={value}
              onClick={(e) => setType(value.toUpperCase())}
            >
              {label}
            </Tab>
          ))}
        </TabsHeader>
        <TabsBody>
          {isFetchData && (
            <div className="grid min-h-[140px] w-full place-items-center overflow-x-scroll rounded-lg p-6 lg:overflow-visible">
              <svg
                className="text-gray-300 animate-spin"
                viewBox="0 0 64 64"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
              >
                <path
                  d="M32 3C35.8083 3 39.5794 3.75011 43.0978 5.20749C46.6163 6.66488 49.8132 8.80101 52.5061 11.4939C55.199 14.1868 57.3351 17.3837 58.7925 20.9022C60.2499 24.4206 61 28.1917 61 32C61 35.8083 60.2499 39.5794 58.7925 43.0978C57.3351 46.6163 55.199 49.8132 52.5061 52.5061C49.8132 55.199 46.6163 57.3351 43.0978 58.7925C39.5794 60.2499 35.8083 61 32 61C28.1917 61 24.4206 60.2499 20.9022 58.7925C17.3837 57.3351 14.1868 55.199 11.4939 52.5061C8.801 49.8132 6.66487 46.6163 5.20749 43.0978C3.7501 39.5794 3 35.8083 3 32C3 28.1917 3.75011 24.4206 5.2075 20.9022C6.66489 17.3837 8.80101 14.1868 11.4939 11.4939C14.1868 8.80099 17.3838 6.66487 20.9022 5.20749C24.4206 3.7501 28.1917 3 32 3L32 3Z"
                  stroke="currentColor"
                  strokeWidth="5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                ></path>
                <path
                  d="M32 3C36.5778 3 41.0906 4.08374 45.1692 6.16256C49.2477 8.24138 52.7762 11.2562 55.466 14.9605C58.1558 18.6647 59.9304 22.9531 60.6448 27.4748C61.3591 31.9965 60.9928 36.6232 59.5759 40.9762"
                  stroke="currentColor"
                  strokeWidth="5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-gray-900"
                ></path>
              </svg>
            </div>
          )}
          {policies.map(({ value, desc }) => (
            <TabPanel key={value} value={value}>
              <div className="flex flex-wrap">
                {desc.map((item) => (
                  <CardPolicy
                    data={item}
                    key={item._id}
                    handleEdit={(data) => handleEdit(data)}
                    handleDel={(data) => handleDel(data)}
                  />
                ))}
              </div>
            </TabPanel>
          ))}
        </TabsBody>
      </Tabs>
      <div className="fixed bottom-3 right-3 z-10">
        <SpeedDial>
          <SpeedDialHandler>
            <IconButton size="lg" className="rounded-full">
              <PlusIcon className="h-5 w-5 transition-transform group-hover:rotate-45" />
            </IconButton>
          </SpeedDialHandler>
          <SpeedDialContent>
            {
              // Loop dictType to render SpeedDialAction
              Object.entries(dictType).map((item, index) => (
                <Tooltip key={index} content={item[1].label} placement="left">
                  <SpeedDialAction onClick={(e) => handleSpeedDial(item[0])}>
                    {item[1].icon}
                  </SpeedDialAction>
                </Tooltip>
              ))
            }
          </SpeedDialContent>
        </SpeedDial>
      </div>
      <Dialog open={open} handler={handleOpen}>
        <DialogHeader>Thêm chính sách</DialogHeader>
        <DialogBody>
          {alert.open && (
            <Alert color="red" className="mb-4">
              {alert.message}
            </Alert>
          )}
          <div className="flex flex-col gap-4">
            <Input
              value={
                policy.type == "USER"
                  ? dictType.user.label
                  : policy.type == "PRODUCT"
                  ? dictType.product.label
                  : dictType.store.label
              }
              crossOrigin={undefined}
              disabled
            />
            <Input
              label="Tên chính sách"
              value={policy.name}
              crossOrigin={undefined}
              onChange={(e) => setPolicy({ ...policy, name: e.target.value })}
            />
            <Textarea
              label="Nội dung"
              rows={12}
              className="w-full"
              value={policy.content}
              onChange={(e) =>
                setPolicy({ ...policy, content: e.target.value })
              }
            />
          </div>
        </DialogBody>
        <DialogFooter>
          <Button
            variant="text"
            color="red"
            onClick={(e) => {
              handleOpen();
              setPolicy({ name: "", content: "", type: "" });
            }}
            className="mr-1"
          >
            <span>Đóng</span>
          </Button>
          <Button variant="gradient" color="green" onClick={(e) => handleAdd()}>
            <span>Thêm</span>
          </Button>
        </DialogFooter>
      </Dialog>
    </>
  );
}

export default Policy;
