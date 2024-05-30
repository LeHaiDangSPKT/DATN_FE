import Toast from "@/utils/Toast";
import React from "react";
interface FilterProps {
  setQuery: (arg: any) => void;
}

function Filter(props: FilterProps) {
  const { setQuery } = props;
  const [price, setPrice] = React.useState<any>({
    priceMin: "",
    priceMax: "",
  });
  const [quantity, setQuantity] = React.useState<any>({
    quantityMin: "",
    quantityMax: "",
  });
  const [created, setCreated] = React.useState<any>({
    createdAtMin: "",
    createdAtMax: "",
  });
  return (
    <div className="relative">
      <label
        htmlFor="medium-range"
        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
      >
        Giá tiền:
      </label>
      <div className="flex flex-col items-center">
        {/* Tạo 2 ô để nhập giá tiền */}
        <input
          type="text"
          value={price.priceMin}
          onChange={(e) =>
            setPrice({
              ...price,
              priceMin: e.currentTarget.value.replace(/[^\d]/g, ""),
            })
          }
          onFocus={(e) => {
            e.currentTarget.value =
              e.currentTarget.value.replace("VND", "") == "0 "
                ? ""
                : e.currentTarget.value.replace("VND", "");
          }}
          onBlur={(e) => {
            if (e.currentTarget.value != "") {
              setPrice({
                ...price,
                priceMin:
                  Number(e.currentTarget.value).toLocaleString("en-US", {}) +
                  " VND",
              });
            } else {
              setPrice({
                ...price,
                priceMin: "",
              });
            }
          }}
          placeholder="0 VND"
          className="block w-full p-2 rounded-md bg-gray-100 border-transparent dark:bg-gray-800 focus:border-gray-500 focus:ring-0 outline-none"
        />
        <span className="m-2">đến</span>
        <input
          type="text"
          value={price.priceMax}
          onChange={(e) =>
            setPrice({
              ...price,
              priceMax: e.currentTarget.value.replace(/[^\d]/g, ""),
            })
          }
          onFocus={(e) => {
            e.currentTarget.value =
              e.currentTarget.value.replace("VND", "") == "0 "
                ? ""
                : e.currentTarget.value.replace("VND", "");
          }}
          onBlur={(e) => {
            if (e.currentTarget.value != "") {
              setPrice({
                ...price,
                priceMax:
                  Number(e.currentTarget.value).toLocaleString("en-US", {}) +
                  " VND",
              });
            } else {
              setPrice({
                ...price,
                priceMax: "",
              });
            }
          }}
          placeholder="1000000 VND"
          className="block w-full p-2 rounded-md bg-gray-100 border-transparent dark:bg-gray-800 focus:border-gray-500 focus:ring-0 outline-none"
        />
      </div>

      <label className="block mb-2 mt-5 text-sm font-medium text-gray-900 dark:text-white">
        Số lượng còn lại:
      </label>
      <input
        type="text"
        value={quantity.quantityMax}
        onChange={(e) =>
          setQuantity({
            ...quantity,
            quantityMax: e.currentTarget.value.replace(/[^\d]/g, ""),
          })
        }
        onFocus={(e) => {
          e.currentTarget.value =
            e.currentTarget.value == "0" ? "" : e.currentTarget.value;
        }}
        placeholder="10"
        className="block w-full p-2 rounded-md bg-gray-100 border-transparent dark:bg-gray-800 focus:border-gray-500 focus:ring-0 outline-none"
      />

      <label
        htmlFor="medium-range"
        className="block mb-2 mt-5 text-sm font-medium text-gray-900 dark:text-white"
      >
        Thời gian:
      </label>
      <div className="flex flex-col items-center">
        <input
          type="date"
          value={created.createdAtMin}
          className="block w-full p-2 rounded-md bg-gray-100 border-transparent dark:bg-gray-800 focus:border-gray-500 focus:ring-0 outline-none"
          onChange={(e) => {
            if (e.currentTarget.value > created.createdAtMax) {
              Toast("error", "Ngày bắt đầu phải nhỏ hơn ngày kết thúc", 2000);
              setCreated({
                ...created,
                createdAtMin: "",
              });
            } else {
              setCreated({
                ...created,
                createdAtMin: e.currentTarget.value,
              });
            }
          }}
        />
        <span className="m-2">đến</span>
        <input
          type="date"
          value={created.createdAtMax}
          className="block w-full p-2 rounded-md bg-gray-100 border-transparent dark:bg-gray-800 focus:border-gray-500 focus:ring-0 outline-none"
          onChange={(e) => {
            if (e.currentTarget.value < created.createdAtMin) {
              Toast("error", "Ngày kết thúc phải lớn hơn ngày bắt đầu", 2000);
              setCreated({
                ...created,
                createdAtMax: "",
              });
            } else {
              setCreated({
                ...created,
                createdAtMax: e.currentTarget.value,
              });
            }
          }}
        />
      </div>

      <div className="flex justify-center mt-5">
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          onClick={(e) => {
            const priceMin = parseFloat(
              price.priceMin.replace(" VND", "").replace(/,/g, "")
            );
            const priceMax = parseFloat(
              price.priceMax.replace(" VND", "").replace(/,/g, "")
            );
            console.log(priceMin, priceMax);
            if (priceMin || priceMax) {
              if (!priceMin || !priceMax) {
                Toast("error", "Chưa nhập đủ giá tiền", 2000);
                return;
              }
              if (priceMin > priceMax) {
                Toast("error", "Giá tiền không hợp lệ", 2000);
                return;
              }
            }
            setQuery({
              priceMin: price.priceMin.replace(" VND", "").replace(/,/g, ""),
              priceMax: price.priceMax.replace(" VND", "").replace(/,/g, ""),
              quantityMin: "0",
              quantityMax: quantity.quantityMax,
              createdAtMin: created.createdAtMin,
              createdAtMax: created.createdAtMax,
            });
          }}
        >
          Lọc
        </button>
      </div>
    </div>
  );
}

export default Filter;
