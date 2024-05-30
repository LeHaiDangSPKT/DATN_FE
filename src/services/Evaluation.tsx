import axiosInstance from "@/utils/axiosInterceptor";
import GetHeaders from "@/utils/GetHeaders";

// api/evaluation?productId=654745397c3886f34c7ae2c8&userId=654745397c3886f34c7ae2c8
export const APIGetEvaluation = async (productId: any) => {
  const user = localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user") ?? "")
    : undefined;
  var headers = undefined;
  if (user) {
    headers = GetHeaders();
  }
  const res = await axiosInstance.get(
    `${process.env.NEXT_PUBLIC_API_URL}/evaluation?productId=${productId}`,
    { headers }
  );
  return res.data;
};

// /api/evaluation/user?productId=123123
export const APIGetEvaluationUser = async (productId: any, body: any) => {
  const headers = GetHeaders();
  if (headers) {
    const res = await axiosInstance.put(
      `${process.env.NEXT_PUBLIC_API_URL}/evaluation/user?productId=${productId}`,
      body,
      { headers }
    );
    return res.data;
  }
};
