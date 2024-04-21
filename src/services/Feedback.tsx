import GetHeaders from "@/utils/GetHeaders";
import axiosInstance from "@/utils/axiosInterceptor";

// /api/feedback?page=1&limit=1&productId=654745397c3886f34c7ae2c8&userId=1
// api/feedback-star?productId=654745397c3886f34c7ae2c8
export const APIGetFeedbackStar = async (productId: any) => {
  const res = await axiosInstance.get(
    `${process.env.NEXT_PUBLIC_API_URL}/feedback-star?productId=${productId}`
  );
  return res.data;
};

// api/feedback?page=1&limit=10&productId=6579e615d88cab3ea7989ff0&userId=
export const APIGetFeedbackUser = async (
  page?: any,
  productId?: any,
  userId?: any
) => {
  var page = page ? page : 1;
  var productId = productId ? productId : "";
  var userId = userId ? userId : "";
  const res = await axiosInstance.get(
    `${
      process.env.NEXT_PUBLIC_API_URL
    }/feedback?page=${page}&limit=${10}&productId=${productId}&userId=${userId}`
  );
  return res.data;
};

// /feedback/user?productId=131231 => POST
export const APICreateFeedback = async (productId: string, body: any) => {
  const headers = GetHeaders();
  if (headers) {
    const res = await axiosInstance.post(
      `${process.env.NEXT_PUBLIC_API_URL}/feedback/user?productId=${productId}`,
      {
        star: body.star,
        content: body.content,
      },
      { headers }
    );
    return res.data;
  }
};

//api/feedback-consensus?productId=131231&userId=123123 => PUT
export const APIUpdateFeedback = async (productId: string, userId: string) => {
  const headers = GetHeaders();
  if (headers) {
    const res = await axiosInstance.put(
      `${process.env.NEXT_PUBLIC_API_URL}/feedback-consensus?productId=${productId}&userId=${userId}`,
      {},
      { headers }
    );
    return res.data;
  }
};
