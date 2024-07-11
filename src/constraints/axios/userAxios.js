import axios from 'axios'
const userBaseUrl = import.meta.env.VITE_USER_BASE_URL

export const userAxios = axios.create({
  baseURL: userBaseUrl,
  headers: {
    "Content-Type": "application/json"
  },
  withCredentials: true
})

userAxios.interceptors.request.use(config => {
  const token = localStorage.getItem("userToken")
  if (token) {
    config.headers.Authorization = token
  }
  return config
})

export const setupInterceptors = (navigate, dispatch, logoutAction, toast) => {
  userAxios.interceptors.response.use(
      response => {
          return response;
      },
      async error => {
          const originalRequest = error.config;

          if (error.response) {
              console.error("Response Error:", error.response.data);
              console.error("Status Code:", error.response.status);
              console.error("Headers:", error.response.headers);

              if (error.response.data.message === 'User Is Blocked') {
                  dispatch(logoutAction());
                  toast.error('User is blocked');
                  navigate('/login');
              }

              if (error.response.status === 401 && error.response.data.message === 'Token expired' && !originalRequest._retry) {
                  originalRequest._retry = true;

                  try {
                      const { data } = await axios.post(`${userBaseUrl}/refresh-token`, {}, { withCredentials: true });

                      localStorage.setItem("userToken", data.accessToken);

                      userAxios.defaults.headers.Authorization = `Bearer ${data.accessToken}`;
                      originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;

                      return userAxios(originalRequest);
                  } catch (refreshError) {
                      dispatch(logoutAction());
                      toast.error('Session expired. Please log in again.');
                      navigate('/login');
                  }
              }
          } else if (error.request) {
              console.error("Request Error:", error.request);
          } else {
              console.error("Error:", error.message);
          }
          return Promise.reject(error);
      }
  );
};


