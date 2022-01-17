import axios from "axios";
import { getAccessToken, getNewAccessToken } from "../auth";

export const api = axios.create({
  baseURL: "/api",
  withCredentials: true,
});

api.interceptors.request.use(async function (config) {
  const token = getAccessToken() || (await getNewAccessToken());
  config.headers.authorization = `Bearer ${token}`;
  return config;
});
