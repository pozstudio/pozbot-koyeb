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

app.get('/', (req, res) => res.redirect('/login'));

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

app.post('/connect', (req, res) => {
  if (!req.session.user) return res.redirect('/login');
  const { ip, port, version } = req.body;
  const botID = Math.floor(Math.random() * 5000) + 1;
  req.session.botID = botID;
  const botName = `PozBot_${botID}`;
  spawnBot(ip, port, version, botName, req.session.user);
  res.redirect('/loading');
});

app.get('/loading', (req, res) => {
  if (!req.session.user || !req.session.botID) return res.redirect('/login');
  res.render('loading');
});

app.post('/disconnect', (req, res) => {
  if (!req.session.user) return res.redirect('/login');
  stopBot(req.session.user);
  res.redirect('/panel');
});

app.listen(port, () => {
  console.log(`PozBot çalışıyor: http://localhost:${port}`);
});
