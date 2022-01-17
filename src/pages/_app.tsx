import { useEffect, useState } from "react";
import { getMe } from "../auth";
import { SafeUser } from "../entities/user";
import "../styles/globals.css";
import { userContext } from "../userContext";

function MyApp({ Component, pageProps }) {
  const [user, setUser] = useState<SafeUser>(undefined);

  useEffect(() => {
    if (!user) {
      (async () => {
        setUser(await getMe());
      })();
    }
  }, []);
  return (
    <userContext.Provider value={{ user, setUser }}>
      <Component {...pageProps} />
    </userContext.Provider>
  );
}

// Only uncomment this method if you have blocking data requirements for
// every single page in your application. This disables the ability to
// perform automatic static optimization, causing every page in your app to
// be server-side rendered.
//
// MyApp.getInitialProps = async (appContext) => {
//   // calls page's `getInitialProps` and fills `appProps.pageProps`
//   const appProps = await App.getInitialProps(appContext);
//
//   return { ...appProps }
// }

export default MyApp;
