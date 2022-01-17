import { useRouter } from "next/router";
import { useContext, useEffect, useRef, useState } from "react";
import AutosizeInput from "react-input-autosize";
import { getAccessToken, getMe, setAccessToken } from "../auth";
import { api } from "../libs/api";
import styles from "../styles/Dashboard.module.css";
import { userContext } from "../userContext";
import { fieldError } from "../util/fieldError";

export default function Dashboard() {
  const { user, setUser } = useContext(userContext);
  const [nicknameEditable, setNicknameEditable] = useState<boolean>(false);
  const [newNickname, setNewNickname] = useState<string>("");
  const [error, setError] = useState<string>(null);
  const router = useRouter();

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      return window.removeEventListener("keydown", handleKeyDown);
    };
  });

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Escape" && nicknameEditable) {
      handleCloseEditNickname();
    }
  };

  const handleCloseEditNickname = () => {
    setNicknameEditable(false);
    setNewNickname(user.nickname);
    setError(null);
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
    } else if (user) {
      setNewNickname(user.nickname);
    }
  }, [user]);

  const logout = async () => {
    await api.get("/logout");
    setAccessToken(null);
    setUser(null);

    router.push("/home");
  };

  if (!user) {
    return <p>loading</p>;
  }

  const handleNicknameChange = async (e) => {
    e.preventDefault();
    if (!nicknameEditable || newNickname === user.nickname)
      return setNicknameEditable((nickEditable) => !nickEditable);
    const res = await api.post("/changeNickname", { newNickname });
    const data = await res.data;
    if (data.errors.find((error) => error.field === "newNickname")) {
      setError(data.errors[0].message);
      return;
    }
    user.nickname = newNickname;
    setNewNickname(newNickname);
    setNicknameEditable(false);
  };

  return (
    <div className={styles.container}>
      {error && <p className="newNicknameError">{error + "\n"}</p>}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "row",
          marginTop: 0,
        }}
      >
        <form className="changeNicknameForm" onSubmit={handleNicknameChange}>
          <h1>
            Hello{" "}
            {nicknameEditable ? (
              <AutosizeInput
                autoFocus
                value={newNickname}
                onChange={(e) => setNewNickname(e.target.value)}
                inputClassName="changeNickname"
              ></AutosizeInput>
            ) : (
              <span>{user?.nickname}</span>
            )}
          </h1>
          <input
            type="image"
            src={
              nicknameEditable
                ? "/check-mark.png"
                : "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/Ei-pencil.svg/128px-Ei-pencil.svg.png"
            }
            alt="pencil"
            style={{
              filter: "invert(.6)",
              width: "2vw",
              height: "2vw",
              margin: "1vw",
              marginTop: "2.4vw",
              cursor: "pointer",
              border: "none",
            }}
            {...(nicknameEditable ? { name: "submit" } : {})}
          />
          {nicknameEditable && (
            <img
              src="/x-mark.png"
              alt="close"
              style={{
                filter: "invert(.4)",
                width: "2vw",
                height: "2vw",
                margin: "1vw",
                marginTop: "2.4vw",
                cursor: "pointer",
              }}
              onClick={handleCloseEditNickname}
            />
          )}
        </form>
      </div>
      <div className="loggedAs">
        <p>logged as {user.username}</p>
      </div>
      <button style={{ marginTop: "-.5vw" }} onClick={logout}>
        Logout
      </button>
    </div>
  );
}
