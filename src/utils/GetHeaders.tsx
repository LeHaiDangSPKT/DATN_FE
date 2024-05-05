import axios from "axios";

export default function GetHeaders() {
  const user = localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user") ?? "")
    : {};

  const JWT = user?.accessToken;

  const jwtPayload = JSON.parse(window.atob(JWT.split(".")[1]));
  const exp = jwtPayload.exp;
  const now = Math.floor(Date.now() / 1000);

  if (exp - now < 0) {
    document.getElementById("loading-page")?.classList.remove("hidden");
    localStorage.removeItem("user");
    window.location.href = "/login";
    return null;
  } else if (exp - now < 86400) {
    //1 ngày
    const refreshToken = user?.refreshToken;
    const headers = {
      Authorization: `Bearer ${refreshToken}`,
    };

    const RefreshToken = async () => {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/refreshToken`,
        { headers }
      );
      if (res?.status === 200 || res?.status === 201) {
        const data = res.data.metadata.data;
        user.accessToken = data.accessToken;
        user.refreshToken = data.refreshToken;
        localStorage.setItem("user", JSON.stringify(user));
      } else {
        localStorage.removeItem("user");
        window.location.href = "/login";
      }
    };
    RefreshToken();

    return headers;
  } else {
    const authorization = `Bearer ${user?.accessToken}`;
    const headers = {
      Authorization: authorization,
    };
    return headers;
  }
}
