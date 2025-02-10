import React, { useReducer, createContext, useContext, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

const BookingContext = createContext();

const bookingReducer = (state, action) => {
  switch (action.type) {
    case 'SET_SELECTED_BOOKING':
      return { ...state, selectedBooking: action.payload };
    case 'TOGGLE_DELETE_MODAL':
      return { ...state, showDeleteModal: !state.showDeleteModal };
    case 'TOGGLE_EDIT_MODAL':
      return { ...state, showEditModal: !state.showEditModal };
    default:
      return state;
  }
};

const initialState = {
  selectedBooking: null,
  showDeleteModal: false,
  showEditModal: false,
};

function Schedule() {
  const [state, dispatch] = useReducer(bookingReducer, initialState);
  const [editData, setEditData] = useState({ date: '', time: '', service: '' });
  const queryClient = useQueryClient();
 
  const { data: bookings = [], isLoading, error } = useQuery({
    queryKey: ['bookings'],
    queryFn: async () => {
      const response = await fetch('http://localhost:3001/api/bookings');
      if (!response.ok) {
        throw new Error('Error fetching bookings');
      }
      return response.json();
    }
  });

  const deleteBookingMutation = useMutation({
    mutationFn: (id) => fetch(`http://localhost:3001/api/book/${id}`, { method: 'DELETE' }),
    onSuccess: () => {
      queryClient.invalidateQueries(['bookings']);
      dispatch({ type: 'TOGGLE_DELETE_MODAL' }); 
    },
    onError: (error) => {
      console.error('Error deleting booking:', error);
    }
  });

  const updateBookingMutation = useMutation({
    mutationFn: ({ id, data }) =>
      fetch(`http://localhost:3001/api/book/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries(['bookings']);
      dispatch({ type: 'TOGGLE_EDIT_MODAL' }); 
    },
    onError: (error) => {
      console.error('Error updating booking:', error);
    }
  });

  const formatDate = (dateString) => new Date(dateString).toLocaleDateString();
  const formatTime = (timeString) => new Date(`1970-01-01T${timeString}`).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  if (isLoading) return <p>Loading bookings...</p>;
  if (error) return <p>Error fetching bookings: {error.message}</p>;

  return (
    <BookingContext.Provider value={{ state, dispatch }}>
      <div>
        <h2 style={{ color: 'black', fontWeight: 'bold' }}>Available Slots</h2>
        {bookings.length > 0 ? (
          bookings.map((booking) => (
            <div key={booking.id}>
              <p>{formatDate(booking.date)} - {formatTime(booking.time)} - {booking.service}</p>
              <button
                onClick={() => {
                  dispatch({ type: 'SET_SELECTED_BOOKING', payload: booking });
                  dispatch({ type: 'TOGGLE_DELETE_MODAL' });
                }}
              >
                Delete
              </button>
              <button
                onClick={() => {
                  dispatch({ type: 'SET_SELECTED_BOOKING', payload: booking });
                  setEditData({ date: booking.date, time: booking.time, service: booking.service });
                  dispatch({ type: 'TOGGLE_EDIT_MODAL' });
                }}
              >
                Edit
              </button>
            </div>
          ))
        ) : (
          <p>No bookings available</p>
        )}

        {state.showDeleteModal && (
          <div>
            <p>Are you sure you want to delete this booking?</p>
            <button onClick={() => deleteBookingMutation.mutate(state.selectedBooking.id)}>Yes</button>
            <button onClick={() => dispatch({ type: 'TOGGLE_DELETE_MODAL' })}>No</button>
          </div>
        )}

        {state.showEditModal && (
          <div>
            <p>Edit Booking</p>
            <input
              type="date"
              value={editData.date}
              onChange={(e) => setEditData({ ...editData, date: e.target.value })}
            />
            <input
              type="time"
              value={editData.time}
              onChange={(e) => setEditData({ ...editData, time: e.target.value })}
            />
            <select
              value={editData.service}
              onChange={(e) => setEditData({ ...editData, service: e.target.value })}
            >
              <option value="Eyelash Extension">Eyelash Extension</option>
              <option value="Eyelash Removal">Eyelash Removal</option>
              <option value="Lash Lifting">Lash Lifting</option>
              <option value="Brow Lamination">Brow Lamination</option>
            </select>
            <button
              onClick={() => updateBookingMutation.mutate({ id: state.selectedBooking.id, data: editData })}
            >
              Save
            </button>
            <button onClick={() => dispatch({ type: 'TOGGLE_EDIT_MODAL' })}>Cancel</button>
          </div>
        )}
      </div>
    </BookingContext.Provider>
  );
}

export default Schedule;
