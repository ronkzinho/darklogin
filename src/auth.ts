import axios from "axios";
import { api } from "./libs/api";

let accessToken: string = null;

export const setAccessToken = (token: string) => {
  accessToken = token;
  return accessToken;
};

export const getAccessToken = () => {
  return accessToken;
};

export const getNewAccessToken = async () => {
  const data = await (await axios.get("/api/token")).data;

  return data["accessToken"];
};

export const getNewRefreshToken = async () => {
  await axios.post("/api/token");
};

export const getMe = async () => {
  try {
    const { data } = await api.get("/me");
    return await data;
  } catch {
    return null;
  }
};
