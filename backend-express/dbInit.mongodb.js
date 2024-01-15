use("games-store-db");

db.createCollection('users');
db.createCollection('games');
db.createCollection('pending-orders');
db.createCollection('closed-orders');
db.createCollection('support-chat');
db.createCollection('returns');