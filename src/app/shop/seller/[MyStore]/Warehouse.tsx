import SortTable from "@/components/SortTable";
import { UPDATEPRODUCT } from "@/constants/UpdateProduct";
import {
  APIDeleteProduct,
  APIGetListProduct,
  APIUpdateProduct,
} from "@/services/Product";
import CheckValidInput from "@/utils/CheckValidInput";
import { APIUploadImage } from "@/services/UploadImage";
import FormatMoney from "@/utils/FormatMoney";
import RemoveVietnameseTones from "@/utils/RemoveVietnameseTones";
import Toast from "@/utils/Toast";
import {
  Button,
  Dialog,
  DialogBody,
  DialogFooter,
  DialogHeader,
  Input,
  Select,
  Option,
  Alert,
} from "@material-tailwind/react";
import React from "react";
import UploadFile from "./UploadFile";
import { useAppSelector } from "@/redux/store";
const ReactQuill =
  typeof window === "object" ? require("react-quill") : () => false;
interface ProductProps {
  _id: string;
  avatar: string[];
  quantity: number;
  name: string;
  newPrice: number;
  oldPrice: number;
  description: string;
  categoryName: string;
  categoryId: string;
  keywords: string[];
  type: string;
  status: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
  storeId: string;
  quantitySold: number;
  quantityGive: number;
  revenue: number;
  isPurchased: boolean;
}
interface WarehouseProps {
  total: number;
  products: ProductProps[];
}

