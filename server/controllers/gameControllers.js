const gameModel = require('../models/gameModel');

module.exports.listGames = async (req, res, next) => {
  try {
    const games = await gameModel.listByUser(req.session.user_id);
    res.send(games);
  } catch (err) {
    next(err);
  }
};

module.exports.createGame = async (req, res, next) => {
  try {
    const { title } = req.body;
    if (!title) return res.status(400).send({ error: 'Title is required.' });
    const game = await gameModel.create(title, req.session.user_id);
    res.status(201).send(game);
  } catch (err) {
    next(err);
  }
};

module.exports.updateGame = async (req, res, next) => {
  try {
    const { game_id } = req.params;
    const game = await gameModel.find(game_id);
    if (!game) return res.status(404).send({ error: 'Game not found.' });
    if (game.user_id !== req.session.user_id) {
      return res.status(403).send({ error: 'Not authorized.' });
    }
    const updatedGame = await gameModel.update(game_id, req.body);
    res.send(updatedGame);
  } catch (err) {
    next(err);
  }
};

module.exports.deleteGame = async (req, res, next) => {
  try {
    const { game_id } = req.params;
    const game = await gameModel.find(game_id);
    if (!game) return res.status(404).send({ error: 'Game not found.' });
    if (game.user_id !== req.session.user_id) {
      return res.status(403).send({ error: 'Not authorized.' });
    }
    const deletedGame = await gameModel.destroy(game_id);
    res.send(deletedGame);
  } catch (err) {
    next(err);
  }
};
