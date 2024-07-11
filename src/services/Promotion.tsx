import GetHeaders from "@/utils/GetHeaders";
import axiosInstance from "@/utils/axiosInterceptor";
import { barClassName } from "@material-tailwind/react/types/components/slider";

// /api/promotions/65f314993331cabe697a318f

export const APIPromotion = async (storeId: string, hasLogin: boolean) => {
  if (hasLogin) {
    const headers = GetHeaders();
    if (headers) {
      const res = await axiosInstance.get(
        `${process.env.NEXT_PUBLIC_API_URL}/promotions/${storeId}`,
        { headers }
      );
      return res;
    }
  } else {
    const res = await axiosInstance.get(
      `${process.env.NEXT_PUBLIC_API_URL}/promotions/${storeId}`
    );
    return res;
  }
};

// /api/promotions/65f5edefff37ad301b196cdd/voucher
export const APISaveVoucher = async (voucherId: string) => {
  const headers = GetHeaders();
  if (headers) {
    const res = await axiosInstance.patch(
      `${process.env.NEXT_PUBLIC_API_URL}/promotions/${voucherId}/voucher`,
      {},
      { headers }
    );
    return res;
  }
};

// /api/promotions/user
export const APIUserPromotion = async (storeIds: string[]) => {
  const headers = GetHeaders();
  if (headers) {
    const res = await axiosInstance.post(
      `${process.env.NEXT_PUBLIC_API_URL}/promotions/user`,
      storeIds,
      { headers }
    );
    return res;
  }
};

// /api/promotions/manager?storeId=65f5ee13ff37ad301b196d05
export const APIManagerPromotion = async (
  storeId?: string,
  isActive?: boolean
) => {
  const headers = GetHeaders();
  if (headers) {
    const res = await axiosInstance.get(
      `${process.env.NEXT_PUBLIC_API_URL}/promotions/manager?storeId=${storeId}&isActive=${isActive}`,
      { headers }
    );
    return res.data.metadata;
  }
};

// api/promotions/65f5edefff37ad301b196cdd
export const APIUpdatePromotion = async (id: string, body: any) => {
  const headers = GetHeaders();
  if (headers) {
    document.getElementById("loading-page")?.classList.remove("hidden");
    const res = await axiosInstance.patch(
      `${process.env.NEXT_PUBLIC_API_URL}/promotions/${id}`,
      body,
      { headers }
    );
    document.getElementById("loading-page")?.classList.add("hidden");

    return res;
  }
};

// /api/promotions/not-used?page=1&limit=10
export const APIPromotionNotUsed = async (page: number, limit: number) => {
  const headers = GetHeaders();
  if (headers) {
    const res = await axiosInstance.get(
      `${process.env.NEXT_PUBLIC_API_URL}/promotions/not-used?page=${page}&limit=${limit}`,
      { headers }
    );
    return res.data.metadata;
  }
};

// /api/promotions/6624e7ae4a7c95d94c97f292 : DELETE
export const APIDeletePromotion = async (id: string) => {
  const headers = GetHeaders();
  if (headers) {
    const res = await axiosInstance.delete(
      `${process.env.NEXT_PUBLIC_API_URL}/promotions/${id}`,
      { headers }
    );
    return res;
  }
};

// /api/promotions
export const APICreatePromotion = async (body: any) => {
  const headers = GetHeaders();
  if (headers) {
    const res = await axiosInstance.post(
      `${process.env.NEXT_PUBLIC_API_URL}/promotions`,
      body,
      { headers }
    );
    return res;
  }
};
