import GetHeaders from "@/utils/GetHeaders";
import axiosInstance from "@/utils/axiosInterceptor";

// /api/report/user
export const APIReportUser = async (body: any) => {
  const headers = GetHeaders();
  if (headers) {
    const res = await axiosInstance.post(
      `${process.env.NEXT_PUBLIC_API_URL}/report/user`,
      body,
      { headers }
    );
    return res;
  }
};

// /api/report/admin?page=1&limit=10&type=product
export const APIReportAdmin = async (
  page: any,
  limit: any,
  type: any,
  status: any,
  search: any
) => {
  const headers = GetHeaders();
  if (headers) {
    const res = await axiosInstance.get(
      `${process.env.NEXT_PUBLIC_API_URL}/report/admin?page=${page}&limit=${limit}&type=${type}&status=${status}&search=${search}`,
      { headers }
    );
    console.log(res);
    return res.data.metadata;
  }
};

// /api/report/admin/:id => PUT
export const APIUpdateReport = async (id: string) => {
  document.getElementById("loading-page")?.classList.remove("hidden");
  const headers = GetHeaders();
  if (headers) {
    const res = await axiosInstance.patch(
      `${process.env.NEXT_PUBLIC_API_URL}/report/admin/${id}`,
      {},
      { headers }
    );
    document.getElementById("loading-page")?.classList.add("hidden");
    return res;
  }
};

// /api/report/admin/:id => DELETE
export const APIDeleteReport = async (id: string) => {
  document.getElementById("loading-page")?.classList.remove("hidden");
  const headers = GetHeaders();
  if (headers) {
    const res = await axiosInstance.delete(
      `${process.env.NEXT_PUBLIC_API_URL}/report/admin/${id}`,
      { headers }
    );
    document.getElementById("loading-page")?.classList.add("hidden");
    return res;
  }
};

// /api/reports?userId=65f3147f3331cabe697a314c
export const APIGetReportUser = async (userId: string) => {
  const headers = GetHeaders();
  if (headers) {
    const res = await axiosInstance.get(
      `${process.env.NEXT_PUBLIC_API_URL}/reports?userId=${userId}`,
      { headers }
    );
    return res.data.metadata.data;
  }
};
