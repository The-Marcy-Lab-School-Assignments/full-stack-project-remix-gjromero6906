const handleFetch = async (url, options = {}) => {
  try {
    const response = await fetch(url, options);
    if (!response.ok) throw new Error(`Fetch failed. ${response.status} ${response.statusText}`);
    const data = await response.json();
    return { data, error: null };
  } catch (error) {
    return { data: null, error };
  }
};

export const fetchAllGames = async () => {
  return handleFetch('/api/games');
};

export const createGame = async (title) => {
  return handleFetch('/api/games', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title }),
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
