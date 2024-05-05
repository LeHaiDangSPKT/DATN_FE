import GetHeaders from "@/utils/GetHeaders";
import axiosInstance from "@/utils/axiosInterceptor";

//
export const APIExport = async (path: string) => {
  const headers = GetHeaders();
  if (headers) {
    const res = await axiosInstance.get(
      `${process.env.NEXT_PUBLIC_API_URL}/${path}`,
      { headers, responseType: "blob" }
    );
    return res;
  }
};
