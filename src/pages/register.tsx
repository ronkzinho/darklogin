import axios from "axios";
import { useRouter } from "next/router";
import { useState } from "react";
import { setAccessToken } from "../auth";

export default function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const submit = async (e) => {
    e.preventDefault();

    const req = await axios.post(
      "/api/register",
      { email, password, username },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    setAccessToken((await req.data)["accessToken"]);

    router.push("/dashboard");
  };
  return (
    <form onSubmit={submit}>
      <button
        type="button"
        className="backButton"
        onClick={() => router.back()}
      >
        {"<"}
      </button>
      <input
        placeholder="username"
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      ></input>
      <input
        placeholder="email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      ></input>
      <input
        placeholder="password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      ></input>
      <button type="submit">Register</button>
    </form>
  );
}
