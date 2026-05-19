import GameItem from './GameItem';

function GameList({ games, loadGames }) {
  if (games.length === 0) {
    return (
      <div className="empty-state-card">
        <div className="empty-state-icon">🎮</div>
        <div>
          <h2>Nothing tracked yet</h2>
          <p>Add your first game to start building your collection and tracking progress.</p>
        </div>
      </div>
    );
  }

  return (
    <ul id="game-list">
      {games.map((game) => (
        <GameItem
          key={game.game_id}
          game={game}
          loadGames={loadGames}
        />
      ))}
    </ul>
  );
}

export default GameList;
