import axios from "axios";

const myAxios = axios.create({
  baseURL: "http://localhost:8080/api/v1",
});

// myAxios.interceptors.request.use(
//   function (config) {
//     const condition =
//       config.url?.includes('/auth/login') ||
//       config.url?.includes('/auth/register') ||
//       config.url?.includes('/auth/refreshToken');
//     if (condition) return config;

//     const token = getTokenLocalStorageItem('token');
//     config.headers = {
//       ...config.headers,
//       Authorization: `Bearer ${token}`,
//     } as any;
//     return config;
//   },
//   function (err) {
//     console.log(err);
//     return Promise.reject(err);
//   }
// );

// myAxios.interceptors.response.use(
//   function (response) {
//     // Any status code that lie within the range of 2xx cause this function to trigger
//     // Do something with response data
//     return response;
//   },
//   function (err) {
//     console.log(err);
//     const prevRequest = err?.response;
//     if (err?.response?.status === 403 && !err?.sent) {
//       prevRequest.sent = true;
//       const newAccessToken = await  ();
//       prevRequest.headers = {
//         ...prevRequest,
//         Authorization: `Bearer ${newAccessToken}`,
//       } as any;
//       return myAxios(prevRequest);
//     }}
// );

export default myAxios;
