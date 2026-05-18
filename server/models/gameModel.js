const pool = require('../db/pool');

// Returns all games for a specific user, ordered by creation time
module.exports.listByUser = async (user_id) => {
  const query = 'SELECT * FROM games WHERE user_id = $1 ORDER BY game_id ASC';
  const { rows } = await pool.query(query, [user_id]);
  return rows;
};

// Returns a single game row (used for ownership checks before update/delete)
module.exports.find = async (game_id) => {
  const query = 'SELECT * FROM games WHERE game_id = $1';
  const { rows } = await pool.query(query, [game_id]);
  return rows[0] || null;
};

// Creates a new game. Returns the full game row.
module.exports.create = async (title, user_id) => {
  const query = 'INSERT INTO games (title, user_id) VALUES ($1, $2) RETURNING *';
  const { rows } = await pool.query(query, [title, user_id]);
  return rows[0];
};

// Updates is_complete for a game. Returns the updated row.
module.exports.update = async (game_id, { is_complete }) => {
  const query = 'UPDATE games SET is_complete = $1 WHERE game_id = $2 RETURNING *';
  const { rows } = await pool.query(query, [is_complete, game_id]);
  return rows[0];
};

// Deletes a game by id
module.exports.destroy = async (game_id) => {
  const query = 'DELETE FROM games WHERE game_id = $1 RETURNING *';
  const { rows } = await pool.query(query, [game_id]);
  return rows[0] || null;
};
