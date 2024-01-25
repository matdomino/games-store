'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const { MongoClient, ObjectId } = require('mongodb');
const cookieParser = require('cookie-parser');
const tokenKey = require('./tokenKey');
const  { clearAllCookies, verifyAuth } = require('./rest-api/auth');
const { login } = require('./rest-api/login');
const { register } = require('./rest-api/register');
const { logout } = require('./rest-api/logout');
const { getUsers } = require('./rest-api/employee/getUsersList');
const { getUser } = require('./rest-api/employee/getUser');
const { banUser } = require('./rest-api/employee/banUser');
const { addGame } = require('./rest-api/employee/addGame');
const { getGames } = require('./rest-api/getGames');
const { searchGames } = require('./rest-api/searchGames');
const { getGameDetails } = require('./rest-api/getGameDetails');
const { addToCart } = require('./rest-api/addToCart');
const { deleteFromCart } = require('./rest-api/deleteFromCart');
const { checkOut } = require('./rest-api/checkOut');
const { clearNotifications } = require('./rest-api/clearNotifications');


const app = express();
const port = 3000;
app.use(cors({
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization'],
  origin: 'http://localhost:3001'
}));

app.use(bodyParser.json());
app.use(cookieParser());

const dbUrl = 'mongodb://localhost:27017/';
const dbName = 'games-store-db';

async function connect() {
  try {
    const client = new MongoClient(dbUrl);
    await client.connect();
    console.log('Pomyślnie połączono z bazą danych!');

    const db = client.db(dbName);
    const usersCollection = db.collection('users');
    const gamesCollection = db.collection('games');
    const supportChatCollection = db.collection('support-chat'); // zmienic na support i dodac closed support
    const returnsCollection = db.collection('returns'); // zmienic na pending i closed

    app.post('/login', async (req, res) => {
      await login(req, res, usersCollection, bcrypt, jwt, tokenKey);
    });

    app.post('/register', async (req, res) => {
      await register(req, res, usersCollection, bcrypt, jwt, tokenKey);
    });

    app.delete('/logout', async (req, res) => {
      await logout(req, res);
    })

    // --- EMPLOYEE ---

    app.get('/users', async (req, res) => {
      await getUsers(req, res, usersCollection);
    });

    app.get('/user/:id', async (req, res) => {
      await getUser(req, res, usersCollection, ObjectId);
    });

    app.delete('/banuser/:id', async (req, res) => {
      await banUser(req, res, usersCollection, ObjectId);
    });

    app.post('/addgame', async (req, res) => {
      await addGame(req, res, gamesCollection);
    });

    // --- USER ---

    app.get('/storegames', async (req, res) => {
      await getGames(req, res, gamesCollection);
    });

    app.get('/searchgames', async (req, res) => {
      await searchGames(req, res, gamesCollection);
    });

    app.get('/gamedetails', async(req, res) => {
      await getGameDetails(req, res, gamesCollection, ObjectId);
    });

    app.put('/addgametocart/:gameId', async (req, res) => {
      await addToCart(req, res, usersCollection, gamesCollection, ObjectId);
    });

    app.delete('/deletefromcart/:gameId', async (req, res) => {
      await deleteFromCart(req, res, usersCollection);
    });

    app.get('/checkout', async (req, res) => {
      await checkOut(req, res, usersCollection, gamesCollection, ObjectId);
    });

    app.delete('/clearnotifications', async (req, res) => {
      await clearNotifications(req, res, usersCollection);
    });

    app.listen(port, () => {
      console.log(`Serwer działa na porcie: ${port}`);
    });
  } catch (err) {
    console.error('Wystąpił błąd podczas łączenia z bazą.', err);
  }
}

connect();