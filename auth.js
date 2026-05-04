async function apiRequest(url, options = {}) {
  const res = await fetch(url, {
    credentials: "include",
    headers: { "Content-Type": "application/json", ...(options.headers || {}) },
    ...options
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || "Request failed");
  return data;
}

async function getCurrentUser() {
  try {
    const data = await apiRequest("/api/auth/me");
    return data.user;
  } catch {
    return null;
  }
}