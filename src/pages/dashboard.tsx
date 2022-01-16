import axios from "axios";
import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";
import {
  getAccessToken,
  getMe,
  getNewAccessToken,
  setAccessToken,
} from "../auth";
import { SafeUser } from "../entities/user";
import styles from "../styles/Dashboard.module.css";
import { userContext } from "../userContext";

export default function Dashboard() {
  const { user, setUser } = useContext(userContext);
  const router = useRouter();

  useEffect(() => {
    if (user === null && !getAccessToken()) {
      router.push("/home");
    } else if (getAccessToken()) {
      (async () => {
        const me = await getMe();
        if (me) {
          setUser(me);
        }
      })();
    }
  }, []);

  const logout = async () => {
    await axios.get("/api/logout");
    setUser(null);
    setAccessToken(null);

    router.push("/home");
  };

  if (!user) {
    return <p>loading</p>;
  }

  return (
    <div className={styles.container}>
      <h1>Hello {user?.username}</h1>
      <button onClick={logout}>Logout</button>
    </div>
  );
}
