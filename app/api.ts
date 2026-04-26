import axios from "axios";

const baseURL = "https://notehub-api.goit.study/api";

export const axiosInstance = axios.create({
  baseURL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});
