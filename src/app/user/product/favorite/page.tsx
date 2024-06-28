"use client";
import SortTable from "@/components/SortTable";
import { APIGetListProductFavorite } from "@/services/User";
import FormatMoney from "@/utils/FormatMoney";
import { Button, Input } from "@material-tailwind/react";
import { useRouter } from "next/navigation";
import React from "react";
interface Product {
  _id: string;
  avatar: string[];
  quantity: number;
  name: string;
  newPrice: number;
  oldPrice: number;
  description: string;
  categoryId: string;
  keywords: string[];
  status: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
  storeId: string;
  categoryName: string;
  storeName: string;
  quantitySold: number;
  quantityGive: number;
  revenue: number;
}

interface ListProduct {
  total: number;
  data: Product[];
}
function ProductFavorite() {
  const router = useRouter();
  const [page, setPage] = React.useState<number>(1);
  const [search, setSearch] = React.useState<string>("");
  const [listProduct, setListProduct] = React.useState<ListProduct>(
    {} as ListProduct
  );
  const [click, setClick] = React.useState<boolean>(false);

  const arrTitleProduct = [
    {
      title: "STT",
      sort: false,
      name: "index",
    },
    {
      title: "Sản phẩm",
      sort: false,
      name: "name",
    },
    {
      title: "Số lượng còn lại",
      sort: false,
      name: "quantity",
    },
    {
      title: "Giá",
      sort: false,
      name: "price",
    },
    {
      title: "Danh mục",
      sort: false,
      name: "category",
    },
    {
      title: "Cửa hàng",
      sort: false,
      name: "store",
    },
  ];
  const onChange = ({ target }: any) => setSearch(target.value);
  React.useEffect(() => {
    document.getElementById("loading-page")?.classList.add("hidden");
    const getListProduct = async () => {
      const res = await APIGetListProductFavorite(page, 20, search);
      setListProduct(res?.metadata);
    };
    getListProduct();
  }, [page, click]);
  return (
    <div className="min-h-screen my-5 px-3">
      <div className="text-xl sm:text-2xl font-bold text-center mb-5">
        Danh sách sản phẩm đã yêu thích
      </div>
      <div className="relative flex w-full mb-4">
        <Input
          type="text"
          label="Tìm kiếm..."
          value={search}
          onChange={onChange}
          className="pr-20"
          containerProps={{
            className: "min-w-0",
          }}
          crossOrigin={undefined}
        />
        <Button
          size="sm"
          color={search ? "gray" : "blue-gray"}
          disabled={!search}
          className="!absolute right-1 top-1 rounded"
          onClick={() => {
            if (page == 1) {
              setClick(!click);
            } else {
              setPage(1);
            }
          }}
        >
          Tìm kiếm
        </Button>
      </div>
      <SortTable
        title={arrTitleProduct}
        totalPage={listProduct.total}
        currentPage={page}
        setPage={(data) => setPage(data)}
        perPage={20}
      >
        {listProduct.data?.map((item, index) => (
          <tr
            className="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
            key={index}
          >
            <td className="px-6 py-4 text-center">
              {(page - 1) * 10 + index + 1}
            </td>
            <td
              className="px-6 py-4 text-center cursor-pointer"
              onClick={(e) => {
                document
                  .getElementById("loading-page")
                  ?.classList.remove("hidden");
                router.push(`/product/${item._id}`);
              }}
            >
              {item.name}
            </td>
            <td className="px-6 py-4 text-center">{item.quantity}</td>
            <td className="px-6 py-4 text-center">
              {FormatMoney(item.newPrice)}
            </td>
            <td className="px-6 py-4 text-center">{item.categoryName}</td>
            <td className="px-6 py-4 text-center">{item.storeName}</td>
          </tr>
        ))}
      </SortTable>
    </div>
  );
}

export default ProductFavorite;
