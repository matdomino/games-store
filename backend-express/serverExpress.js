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
const { getUsers } = require('./rest-api/getUsersList');
const { getUser } = require('./rest-api/getUser');
const { banUser } = require('./rest-api/banUser');

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

    app.get('/users', async (req, res) => {
      await getUsers(req, res, usersCollection);
    });

    app.get('/user/:id', async (req, res) => {
      await getUser(req, res, usersCollection, ObjectId);
    });

    app.delete('/banuser/:id', async (req, res) => {
      await banUser(req, res, usersCollection, ObjectId);
    });

    app.listen(port, () => {
      console.log(`Serwer działa na porcie: ${port}`);
    });
  } catch (err) {
    console.error('Wystąpił błąd podczas łączenia z bazą.', err);
  }
}

connect();