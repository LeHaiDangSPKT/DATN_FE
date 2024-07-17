import GetHeaders from "@/utils/GetHeaders";
import axiosInstance from "@/utils/axiosInterceptor";

// POST /api/proposes
export const APIPropose = async (body: {
  image: string;
  title: string;
  price: number;
  timePackage: number;
}) => {
  const headers = GetHeaders();
  if (headers) {
    const res = await axiosInstance.post(
      `${process.env.NEXT_PUBLIC_API_URL}/proposes`,
      body,
      { headers }
    );
    return res;
  }
};

// api/proposes
export const APIGetPropose = async () => {
  const res = await axiosInstance.get(
    `${process.env.NEXT_PUBLIC_API_URL}/proposes`
  );
  return res.data.metadata.data;
};

// POST /api/proposes/6696d98cc992cf30c1b0c1a8/purchase
export const APIPurchasePropose = async (id: string, paymentMethod: string) => {
  const headers = GetHeaders();
  if (headers) {
    const res = await axiosInstance.post(
      `${process.env.NEXT_PUBLIC_API_URL}/proposes/${id}/purchase`,
      { paymentMethod },
      { headers }
    );
    return res;
  }
};

// /api/proposes/stores
export const APIProposeStores = async () => {
  const headers = GetHeaders();
  if (headers) {
    const res = await axiosInstance.get(
      `${process.env.NEXT_PUBLIC_API_URL}/store-proposes/stores`,
      { headers }
    );
    return res.data.metadata.data;
  }
};

// /api/proposes/my-propose
export const APIGetMyPropose = async () => {
  const headers = GetHeaders();
  if (headers) {
    const res = await axiosInstance.get(
      `${process.env.NEXT_PUBLIC_API_URL}/store-proposes/my-propose`,
      { headers }
    );
    return res.data.metadata.data;
  }
};
