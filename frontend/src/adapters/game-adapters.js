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

export const fetchAllGames = async () => {
  return handleFetch('/api/games');
};

export const createGame = async (game) => {
  return handleFetch('/api/games', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(game),
  });
};

export const updateGame = async (game_id, updates) => {
  return handleFetch(`/api/games/${game_id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updates),
  });
};

export const deleteGame = async (game_id) => {
  return handleFetch(`/api/games/${game_id}`, { method: 'DELETE' });
};
