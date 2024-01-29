const { verifyAuth } = require('../auth');

const respondToRefund = async (req, res, pendingReturnsCollection, closedReturnsCollection, transactionsCollection, usersCollection, gamesCollection, ObjectId) => {
  try {
    const isValidLogin = await verifyAuth(req, res);
    const { pendingId, response, accepted } = req.body;

    if (isValidLogin === true) {
      const role = req.cookies.roleType;

      if (!response) {
        return res.status(400).json({ error: "Brak wiadomosci." });
      }

      if (typeof(accepted) !== 'boolean') {
        return res.status(400).json({ error: "Brak zatwierdzenia." });
      }

      if (role === "employee") {
        const msg = await pendingReturnsCollection.findOne({ _id: new ObjectId(pendingId) });

        if (msg) {
          const newObj = {
            _id: msg._id,
            user: msg.user,
            topic: msg.topic,
            game: msg.game,
            comment: msg.comment,
            transaction: msg.transaction,
            date: msg.date,
            accepted: accepted,
            response: response
          };

          await closedReturnsCollection.insertOne(newObj);
          await pendingReturnsCollection.deleteOne({ _id: new ObjectId(pendingId) });
          const userData = await usersCollection.findOne({ _id: new ObjectId(msg.user) });

          if (!userData) {
            return res.status(404).json({ error: "Brak użytkownika w bazie" });
          }

          await usersCollection.updateOne({ _id: new ObjectId(msg.user) }, { $push: { notifications: `Otrzymałeś/aś odpowiedź na zwrot: ${msg.topic}` } });

          if (accepted === false) {
            return res.json({ status: "success" });
          }

          const game = await gamesCollection.findOne({ _id: new ObjectId(msg.game) });

          const newBalance = Number((userData.walletBalance + game.price).toFixed(2));

          const transaction = {
            type: `${msg.game} return`,
            date: new Date(),
            returned: msg.topic,
            total: game.price,
            oldBalance: userData.walletBalance,
            newBalance: newBalance,
            billingInfo: userData.address
          };

          const addTransaction = await transactionsCollection.insertOne(transaction);

          await usersCollection.updateOne({ _id: userData._id }, { $set: { walletBalance: newBalance }, $push: { transactions: addTransaction.insertedId }, $pull: { games: { id: new ObjectId(msg.game) }, favouriteGames: { id: new ObjectId(msg.game) } }
        });

          res.json({ status: "success" });

        } else {
          res.status(400).json({ error: "Nie znaleziono żądanego zwrotu" });
        }
      } else {
        res.status(401).json({ error: "Nie masz wymaganych uprawnień" });
      }
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Wystąpił błąd serwera." });
  }
};

module.exports = { respondToRefund };