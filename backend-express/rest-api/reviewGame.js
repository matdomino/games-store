const { verifyAuth } = require('./auth');

const reviewGame = async (req, res, usersCollection, gamesCollection, ObjectId) => {
  return new Promise(async (resolve, reject) => {
    try {
      const { gameId, grade, comment } = req.body;
      const isValidLogin = await verifyAuth(req, res);

      const gradeOptions = [
        1,
        2,
        3,
        4,
        5
      ];

      if (isValidLogin === true) {
        const username = req.cookies.username;

        if (gameId && grade && comment) {
          if (!(!isNaN(grade) && gradeOptions.includes(grade))) {
            reject({ status: 400, error: "Niepoprawne opcje dla oceny" });
            return;
          }

          if (typeof(comment) !== "string" || comment.length < 3 || comment.length > 500) {
            reject({ status: 400, error: "Niepoprawne opcje dla komentarza" });
            return;
          }

          const userProfile = await usersCollection.findOne({ "username": username });
          const gameInLibrary = userProfile.games.some(g => g.id.toString() === gameId);

          if (gameInLibrary) {
            const game = await gamesCollection.findOne({ _id: new ObjectId(gameId) });

            const reviewedAlready = game.reviews.some(r => r.user.toString() === userProfile._id.toString());

            const review = {
              user: userProfile._id,
              grade: grade,
              comment: comment
            };

            if (reviewedAlready) {
              await gamesCollection.updateOne({ _id: new ObjectId(gameId) }, { $pull: { reviews: { user: userProfile._id } } });
            }

            const update = await gamesCollection.updateOne({ _id: new ObjectId(gameId) }, { $push: { reviews: review } });

            if (update.modifiedCount === 1) {
              resolve({ status: "success" });
            } else {
              reject({ status: 500, error: "Nie udało się ocenić gry." });
            }
          } else {
            reject({ status: 400, error: "Brak gry o podanym id w bibliotece." });
          }
        } else {
          reject({ status: 400, error: "Brakuje informacji do recenzji gry." });
        }
      }

    } catch (err) {
      console.error(err);
      reject({ status: 500, error: "Wystąpił błąd serwera." });
    }
  });
};

module.exports = { reviewGame };