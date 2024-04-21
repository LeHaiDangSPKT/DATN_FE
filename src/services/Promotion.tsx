import GetHeaders from "@/utils/GetHeaders";
import axiosInstance from "@/utils/axiosInterceptor";

// /api/promotions/65f314993331cabe697a318f

export const APIPromotion = async (storeId: string) => {
  // let config = {} as any;
  // if (headers.Authorization && headers.Authorization !== "Bearer undefined") {
  //   config.headers = headers;
  // }

  const headers = GetHeaders();
  if (headers) {
    const res = await axiosInstance.get(
      `${process.env.NEXT_PUBLIC_API_URL}/promotions/${storeId}`,
      { headers }
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
