const { verifyAuth } = require('./auth');

const getWalletBalance = (req, res, usersCollection) => {
  return new Promise(async (resolve, reject) => {
    try {
      const isValidLogin = await verifyAuth(req, res);

      if (isValidLogin === true) {
        const user = req.cookies.username;
        const userData = await usersCollection.findOne(
          { "username": user },
          { projection: { _id: 0, walletBalance: 1 } }
        );

        if (userData) {
          resolve({ status: "success", balance: userData.walletBalance });
        } else {
          reject({ status: 500, error: "Wystąpił błąd podczas pobierania stanu portfela." });
        }
      }
    } catch (err) {
      console.error(err);
      reject({ status: 500, error: "Wystąpił błąd serwera." });
    }
  });
};

module.exports = { getWalletBalance };
