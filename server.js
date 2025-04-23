const express = require('express');
const { spawnBot, stopBot, isBotRunning } = require('./bot');
const path = require('path');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.get('/', (req, res) => {
  res.render('index', { botRunning: isBotRunning() });
});

app.post('/connect', (req, res) => {
  const { ip, port, version } = req.body;
  if (!isBotRunning()) {
    spawnBot(ip, port, version);
  }
  res.redirect('/');
});

app.post('/disconnect', (req, res) => {
  stopBot();
  res.redirect('/');
});

app.listen(port, () => {
  console.log(`Sunucu http://localhost:${port} üzerinden çalışıyor`);
});
