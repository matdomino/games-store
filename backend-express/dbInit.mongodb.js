use("games-store-db");

db.createCollection('users');
db.createCollection('games');
db.createCollection('pending-orders');
db.createCollection('closed-orders');
db.createCollection('support-chat');
db.createCollection('returns');

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
  support: [],
  notifications: []
});