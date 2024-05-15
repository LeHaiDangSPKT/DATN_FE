import GetHeaders from "@/utils/GetHeaders";
import axiosInstance from "@/utils/axiosInterceptor";

// /api/shippers
export const APICreateShippers = async (body: any) => {
  document.getElementById("loading-page")?.classList.remove("hidden");
  const res = await axiosInstance.post(
    `${process.env.NEXT_PUBLIC_API_URL}/shippers`,
    body
  );
  document.getElementById("loading-page")?.classList.add("hidden");

  return res;
};

// /api/shippers/in-active?page=1&limit=10&search=
export const APIGetListShippers = async (
  page: number,
  limit: number,
  search: string,
  status: boolean
) => {
  const headers = GetHeaders();
  if (headers) {
    const res = await axiosInstance.get(
      `${process.env.NEXT_PUBLIC_API_URL}/shippers?page=${page}&limit=${limit}&search=${search}&status=${status}`,
      { headers }
    );
    return res.data.metadata;
  }
};

// /api/shippers/663fc6edf85c9b1295d5f996/active
export const APIActiveShippers = async (id: string, email: string) => {
  const headers = GetHeaders();
  if (headers) {
    document.getElementById("loading-page")?.classList.remove("hidden");
    const res = await axiosInstance.post(
      `${process.env.NEXT_PUBLIC_API_URL}/shippers/${id}/active`,
      { email },
      { headers }
    );
    document.getElementById("loading-page")?.classList.add("hidden");
    return res;
  }
};

// api/shippers/profile
export const APIGetProfileShipper = async () => {
  const headers = GetHeaders();
  if (headers) {
    const res = await axiosInstance.get(
      `${process.env.NEXT_PUBLIC_API_URL}/shippers/profile`,
      { headers }
    );
    return res.data.metadata.data;
  }
};

// PATCH: api/shippers
export const APIUpdateProfileShipper = async (body: any) => {
  const headers = GetHeaders();
  if (headers) {
    document.getElementById("loading-page")?.classList.remove("hidden");
    const res = await axiosInstance.patch(
      `${process.env.NEXT_PUBLIC_API_URL}/shippers`,
      body,
      { headers }
    );
    document.getElementById("loading-page")?.classList.add("hidden");
    return res;
  }
};

// PATCH: api/shippers/bills/:billId
export const APIUpdateStatusBill = async (billId: string) => {
  const headers = GetHeaders();
  if (headers) {
    document.getElementById("loading-page")?.classList.remove("hidden");
    const res = await axiosInstance.patch(
      `${process.env.NEXT_PUBLIC_API_URL}/shippers/bills/${billId}`,
      {},
      { headers }
    );
    document.getElementById("loading-page")?.classList.add("hidden");
    return res;
  }
};

// GET: api/shippers/bills?page=1&limit=10&status=CONFIRMED
export const APIGetListBills = async (
  page: number,
  limit: number,
  status: string
) => {
  const headers = GetHeaders();
  if (headers) {
    const res = await axiosInstance.get(
      `${process.env.NEXT_PUBLIC_API_URL}/shippers/bills?page=${page}&limit=${limit}&status=${status}`,
      { headers }
    );
    return res.data.metadata;
  }
};

// PATCH: api/shippers/bills/:billId/behavior
export const APIUpdateBehaviorBill = async (
  billId: string,
  behavior: string,
  reason?: string
) => {
  const headers = GetHeaders();
  if (headers) {
    document.getElementById("loading-page")?.classList.remove("hidden");
    const res = await axiosInstance.patch(
      `${process.env.NEXT_PUBLIC_API_URL}/shippers/bills/${billId}/behavior`,
      { behavior: behavior, reason: reason },
      { headers }
    );
    document.getElementById("loading-page")?.classList.add("hidden");
    return res;
  }
};

// PATCH: api/shippers/change-password
export const APIChangePassword = async (body: any) => {
  const headers = GetHeaders();
  if (headers) {
    document.getElementById("loading-page")?.classList.remove("hidden");
    const res = await axiosInstance.patch(
      `${process.env.NEXT_PUBLIC_API_URL}/shippers/change-password`,
      body,
      { headers }
    );
    document.getElementById("loading-page")?.classList.add("hidden");
    return res;
  }
};

// api/feedback-shipper
// {
//   "billId": "6616d48b30046e7638d1b623",
//   "star": 5,
//   "content": "this is optional field"
// }
export const APIFeedbackShipper = async (body: any) => {
  const headers = GetHeaders();
  if (headers) {
    const res = await axiosInstance.post(
      `${process.env.NEXT_PUBLIC_API_URL}/feedback-shipper`,
      body,
      { headers }
    );
    return res;
  }
};
