const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const { MongoClient, ObjectId } = require('mongodb');
const cookieParser = require('cookie-parser');
const multer = require('multer');
const tokenKey = require('./tokenKey');
const { login } = require('./rest-api/login');
const { register } = require('./rest-api/register');
const { logout } = require('./rest-api/logout');
const { getUsers } = require('./rest-api/employee/getUsersList');
const { getUser } = require('./rest-api/employee/getUser');
const { banUser } = require('./rest-api/employee/banUser');
const { addGame } = require('./rest-api/employee/addGame');
const { getSupportList } = require('./rest-api/employee/getSupportList');
const { respondToSupport } = require('./rest-api/employee/respondToSupport');
const { getRefundsList } = require('./rest-api/employee/getRefundsList');
const { respondToRefund } = require('./rest-api/employee/respondToRefund');
const { getFullTransactionHistory } = require('./rest-api/employee/getFullTransactionHistory');
const { getGames } = require('./rest-api/getGames');
const { searchGames } = require('./rest-api/searchGames');
const { getGameDetails } = require('./rest-api/getGameDetails');
const { addToCart } = require('./rest-api/addToCart');
const { deleteFromCart } = require('./rest-api/deleteFromCart');
const { checkOut } = require('./rest-api/checkOut');
const { clearNotifications } = require('./rest-api/clearNotifications');
const { getNotifications } = require('./rest-api/getNotifications');
const { getUserData } = require('./rest-api/getUserData');
const { getWalletBalance } = require('./rest-api/getWalletBalance');
const { changeUsername } = require('./rest-api/changeUsername');
const { changePassword } = require('./rest-api/changePassword');
const { changeAdress } = require('./rest-api/changeAdress');
const { changeEmail } = require('./rest-api/changeEmail');
const { deleteAccount } = require('./rest-api/deleteAccount');
const { addBalance } = require('./rest-api/addBalance');
const { finalizeOrder } = require('./rest-api/finalizeOrder');
const { getOwnedGames } = require('./rest-api/getOwnedGames');
const { addToFavourites } = require('./rest-api/addToFavourites');
const { reviewGame } = require('./rest-api/reviewGame');
const { returnGame } = require('./rest-api/returnGame');
const { sendSupportMsg } = require('./rest-api/sendSupportMsg');
const { getHistory } = require('./rest-api/getHistory');
const { getHistoryDetails } = require('./rest-api/getHistoryDetails');
const { getSupportMsgs } = require('./rest-api/getSupportMsgs');
const { getRefunds } = require('./rest-api/getRefunds');


const app = express();
const port = 3000;
app.use(cors({
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization'],
  origin: 'http://localhost:8080'
}));

app.use(bodyParser.json());
app.use(cookieParser());

const dbUrl = 'mongodb://mongo-db:27017/';
const dbName = 'games-store-db';

