import { apiRequest } from "./Axios";

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
    return response.data;
  } catch (err) {
    console.log(err);
    return err;
  }
}
