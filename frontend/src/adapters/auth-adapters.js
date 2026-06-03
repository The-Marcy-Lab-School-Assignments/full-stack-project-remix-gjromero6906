const handleFetch = async (url, options = {}) => {
  try {
    const fetchOptions = { credentials: 'include', ...options };
    const response = await fetch(url, fetchOptions);
    const payload = await response.json().catch(() => null);

    if (!response.ok) {
      const errorMessage = payload?.error || payload?.message || `${response.status} ${response.statusText}`;
      return { data: null, error: new Error(errorMessage) };
    }

    return { data: payload, error: null };
  } catch (error) {
    return { data: null, error };
  }
};

export const getMe = async () => {
  return handleFetch('/api/auth/me');
};

export const register = async (username, password) => {
  return handleFetch('/api/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  });
};

export const login = async (username, password) => {
  return handleFetch('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  });
};

export const logout = async () => {
  return handleFetch('/api/auth/logout', { method: 'DELETE' });
};
