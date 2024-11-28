export async function initializeUserInfo() {
  const savedUserInfo = localStorage.getItem("userInfo");
  console.log(savedUserInfo);
  if (!savedUserInfo) {
    try {
      const response = await fetch("/api/auth/user_info", {
        credentials: "include",
      });

      if (response.ok) {
        const data = await response.json();
        console.log("User info fetched:", data.payload);
        localStorage.setItem("userInfo", JSON.stringify(data.payload));
      } else {
        console.error(
          "Failed to fetch user info",
          response.status,
          response.statusText,
        );
      }
    } catch (error) {
      console.error("Error fetching user info:", error);
    }
  }
}
