import { API_BASE_URL } from "@/config/url";
import { AUTH_API_ROUTES } from "@/constants/apiRoutes";

export async function refreshHandler(refreshToken: string) {
  try {
    const res = await fetch(API_BASE_URL + AUTH_API_ROUTES.REFRESH, {
      method: "POST",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify({
        refreshToken,
      }),
    });

    if (res.ok) {
      return await res.json();
    }
  } catch (error) {
    if (error instanceof Error) {
      return {
        success: false,
        error: error.message,
      };
    }
    // console.log("Refresh call error",error)
  }
  return null;
}
