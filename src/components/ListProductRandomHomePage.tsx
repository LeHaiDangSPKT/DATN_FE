import React from "react";
import CardProduct from "./CardProduct";
import { APIGetListProductRandom } from "@/services/Product";
interface Props {
  showButton?: boolean;
}

function ListProductRandomHomePage(props: Props) {
  const { showButton } = props;
  const [lstProduct, setLstProduct] = React.useState<any[]>([]);
  const [limit, setLimit] = React.useState<number>(30);
  React.useEffect(() => {
    const fetchData = async () => {
      await APIGetListProductRandom(limit).then((res: any) => {
        setLstProduct(res);
      });
    };
    fetchData();
  }, [limit]);
  return (
    <div className="flex flex-col bg-white p-4 rounded-xl mb-2">
      <div className="flex justify-between font-bold">
        <div>Các sản phẩm khác</div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-y-4 mt-5">
        {lstProduct.map((item: any, index: any) => {
          return <CardProduct className="col-span-1" key={index} data={item} />;
        })}
      </div>
      {showButton != false && (
        <div className="mx-auto">
          <button
            type="button"
            className=" mt-3 flex w-fit justify-center text-white items-center bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300  rounded-lg py-2 px-5  dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
            onClick={() => setLimit(limit + 10)}
          >
            <span>Hiển thị thêm</span>
          </button>
        </div>
      )}
    </div>
  );
}

export default ListProductRandomHomePage;
