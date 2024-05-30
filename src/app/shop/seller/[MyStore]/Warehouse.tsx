import Input from "@/components/Input";
import Modal from "@/components/Modal";
import SortTable from "@/components/SortTable";
import { UPDATEPRODUCT } from "@/constants/UpdateProduct";
import {
  APIDeleteProduct,
  APIGetListProduct,
  APIUpdateProduct,
} from "@/services/Product";
import CheckValidInput from "@/utils/CheckValidInput";
import FormatMoney from "@/utils/FormatMoney";
import RemoveVietnameseTones from "@/utils/RemoveVietnameseTones";
import Toast from "@/utils/Toast";
import React from "react";
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
  const arrTitle = [
    {
      title: "STT",
      sort: false,
      name: "index",
    },
    {
      title: "Tên sản phẩm",
      sort: true,
      name: "name",
    },
    {
      title: "Loại sản phẩm",
      sort: false,
      name: "category",
    },
    {
      title: "Giá trước giảm",
      sort: true,
      name: "oldPrice",
    },
    {
      title: "Giá sau khi giảm (bán)",
      sort: true,
      name: "newPrice",
    },
    {
      title: "Số lượng còn lại",
      sort: true,
      name: "quantity",
    },
    {
      title: "Số lượng đã bán/tặng",
      sort: true,
      name: "quantitySold",
    },
    {
      title: "Doanh số",
      sort: true,
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
  const [isShow, setIsShow] = React.useState<boolean>(false);
  const [isShowDelete, setIsShowDelete] = React.useState<boolean>(false);
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
  });
  const [deleted, setDeleted] = React.useState<boolean>(false);
  const [data, setData] = React.useState<WarehouseProps>({} as WarehouseProps);
  React.useEffect(() => {
    const fetchData = async () => {
      const data = await APIGetListProduct(
        page || 1,
        20,
        "",
        sortType,
        sortValue
      ).then((res) => res);
      console.log(data);
      setData(data.metadata);
    };
    fetchData();
  }, [page, deleted, sortType, sortValue]);
  const category = localStorage.getItem("category")
    ? JSON.parse(localStorage.getItem("category")!)
    : null;
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
    if (+currentProduct.newPrice > +currentProduct.oldPrice) {
      Toast("error", "Giá mới không được lớn hơn giá cũ", 2000);
      return;
    }

    if (
      document.querySelectorAll(".border-red-500").length != 0 ||
      currentProduct.description.replace(/<(.|\n)*?>/g, "").trim().length == 0
    ) {
      Toast("error", "Vui lòng nhập đầy đủ thông tin", 2000);
      return;
    }
    const index = data.products.findIndex(
      (item) => item._id == currentProduct._id
    );
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
    };
    setData({ ...data, products: newData });

    currentProduct.keywords = currentProduct.list_keyword.split(",");
    currentProduct.newPrice = +currentProduct.newPrice;
    currentProduct.oldPrice = +currentProduct.oldPrice;
    currentProduct.quantity = +currentProduct.quantity;
    // Call api APIUpdateProduct to update product

    await APIUpdateProduct(currentProduct._id, currentProduct).then((res) => {
      if (res?.status == 200 || res?.status == 201) {
        Toast("success", "Cập nhật sản phẩm thành công", 2000);
        setIsShow(false);
      } else {
        Toast("error", "Cập nhật sản phẩm thất bại", 2000);
      }
    });

    // Set currentProduct to data
  };
  const ConfirmDeleteProduct = async () => {
    // Call api APIDeleteProduct to delete product
    await APIDeleteProduct(currentProduct._id).then((res) => {
      console.log(res);
      if (res?.status == 200 || res?.status == 201) {
        Toast("success", "Xoá sản phẩm thành công", 2000);
        setIsShowDelete(false);
        setDeleted(!deleted);
      } else {
        Toast("error", "Xoá sản phẩm thất bại", 2000);
      }
    });
  };
  const handleDescriptionChange = (value: string) => {
    setCurrentProduct({ ...currentProduct, description: value });
  };
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
                      setIsShowDelete(true);
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
                      });
                      setIsShow(true);
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
      <Modal
        isShow={isShow}
        setIsShow={(data: any) => setIsShow(data)}
        confirm={() => ConfirmUpdateProduct()}
        title="Cập nhật thông tin sản phẩm"
      >
        <div className="w-full">
          {UPDATEPRODUCT.map((item: any, index: number) => (
            <Input label={item.label} required={true} key={index}>
              <input
                key={index}
                id={`formUpdate-${item.name}`}
                type="text"
                className="w-full outline-none border-solid border-2 border-gray-300 rounded-md p-2"
                placeholder={item.placeholder}
                name={item.name}
                value={currentProduct[item.name as keyof typeof currentProduct]}
                onChange={(e) => {
                  setCurrentProduct({
                    ...currentProduct,
                    [item.name]: e.target.value,
                  });
                }}
                onBlur={(e) => {
                  const result = CheckValidInput({
                    [`${item.identify}`]: e.target.value,
                  });
                  if (result !== "") {
                    document
                      .getElementById(`formUpdate-${item.name}`)
                      ?.classList.add("border-red-500");
                  } else {
                    document
                      .getElementById(`formUpdate-${item.name}`)
                      ?.classList.remove("border-red-500");
                  }
                  document.getElementById(`errMes-${item.name}`)!.innerHTML =
                    result;
                }}
              />
              <span
                id={`errMes-${item.name}`}
                className="text-red-500 text-sm"
              ></span>
            </Input>
          ))}
          <Input label={"Danh mục"} required={true}>
            <select
              name=""
              id=""
              className={`w-full outline-none border-solid border-2 border-gray-300 rounded-md p-2`}
              onChange={(e) =>
                setCurrentProduct({
                  ...currentProduct,
                  categoryId: e.target.value,
                })
              }
              value={currentProduct.categoryId}
            >
              {category &&
                category.map((item: any, index: number) => (
                  <option value={item._id} key={index}>
                    {item.name}
                  </option>
                ))}
            </select>
          </Input>
          <div className="mt-4">
            <div className="font-bold text-lg">Mô tả sản phẩm của bạn </div>
            <ReactQuill
              theme="snow"
              value={currentProduct.description}
              onChange={handleDescriptionChange}
            />
          </div>
        </div>
      </Modal>
      <Modal
        isShow={isShowDelete}
        setIsShow={(data: any) => setIsShowDelete(data)}
        confirm={() => ConfirmDeleteProduct()}
        title="Xoá sản phẩm"
      >
        <div className="w-full">
          <div className="font-bold text-lg">
            Bạn có chắc chắn muốn xoá sản phẩm này?
          </div>
        </div>
      </Modal>
    </>
  );
}

export default Warehouse;
