import React from 'react';

function Confirmation({ booking }) {
  if (!booking) {
    return <p style={{ textAlign: 'center', color: '#ff6666' }}>No booking data available.</p>;
  }

  const formatDate = (dateString) => new Date(dateString).toLocaleDateString();
  
  // Formato koha për të shfaqur në format 12-orësh
  const formatTime = (timeString) => new Date(`1970-01-01T${timeString}`).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });

  return (
    <div style={{ padding: '20px', border: '1px solid #ddd', borderRadius: '8px', backgroundColor: '#f8f8f8', maxWidth: '400px', margin: '0 auto', textAlign: 'center' }}>
      <h2 style={{ color: '#d67bb3' }}>Booking Confirmed!</h2>
      <p><strong>Date:</strong> {formatDate(booking.date)}</p>
      <p><strong>Time:</strong> {formatTime(booking.time)}</p>
      <p><strong>Service:</strong> {booking.service}</p>
      {booking.contact && <p><strong>Contact Number:</strong> {booking.contact}</p>}
    </div>
  );
}

export default Confirmation;
