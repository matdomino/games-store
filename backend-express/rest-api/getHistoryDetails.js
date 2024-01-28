const { verifyAuth } = require('./auth');

const getHistoryDetails = async (req, res, usersCollection, transactionsCollection, ObjectId) => {
  return new Promise(async (resolve, reject) => {
    try {
      const isValidLogin = await verifyAuth(req, res);
      const transId = req.params.transId;

      if (isValidLogin === true) {
        if (!transId) {
          reject({ status: 400, error: "Brak id tranzakcji." });
          return;
        }

        const username = req.cookies.username;

        const userProfile = await usersCollection.findOne({ "username": username });

        if (!userProfile.transactions.some(id => id.equals(new ObjectId(transId)))) {
          reject({ status: 400, error: "Brak podanej transakcji w historii." });
          return;
        }

        const historyDetails = await transactionsCollection.findOne({ _id: new ObjectId(transId) });

        if (historyDetails) {
          resolve( historyDetails );
        } else {
          reject({ status: 500, error: "Wystąpił błąd przy wyszukaniu danej tranzakcji." });
        }
      }
    } catch (err) {
      console.error(err);
      reject({ status: 500, error: "Wystąpił błąd serwera." });
    }
  });
};

module.exports = { getHistoryDetails };