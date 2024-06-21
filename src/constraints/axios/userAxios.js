
import axios from 'axios'
const userBaseUrl = import.meta.env.VITE_USER_BASE_URL

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
  


  export const setupInterceptors = (navigate, dispatch, logoutAction, toast) => {
    userAxios.interceptors.response.use(
      (response) => {
        return response;
      },
      (error) => {
        if (error.response) {
          console.error("Response Error:", error.response.data);
          console.error("Status Code:", error.response.status);
          console.error("Headers:", error.response.headers);
  
          if (error.response.data.message === 'User Is Blocked') {
            dispatch(logoutAction());
            toast.error('User is blocked');
            navigate('/login');
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


    // userAxios.interceptors.response.use((response) => {
  //   return response;  
  // }, (error) => {
  //   if (error.response) {
  //     // The request was made and the server responded with a status code
  //     // that falls out of the range of 2xx
  //     console.error("Response Error:", error.response.data);
  //     console.error("Status Code:", error.response.status);
  //     console.error("Headers:", error.response.headers);
  //     if (error.response.data.message === 'User Is Blocked') {
  //       // Navigate to login page
  //       const history = useHistory();
  //       history.push('/login');
  //     }
  //   } else if (error.request) {
  //     // The request was made but no response was received
  //     console.error("Request Error:", error.request);
  //   } else {
  //     // Something happened in setting up the request that triggered an Error
  //     console.error("Error:", error.message);
  //   }
  //   return Promise.reject(error);
  // });