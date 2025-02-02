import React, { useState } from 'react';

function BookingForm({ onConfirm }) {
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [service, setService] = useState('');
  const [contact, setContact] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    
    const contactRegex = /^\d{10}$/; 
    if (!contactRegex.test(contact)) {
      setError('Please enter a valid 10-digit contact number.');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('http://localhost:3001/api/book', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ date, time, service, contact }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok.');
      }

      const data = await response.json();
      setLoading(false);
      onConfirm(data);

      
      setTimeout(() => {
        window.location.href = '/';  
      }, 1000);  

    } catch (error) {
      setLoading(false);
      setError('There was an error with your booking. Please try again later.');
      console.error('Error:', error);
    }
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
      <div>
        <label>Contact Number:</label>
        <input
          type="tel"
          value={contact}
          onChange={(e) => setContact(e.target.value)}
          placeholder="Enter a 10-digit number"
          required
        />
      </div>

      <button type="submit" disabled={loading}>
        {loading ? 'Booking...' : 'Book Now'}
      </button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </form>
  );
}

export default BookingForm;
