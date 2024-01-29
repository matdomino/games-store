const { verifyAuth } = require('./auth');

const returnGame = async (req, res, usersCollection, pendingReturnsCollection) => {
  return new Promise(async (resolve, reject) => {
    try {
      const { gameId, comment } = req.body;
      const isValidLogin = await verifyAuth(req, res);

      if (isValidLogin === true) {
        const username = req.cookies.username;

        if (gameId && comment) {
          if (typeof(comment) !== "string" || comment.length < 3 || comment.length > 500) {
            reject({ status: 400, error: "Niepoprawne opcje dla komentarza" });
            return;
          }

          const userProfile = await usersCollection.findOne({ "username": username });
          const gameInLibrary = await userProfile.games.findIndex(g => g.id.toString() === gameId);

          if (gameInLibrary !== -1) {
            const game = userProfile.games.find(g => g.id.toString() === gameId);
            const gameReturn = {
              user: userProfile._id,
              topic: `Zwrot gry: ${gameId}`,
              game: gameId,
              comment: comment,
              transaction: game.transaction,
              date: new Date()
            };

            const isReturnInCollection = await pendingReturnsCollection.findOne({ user: userProfile._id, topic: gameReturn.topic });

            if (!isReturnInCollection) {
              const addReturnRequest = await pendingReturnsCollection.insertOne(gameReturn);

              if (addReturnRequest.acknowledged === true) {
                resolve({ status: "success" });
              }
            } else {
              reject({ status: 400, error: "Zwrot został już wysłany." });
            }

          } else {
            reject({ status: 400, error: "Brak gry w bibliotece" });
          }
        }
      }
    } catch (err) {
      console.error(err);
      reject({ status: 500, error: "Wystąpił błąd serwera." });
    }
  });
};

module.exports = { returnGame };