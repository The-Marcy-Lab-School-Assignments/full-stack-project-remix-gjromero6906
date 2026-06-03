import { useState, useEffect } from 'react';
import { fetchAllGames } from '../adapters/game-adapters';
import AddGameForm from './AddGameForm';
import GameList from './GameList';

function GamePage({ currentUser, handleLogout }) {
  const [games, setGames] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadGames = async () => {
    setIsLoading(true);
    setError(null);
    const { data, error: fetchError } = await fetchAllGames();
    if (fetchError) {
      setError(fetchError.message);
    } else {
      setGames(data);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    loadGames();
  }, []);

  return (
    <section id="game-page">
        <div id="user-controls">
        <div className="user-info">
          <span>Welcome back</span>
        </div>

        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </div>

      <AddGameForm loadGames={loadGames} />

      {isLoading && <p className="status-message">Loading games...</p>}
      {error && <p className="error">Something went wrong: {error}</p>}

      <GameList games={games} loadGames={loadGames} />
    </section>
  );
}

export default GamePage;
