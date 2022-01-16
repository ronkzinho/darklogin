import Link from "next/link";
import { useRouter } from "next/router";
import { useContext, useEffect } from "react";
import { getAccessToken } from "../auth";
import styles from "../styles/Home.module.css";
import { userContext } from "../userContext";

export default function App() {
  const { user } = useContext(userContext);
  const router = useRouter();

  useEffect(() => {
    if (user || getAccessToken()) {
      router.push("/dashboard");
    }
  });

  if (user === undefined) {
    return <p>loading</p>;
  }

  return (
    <div className={styles.container}>
      <Link href={"/register"}>
        <button>register</button>
      </Link>
      <Link href={"/login"}>
        <button>login</button>
      </Link>
    </div>
  );
}
