import GetHeaders from "@/utils/GetHeaders";
import axiosInstance from "@/utils/axiosInterceptor";

export const APIUploadImage = async (file: any) => {
  const res = await axiosInstance.post(
    `${process.env.NEXT_PUBLIC_API_URL}/upload`,
    file
  );
  return res.data;
};

export const APICreate = async (body: any) => {
  const headers = GetHeaders();
  if (headers) {
    const res = await axiosInstance.post(
      `${process.env.NEXT_PUBLIC_API_URL}/store/user`,
      body,
      { headers }
    );
    return res;
  }
};

export const APIGetMyStore = async () => {
  const headers = GetHeaders();
  if (headers) {
    document.getElementById("loading-page")?.classList.remove("hidden");
    const res = await axiosInstance.get(
      `${process.env.NEXT_PUBLIC_API_URL}/store/seller`,
      { headers }
    );
    document.getElementById("loading-page")?.classList.add("hidden");
    return res;
  }
};

// api/store/seller => PUT
export const APIUpdateMyStore = async (body: any) => {
  const headers = GetHeaders();
  if (headers) {
    const res = await axiosInstance.put(
      `${process.env.NEXT_PUBLIC_API_URL}/store/seller`,
      body,
      { headers }
    );
    return res;
  }
};

// /api/store-reputation?storeId=654736b154e5a9481f44b86d
export const APIGetStoreReputation = async (
  storeId: string,
  userId: string
) => {
  var userId = userId ? userId : "";
  const res = await axiosInstance.get(
    `${process.env.NEXT_PUBLIC_API_URL}/store-reputation?storeId=${storeId}&userId=${userId}`
  );
  return res.data;
};

// /api/store/123
export const APIGetStoreById = async (id: string) => {
  document.getElementById("loading-page")?.classList.remove("hidden");
  const res = await axiosInstance.get(
    `${process.env.NEXT_PUBLIC_API_URL}/store/${id}`
  );
  document.getElementById("loading-page")?.classList.add("hidden");
  return res.data;
};

// api/store/admin/stores-most-products?limit=10
export const APIGetStoreMostProduct = async (limit: number) => {
  const headers = GetHeaders();
  if (headers) {
    const res = await axiosInstance.get(
      `${process.env.NEXT_PUBLIC_API_URL}/store/admin/stores-most-products?limit=${limit}`,
      { headers }
    );
    return res.data;
  }
};

//api/store/admin?page=1&limit=1
export const APIGetListStore = async (
  page?: any,
  limit?: any,
  search?: any
) => {
  const headers = GetHeaders();
  if (headers) {
    var search = search ? search : "";
    var page = page ? page : 1;
    var limit = limit ? limit : 10;
    const res = await axiosInstance.get(
      `${process.env.NEXT_PUBLIC_API_URL}/store/admin?page=${page}&limit=${limit}&search=${search}`,
      { headers }
    );
    return res.data;
  }
};

// /api/store/admin/:id
export const APIGetStoreAdmin = async (id: any) => {
  const headers = GetHeaders();
  if (headers) {
    const res = await axiosInstance.get(
      `${process.env.NEXT_PUBLIC_API_URL}/store/admin/${id}`,
      { headers }
    );
    return res.data;
  }
};

// pp/api/user/user-follow-store?storeId=sad
export const APIFollowStore = async (storeId: any) => {
  const headers = GetHeaders();
  if (headers) {
    const res = await axiosInstance.put(
      `${process.env.NEXT_PUBLIC_API_URL}/user/user-follow-store?storeId=${storeId}`,
      {},
      { headers }
    );
    return res.data;
  }
};

// api/store/admin-get-all
export const APIGetAllStore = async () => {
  document.getElementById("loading-page")?.classList.remove("hidden");

  const headers = GetHeaders();
  if (headers) {
    const res = await axiosInstance.get(
      `${process.env.NEXT_PUBLIC_API_URL}/store/admin-get-all`,
      { headers }
    );
    document.getElementById("loading-page")?.classList.add("hidden");

    return res.data;
  }
};

// /api/stores/select
export const APISelectStore = async () => {
  const headers = GetHeaders();
  if (headers) {
    const res = await axiosInstance.get(
      `${process.env.NEXT_PUBLIC_API_URL}/stores/select`,
      { headers }
    );
    return res.data.metadata.data;
  }
};
