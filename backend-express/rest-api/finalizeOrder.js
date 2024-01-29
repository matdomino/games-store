const { verifyAuth } = require('./auth');

const finalizeOrder = async (req, res, usersCollection, transactionsCollection, gamesCollection, ObjectId) => {
  return new Promise(async (resolve, reject) => {
    try {
      const isValidLogin = await verifyAuth(req, res);


      if (isValidLogin === true) {
        const user = req.cookies.username;

        const userData = await usersCollection.findOne({ "username": user });

        const shoppingCartIds = userData.shoppingCart;
        const shoppingCart = await Promise.all(shoppingCartIds.map(async (elem) => {
          const elemData = await gamesCollection.findOne({ _id: new ObjectId(elem) }, { projection: { _id: 1, name: 1, price: 1 } });
        return elemData;
        }));

        if (shoppingCart.length === 0) {
          reject({ status: 400, error: "Pusty koszyk." });
          return;
        }

        const total = shoppingCart.reduce((acc, elem) => acc + elem.price, 0);
        const roundedTotal = Number(total.toFixed(2));

        if (userData.walletBalance >= total) {
          const newBalance = Number((userData.walletBalance - roundedTotal).toFixed(2));

          const transaction = {
            type: "Order finalization",
            date: new Date(),
            returned: [],
            cart: shoppingCart,
            total: roundedTotal,
            oldBalance: userData.walletBalance,
            newBalance: newBalance,
            billingInfo: userData.address
          };

          const addTransaction = await transactionsCollection.insertOne(transaction);

          if (addTransaction.acknowledged === true) {
            const games = shoppingCart.map(item => ({
              id: item._id,
              name: item.name,
              transaction: addTransaction.insertedId
            }));

            const newGames = [...userData.games, ...games];

            const updateUser = await usersCollection.updateOne({ _id: userData._id }, { $set: { walletBalance: newBalance, games: newGames, shoppingCart: [] }, $push: { transactions: addTransaction.insertedId } });

            if (updateUser.modifiedCount === 1) {
              resolve({ status: "success" });
            }
          }

        } else {
          reject({ status: 401, error: "Niewystarczająca ilość środków na koncie." });
        }
      }
    } catch (err) {
      console.error(err);
      reject({ status: 500, error: "Wystąpił błąd serwera." });
    }
  });
};

module.exports = { finalizeOrder };