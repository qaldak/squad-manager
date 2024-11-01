# Squad Manager

## Administration
- Teammitglieder verwalten
  - Daten
    - Name
    - Vorname

- Trainings verwalten
  - Datum
  - Teilnehmer

- Spiele verwalten
  - Datum
  - Teilnehmer
  - Manuell 
  - Begründung

- Sperren verwalten
  - Datum
  - Teilnehmer
  - Begründung


## Auswertungen
- Teilnehmer + Trainingsteilnahme
- Teilnehmer + Spielteilname
- Teilnehmer + Sperre




----
team-management/
├── app.js
├── package.json
├── config/
│   └── database.js
├── controllers/
│   └── playerController.js
│   └── trainingController.js
│   └── matchController.js
├── models/
│   └── player.js
│   └── training.js
│   └── match.js
├── routes/
│   └── playerRoutes.js
│   └── trainingRoutes.js
│   └── matchRoutes.js
├── views/
│   └── index.ejs
│   └── players.ejs
│   └── trainings.ejs
│   └── matches.ejs
└── public/
    └── css/
    └── js/



Datenbankkonfigruation
config/database.js
const { Pool } = require('pg');

const pool = new Pool({
  user: 'yourusername',
  host: 'localhost',
  database: 'team_management',
  password: 'yourpassword',
  port: 5432,
});

pool.connect((err, client, release) => {
  if (err) {
    return console.error('Error acquiring client', err.stack);
  }
  console.log('Connected to the database');
});

module.exports = pool;



Models:
Mongoose Modelle in models/
// models/player.js
const mongoose = require('mongoose');

const playerSchema = new mongoose.Schema({
  firstName: String,
  lastName: String
});

module.exports = mongoose.model('Player', playerSchema);


Controllers:
controllers/
// controllers/playerController.js
const Player = require('../models/player');

exports.createPlayer = (req, res) => {
  const player = new Player(req.body);
  player.save((err) => {
    if (err) return res.status(500).send(err);
    res.redirect('/players');
  });
};


Routen
routes/
// routes/playerRoutes.js
const express = require('express');
const router = express.Router();
const playerController = require('../controllers/playerController');

router.post('/players', playerController.createPlayer);

module.exports = router;


app.js
const express = require('express');
const bodyParser = require('body-parser');
const db = require('./config/database');
const playerRoutes = require('./routes/playerRoutes');

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');

app.use('/', playerRoutes);

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});


views/
<!-- views/index.ejs -->
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Team Management</title>
</head>
<body>
  <h1>Welcome to Team Management</h1>
  <a href="/players">Manage Players</a>
</body>
</html>
