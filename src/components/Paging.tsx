import React from "react";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa";
interface SortTableProps {
  totalPage: number | undefined;
  currentPage: number;
  perPage?: number;
  setPage: (arg: number) => void;
}
function Paging(props: SortTableProps) {
  const { totalPage = 1, currentPage, setPage, perPage = 1 } = props;
  return (
    <nav aria-label="Page navigation example" className="mt-3">
      <ul className="flex items-center -space-x-px h-10 text-base justify-end">
        <li
          onClick={(e) => {
            if (currentPage == 1) {
              e.preventDefault();
            } else {
              setPage(currentPage - 1);
            }
          }}
        >
          <div
            className={`cursor-pointer flex items-center justify-center px-4 h-10 ms-0 leading-tight text-gray-500 bg-white border border-e-0 border-gray-300 rounded-s-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white`}
          >
            <FaAngleLeft />
          </div>
        </li>
        {totalPage > 0 &&
          Array.from(
            { length: Math.ceil(totalPage / perPage) },
            (_, index) => index
          ).map((item, index) => (
            <li
              key={index}
              className="cursor-pointer"
              onClick={(e) => setPage(index + 1)}
            >
              <div
                className={`flex items-center justify-center px-4 h-10 leading-tight ${
                  index + 1 == currentPage
                    ? "text-blue-600 border-blue-300 bg-blue-50 hover:bg-blue-100 hover:text-blue-700"
                    : "text-gray-500 bg-white  border-gray-300 hover:bg-gray-100"
                } hover:text-gray-700 dark:bg-gray-800 border dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white`}
              >
                {index + 1}
              </div>
            </li>
          ))}
        <li
          onClick={(e) => {
            if (currentPage == totalPage) {
              e.preventDefault();
            } else {
              setPage(currentPage + 1);
              setPage;
            }
          }}
        >
          <div className="cursor-pointer flex items-center justify-center px-4 h-10 leading-tight text-gray-500 bg-white border border-gray-300 rounded-e-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">
            <FaAngleRight />
          </div>
        </li>
      </ul>
    </nav>
  );
}

export default Paging;
