import { QueryThreeElement } from "@/types/Query";
import GetHeaders from "@/utils/GetHeaders";
import Toast from "@/utils/Toast";
import axiosInstance from "@/utils/axiosInterceptor";

export const APIGetAllCartPaging = async ({
  page,
  limit,
  search,
}: QueryThreeElement): Promise<any> => {
  const headers = GetHeaders();
  if (headers) {
    const res = await axiosInstance.get(
      `${process.env.NEXT_PUBLIC_API_URL}/cart/user?page=${page}&limit=${limit}&search=${search}`,
      { headers }
    );
    return res.data;
  }
};

export const APIGetAllCart = async (): Promise<any> => {
  document.getElementById("loading-page")?.classList.remove("hidden");
  const headers = GetHeaders();
  if (headers) {
    const res = await axiosInstance.get(
      `${process.env.NEXT_PUBLIC_API_URL}/cart/user/get-all`,
      { headers }
    );
    document.getElementById("loading-page")?.classList.add("hidden");
    return res;
  }
};

export const APIRemoveProductInCart = async (
  productId: string
): Promise<any> => {
  const headers = GetHeaders();
  if (headers) {
    const res = await axiosInstance.delete(
      `${process.env.NEXT_PUBLIC_API_URL}/cart/user?productId=${productId}`,
      { headers }
    );
    return res.data;
  }
};

export const APIAddProductInCart = async (productId: string): Promise<any> => {
  try {
    const headers = GetHeaders();
    if (headers) {
      const res = await axiosInstance.post(
        `${process.env.NEXT_PUBLIC_API_URL}/cart/user?productId=${productId}`,
        {},
        { headers }
      );
      return res.data;
    }
  } catch (error) {
    window.location.href = "/login";
  }
};
