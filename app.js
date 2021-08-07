const express = require('express');
const cors = require('cors');

const { SERVER_PORT, inTestEnv } = require('./env');

const connection = require('./db-config');

const app = express();
app.use(cors());

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

//Hard data

const newCountries = [
  {
    name: 'Montreal',
    background_image:
      'https://images.unsplash.com/photo-1594825505684-5a5a5b18b544?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=2175&q=80',
    description:
      "Montréal est la principale ville du Québec. Grande métropole insulaire et portuaire du fleuve Saint-Laurent au pied des rapides de Lachine, c'est la deuxième ville la plus peuplée du Canada, après Toronto et la plus grande ville francophone d'Amérique.",
    flight: 'unknown',
  },
  {
    name: 'Antarctica',
    background_image:
      'https://images.unsplash.com/photo-1603548746365-0c7a1583d826?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=728&q=80',
    description:
      "Antarctica is Earth's southernmost continent. It contains the geographic South Pole and is situated in the Antarctic region of the Southern Hemisphere, almost entirely south of the Antarctic Circle, and is surrounded by the Southern Ocean.",
    flight: 'good luck!',
  },
];

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
  const { name, background_image, year, description, lat, lng } = req.body;
  connection.query(
    'INSERT INTO destination(name, background_image, year, description, lat, lng) VALUES (?, ?, ?, ?, ?, ?)',
    [name, background_image, year, description, lat, lng],
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
  const { name, background_image, description, flight, lat, lng } = req.body;
  connection.query(
    'INSERT INTO countrywishlist(name, background_image, description, flight, lat, lng) VALUES (?, ?, ?, ?, ?, ?)',
    [name, background_image, description, flight, lat, lng],
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

app.listen(SERVER_PORT, (err) => {
  if (!inTestEnv) {
    console.log(`🚀 Server running on http://localhost:${SERVER_PORT}`);
  }
});

// process setup : improves error reporting
process.on('unhandledRejection', (error) => {
  console.error('unhandledRejection', JSON.stringify(error), error.stack);
  process.exit(1);
});
process.on('uncaughtException', (error) => {
  console.error('uncaughtException', JSON.stringify(error), error.stack);
  process.exit(1);
});
process.on('beforeExit', () => {
  app.close((error) => {
    if (error) console.error(JSON.stringify(error), error.stack);
  });
});
