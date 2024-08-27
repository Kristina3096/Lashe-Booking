import React, { useState, useEffect } from 'react';
import BookingForm from './components/BookingForm';
import Confirmation from './components/Confirmation';
import Schedule from './components/Schedule';
import './css/App.css';

function App() {
  const [booking, setBooking] = useState(null);

  useEffect(() => {
    const imagesContainer = document.querySelector('.background-images');
    const imageCount = document.querySelectorAll('.background-images img').length;
    let currentIndex = 0;

    function showNextImage() {
      currentIndex = (currentIndex + 1) % imageCount;
      const offset = -currentIndex * (100 / imageCount);
      imagesContainer.style.transform = `translateX(${offset}%)`;
    }

    const interval = setInterval(showNextImage, 5000); // Ndryshimi çdo 5 sekonda

    return () => clearInterval(interval); // Pastroni intervalin kur komponenti largohet
  }, []);

  return (
    <div className="App">
      <nav className="Navbar">
        <img src="/logoeye.png" alt="Lash Store Logo" className="Navbar-logo" />
        <h1 className="Navbar-text">Welcome to Perfect Your Eyelash</h1>
      </nav>
      <div className="background-carousel">
        <div className="background-images">
          <img src="/images/Image1.jpeg" alt="Background Image 1" />
          <img src="/images/Image2.jpeg" alt="Background Image 2" />
          <img src="/images/Image3.jpeg" alt="Background Image 3" />
          
          
          
    
          {/* Shtoni më shumë imazhe si të nevojshme */}
        </div>
      </div>
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
  );
}

export default App;
