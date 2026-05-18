import { useState, useEffect } from 'react';
import { fetchAllGames } from '../adapters/game-adapters';
import AddGameForm from './AddGameForm';
import GameList from './GameList';

function GamePage({ currentUser, handleLogout }) {
  const [games, setGames] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // This helper fetches games on page load with useEffect
  // It is also used within the AddGameForm and GameList
  // to re-fetch the games when a mutation action is performed
  // such as creating, deleting, or updating a game.
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
    <section>
      <div id="user-controls">
        <span>Welcome, <strong>{currentUser.username}</strong>!</span>
        <button onClick={handleLogout}>Log Out</button>
      </div>
      <AddGameForm loadGames={loadGames} />
      {isLoading && <p>Loading games...</p>}
      {error && <p className="error">Something went wrong: {error}</p>}
      <GameList games={games} loadGames={loadGames} />
    </section>
  );
}

export default GamePage;
