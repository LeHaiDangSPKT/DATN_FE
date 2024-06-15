import Toast from "@/utils/Toast";
import { RangeCalendar, Slider } from "@nextui-org/react";
import React from "react";
import { today, getLocalTimeZone } from "@internationalized/date";
import { Button } from "@material-tailwind/react";
interface FilterProps {
  setQuery: (arg: any) => void;
}

function Filter(props: FilterProps) {
  const { setQuery } = props;
  const [quantity, setQuantity] = React.useState<any>({
    quantityMin: "",
    quantityMax: "",
  });
  const [date, setDate] = React.useState({
    start: today(getLocalTimeZone()).add({ days: -7 }),
    end: today(getLocalTimeZone()),
  });
  const [price, setPrice] = React.useState<[number, number]>([0, 0]);
  const handleSliderChange = (newPrice: number | number[]) => {
    if (Array.isArray(newPrice)) {
      setPrice([newPrice[0], newPrice[1]] as [number, number]);
    }
  };
  return (
    <>
      <Slider
        label="Giá tiền"
        formatOptions={{
          style: "currency",
          currency: "VND",
        }}
        step={200000}
        maxValue={10000000}
        minValue={0}
        value={price}
        onChange={handleSliderChange}
      />
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
      <label className="block mb-2 mt-5 text-sm font-medium text-gray-900 dark:text-white">
        Ngày đăng bài:
      </label>
      <div className="text-center">
        <RangeCalendar
          aria-label="Date (Controlled)"
          value={date}
          onChange={setDate}
          className="w-fit-content"
          maxValue={today(getLocalTimeZone())}
        />
      </div>

      <div className="flex justify-center my-5">
        <Button
          color="blue"
          onClick={(e) => {
            if (price[0] == price[1]) {
              Toast("error", "Giá tiền không hợp lệ", 2000);
              return;
            }
            const convertDate = JSON.parse(JSON.stringify(date));
            setQuery({
              priceMin: price[0],
              priceMax: price[1],
              quantityMin: "0",
              quantityMax: quantity.quantityMax,
              createdAtMin: new Date(
                convertDate.start.year,
                convertDate.start.month - 1,
                convertDate.start.day
              ),
              createdAtMax: new Date(
                convertDate.end.year,
                convertDate.end.month - 1,
                convertDate.end.day
              ),
            });
          }}
        >
          Lọc
        </Button>
      </div>
    </>
  );
}

export default Filter;
