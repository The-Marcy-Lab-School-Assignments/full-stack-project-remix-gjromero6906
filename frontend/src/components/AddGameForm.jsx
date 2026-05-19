import { useState } from 'react';
import { createGame } from '../adapters/game-adapters';

function AddGameForm({ loadGames }) {
  const [formState, setFormState] = useState({
    title: '',
    platform: '',
    status: 'Playing',
    notes: '',
    url_img: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!formState.title.trim()) {
      setErrorMessage('Title is required.');
      return;
    }

    setIsSubmitting(true);
    const { error } = await createGame(formState);
    setIsSubmitting(false);

    if (error) {
      setErrorMessage('Could not save game.');
      return;
    }

    await loadGames();
    setFormState({ title: '', platform: '', status: 'Playing', notes: '', url_img: '' });
  };

  return (
    <form id="add-game-form" onSubmit={handleSubmit}>
      <h2>Add a Game</h2>
      <input
        type="text"
        name="title"
        placeholder="Game title"
        value={formState.title}
        onChange={handleChange}
      />
      <input
        type="text"
        name="platform"
        placeholder="Platform (e.g. PC, Switch)"
        value={formState.platform}
        onChange={handleChange}
      />
      <label htmlFor="status" className="sr-only">Status</label>
      <select
        id="status"
        name="status"
        value={formState.status}
        onChange={handleChange}
      >
        <option value="Playing">Playing</option>
        <option value="Wishlist">Wishlist</option>
        <option value="Backlog">Backlog</option>
        <option value="Completed">Completed</option>
        <option value="Dropped">Dropped</option>
      </select>
      <textarea
        name="notes"
        placeholder="Notes or goal"
        value={formState.notes}
        onChange={handleChange}
      />
      <input
        type="url"
        name="url_img"
        placeholder="Image URL (optional)"
        value={formState.url_img}
        onChange={handleChange}
      />
      {errorMessage && <p className="error">{errorMessage}</p>}
      <button type="submit" disabled={isSubmitting}>{isSubmitting ? 'Saving...' : 'Add Game'}</button>
    </form>
  );
}

export default AddGameForm;
