const { verifyAuth } = require('./auth');

const addToCart = async (req, res, usersCollection, gamesCollection, ObjectId) => {
  try {
    const isValidLogin = await verifyAuth(req, res);
    const gameId = req.params.gameId;

    if (isValidLogin === true) {
      const user = req.cookies.username;
      const userProfile = await usersCollection.findOne({ "username": user });
      const game = await gamesCollection.findOne({ _id: new ObjectId(gameId) });
      if (game) {
        const gameInLibrary = userProfile.games.some(g => g.id.toString() === gameId);
        if (gameInLibrary === true) {
          return res.json({ status: "Gra w bibliotece" });
        }

        if (!userProfile.shoppingCart.includes(gameId)) {
          const updateCart = await usersCollection.updateOne({ "username": user }, { $push: { shoppingCart: gameId } });

          if (updateCart.modifiedCount === 1) {
            res.json({ status: "Dodano gre do koszyka." });
          } else {
            res.status(500).json({ error: "Błąd podczas dodawania gry do koszyka." });
          }
        } else {
          res.json({ status: "Gra w koszyku" });
        }
      } else {
        res.status(404).json({ error: "Nie znaleziono gry" });
      }
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Wystąpił błąd serwera." });
  }
};

module.exports = { addToCart };