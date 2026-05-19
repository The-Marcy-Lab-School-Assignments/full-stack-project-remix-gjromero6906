import { updateGame, deleteGame } from '../adapters/game-adapters';

function GameItem({ game, loadGames }) {
  const handleComplete = async () => {
    const { error } = await updateGame(game.game_id, { is_complete: !game.is_complete });
    if (error) return console.error(error);
    loadGames();
  };

  const handleDelete = async () => {
    const { error } = await deleteGame(game.game_id);
    if (error) return console.error(error);
    loadGames();
  };

  const statusOptions = ['Playing', 'Wishlist', 'Backlog', 'Completed', 'Dropped'];

  const handleStatusChange = async (event) => {
    const status = event.target.value;
    const { error } = await updateGame(game.game_id, { status });
    if (error) return console.error(error);
    loadGames();
  };

  return (
    <li className={`game-item ${!game.url_img ? 'no-image' : ''}`}>
      <div className="game-card-image">
        {game.url_img ? (
          <img src={game.url_img} alt={game.title} />
        ) : (
          <div className="game-image-placeholder">No cover</div>
        )}
      </div>
      <div className="game-details">
        <div className="game-header">
          <div>
            <h3>{game.title}</h3>
            <p className="game-meta">{game.platform || 'Platform unknown'}</p>
          </div>
          <div>
            <span className={`badge badge-${game.status?.toLowerCase() || 'playing'}`}>
              {game.status || 'Playing'}
            </span>
            <select
              className="status-select"
              value={game.status || 'Playing'}
              onChange={handleStatusChange}
            >
              {statusOptions.map((option) => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </div>
        </div>
        {game.notes && <p className="notes">{game.notes}</p>}
        <div className="progress-row">
          <span className="progress-label">Completion</span>
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: game.is_complete ? '100%' : '33%' }} />
          </div>
        </div>
        <div className="game-actions">
          <button type="button" className="complete-btn" onClick={handleComplete}>
            {game.is_complete ? 'Reset' : 'Complete'}
          </button>
          <button type="button" className="delete-btn" onClick={handleDelete}>Delete</button>
        </div>
      </div>
    </li>
  );
}

export default GameItem;
