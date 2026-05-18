import GameItem from './GameItem';

function GameList({ games, loadGames }) {
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
