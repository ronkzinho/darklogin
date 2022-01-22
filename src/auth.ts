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
  const { data } = await axios.get("/api/token");

  setAccessToken(await data["accessToken"]);

  return await data["accessToken"];
};

export const getNewRefreshToken = async () => {
  await axios.post("/api/token");
};

export const getMe = async () => {
  try {
    let { data } = await api.get("/me");

    if (data === null) {
      setAccessToken(null);
      data = (await api.get("/me")).data;
    }
    return await data;
  } catch {
    return null;
  }
};
