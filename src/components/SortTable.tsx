import React from "react";
import Image from "next/image";
import { FaAngleLeft } from "react-icons/fa6";
import { FaAngleRight } from "react-icons/fa6";
import { Pagination } from "@nextui-org/react";
import EmptyData from "@/assets/icons/nodata.svg";

interface SortTableProps {
  title: {
    name: string;
    sort: boolean;
    title: string;
  }[];
  children: React.ReactNode;
  totalPage?: number | undefined;
  currentPage?: number;
  sort?: (arg: string) => void;
  setPage?: (arg: number) => void;
  noPaging?: boolean;
  perPage?: number;
  noData?: boolean;
}

function SortTable(props: SortTableProps) {
  const {
    title,
    children,
    totalPage = 1,
    sort,
    setPage,
    noPaging,
    noData,
  } = props;
  const totalPaging =
    (totalPage / 20) % 1 == 0 ? totalPage / 20 : Math.ceil(totalPage / 20);
  return (
    <>
      {totalPage > 0 || noData ? (
        <>
          <div className="relative overflow-x-auto overflow-y-hidden shadow-md sm:rounded-lg">
            <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                <tr>
                  {title?.map((item, index) =>
                    item.sort ? (
                      <th
                        scope="col"
                        className="px-6 py-3 text-center min-w-[150px]"
                        key={index}
                      >
                        <div className="flex items-center justify-center">
                          {item.title}
                          <div
                            className="cursor-pointer"
                            onClick={(e) => sort!(item.name)}
                          >
                            <svg
                              className="w-3 h-3 ms-1.5"
                              aria-hidden="true"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path d="M8.574 11.024h6.852a2.075 2.075 0 0 0 1.847-1.086 1.9 1.9 0 0 0-.11-1.986L13.736 2.9a2.122 2.122 0 0 0-3.472 0L6.837 7.952a1.9 1.9 0 0 0-.11 1.986 2.074 2.074 0 0 0 1.847 1.086Zm6.852 1.952H8.574a2.072 2.072 0 0 0-1.847 1.087 1.9 1.9 0 0 0 .11 1.985l3.426 5.05a2.123 2.123 0 0 0 3.472 0l3.427-5.05a1.9 1.9 0 0 0 .11-1.985 2.074 2.074 0 0 0-1.846-1.087Z" />
                            </svg>
                          </div>
                        </div>
                      </th>
                    ) : (
                      <th
                        scope="col"
                        className="px-6 py-3 text-center min-w-[150px]"
                        key={index}
                      >
                        {item.title}
                      </th>
                    )
                  )}
                </tr>
              </thead>
              <tbody>{children}</tbody>
            </table>
          </div>
          {!noPaging && totalPaging > 1 && (
            <div className="flex justify-center mt-4">
              <Pagination
                onChange={setPage}
                total={totalPaging}
                size={"md"}
                initialPage={1}
              />
            </div>
          )}
        </>
      ) : (
        <div
          className={`flex items-center justify-center ${noData && "hidden"}`}
        >
          <Image priority src={EmptyData} alt="" />
        </div>
      )}
    </>
  );
}

export default SortTable;
