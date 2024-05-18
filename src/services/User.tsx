import GetHeaders from "@/utils/GetHeaders";
import axiosInstance from "@/utils/axiosInterceptor";

export const APIGetUserById = async (id: string) => {
  const headers = GetHeaders();
  if (headers) {
    document.getElementById("loading-page")?.classList.remove("hidden");

    const res = await axiosInstance.get(
      `${process.env.NEXT_PUBLIC_API_URL}/user/user/${id}`,
      { headers }
    );
    document.getElementById("loading-page")?.classList.add("hidden");

    return res.data;
  }
};

export const APIUpdateUser = async (id: string, body: any) => {
  const headers = GetHeaders();
  if (headers) {
    const res = await axiosInstance.patch(
      `${process.env.NEXT_PUBLIC_API_URL}/user/user/${id}`,
      body,
      { headers }
    );
    return res;
  }
};

// /api/user/admin?page=1&limit=1&search=2
export const APIGetListUser = async (
  page: number,
  limit: number,
  search: string = ""
) => {
  const headers = GetHeaders();
  console.log("APIGetListUser1", headers);
  if (headers) {
    const res = await axiosInstance.get(
      `${process.env.NEXT_PUBLIC_API_URL}/user/admin?page=${page}&limit=${limit}&search=${search}`,
      { headers }
    );
    console.log("APIGetListUser", res.data);
    return res.data;
  }
};

// /api/user/has-store?page=1&limit=20&search=2
export const APIGetListUserHasStore = async (
  page: number,
  limit: number,
  search: string = ""
) => {
  const headers = GetHeaders();
  if (headers) {
    const res = await axiosInstance.get(
      `${process.env.NEXT_PUBLIC_API_URL}/user/has-store?page=${page}&limit=${limit}&search=${search}`,
      { headers }
    );
    return res.data.metadata;
  }
};

// /api/user/has-been-warning?page=1&limit=10&search=2
export const APIGetListUserWarning = async (
  page: number,
  limit: number,
  search: string = ""
) => {
  const headers = GetHeaders();
  if (headers) {
    const res = await axiosInstance.get(
      `${process.env.NEXT_PUBLIC_API_URL}/user/has-been-warning?page=${page}&limit=${limit}&search=${search}`,
      { headers }
    );
    return res.data.metadata;
  }
};

// /api/user/admin/get-all
export const APIGetAllUser = async () => {
  document.getElementById("loading-page")?.classList.remove("hidden");

  const headers = GetHeaders();
  if (headers) {
    const res = await axiosInstance.get(
      `${process.env.NEXT_PUBLIC_API_URL}/user/admin/get-all`,
      { headers }
    );
    document.getElementById("loading-page")?.classList.add("hidden");

    return res.data;
  }
};

// /api/user/user-follow-stores?page=1&limit=2
export const APIGetListStoreFollow = async (
  page: number,
  limit: number,
  search: string = ""
) => {
  const headers = GetHeaders();
  if (headers) {
    const res = await axiosInstance.get(
      `${process.env.NEXT_PUBLIC_API_URL}/user/user-follow-stores?page=${page}&limit=${limit}&search=${search}`,
      { headers }
    );
    return res;
  }
};

// /api/product/user-love-list?page=1&limit=4
export const APIGetListProductFavorite = async (
  page: number,
  limit: number,
  search: string = ""
) => {
  const headers = GetHeaders();
  if (headers) {
    const res = await axiosInstance.get(
      `${process.env.NEXT_PUBLIC_API_URL}/product/user-love-list?page=${page}&limit=${limit}&search=${search}`,
      { headers }
    );
    return res.data;
  }
};

// /api/user/banned?page=1&limit=10&search=2
export const APIGetListUserBanned = async (
  page: number,
  limit: number,
  search: string = ""
) => {
  const headers = GetHeaders();
  if (headers) {
    const res = await axiosInstance.get(
      `${process.env.NEXT_PUBLIC_API_URL}/user/banned?page=${page}&limit=${limit}&search=${search}`,
      { headers }
    );
    console.log("APIGetListUserBanned", res);
    return res.data.metadata;
  }
};
