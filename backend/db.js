const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',      // Vendos emrin e përdoruesit të PostgreSQL
  host: 'localhost',               // Ose adresa e serverit nëse është e ndryshme
  database: 'postgres',  // Vendos emrin e bazës së të dhënave
  password: 'postgres',          // Vendos fjalëkalimin e PostgreSQL
  port: 5432,                       // Porti default për PostgreSQL është 5432
});

module.exports = pool;
