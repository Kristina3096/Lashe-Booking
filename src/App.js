import React, { useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import BookingForm from './components/BookingForm';
import Confirmation from './components/Confirmation';
import Schedule from './components/Schedule';
import './css/App.css';

// Krijimi i QueryClient
const queryClient = new QueryClient();

function App() {
  const [booking, setBooking] = useState(null);

  return (
    <QueryClientProvider client={queryClient}>
      <div className="App">
        <nav className="Navbar">
          <img src="/logoeye.png" alt="Lash Store Logo" className="Navbar-logo" />
          <h1 className="Navbar-text">Welcome to Perfect Your Eyelash</h1>
        </nav>
        <div className="App-background"></div>
        <div className="App-content">
          {!booking ? (
            <>
              <Schedule />
              <BookingForm onConfirm={setBooking} />
            </>
          ) : (
            <Confirmation booking={booking} />
          )}
        </div>
      </div>
    </QueryClientProvider>
  );
}

export default App;
