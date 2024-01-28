const { verifyAuth } = require('./auth');

const getHistory = async (req, res, usersCollection) => {
  return new Promise(async (resolve, reject) => {
    try {
      const isValidLogin = await verifyAuth(req, res);

      if (isValidLogin === true) {
        const username = req.cookies.username;

        const userProfile = await usersCollection.findOne({ "username": username });

        if (userProfile) {
          resolve({ transactions: userProfile.transactions });
        } else {
          reject({ status: 500, error: "Wystąpił błąd podczas pobierania historii." });
        }
      }
    } catch (err) {
      console.error(err);
      reject({ status: 500, error: "Wystąpił błąd serwera." });
    }
  });
};

module.exports = { getHistory };