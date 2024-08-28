const express = require('express');
const pool = require('./db'); 
const app = express();
const cors = require('cors');
const port = 3001;

app.use(cors());
app.use(express.json());

app.get('/api/bookings', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM bookings ORDER BY id ASC');
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

app.post('/api/book', async (req, res) => {
  const { date, time, service } = req.body;

  if (!date || !time || !service) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  try {
    const existingBooking = await pool.query(
      'SELECT * FROM bookings WHERE date = $1 AND time = $2',
      [date, time]
    );

    if (existingBooking.rows.length > 0) {
      return res.status(409).json({ error: 'This time slot is already booked' });
    }

    const newBooking = await pool.query(
      'INSERT INTO bookings (date, time, service) VALUES ($1, $2, $3) RETURNING *',
      [date, time, service]
    );

    res.status(201).json(newBooking.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

app.put('/api/book/:id', async (req, res) => {
  const { id } = req.params;
  const { date, time, service } = req.body;

  if (!date || !time || !service) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  try {
    const existingBooking = await pool.query(
      'SELECT * FROM bookings WHERE id = $1',
      [id]
    );

    if (existingBooking.rows.length === 0) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    const updatedBooking = await pool.query(
      'UPDATE bookings SET date = $1, time = $2, service = $3 WHERE id = $4 RETURNING *',
      [date, time, service, id]
    );

    res.status(200).json(updatedBooking.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

app.delete('/api/book/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      'DELETE FROM bookings WHERE id = $1 RETURNING *',
      [id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    res.status(204).send();
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
