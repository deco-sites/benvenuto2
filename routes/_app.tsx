import { AppProps } from "$fresh/server.ts";
import GlobalTags from "$store/components/GlobalTags.tsx";
import Theme from "../sections/Theme/Theme.tsx";
import UserInfoInitializer from "site/islands/auth/UserInfoInitializer.tsx";

const sw = () =>
  addEventListener("load", () =>
    navigator && navigator.serviceWorker &&
    navigator.serviceWorker.register("/sw.js"));

function App(props: AppProps) {
  return (
    <>
      {/* Include default fonts and css vars */}
      <Theme />

      {/* Include Icons and manifest */}
      <GlobalTags />

      <UserInfoInitializer />

      {/* Rest of Preact tree */}
      <props.Component />

      {/* Include service worker */}
      <script
        type="module"
        dangerouslySetInnerHTML={{ __html: `(${sw})();` }}
      />
    </>
  );
}

export default App;
