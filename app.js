const express = require('express');

const connection = require('./db-config');

const app = express();
const PORT = process.env.PORT || 5000;

connection.connect((err) => {
  if (err) {
    console.error('whomp whomp error connecting');
  } else {
    console.log('connected to database 🥳, happy browsing 🌎');
  }
});

app.use(express.json());

app.get('/visitedlocations', (req, res) => {
  connection.query('SELECT * FROM destination', (err, result) => {
    if (err) {
      res.status(500).send('Error retrieving data from database');
    } else {
      res.status(200).json(result);
    }
  });
});

app.get('/bucketlist', (req, res) => {
  connection.query('SELECT * FROM countrywishlist', (err, result) => {
    if (err) {
      res.status(500).send('Error retrieving data from database');
    } else {
      res.status(200).json(result);
    }
  });
});

// POST ROUTES
app.post('/visitedlocations', (req, res) => {
  const { name, background_image, year, description } = req.body;
  connection.query(
    'INSERT INTO destination(name, background_image, year, description) VALUES (?, ?, ?, ?)',
    [name, background_image, year, description],
    (err, result) => {
      if (err) {
        res.status(500).send('Error saving data');
      } else {
        res.status(201).send('Your trip was successfully logged 🛬');
      }
    }
  );
});

app.post('/bucketlist', (req, res) => {
  const { name, background_image, description, flight } = req.body;
  connection.query(
    'INSERT INTO countrywishlist(name, background_image, description, flight) VALUES (?, ?, ?, ?)',
    [name, background_image, description, flight],
    (err, result) => {
      if (err) {
        res.status(500).send('Error saving data');
      } else {
        res.status(201).send('Your wishlist was updated, take flight soon 🛫');
      }
    }
  );
});

// DELETE ROUTES

app.delete('/visitedlocations/:id', (req, res) => {
  const tripId = req.params.id;
  connection.query(
    'DELETE FROM destination WHERE id = ?',
    [tripId],
    (err, results) => {
      if (err) {
        console.log(err);
        res.status(500).send('This location stayed right where it sould be');
      } else {
        res
          .status(200)
          .send(
            'Did you travel back in time ? Location list was successfully updated 🌈 '
          );
      }
    }
  );
});

app.delete('/bucketlist/:id', (req, res) => {
  const tripId = req.params.id;
  connection.query(
    'DELETE FROM countrywishlist WHERE id = ?',
    [tripId],
    (err, results) => {
      if (err) {
        console.log(err);
        res.status(500).send('Covid stopped you from traveling...');
      } else {
        res.status(200).send('Looks like your travel wish came true ❤️🗺');
      }
    }
  );
});

app.listen(PORT, (err) => {
  if (err) console.error(err);
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});

module.exports = app;
