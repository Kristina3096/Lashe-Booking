import React, { useEffect, useState } from 'react';

function Schedule() {
  const [bookings, setBookings] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [editData, setEditData] = useState({ date: '', time: '', service: '' });

  useEffect(() => {
    fetch('http://localhost:3001/api/bookings')
      .then((response) => response.json())
      .then((data) => setBookings(data));
  }, []);

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const formatTime = (timeString) => {
    const date = new Date(`1970-01-01T${timeString}`);
    return date.toLocaleTimeString(undefined, {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });
  };

  const deleteBooking = async (id) => {
    try {
      const response = await fetch(`http://localhost:3001/api/book/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setBookings(bookings.filter((booking) => booking.id !== id));
        setShowDeleteModal(false);
      } else {
        console.error('Failed to delete the booking');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleEditSubmit = async () => {
    const { id } = selectedBooking;

    try {
      const response = await fetch(`http://localhost:3001/api/book/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editData),
      });

      if (response.ok) {
        const updated = await response.json();
        setBookings(
          bookings.map((booking) => (booking.id === id ? updated : booking))
        );
        setShowEditModal(false);
      } else {
        console.error('Failed to update the booking');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const containerStyle = {
    border: '2px solid #FFC9FD',
    padding: '10px',
    borderRadius: '5px',
    backgroundColor: ' rgba(255, 255, 255, 0.6)',
  };

  const textStyle = {
    color: '#d67bb3',
    fontWeight: 'bold',
  };

  const buttonStyle = {
    marginLeft: '10px',
    color: '#FFFFFF',
    backgroundColor: '#FF6B6B', // Delete button color
    border: 'none',
    padding: '5px 10px',
    borderRadius: '3px',
    cursor: 'pointer',
  };

  const editButtonStyle = {
    marginLeft: '10px',
    color: '#FFFFFF',
    backgroundColor: '#8EC6C5', // Edit button color
    border: 'none',
    padding: '5px 10px',
    borderRadius: '3px',
    cursor: 'pointer',
  };

  return (
    <div>
      <h2 style={{ color: '#d67bb3' }}>Available Slots</h2>
      {bookings.length > 0 ? (
        <div style={containerStyle}>
          {bookings.map((booking) => (
            <div key={booking.id} style={textStyle}>
              <p>
                {formatDate(booking.date)} - {formatTime(booking.time)} - {booking.service}
              </p>
              <button
                style={buttonStyle}
                onClick={() => {
                  setSelectedBooking(booking);
                  setShowDeleteModal(true);
                }}
              >
                Delete
              </button>
              <button
                style={editButtonStyle}
                onClick={() => {
                  setSelectedBooking(booking);
                  setEditData({
                    date: booking.date,
                    time: booking.time,
                    service: booking.service,
                  });
                  setShowEditModal(true);
                }}
              >
                Edit
              </button>
            </div>
          ))}
        </div>
      ) : (
        <p style={textStyle}>No bookings available</p>
      )}

      {showDeleteModal && (
        <div className="modal">
          <div className="modal-content">
            <p>Are you sure you want to delete this booking?</p>
            <button
              style={buttonStyle}
              onClick={() => deleteBooking(selectedBooking.id)}
            >
              Yes
            </button>
            <button
              style={editButtonStyle}
              onClick={() => setShowDeleteModal(false)}
            >
              No
            </button>
          </div>
        </div>
      )}

      {showEditModal && (
        <div className="modal">
          <div className="modal-content">
            <p>Edit Booking</p>
            <input
              type="date"
              value={editData.date}
              onChange={(e) =>
                setEditData({ ...editData, date: e.target.value })
              }
            />
            <input
              type="time"
              value={editData.time}
              onChange={(e) =>
                setEditData({ ...editData, time: e.target.value })
              }
            />
            <select
              value={editData.service}
              onChange={(e) =>
                setEditData({ ...editData, service: e.target.value })
              }
            >
              <option value="Eyelash Extension">Eyelash Extension</option>
              <option value="Eyelash Removal">Eyelash Removal</option>
              <option value="Lash Lifting">Lash Lifting</option>
              <option value="Brow Lamination">Brow Lamination</option>
            </select>
            <button style={editButtonStyle} onClick={handleEditSubmit}>
              Save
            </button>
            <button
              style={buttonStyle}
              onClick={() => setShowEditModal(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Schedule;
