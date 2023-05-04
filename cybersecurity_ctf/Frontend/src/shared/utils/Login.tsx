import { apiRequest } from "./Axios";
import { User } from "./Type";
import jwtDecode from "jwt-decode";

export function isLoggedIn() {
  return localStorage.getItem("token") !== null && localStorage.getItem("token") !== "undefined";
}

export function deleteTokens() {
  localStorage.removeItem("token");
  localStorage.removeItem("userId");
  localStorage.removeItem("userName");
}

export async function getCurrentUser() {
  try {
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");
    const response = await apiRequest({
      method: "GET",
      url: `/users/${userId}`,
      headers: { Authorization: `Bearer ${token}` },
    });
    for (const user of response.data as User[]) {
      if (user.id.toString() === userId) return user;
      return null;
    }
    return response.data;
  } catch (err) {
    console.log(err);
    return err;
  }
}

export async function isAdminRole(): Promise<boolean> {
  const response = await getCurrentUser();
  const user = response as User;
  return user.role === "admin";
}

export function isTokenExpired(token: string): boolean {
  const decodedToken: any = jwtDecode(token);
  const currentTime = Date.now() / 1000; // convert to seconds
  return decodedToken.exp < currentTime;
}
