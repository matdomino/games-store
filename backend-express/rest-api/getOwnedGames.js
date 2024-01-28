const { verifyAuth } = require('./auth');

const getOwnedGames = async (req, res, usersCollection) => {
  return new Promise(async (resolve, reject) => {
    try {
      const isValidLogin = await verifyAuth(req, res);

      if (isValidLogin === true) {
        const user = req.cookies.username;

        const userData = await usersCollection.findOne({ "username": user });

        if (userData) {
          resolve({ games: userData.games, favouriteGames: userData.favouriteGames });
        } else {
          reject({ status: 500, error: "Nie udało się uzyskać gier." });
        }
      }
    } catch (err) {
      console.error(err);
      reject({ status: 500, error: "Wystąpił błąd serwera." });
    }
  });
};

module.exports = { getOwnedGames };