function Warehouse() {
  const [alert, setAlert] = React.useState({
    open: false,
    message: "",
  });
  const lengthIndex = useAppSelector(
    (state) => state.uploadFilesReducer.arr.length
  );
  const arrTitle = [
    {
      title: "STT",
      sort: false,
      name: "index",
    },
    {
      title: "Tên sản phẩm",
      sort: false,
      name: "name",
    },
    {
      title: "Loại sản phẩm",
      sort: false,
      name: "category",
    },
    {
      title: "Giá trước giảm",
      sort: false,
      name: "oldPrice",
    },
    {
      title: "Giá sau khi giảm (bán)",
      sort: false,
      name: "newPrice",
    },
    {
      title: "Số lượng còn lại",
      sort: false,
      name: "quantity",
    },
    {
      title: "Số lượng đã bán/tặng",
      sort: false,
      name: "quantitySold",
    },
    {
      title: "Doanh số",
      sort: false,
      name: "revenue",
    },
    {
      title: "Thao tác",
      sort: false,
      name: "action",
    },
  ];
  const [sortType, setSortType] = React.useState<string>("");
  const [sortValue, setSortValue] = React.useState<string>("name");
  const [page, setPage] = React.useState<number>(1);
  const [currentProduct, setCurrentProduct] = React.useState<any>({
    _id: "",
    name: "",
    newPrice: 0,
    oldPrice: 0,
    description: "",
    categoryId: "",
    quantity: 0,
    list_keyword: "",
    keywords: [] as string[],
    avatar: [] as string[],
  });
  const [creating, setCreating] = React.useState(false);
  const [data, setData] = React.useState<WarehouseProps>({} as WarehouseProps);
  const [listImgTemp, setListImgTemp] = React.useState<any[]>([]);
  const category = localStorage.getItem("category")
    ? JSON.parse(localStorage.getItem("category")!)
    : null;
  React.useEffect(() => {
    const fetchData = async () => {
      const data = await APIGetListProduct(
        page || 1,
        20,
        "",
        sortType,
        sortValue
      );
      setData(data.metadata);
    };
    fetchData();
  }, [page, sortType, sortValue]);

  const SortbyField = (field: any) => {
    if (sortType === "asc") {
      setData({
        ...data,
        products: data.products.sort((a: any, b: any) =>
          RemoveVietnameseTones(a[field] + "").toUpperCase() <
          RemoveVietnameseTones(b[field] + "").toUpperCase()
            ? 1
            : RemoveVietnameseTones(b[field] + "").toUpperCase() <
              RemoveVietnameseTones(a[field] + "").toUpperCase()
            ? -1
            : 0
        ),
      });
      setSortType("desc");
    } else {
      setData({
        ...data,
        products: data.products.sort((a: any, b: any) =>
          RemoveVietnameseTones(a[field] + "").toUpperCase() >
          RemoveVietnameseTones(b[field] + "").toUpperCase()
            ? 1
            : RemoveVietnameseTones(b[field] + "").toUpperCase() >
              RemoveVietnameseTones(a[field] + "").toUpperCase()
            ? -1
            : 0
        ),
      });

      setSortType("asc");
    }
    setSortValue(field);
  };
  const ConfirmUpdateProduct = async () => {
    const objCopied = JSON.parse(JSON.stringify(currentProduct));
    delete objCopied.keywords;
    if (+objCopied.newPrice > +objCopied.oldPrice) {
      setAlert({
        open: true,
        message: "Giá sau khi giảm phải nhỏ hơn giá trước giảm",
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
      CheckValidInput(objCopied) == "" &&
      objCopied.description.replace(/<(.|\n)*?>/g, "").trim().length !== 0
    ) {
      const index = data.products.findIndex(
        (item) => item._id == currentProduct._id
      );

      var listImg: any = [];
      setCreating(true);
      for (let i = 0; i < listImgTemp.length; i++) {
        if (typeof listImgTemp[i] != "string") {
          let formData = new FormData();
          formData.append("file", listImgTemp[i]);
          const res = await APIUploadImage(formData);
          if (res?.status == 200 || res?.status == 201) {
            listImg.push(res?.data.url);
          } else {
            Toast("error", res.data.message, 2000);
            setCreating(false);
            return;
          }
        } else {
          listImg.push(listImgTemp[i]);
        }
      }
      currentProduct.avatar = listImg;
      const newData = data.products;
      newData[index] = {
        ...newData[index],
        name: currentProduct.name,
        newPrice: currentProduct.newPrice,
        oldPrice: currentProduct.oldPrice,
        quantity: currentProduct.quantity,
        keywords: currentProduct.keywords,
        description: currentProduct.description,
        categoryId: currentProduct.categoryId,
        avatar: listImg,
      };
      setData({ ...data, products: newData });
      currentProduct.keywords = currentProduct.list_keyword.split(",");
      currentProduct.newPrice = +currentProduct.newPrice;
      currentProduct.oldPrice = +currentProduct.oldPrice;
      currentProduct.quantity = +currentProduct.quantity;
      // Call api APIUpdateProduct to update product

      const res = await APIUpdateProduct(currentProduct._id, currentProduct);
      setCreating(false);
      handleOpenEdit();
      if (res?.status == 200 || res?.status == 201) {
        Toast("success", "Cập nhật sản phẩm thành công", 2000);
      } else {
        Toast("error", "Cập nhật sản phẩm thất bại", 2000);
      }
    } else {
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

    // Set currentProduct to data
  };
  const ConfirmDeleteProduct = async () => {
    // Call api APIDeleteProduct to delete product
    setCreating(true);

    const res = await APIDeleteProduct(currentProduct._id);
    setCreating(false);
    handleOpenDel();
    if (res?.status == 200 || res?.status == 201) {
      Toast("success", "Xoá sản phẩm thành công", 2000);
      const newData = data.products.filter(
        (item) => item._id != currentProduct._id
      );
      setData({ ...data, products: newData });
    } else {
      Toast("error", "Xoá sản phẩm thất bại", 2000);
    }
  };
  const handleDescriptionChange = (value: string) => {
    setCurrentProduct({ ...currentProduct, description: value });
  };
  const [openDel, setOpenDel] = React.useState(false);
  const handleOpenDel = () => setOpenDel(!openDel);
  const [openEdit, setOpenEdit] = React.useState(false);
  const handleOpenEdit = () => setOpenEdit(!openEdit);
  return (
    <>
      <SortTable
        title={arrTitle}
        totalPage={data?.total}
        sort={(data) => SortbyField(data)}
        currentPage={page}
        setPage={(data) => setPage(data)}
      >
        {data?.products?.map((item, index) => (
          <tr
            className="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
            key={index}
          >
            <td
              scope="row"
              className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white text-center"
            >
              {index + 1 + (page - 1) * 2}
            </td>
            <td
              scope="row"
              className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white text-center"
            >
              {item.name}
            </td>
            <td className="px-6 py-4 text-center">{item.categoryName}</td>
            <td className="px-6 py-4 text-center">
              {FormatMoney(item.oldPrice)}
            </td>
            <td className="px-6 py-4 text-center">
              {FormatMoney(item.newPrice)}
            </td>
            <td className="px-6 py-4 text-center">{item.quantity}</td>
            <td className="px-6 py-4 text-center">
              {item.quantitySold || item.quantityGive}
            </td>
            <td className="px-6 py-4 text-center">
              {FormatMoney(item.revenue)}
            </td>

            <td className="px-6 py-4 text-center">
              {!item.isPurchased ? (
                <>
                  <div
                    className="font-medium text-red-600 dark:text-red-500 hover:underline cursor-pointer mb-2"
                    onClick={(e) => {
                      handleOpenDel();
                      setCurrentProduct({ ...currentProduct, _id: item._id });
                    }}
                  >
                    Xoá
                  </div>
                  <div
                    className="font-medium text-blue-600 dark:text-blue-500 hover:underline cursor-pointer"
                    onClick={() => {
                      setCurrentProduct({
                        _id: item._id,
                        name: item.name,
                        newPrice: item.newPrice,
                        oldPrice: item.oldPrice,
                        description: item.description,
                        categoryId: item.categoryId,
                        quantity: item.quantity,
                        list_keyword: item.keywords.join(", "),
                        keywords: item.keywords,
                        avatar: item.avatar,
                      });
                      setListImgTemp(item.avatar);
                      handleOpenEdit();
                    }}
                  >
                    Chỉnh sửa
                  </div>
                </>
              ) : (
                <div className="font-medium text-blue-600 dark:text-blue-500">
                  Đã có người dùng tương tác
                </div>
              )}
            </td>
          </tr>
        ))}
      </SortTable>
      <Dialog open={openEdit} handler={handleOpenEdit} size={"lg"}>
        <DialogHeader>Cập nhật thông tin sản phẩm</DialogHeader>
        <DialogBody className="h-[28rem] overflow-y-scroll">
          <div className="flex justify-between items-center mb-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <UploadFile
                index={index}
                key={index}
                dataOrigin={currentProduct.avatar[index] || ""}
                setProduct={(data: any) => {
                  if (listImgTemp[index]) {
                    setListImgTemp((prev) => {
                      prev[index] = data;
                      return [...prev];
                    });
                  } else {
                    setListImgTemp((prev) => {
                      prev.push(data);
                      return [...prev];
                    });
                  }
                }}
              />
            ))}
          </div>

          {UPDATEPRODUCT.map((item: any, index: number) => (
            <div key={index} className="mb-4">
              <Input
                label={item.label}
                id={`formUpdate-${item.name}`}
                type={item.identify == "number" ? "number" : "text"}
                name={item.name}
                value={currentProduct[item.name as keyof typeof currentProduct]}
                onChange={(e) => {
                  setCurrentProduct({
                    ...currentProduct,
                    [item.name]: e.target.value,
                  });
                }}
                crossOrigin={undefined}
              />
            </div>
          ))}

          <div className="mb-4">
            <Select
              label="Chọn danh mục"
              onChange={(val) =>
                setCurrentProduct({
                  ...currentProduct,
                  categoryId: val!,
                })
              }
              value={currentProduct.categoryId}
            >
              {category &&
                category.map((item: any, index: number) => {
                  return (
                    <Option value={item._id} key={index}>
                      {item.name}
                    </Option>
                  );
                })}
            </Select>
          </div>
          <div className="mb-4">
            <div className="font-bold text-lg">Mô tả sản phẩm của bạn </div>
            <ReactQuill
              theme="snow"
              value={currentProduct.description}
              onChange={handleDescriptionChange}
            />
          </div>
        </DialogBody>
        <DialogFooter>
          {alert.open && (
            <Alert className="mb-4" color="red">
              {alert.message}
            </Alert>
          )}
          <Button
            variant="text"
            color="red"
            onClick={handleOpenEdit}
            className="mr-1"
          >
            <span>Đóng</span>
          </Button>
          <Button
            variant="gradient"
            color="green"
            loading={creating || lengthIndex != 0}
            onClick={() => {
              ConfirmUpdateProduct();
            }}
          >
            <span>Xác nhận</span>
          </Button>
        </DialogFooter>
      </Dialog>
      <Dialog open={openDel} handler={handleOpenDel}>
        <DialogHeader>Xoá sản phẩm</DialogHeader>
        <DialogBody>Bạn có chắc chắn muốn xoá sản phẩm này?</DialogBody>
        <DialogFooter>
          <Button
            variant="text"
            color="red"
            onClick={handleOpenDel}
            className="mr-1"
          >
            <span>Đóng</span>
          </Button>
          <Button
            variant="gradient"
            color="green"
            loading={creating}
            onClick={() => {
              ConfirmDeleteProduct();
            }}
          >
            <span>Xác nhận</span>
          </Button>
        </DialogFooter>
      </Dialog>
    </>
  );
}

export default Warehouse;
