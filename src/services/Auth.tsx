import axiosInstance from "@/utils/axiosInterceptor";
interface SignUpForm {
  name: string;
  email: string;
  password: string;
}

export const APISignUp = async ({ name, email, password }: SignUpForm) => {
  const res = await axiosInstance.post(
    `${process.env.NEXT_PUBLIC_API_URL}/auth/signup`,
    {
      email,
      fullName: name,
      password,
    }
  );
  return res;
};

export const APILogin = async (email: string, password: string) => {
  document.getElementById("loading-page")?.classList.remove("hidden");
  const res = await axiosInstance.post(
    `${process.env.NEXT_PUBLIC_API_URL}/auth/login`,
    {
      email,
      password,
    }
  );
  return res;
};

export const APIForgetPassword = async (email: string, password: string) => {
  const res = await axiosInstance.post(
    `${process.env.NEXT_PUBLIC_API_URL}/auth/forgetPassword`,
    {
      email,
      password,
    }
  );
  return res;
};

// /api/auth/google
export const APIGoogleLogin = async (idToken: string) => {
  const res = await axiosInstance.post(
    `${process.env.NEXT_PUBLIC_API_URL}/auth/login/google`,
    {
      idToken,
    }
  );
  return res;
};

// /api/auth/facebook
export const APIFacebookLogin = async (accessToken: string) => {
  const res = await axiosInstance.post(
    `${process.env.NEXT_PUBLIC_API_URL}/auth/login/facebook`,
    {
      accessToken,
    }
  );
  return res;
};
