import Paging from "@/components/Paging";
import Star from "@/components/Star";
import {
  APICreateFeedback,
  APIGetFeedbackUser,
  APIUpdateFeedback,
} from "@/services/Feedback";
import { UserInterface } from "@/types/User";
import ConvertDate from "@/utils/ConvertDate";
import Toast from "@/utils/Toast";
import { useParams } from "next/navigation";
import React from "react";
import { FaRegPaperPlane } from "react-icons/fa";
import Image from "next/image";
import { Textarea } from "@material-tailwind/react";
interface Props {
  isPurchase: boolean;
  setTotalFeedback: (arg: number) => void;
  setShowLogin: (arg: boolean) => void;
}

function Feedback(props: Props) {
  const { isPurchase, setTotalFeedback, setShowLogin } = props;
  const [page, setPage] = React.useState(1);
  const [total, setTotal] = React.useState(0);
  const [feedbacks, setFeedbacks] = React.useState([]);
  const params = useParams();
  const [user, setUser] = React.useState<UserInterface>();
  const [feedback, setFeedback] = React.useState<any>({
    star: 5,
    content: "",
  });
  React.useEffect(() => {
    const user = localStorage.getItem("user")
      ? JSON.parse(localStorage.getItem("user") ?? "")?.providerData[0]
      : null;
    setUser(user);
    const fetchData = async () => {
      await APIGetFeedbackUser(page || 1, params.ProductDetail, user?._id).then(
        (res) => {
          setFeedbacks(res?.metadata.data);
          setTotal(res?.metadata.total);
          setTotalFeedback(res?.metadata.total);
        }
      );
    };
    fetchData();
  }, [page, params.ProductDetail, setTotalFeedback]);
  const SendFeedback = async () => {
    const res = await APICreateFeedback(params.ProductDetail + "", feedback);
    if (res?.status == 200 || res?.status == 201) {
      Toast("success", res.data.message, 3000);
      setFeedbacks([
        {
          ...res.data.metadata.data,
          name: user?.fullName,
          avatar: user?.avatar,
        } as never,
        ...feedbacks,
      ]);
      setTotalFeedback(total + 1);
      setFeedback({
        ...feedback,
        content: "",
      });
      HandleClick(5);
      const cmt = document.getElementById("cmt") as HTMLTextAreaElement;
      cmt.value = "";
    } else {
      Toast("error", res?.data.message, 3000);
    }
  };
  const HandleClick = (star: number) => {
    setFeedback({ ...feedback, star: star });
    const feedbackEle = document.getElementById("feedback");
    const starList = feedbackEle?.getElementsByTagName("svg");
    for (let i = 0; i < starList!.length; i++) {
      if (i < star) {
        starList![i].classList.add("text-yellow-300");
      } else {
        starList![i].classList.remove("text-yellow-300");
      }
    }
  };

  const Cosensus = async (fb: any, id: string) => {
    const res = await APIUpdateFeedback(params.ProductDetail + "", id);
    if (res?.status !== 200 && res.status !== 201) {
      Toast("warning", res.message, 3000);
    } else {
      var arr = feedbacks.map((item: any) => {
        if (item._id == fb._id) {
          if (item.consensus.includes(user?._id)) {
            item.consensus = item.consensus.filter(
              (item: any) => item != user?._id
            );
          } else {
            item.consensus.push(user?._id);
          }
        }
        return item;
      });
      setFeedbacks(arr as any);
    }
  };
  return (
    <>
      {feedbacks!.map((item: any, index: any) => (
        <div key={index}>
          <article>
            <div className="flex items-center mb-4">
              <Image
                src={item.avatar}
                className="w-10 h-10 me-4 rounded-full"
                alt=""
                width={40}
                height={40}
              />
              <div className="font-medium dark:text-white">
                <p>
                  {item.name}
                  <div className="block text-sm text-gray-500 dark:text-gray-400">
                    {ConvertDate(item.createdAt)}
                  </div>
                </p>
              </div>
            </div>
            <div className="flex items-center mb-1 space-x-1 rtl:space-x-reverse">
              {Array.from({ length: 5 }, (_, index) => {
                return (
                  <Star
                    key={index}
                    state={index + 1 <= item.star ? true : false}
                  />
                );
              })}
            </div>

            <div
              className="my-2 text-gray-500 dark:text-gray-400"
              dangerouslySetInnerHTML={{ __html: item.content }}
            ></div>
            {item.userId != user?._id && (
              <aside>
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  {item.consensus.length} người đồng thuận
                </p>
                <div className="flex items-center mt-3">
                  <div
                    className={`text-gray-900 ${
                      item.consensus.includes(user?._id)
                        ? "bg-blue-700 text-white hover:bg-blue-600"
                        : "bg-white hover:bg-gray-100"
                    } cursor-pointer border border-gray-300 focus:outline-none  focus:ring-4 focus:ring-gray-200 font-medium rounded-lg text-xs px-2 py-1.5 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700`}
                    onClick={(e) => {
                      if (user) {
                        Cosensus(item, item.userId);
                      } else {
                        setShowLogin(true);
                      }
                    }}
                  >
                    {item.consensus.includes(user?._id)
                      ? "Đã đồng thuận"
                      : "Đồng thuận"}
                  </div>
                </div>
              </aside>
            )}
          </article>
          <hr className="w-full my-5" />
        </div>
      ))}
      <Paging
        totalPage={total}
        currentPage={page || 1}
        setPage={setPage}
        perPage={20}
      />
      {/* Viết bình luận và cho sao */}
      {user && isPurchase ? (
        <>
          <div id="feedback" className="flex items-center justify-center mb-2 ">
            <svg
              className="cursor-pointer w-5 h-5 text-yellow-300 me-1"
              onClick={() => HandleClick(1)}
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              viewBox="0 0 22 20"
            >
              <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
            </svg>
            <svg
              className="cursor-pointer w-5 h-5 text-yellow-300 me-1"
              onClick={() => HandleClick(2)}
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              viewBox="0 0 22 20"
            >
              <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
            </svg>
            <svg
              className="cursor-pointer w-5 h-5 text-yellow-300 me-1"
              onClick={() => HandleClick(3)}
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              viewBox="0 0 22 20"
            >
              <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
            </svg>
            <svg
              className="cursor-pointer w-5 h-5 text-yellow-300 me-1"
              onClick={() => HandleClick(4)}
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              viewBox="0 0 22 20"
            >
              <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
            </svg>
            <svg
              className="cursor-pointer w-5 h-5 text-yellow-300 me-1"
              onClick={() => HandleClick(5)}
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              viewBox="0 0 22 20"
            >
              <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
            </svg>
          </div>
          <div className="flex items-center mb-4">
            <Image
              src={user?.avatar}
              className="w-10 h-10 me-4 rounded-full"
              alt=""
              width={40}
              height={40}
            />
            <div className="font-medium dark:text-white w-full">
              <Textarea
                id="cmt"
                rows={4}
                label="Viết bình luận"
                color="blue-gray"
                onChange={(e) =>
                  setFeedback({ ...feedback, content: e.target.value })
                }
              />
            </div>
            {/* Button send */}
            <button
              type="button"
              className="ml-2 text-white bg-blue-700 h-full hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-3  dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
              onClick={(e) => SendFeedback()}
            >
              <FaRegPaperPlane />
            </button>
          </div>
        </>
      ) : (
        <div className="text-center">
          <i>Hãy mua hàng để có thể bình luận nhé</i>
        </div>
      )}
    </>
  );
}

export default Feedback;
