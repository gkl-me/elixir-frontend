import { cookies } from "next/headers";

export const setCookies = async (token?: string) => {
  const name = "refreshToken";
  const cookieConfig = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    maxAge: 7 * 24 * 60 * 60,
  };

  const cookieStore = await cookies();
  cookieStore.set(name, token, cookieConfig);
};

export const deleteCookies = async () => {
  const cookieStore = await cookies();
  cookieStore.delete("refreshToken");
};

export const getCookies = async (name: string) => {
  const cookieStore = await cookies();
  return cookieStore.get(name)?.value;
};
