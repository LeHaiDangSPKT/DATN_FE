import ConvertDate from "@/utils/ConvertDate";
import FormatMoney from "@/utils/FormatMoney";
import GetNumberInString from "@/utils/GetNumberInString";
import React from "react";
interface Props {
  bill: any;
  setChanged: (arg: boolean) => void;
}

function Review(props: Props) {
  const { bill, setChanged } = props;
  console.log("bill", bill);
  return (
    <div className="overscroll-contain hidden-scrollbar justify-center items-center flex overflow-x-hidden overflow-y-auto absolute inset-0 z-50 outline-none focus:outline-none bg-gray-500 bg-opacity-50">
      <div className="relative w-auto my-6 mx-auto max-w-3xl min-w-[40rem] mt-20">
        <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
          <div className="relative flex flex-col bg-white shadow-lg rounded-xl pointer-events-auto dark:bg-gray-800">
            <div className="relative min-h-[8rem] bg-gray-900 text-center rounded-t-lg">
              <div className="absolute top-2 end-2">
                <button
                  type="button"
                  className=" flex-shrink-0 justify-center items-center h-8 w-8 rounded-lg text-gray-500 hover:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 focus:ring-offset-gray-900 transition-all text-sm dark:focus:ring-gray-700 dark:focus:ring-offset-gray-800"
                  onClick={() => setChanged(false)}
                >
                  <span className="sr-only">Close</span>
                  <svg
                    className="flex-shrink-0 w-4 h-4"
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M18 6 6 18" />
                    <path d="m6 6 12 12" />
                  </svg>
                </button>
              </div>
              <figure className="absolute inset-x-0 bottom-0 -mb-px">
                <svg
                  preserveAspectRatio="none"
                  xmlns="http://www.w3.org/2000/svg"
                  x="0px"
                  y="0px"
                  viewBox="0 0 1920 100.1"
                >
                  <path
                    fill="currentColor"
                    className="fill-white dark:fill-gray-800"
                    d="M0,0c0,0,934.4,93.4,1920,0v100.1H0L0,0z"
                  ></path>
                </svg>
              </figure>
            </div>

            <div className="relative z-10 -mt-12">
              <span className="mx-auto flex justify-center items-center w-[62px] h-[62px] rounded-full border border-gray-200 bg-white text-gray-700 shadow-sm dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400">
                <svg
                  className="flex-shrink-0 w-6 h-6"
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="currentColor"
                  viewBox="0 0 16 16"
                >
                  <path d="M1.92.506a.5.5 0 0 1 .434.14L3 1.293l.646-.647a.5.5 0 0 1 .708 0L5 1.293l.646-.647a.5.5 0 0 1 .708 0L7 1.293l.646-.647a.5.5 0 0 1 .708 0L9 1.293l.646-.647a.5.5 0 0 1 .708 0l.646.647.646-.647a.5.5 0 0 1 .708 0l.646.647.646-.647a.5.5 0 0 1 .801.13l.5 1A.5.5 0 0 1 15 2v12a.5.5 0 0 1-.053.224l-.5 1a.5.5 0 0 1-.8.13L13 14.707l-.646.647a.5.5 0 0 1-.708 0L11 14.707l-.646.647a.5.5 0 0 1-.708 0L9 14.707l-.646.647a.5.5 0 0 1-.708 0L7 14.707l-.646.647a.5.5 0 0 1-.708 0L5 14.707l-.646.647a.5.5 0 0 1-.708 0L3 14.707l-.646.647a.5.5 0 0 1-.801-.13l-.5-1A.5.5 0 0 1 1 14V2a.5.5 0 0 1 .053-.224l.5-1a.5.5 0 0 1 .367-.27zm.217 1.338L2 2.118v11.764l.137.274.51-.51a.5.5 0 0 1 .707 0l.646.647.646-.646a.5.5 0 0 1 .708 0l.646.646.646-.646a.5.5 0 0 1 .708 0l.646.646.646-.646a.5.5 0 0 1 .708 0l.646.646.646-.646a.5.5 0 0 1 .708 0l.646.646.646-.646a.5.5 0 0 1 .708 0l.509.509.137-.274V2.118l-.137-.274-.51.51a.5.5 0 0 1-.707 0L12 1.707l-.646.647a.5.5 0 0 1-.708 0L10 1.707l-.646.647a.5.5 0 0 1-.708 0L8 1.707l-.646.647a.5.5 0 0 1-.708 0L6 1.707l-.646.647a.5.5 0 0 1-.708 0L4 1.707l-.646.647a.5.5 0 0 1-.708 0l-.509-.51z" />
                  <path d="M3 4.5a.5.5 0 0 1 .5-.5h6a.5.5 0 1 1 0 1h-6a.5.5 0 0 1-.5-.5zm0 2a.5.5 0 0 1 .5-.5h6a.5.5 0 1 1 0 1h-6a.5.5 0 0 1-.5-.5zm0 2a.5.5 0 0 1 .5-.5h6a.5.5 0 1 1 0 1h-6a.5.5 0 0 1-.5-.5zm0 2a.5.5 0 0 1 .5-.5h6a.5.5 0 0 1 0 1h-6a.5.5 0 0 1-.5-.5zm8-6a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 0 1h-1a.5.5 0 0 1-.5-.5zm0 2a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 0 1h-1a.5.5 0 0 1-.5-.5zm0 2a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 0 1h-1a.5.5 0 0 1-.5-.5zm0 2a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 0 1h-1a.5.5 0 0 1-.5-.5z" />
                </svg>
              </span>
            </div>

            <div className="p-4 sm:p-7 overflow-y-auto">
              <div className="text-center">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                  Thông tin đơn hàng
                </h3>
                <p className="text-sm text-gray-500">
                  Hoá đơn #{GetNumberInString(bill.id)}
                </p>
              </div>
              {bill.data.map((data: any, index: number) => (
                <div className="flex justify-center my-2" key={index}>
                  {data.products.map((item: any, indexImg: number) => (
                    <img
                      key={indexImg}
                      src={item.avatar[0]}
                      alt=""
                      className="w-20 h-20 object-cover rounded-md mx-4"
                    />
                  ))}
                </div>
              ))}

              <div className="mt-5 sm:mt-10 grid grid-cols-2 sm:grid-cols-3 gap-5">
                <div>
                  <span className="block text-xs uppercase text-gray-500">
                    Phương thức thanh toán:
                  </span>
                  <span className="block text-sm font-medium text-gray-800 dark:text-gray-200">
                    {bill.paymentMethod == "CashOnDelivery"
                      ? "Thanh toán tiền mặt khi nhận hàng"
                      : bill.paymentMethod}
                  </span>
                </div>

                <div>
                  <span className="block text-xs uppercase text-gray-500">
                    Ngày đặt hàng:
                  </span>
                  <span className="block text-sm font-medium text-gray-800 dark:text-gray-200">
                    {ConvertDate(bill.createdAt)}
                  </span>
                </div>
                <div>
                  <span className="block text-xs uppercase text-gray-500">
                    Ngày dự kiến nhận hàng:
                  </span>
                  <span className="block text-sm font-medium text-gray-800 dark:text-gray-200">
                    {bill.recievedDate}
                  </span>
                </div>

                <div>
                  <span className="block text-xs uppercase text-gray-500">
                    Tên người nhận hàng:
                  </span>
                  <span className="block text-sm font-medium text-gray-800 dark:text-gray-200">
                    {bill.receiverInfo?.fullName}
                  </span>
                </div>
                <div>
                  <span className="block text-xs uppercase text-gray-500">
                    Số điện thoại:
                  </span>
                  <span className="block text-sm font-medium text-gray-800 dark:text-gray-200">
                    {bill.receiverInfo?.phoneNumber}
                  </span>
                </div>
                <div>
                  <span className="block text-xs uppercase text-gray-500">
                    Địa chỉ:
                  </span>
                  <span className="block text-sm font-medium text-gray-800 dark:text-gray-200">
                    {bill.receiverInfo?.address}
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-5 sm:mt-10 px-4">
              <h4 className="text-xs font-semibold uppercase text-gray-800 dark:text-gray-200">
                Hoá đơn
              </h4>

              <ul className="mt-3 flex flex-col">
                {bill.listProductsFullInfo?.map((item: any, index: number) => (
                  <li
                    key={index}
                    className=" py-3 px-4 text-sm border text-gray-800  first:rounded-t-lg first:mt-0 last:rounded-b-lg dark:border-gray-700 dark:text-gray-200"
                  >
                    <div className="flex items-center justify-between w-full">
                      <span>
                        {item.product.productName} x{" "}
                        <span className="font-bold">
                          {item.subInfo.quantity}
                        </span>
                      </span>
                      <span>
                        {FormatMoney(
                          item.product.price * item.subInfo.quantity
                        )}
                      </span>
                    </div>
                  </li>
                ))}
                <li className="inline-flex items-center gap-x-2 py-3 px-4 text-sm font-semibold bg-gray-50 border text-gray-800 -mt-px first:rounded-t-lg first:mt-0 last:rounded-b-lg dark:bg-slate-800 dark:border-gray-700 dark:text-gray-200">
                  <div className="flex items-center justify-between w-full">
                    <span>Phí giao hàng</span>
                    <span>{FormatMoney(bill.deliveryFee)}</span>
                  </div>
                </li>
                <li className="inline-flex items-center gap-x-2 py-3 px-4 text-sm font-semibold bg-gray-50 border text-gray-800 -mt-px first:rounded-t-lg first:mt-0 last:rounded-b-lg dark:bg-slate-800 dark:border-gray-700 dark:text-gray-200">
                  <div className="flex items-center justify-between w-full">
                    <span>Tổng cộng</span>
                    <span>{FormatMoney(bill.price + bill.deliveryFee)}</span>
                  </div>
                </li>
              </ul>
            </div>

            <div className="mt-5 sm:mt-10 p-4">
              <p className="text-sm text-gray-500">
                If you have any questions, please contact us at{" "}
                <a
                  className=" items-center gap-x-1.5 text-blue-600 decoration-2 hover:underline font-medium"
                  href="mailto: dtex.helpdesk@gmail.com"
                >
                  dtex.helpdesk@gmail.com
                </a>{" "}
                or call at{" "}
                <a
                  className=" items-center gap-x-1.5 text-blue-600 decoration-2 hover:underline font-medium"
                  href="tel:+84868366694"
                >
                  0868366694
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Review;
