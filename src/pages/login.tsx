import axios from "axios";
import { useRouter } from "next/router";
import { useState } from "react";
import { setAccessToken } from "../auth";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const submit = async (e) => {
    e.preventDefault();

    const res = await axios.post(
      "/api/login",
      { email, password },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    setAccessToken((await res.data)["accessToken"]);

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
      <button type="submit">Login</button>
    </form>
  );
}
