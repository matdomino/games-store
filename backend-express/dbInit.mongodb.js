use("games-store-db");

db.createCollection('users');
db.createCollection('games');
db.createCollection('pending-support');
db.createCollection('closed-support');
db.createCollection('pending-returns');
db.createCollection('closed-returns');
db.createCollection('transactions-history');

db.users.insertOne({
  email: "admin@wp.pl",
  username: "admin",
  password: "$2b$10$yKRECITBmeIlEApIOIWmkumJ6xMEng9r8fIAAzPIjSo/hV/CgEXmq",
  role: 'employee',
  walletBalance: 0,
  address: {
    city: "Gdańsk",
    street: "Grunwaldzka",
    home: "20B",
    flat: 5,
    postCode: "80-000"
  },
  games: [],
  favouriteGames: [],
  transactions: [],
  support: [],
  notifications: [],
  shoppingCart: []
});