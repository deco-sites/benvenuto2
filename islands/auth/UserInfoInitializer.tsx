import { useEffect } from "preact/hooks";
import { initializeUserInfo } from "site/utils/userInfo.ts";

export default function UserInfoInitializer() {
  useEffect(() => {
    console.log("Fetching user info");
    initializeUserInfo();
  }, []);

  return null; // No UI is rendered; just client-side logic
}
