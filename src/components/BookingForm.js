import React, { useState } from 'react';
import { useForm } from 'react-hook-form';

function BookingForm({ onConfirm }) {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const onSubmit = async (data) => {
    setLoading(true);
    setError('');

    try {
      const response = await fetch('http://localhost:3001/api/book', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok.');
      }

      const result = await response.json();
      setLoading(false);
      onConfirm(result);

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
    <form onSubmit={handleSubmit(onSubmit)}>
      <div>
        <label>Date:</label>
        <input type="date" {...register('date', { required: true })} />
        {errors.date && <p style={{ color: 'black' }}>Date is required.</p>}
      </div>
      <div>
        <label>Time:</label>
        <input type="time" {...register('time', { required: true })} />
        {errors.time && <p style={{ color: 'black' }}>Time is required.</p>}
      </div>
      <div>
        <label>Service:</label>
        <select {...register('service', { required: true })}>
          <option value="">Select Service</option>
          <option value="Extension">Eyelash Extension</option>
          <option value="Removal">Eyelash Removal</option>
          <option value="Lifting">Eyelash Lifting</option>
          <option value="Lamination">Brow Lamination</option>
        </select>
        {errors.service && <p style={{ color: 'black' }}>Service is required.</p>}
      </div>
      <div>
        <label>Contact Number:</label>
        <input type="tel" {...register('contact', { required: true, pattern: /^\d{10}$/ })} placeholder="Enter a 10-digit number" />
        {errors.contact && <p style={{ color: 'black' }}>Enter a valid 10-digit contact number.</p>}
      </div>

      <button type="submit" disabled={loading}>
        {loading ? 'Booking...' : 'Book Now'}
      </button>
      {error && <p style={{ color: 'black' }}>{error}</p>}
    </form>
  );
}

export default BookingForm;
