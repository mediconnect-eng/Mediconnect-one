export function getUserFromStorage() {
  if (typeof window === 'undefined') return null;
  
  try {
    const data = localStorage.getItem("mediconnect_user");
    if (!data) return null;
    return JSON.parse(data);
  } catch (error) {
    console.error("Failed to parse user data from localStorage:", error);
    return null;
  }
}
