const express = require('express');
const session = require('express-session');
const path = require('path');
const { spawnBot, stopBot, isBotRunning, getLastError, getCurrentOwner } = require('./bot');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(session({
  secret: 'pozbotsecret',
  resave: false,
  saveUninitialized: true
}));

const USERS = {
  admin1: { password: 'admin1' },
  admin2: { password: 'admin2' }
};

// Anasayfa
app.get('/', (req, res) => res.redirect('/login'));

// Giriş
app.get('/login', (req, res) => {
  res.render('login', { error: null });
});

app.post('/login', (req, res) => {
  const { username, password } = req.body;
  if (USERS[username] && USERS[username].password === password) {
    req.session.user = username;
    res.redirect('/panel');
  } else {
    res.render('login', { error: 'Kullanıcı adı veya şifre yanlış!' });
  }
});

// Panel
app.get('/panel', (req, res) => {
  if (!req.session.user) return res.redirect('/login');
  const error = getLastError();
  const botRunning = isBotRunning();
  const myTurn = getCurrentOwner() === req.session.user;

  res.render('panel', {
    username: req.session.user,
    botID: req.session.botID,
    botRunning: botRunning && myTurn,
    blocked: botRunning && !myTurn,
    error
  });
});

// Bot başlat
app.post('/connect', (req, res) => {
  if (!req.session.user) return res.redirect('/login');
  const { ip, port, version } = req.body;
  const botID = Math.floor(Math.random() * 5000) + 1;
  req.session.botID = botID;
  spawnBot(ip, port, version, 'PozBot_Original', req.session.user);
  res.redirect('/panel');
});

// Botu durdur
app.post('/disconnect', (req, res) => {
  if (!req.session.user) return res.redirect('/login');
  stopBot(req.session.user);
  res.redirect('/panel');
});

// Sunucu başlat
app.listen(port, () => {
  console.log(`PozBot çalışıyor: http://localhost:${port}`);
});
