'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { MongoClient, ObjectId } = require('mongodb');
const cookieParser = require('cookie-parser');

const  { clearAllCookies, verifyAuth } = require('./rest-api/auth');

const app = express();
const port = 3000;
app.use(cors({
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization']
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
    const pendingOrdersCollection = db.collection('pending-orders');
    const closedOrdersCollection = db.collection('closed-orders');
    const supportChatCollection = db.collection('support-chat');
    const returnsCollection = db.collection('returns');



    app.listen(port, () => {
      console.log(`Serwer działa na porcie: ${port}`);
    });
  } catch (err) {
    console.error('Wystąpił błąd podczas łączenia z bazą.', err);
  }
}

connect();