import axios from 'axios'

const adminBaseUrl = import.meta.env.VITE_ADMIN_BASE_URL


export const adminAxios = axios.create({
  baseURL: adminBaseUrl,
  headers: {
    "Content-Type": "application/json"
  },
  withCredentials: true
})

adminAxios.interceptors.request.use(config => {
  const token = localStorage.getItem("adminToken")
  if (token) {
    config.headers.Authorization = token
  }
  return config
})


adminAxios.interceptors.response.use(
  response => response,
  async error => {
      const originalRequest = error.config;
      if (error.response && error.response.status === 401 && error.response.data.message === "Token expired") {
          try {           
              const response = await axios.post(`${adminBaseUrl}/refresh-token`, {}, { withCredentials: true });           
              localStorage.setItem('adminToken', response.data.accessToken);           
              const newAccessToken = response.data.accessToken;
              adminAxios.defaults.headers.common['Authorization'] = `Bearer ${newAccessToken}`;
              originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
              return adminAxios(originalRequest);
          } catch (refreshError) {
              console.error("Refresh Token Error:", refreshError);           
              return Promise.reject(refreshError);
          }
      }

      return Promise.reject(error);
  }
);