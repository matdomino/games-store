const { verifyAuth } = require('./auth');

const getGameDetails = async (req, res, gamesCollection, ObjectId) => {
  try {
    const isValidLogin = await verifyAuth(req, res);
    const gameId = req.params.gameId;

    if (isValidLogin === true) {
      const game = await gamesCollection.findOne({ _id: new ObjectId(gameId) });

      if (game) {
        res.json({ status: "success", game: game });
      } else {
        res.status(404).json({ status: "failure" });
      }
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Wystąpił błąd serwera." });
  }
};

module.exports = { getGameDetails };