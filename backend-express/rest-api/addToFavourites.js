const { verifyAuth } = require('./auth');

const addToFavourites = async (req, res, usersCollection, ObjectId) => {
  return new Promise(async (resolve, reject) => {
    try {
      const { gameId } = req.body;
      const isValidLogin = await verifyAuth(req, res);

      if (isValidLogin === true) {
        const username = req.cookies.username;

        if (gameId) {
          const userProfile = await usersCollection.findOne({ "username": username });

          const gameInLibrary = userProfile.games.some(g => g.id.toString() === gameId);
          const gameInFavourites = userProfile.favouriteGames.findIndex(g => g.id.toString() === gameId);
          if (!gameInLibrary) {
            reject({ status: 400, error: "Brak gry o podanym id w bibliotece." });
            return;
          }

          if (gameInFavourites !== -1) {
            const update = await usersCollection.updateOne({ "username": username }, { $pull: { "favouriteGames": { "id": new ObjectId(gameId) } } });
            if (update.modifiedCount === 1) {
              resolve({ status: "success" });
            }
          } else {
            const gameToAdd = userProfile.games.find(g => g.id.toString() === gameId);
            const update = await usersCollection.updateOne({ "username": username }, { $push: { "favouriteGames": gameToAdd } });
            if (update.modifiedCount === 1) {
              resolve({ status: "success" });
            }
          }
        } else {
          reject({ status: 400, error: "Brakuje ID gry." });
        }
      }

    } catch (err) {
      console.error(err);
      reject({ status: 500, error: "Wystąpił błąd serwera." });
    }
  });
};

module.exports = { addToFavourites };