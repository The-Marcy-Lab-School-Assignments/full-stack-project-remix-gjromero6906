import { updateGame, deleteGame } from '../adapters/game-adapters';

function GameItem({ game, loadGames }) {
  const handleChange = async (e) => {
    const { error } = await updateGame(game.game_id, { is_complete: e.target.checked });
    if (error) return console.error(error);
    loadGames();
  };

  const handleDelete = async () => {
    const { error } = await deleteGame(game.game_id);
    if (error) return console.error(error);
    loadGames();
  };

  return (
    <li className="game-item">
      <input
        type="checkbox"
        checked={game.is_complete}
        onChange={handleChange}
      />
      <span className={game.is_complete ? 'completed' : ''}>{game.title}</span>
      <button className="delete-btn" onClick={handleDelete}>Delete</button>
    </li>
  );
}

export default GameItem;
