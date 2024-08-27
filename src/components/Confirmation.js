import React from 'react';

function Confirmation({ booking }) {
  if (!booking) {
    return <p>No booking data available.</p>;
  }

  return (
    <div style={{ padding: '20px', border: '1px solid #ddd', borderRadius: '8px', backgroundColor: '#f8f8f8' }}>
      <h2 style={{ color: '#d67bb3' }}>Booking Confirmed!</h2>
      <p><strong>Date:</strong> {booking.date}</p>
      <p><strong>Time:</strong> {booking.time}</p>
      <p><strong>Service:</strong> {booking.service}</p>
    </div>
  );
}

export default Confirmation;
