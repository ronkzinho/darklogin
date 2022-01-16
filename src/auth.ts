import axios from "axios";

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
    const { data } = await axios.get("/api/me", {
      method: "GET",
      headers: {
        Authorization:
          "Bearer " + (getAccessToken() || (await getNewAccessToken())),
        "Content-Type": "json",
      },
    });
    return await data;
  } catch {
    return null;
  }
};
