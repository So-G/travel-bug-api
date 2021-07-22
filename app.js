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

connection.query('SELECT * FROM destination', (err, results) => {
  // Do something when mysql is done executing the query
  console.log(err, results);
});

// app.use(express.json());

app.get('/visitedlocations', (req, res) => {
  connection.query('SELECT * FROM destination', (err, result) => {
    if (err) {
      res.status(500).send('Error retrieving data from database');
    } else {
      res.status(200).json(result);
    }
  });
});

// POST ROUTES
// app.post('/newcountry', (req, res) => {
//   res.send('Post route is working 🎉');
// });

app.listen(PORT, (err) => {
  if (err) console.error(err);
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});

module.exports = app;