async function connect() {
  try {
    const client = new MongoClient(dbUrl);
    const upload = multer();
    await client.connect();
    console.log('Pomyślnie połączono z bazą danych!');

    const db = client.db(dbName);
    const usersCollection = db.collection('users');
    const gamesCollection = db.collection('games');
    const pendingSupportCollection = db.collection('pending-support');
    const closedSupportCollection = db.collection('closed-support');
    const pendingReturnsCollection = db.collection('pending-returns');
    const closedReturnsCollection = db.collection('closed-returns');
    const transactionsCollection = db.collection('transactions-history');

    app.post('/login', async (req, res) => {
      await login(req, res, usersCollection, bcrypt, jwt, tokenKey);
    });

    app.post('/register', async (req, res) => {
      await register(req, res, usersCollection, bcrypt, jwt, tokenKey);
    });

    app.delete('/logout', async (req, res) => {
      await logout(req, res);
    });

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

    app.post('/addgame', upload.single('file'), async (req, res) => {
      await addGame(req, res, gamesCollection);
    });

    app.get('/getsupportlist', async (req, res) => {
      await getSupportList(req, res, pendingSupportCollection);
    });

    app.post('/respondtosupportmsg', async (req, res) => {
      await respondToSupport(req, res, pendingSupportCollection, closedSupportCollection, usersCollection, ObjectId);
    });

    app.get('/getrefundslist', async (req, res) => {
      await getRefundsList(req, res, pendingReturnsCollection);
    });

    app.post('/respondtorefund', async (req, res) => {
      await respondToRefund(req, res, pendingReturnsCollection, closedReturnsCollection, transactionsCollection, usersCollection, gamesCollection, ObjectId);
    });

    app.get('/transactionhistory', async (req, res) => {
      await getFullTransactionHistory(req, res, transactionsCollection);
    });

    // --- USER ---

    app.post('/storegames', async (req, res) => {
      await getGames(req, res, gamesCollection);
    });

    app.post('/searchgames', async (req, res) => {
      await searchGames(req, res, gamesCollection);
    });

    app.get('/gamedetails/:gameId', async(req, res) => {
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

    app.get('/notifications', async (req, res) => {
      await getNotifications(req, res, usersCollection);
    });

    app.get('/getuserdata', async (req, res) => {
      getUserData(req, res, usersCollection)
        .then(result => res.json(result))
        .catch(error => res.status(error.status).json({ error: error.error }));
    });

    app.get('/walletbalance', async (req, res) => {
      getWalletBalance(req, res, usersCollection)
        .then(result => res.json(result))
        .catch(error => res.status(error.status).json({ error: error.error }));
    });

    app.put('/changeusername', async (req, res) => {
      changeUsername(req, res, usersCollection, bcrypt)
        .then(result => res.json(result))
        .catch(error => res.status(error.status).json({ error: error.error }));
    });

    app.put('/changepassword', async (req, res) => {
      changePassword(req, res, usersCollection, bcrypt)
        .then(result => res.json(result))
        .catch(error => res.status(error.status).json({ error: error.error }));
    });

    app.put('/changeaddress', async (req, res) => {
      changeAdress(req, res, usersCollection)
        .then(result => res.json(result))
        .catch(error => res.status(error.status).json({ error: error.error }));
    });

    app.put('/changeemail', async (req, res) => {
      changeEmail(req, res, usersCollection, bcrypt)
        .then(result => res.json(result))
        .catch(error => res.status(error.status).json({ error: error.error }));
    });

    app.delete('/deleteaccount', async (req, res) => {
      deleteAccount(req, res, usersCollection, bcrypt)
        .then(result => res.json(result))
        .catch(error => res.status(error.status).json({ error: error.error }));
    });

    app.put('/addbalance', async (req, res) => {
      addBalance(req, res, usersCollection, transactionsCollection)
        .then(result => res.json(result))
        .catch(error => res.status(error.status).json({ error: error.error }));
    });

    app.post('/finalizeorder', async (req, res) => {
      finalizeOrder(req, res, usersCollection, transactionsCollection, gamesCollection, ObjectId)
        .then(result => res.json(result))
        .catch(error => res.status(error.status).json({ error: error.error }));
    });

    app.get('/getownedgames', async (req, res) => {
      getOwnedGames(req, res, usersCollection)
        .then(result => res.json(result))
        .catch(error => res.status(error.status).json({ error: error.error }));
    });

    app.post('/addtofavourites', async (req, res) => {
      addToFavourites(req, res, usersCollection, ObjectId)
        .then(result => res.json(result))
        .catch(error => res.status(error.status).json({ error: error.error }));
    });

    app.post('/reviewgame', async (req, res) => {
      reviewGame(req, res, usersCollection, gamesCollection, ObjectId)
        .then(result => res.json(result))
        .catch(error => res.status(error.status).json({ error: error.error }));
    });

    app.post('/returngame', async (req, res) => {
      returnGame(req, res, usersCollection, pendingReturnsCollection)
        .then(result => res.json(result))
        .catch(error => res.status(error.status).json({ error: error.error }));
    });

    app.post('/sendsupportmsg', async (req, res) => {
      sendSupportMsg(req, res, usersCollection, pendingSupportCollection)
        .then(result => res.json(result))
        .catch(error => res.status(error.status).json({ error: error.error }));
    });

    app.get('/gettransactionshistory', async (req, res) => {
      getHistory(req, res, usersCollection)
        .then(result => res.json(result))
        .catch(error => res.status(error.status).json({ error: error.error }));
    });

    app.get('/gettransactiondetails/:transId', async (req, res) => {
      getHistoryDetails(req, res, usersCollection, transactionsCollection, ObjectId)
        .then(result => res.json(result))
        .catch(error => res.status(error.status).json({ error: error.error }));
    });

    app.get('/getsupportmsgs/', async (req, res) => {
      getSupportMsgs(req, res, usersCollection, pendingSupportCollection, closedSupportCollection, ObjectId)
        .then(result => res.json(result))
        .catch(error => res.status(error.status).json({ error: error.error }));
    });

    app.get('/getrefunds/', async (req, res) => {
      getRefunds(req, res, usersCollection, pendingReturnsCollection, closedReturnsCollection, ObjectId)
        .then(result => res.json(result))
        .catch(error => res.status(error.status).json({ error: error.error }));
    });

    app.listen(port, () => {
      console.log(`Serwer działa na porcie: ${port}`);
    });
  } catch (err) {
    console.error('Wystąpił błąd podczas łączenia z bazą.', err);
  }
}

connect();