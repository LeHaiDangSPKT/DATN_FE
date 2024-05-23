import axios from 'axios';

// Tạo một instance Axios tùy chỉnh
const axiosInstance = axios.create();

// // Thêm interceptor cho request
axiosInstance.interceptors.request.use(function (config) {
    return config;
}, function (error) {
    return Promise.reject(error);
});

// Thêm interceptor cho response
axiosInstance.interceptors.response.use(function (response) {
    return response;
}, function (error) {
    const { response, config } = error;
    const status = response?.status;
    console.error("error", error)
    // Kiểm tra mã lỗi có phải là 401 hoặc 403 hay không
    if (status === 401 || status === 403) {
        localStorage.removeItem("user");
        window.location.href = "/login";

    }
    return error.response
});


export default axiosInstance;