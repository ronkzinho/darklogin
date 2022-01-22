import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";
import AutosizeInput from "react-input-autosize";
import { getAccessToken, getMe, setAccessToken } from "../auth";
import { api } from "../libs/api";
import { userContext } from "../userContext";

export default function Dashboard() {
  const { user, setUser } = useContext(userContext);
  const [nicknameEditable, setNicknameEditable] = useState<boolean>(false);
  const [newNickname, setNewNickname] = useState<string>("");
  const [error, setError] = useState<string>(null);
  const [key, setKey] = useState(null);
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
    window.addEventListener("resize", setCorrectInputWidth);

    return () => window.removeEventListener("resize", setCorrectInputWidth);
  }, []);

  const setCorrectInputWidth = () => {
    setKey((prevState) => prevState + 1);
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

  useEffect(() => {
    if (user && !newNickname) {
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
    user.nickname = data.newNickname;
    setNewNickname(data.newNickname);
    setNicknameEditable(false);
  };

  return (
    <div className="dashboardContainer">
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
            Hello
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
                maxWidth: "100vw",
                width: "100%",
              }}
            >
              <div style={{ maxWidth: nicknameEditable ? "78%" : "90%" }}>
                {nicknameEditable ? (
                  <AutosizeInput
                    autoFocus
                    value={newNickname}
                    onChange={(e) => setNewNickname(e.target.value)}
                    inputClassName="changeNickname"
                    style={{ maxWidth: "100%" }}
                    maxLength={15}
                    key={key}
                  ></AutosizeInput>
                ) : (
                  <span
                    style={{
                      display: "block",
                      maxWidth: "100%",
                      wordWrap: "break-word",
                    }}
                  >
                    {user?.nickname}
                  </span>
                )}
              </div>
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
                  width: `calc(32px + ${nicknameEditable ? "2" : "3"}vw)`,
                  cursor: "pointer",
                  border: "none",
                  marginTop: !nicknameEditable ? "-.5vw" : 0,
                  marginLeft: "1vw",
                }}
                {...(nicknameEditable ? { name: "submit" } : {})}
              />
              {nicknameEditable && (
                <img
                  src="/x-mark.png"
                  alt="close"
                  style={{
                    filter: "invert(.4)",
                    width: "calc(24px + 2vw)",
                    cursor: "pointer",
                    marginLeft: "calc(8px + .5vw)",
                    border: "none",
                  }}
                  onClick={handleCloseEditNickname}
                />
              )}
            </div>
          </h1>
        </form>
      </div>
      <div className="loggedAs">
        <p>logged as {user.username}</p>
      </div>
      <button style={{ marginTop: ".5vw" }} onClick={logout}>
        Logout
      </button>
    </div>
  );
}
