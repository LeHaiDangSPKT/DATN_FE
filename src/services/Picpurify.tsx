import axiosInstance from "@/utils/axiosInterceptor";

// /api/feedback?page=1&limit=1&productId=654745397c3886f34c7ae2c8&userId=1
// api/feedback-star?productId=654745397c3886f34c7ae2c8
export const CheckValidImage = async (body: any) => {
  const res = await axiosInstance.post(
    `${process.env.NEXT_PUBLIC_API_URL}/upload/scan`,
    body
  );
  return res;
};
