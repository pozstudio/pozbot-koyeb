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
  admin1: { password: 'admin1', botName: 'PozBot_1' },
  admin2: { password: 'admin2', botName: 'PozBot_2' }
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
    botName: USERS[req.session.user].botName,
    botRunning: botRunning && myTurn,
    blocked: botRunning && !myTurn,
    error
  });
});

app.post('/connect', (req, res) => {
  if (!req.session.user) return res.redirect('/login');
  const { ip, port, version } = req.body;
  const botName = USERS[req.session.user].botName;
  spawnBot(ip, port, version, botName, req.session.user);
  setTimeout(() => res.redirect('/panel'), 1000);
});

app.post('/disconnect', (req, res) => {
  if (!req.session.user) return res.redirect('/login');
  stopBot(req.session.user);
  res.redirect('/panel');
});

app.listen(port, () => {
  console.log(`PozBot çalışıyor: http://localhost:${port}`);
});
