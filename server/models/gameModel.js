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
module.exports.create = async (game, user_id) => {
  const query = `INSERT INTO games
    (title, platform, status, notes, url_img, user_id)
    VALUES ($1, $2, $3, $4, $5, $6)
    RETURNING *`;
  const { rows } = await pool.query(query, [
    game.title,
    game.platform,
    game.status || 'Playing',
    game.notes,
    game.url_img,
    user_id,
  ]);
  return rows[0];
};

// Updates a game row using only allowed fields. Returns the updated row.
module.exports.update = async (game_id, updates) => {
  const allowedFields = ['title', 'platform', 'status', 'notes', 'url_img', 'is_complete'];
  const entries = Object.entries(updates).filter(([key]) => allowedFields.includes(key));
  if (entries.length === 0) {
    return this.find(game_id);
  }

  const setters = entries.map(([key], index) => `${key} = $${index + 1}`).join(', ');
  const values = entries.map(([, value]) => value);
  values.push(game_id);

  const query = `UPDATE games SET ${setters} WHERE game_id = $${values.length} RETURNING *`;
  const { rows } = await pool.query(query, values);
  return rows[0];
};

// Deletes a game by id
module.exports.destroy = async (game_id) => {
  const query = 'DELETE FROM games WHERE game_id = $1 RETURNING *';
  const { rows } = await pool.query(query, [game_id]);
  return rows[0] || null;
};
