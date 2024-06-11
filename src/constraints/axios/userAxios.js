
import axios from 'axios'

const userBaseUrl = import.meta.env.VITE_USER_BASE_URL
console.log(userBaseUrl)

export const userAxios=axios.create({
    baseURL:userBaseUrl,
    headers:{
      "Content-Type":"application/json"
    },
    withCredentials: true
  })
  
  userAxios.interceptors.request.use(config=>{
    const token=localStorage.getItem("userToken")
    // console.log(token)
    if(token){
      config.headers.Authorization=token
    }
    return config
  })
  
  userAxios.interceptors.response.use((response) => {
    return response;  
  }, (error) => {
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error("Response Error:", error.response.data);
      console.error("Status Code:", error.response.status);
      console.error("Headers:", error.response.headers);
    } else if (error.request) {
      // The request was made but no response was received
      console.error("Request Error:", error.request);
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error("Error:", error.message);
    }
    return Promise.reject(error);
  });

  // userAxios.interceptors.response.use(
  //   (response) => {
  //     return response;
  //   },
  //   (error) => {
  //     if (error.response) {
  //       const { status, data } = error.response;
  //       if (status === 401 && data.message === 'User Is Blocked') {
  //         navigateToLogin(); // Redirect to the login page
  //       } else {
  //         console.error('Response Error:', data);
  //         console.error('Status Code:', status);
  //         console.error('Headers:', error.response.headers);
  //       }
  //     } else if (error.request) {
  //       console.error('Request Error:', error.request);
  //     } else {
  //       console.error('Error:', error.message);
  //     }
  //     return Promise.reject(error);
  //   }
  // );