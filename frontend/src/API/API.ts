import axios from "axios";
import { getAuthToken } from "../Utils/auth";

export const instance = axios.create({
  withCredentials: true,
  baseURL: `http://localhost:8888/`,
});

instance.interceptors.request.use((config) => {
  const token = getAuthToken();

  config.headers.token = token;

  return config;
});

export type Response<D> = {
  status: "success" | "error";
  data: D;
};
