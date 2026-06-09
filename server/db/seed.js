const bcrypt = require('bcrypt');
const pool = require('./pool');

const SALT_ROUNDS = 8;

const seed = async () => {
  // Drop tables in reverse dependency order (games references users via FK)
  await pool.query('DROP TABLE IF EXISTS games');
  await pool.query('DROP TABLE IF EXISTS users');

  await pool.query(`
    CREATE TABLE users (
      user_id       SERIAL PRIMARY KEY,
      username      TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL
    )
  `);

  await pool.query(`
    CREATE TABLE games (
      game_id     SERIAL PRIMARY KEY,
      title       TEXT NOT NULL,
      platform    TEXT,
      status      TEXT DEFAULT 'Playing',
      notes       TEXT,
      url_img     TEXT,
      is_complete BOOLEAN NOT NULL DEFAULT FALSE,
      user_id     INT REFERENCES users(user_id) ON DELETE CASCADE
    )
  `);

  // Hash passwords in parallel — bcrypt is slow by design (CPU-bound hashing)
  const [aliceHash, bobHash] = await Promise.all([
    bcrypt.hash('password123', SALT_ROUNDS),
    bcrypt.hash('password123', SALT_ROUNDS),
  ]);

  // RETURNING captures inserted user_ids so we don't hardcode them
  const { rows: users } = await pool.query(`
    INSERT INTO users (username, password_hash) VALUES
      ('alice', $1),
      ('bob',   $2)
    RETURNING user_id, username
  `, [aliceHash, bobHash]);

  const [alice, bob] = users;

  await pool.query(`
    INSERT INTO games (title, platform, status, notes, url_img, is_complete, user_id) VALUES
      ('Elden Ring', 'PC', 'Playing', 'Beat Malenia', 'https://images.igdb.com/igdb/image/upload/t_cover_big/co1r5a.jpg', FALSE, $1),
      ('Celeste', 'Switch', 'Completed', 'Finish all B-sides', 'https://images.igdb.com/igdb/image/upload/t_cover_big/co1vzv.jpg', TRUE, $1),
      ('Hollow Knight', 'PC', 'Wishlist', 'Explore the White Palace', 'https://images.igdb.com/igdb/image/upload/t_cover_big/co1vbb.jpg', FALSE, $2)
  `, [alice.user_id, bob.user_id]);

  return users;
};

seed()
  .then((users) => {
    console.log('Database seeded successfully.');
    console.log(`  Users: ${users.map((u) => u.username).join(', ')}`);
  })
  .catch((err) => {
    console.error('Error seeding database:', err);
    process.exit(1);
  })
  .finally(() => pool.end());
