import React, { useState } from 'react';

function BookingForm({ onConfirm }) {
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [service, setService] = useState('');
  const [loading, setLoading] = useState(false); // Për të treguar ngarkimin
  const [error, setError] = useState(''); // Për të treguar gabimet

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    fetch('http://localhost:3001/api/book', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ date, time, service }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok.');
        }
        return response.json();
      })
      .then((data) => {
        setLoading(false);
        onConfirm(data);
      })
      .catch((error) => {
        setLoading(false);
        setError('There was an error with your booking. Please try again.');
        console.error('Error:', error);
      });
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Date:</label>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
        />
      </div>
      <div>
        <label>Time:</label>
        <input
          type="time"
          value={time}
          onChange={(e) => setTime(e.target.value)}
          required
        />
      </div>
      <div>
        <label>Service:</label>
        <select
          value={service}
          onChange={(e) => setService(e.target.value)}
          required
        >
          <option value="">Select Service</option>
          <option value="Extension">Eyelash Extension</option>
          <option value="Removal">Eyelash Removal</option>
          <option value="Lifting">Eyelash Lifting</option>
          <option value="Lamination">Brow Lamination</option>
        </select>
      </div>
      <button type="submit" disabled={loading}>
        {loading ? 'Booking...' : 'Book Now'}
      </button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </form>
  );
}

export default BookingForm;
