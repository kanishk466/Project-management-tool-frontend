export const authFetch = async (url: string, options: RequestInit = {}) => {
  const token = localStorage.getItem("rpm_token");

  return fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: token ? `Bearer ${token}` : "",
      ...(options.headers || {}),
    },
  });
};