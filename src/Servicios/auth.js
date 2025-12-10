export const getStoredUser = () => {
  const raw = localStorage.getItem("user");
  if (!raw) return null;

  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
};

export const getToken = () => {
  return localStorage.getItem("token") || null;
};

export const isAdminLogged = () => {
  const user = getStoredUser();
  const token = getToken();

  if (!user || !token) return false;

  const role =
    user.role ||
    user.authority ||
    (Array.isArray(user.authorities) ? user.authorities[0] : null);

  return role === "ADMIN" || role === "ROLE_ADMIN";
};
