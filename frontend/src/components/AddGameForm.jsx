import { createGame } from '../adapters/game-adapters';

function AddGameForm({ loadGames }) {
  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;
    const title = form.elements.title.value;
    if (!title) return;

    const { error } = await createGame(title);
    if (error) return console.error(error);

    await loadGames();
    form.reset();
  };

  return (
    <form id="add-game-form" onSubmit={handleSubmit}>
      <label htmlFor="title-input">New Game:</label>
      <input type="text" name="title" id="title-input" placeholder="What game are you tracking?" />
      <button type="submit">Add</button>
    </form>
  );
}

export default AddGameForm;
