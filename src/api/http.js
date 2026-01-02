import axios from "axios";

const http = axios.create({
  baseURL: "https://blog-backend-agt0.onrender.com/api",
});

export default http;
export { http };