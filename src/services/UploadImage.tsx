import axiosInstance from "@/utils/axiosInterceptor";

export const APIUploadImage = async (file: any) => {
  const res = await axiosInstance.post(
    `${process.env.NEXT_PUBLIC_API_URL}/upload`,
    file
  );
  return res;
};
