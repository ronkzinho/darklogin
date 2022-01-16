import axios from "axios";
import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";
import useSound from "use-sound";
import { getAccessToken, getMe, setAccessToken } from "../auth";
import styles from "../styles/Dashboard.module.css";
import { userContext } from "../userContext";

export default function Dashboard() {
  const { user, setUser } = useContext(userContext);
  const router = useRouter();
  const [play, { stop }] = useSound("/rickroll.mp3");

  const playRickroll = () => {
    play();
  };

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

  const startCountdown = () => {
    setTimeout(() => {
      playRickroll();
    }, 5000);
  };

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
      <h1>
        Hello{" "}
        {user?.username === "jayberto" ? (
          <span>
            jay, when are u getting wr? majj and can you please click{" "}
            <span
              style={{ cursor: "pointer", color: "blue" }}
              onClick={startCountdown}
            >
              here
            </span>
            ?
          </span>
        ) : (
          user?.username
        )}
      </h1>
      <button onClick={logout}>Logout</button>
    </div>
  );
}
