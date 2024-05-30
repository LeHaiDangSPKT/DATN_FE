import GetHeaders from "@/utils/GetHeaders";
import axiosInstance from "@/utils/axiosInterceptor";

// /api/policies?type=USER
export const APIGetAllPolicy = async (type: string) => {
  const headers = GetHeaders();
  if (headers) {
    const res = await axiosInstance.get(
      `${process.env.NEXT_PUBLIC_API_URL}/policies?type=${type}`,
      { headers }
    );
    return res.data.metadata.data;
  }
};

// api/policies/65ddf631c4500250d92b147e
export const APIUpdatePolicy = async (id: string, content: string) => {
  const headers = GetHeaders();
  if (headers) {
    const res = await axiosInstance.patch(
      `${process.env.NEXT_PUBLIC_API_URL}/policies/${id}`,
      { content },
      { headers }
    );
    console.log(res);
    return res;
  }
};

// /api/policies
export const APIAddPolicy = async (policy: any) => {
  const headers = GetHeaders();
  if (headers) {
    const res = await axiosInstance.post(
      `${process.env.NEXT_PUBLIC_API_URL}/policies`,
      policy,
      { headers }
    );
    return res;
  }
};

// /api/policies/65ddf631c4500250d92b147e
export const APIRemovePolicy = async (id: string) => {
  const headers = GetHeaders();
  if (headers) {
    const res = await axiosInstance.delete(
      `${process.env.NEXT_PUBLIC_API_URL}/policies/${id}`,
      { headers }
    );
    console.log("APIRemovePolicy", res);
    return res;
  }
};
