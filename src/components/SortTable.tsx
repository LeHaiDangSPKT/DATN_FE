import React from "react";
import { FaAngleLeft } from "react-icons/fa6";
import { FaAngleRight } from "react-icons/fa6";
import { Pagination } from "@nextui-org/react";
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
}

function SortTable(props: SortTableProps) {
  const {
    title,
    children,
    totalPage = 1,
    sort,
    currentPage,
    setPage,
    noPaging,
    perPage = 20,
  } = props;
  const totalPaging =
    (totalPage / 20) % 1 == 0 ? totalPage / 20 : Math.ceil(totalPage / 20);
  return (
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
          <tbody>
            {/* tr => th,td */}
            {children}
          </tbody>
        </table>
      </div>
      {!noPaging && totalPaging > 1 && (
        <div className="flex justify-center mt-4">
          <Pagination
            page={currentPage}
            onChange={setPage}
            total={totalPaging}
            size={"md"}
          />
        </div>
        // <nav aria-label="Page navigation example" className="mt-3">
        //   <ul className="flex items-center -space-x-px h-10 text-base justify-end">
        //     <li
        //       onClick={(e) => {
        //         if (currentPage == 1) {
        //           e.preventDefault();
        //         } else {
        //           setPage!(currentPage! - 1);
        //         }
        //       }}
        //     >
        //       <div
        //         className={`cursor-pointer flex items-center justify-center px-4 h-10 ms-0 leading-tight text-gray-500 bg-white border border-e-0 border-gray-300 rounded-s-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white`}
        //       >
        //         <FaAngleLeft />
        //       </div>
        //     </li>
        //     {totalPage > 0 &&
        //       Array.from(
        //         { length: Math.ceil(totalPage / (perPage! || 2)) },
        //         (_, index) => index
        //       ).map((item, index) => (
        //         <li
        //           key={index}
        //           className="cursor-pointer"
        //           onClick={(e) => setPage!(index + 1)}
        //         >
        //           <div
        //             className={`flex items-center justify-center px-4 h-10 leading-tight ${
        //               index + 1 == currentPage
        //                 ? "text-blue-600 border-blue-300 bg-blue-50 hover:bg-blue-100 hover:text-blue-700"
        //                 : "text-gray-500 bg-white  border-gray-300 hover:bg-gray-100"
        //             } hover:text-gray-700 dark:bg-gray-800 border dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white`}
        //           >
        //             {index + 1}
        //           </div>
        //         </li>
        //       ))}
        //     <li
        //       onClick={(e) => {
        //         if (currentPage == totalPage) {
        //           e.preventDefault();
        //         } else {
        //           setPage!(currentPage! + 1);
        //         }
        //       }}
        //     >
        //       <div className="cursor-pointer flex items-center justify-center px-4 h-10 leading-tight text-gray-500 bg-white border border-gray-300 rounded-e-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">
        //         <FaAngleRight />
        //       </div>
        //     </li>
        //   </ul>
        // </nav>
      )}
    </>
  );
}

export default SortTable;
