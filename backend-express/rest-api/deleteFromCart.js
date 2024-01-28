const { verifyAuth } = require('./auth');

const deleteFromCart = async (req, res, usersCollection) => {
  try {
    const isValidLogin = await verifyAuth(req, res);
    const gameId = req.params.gameId;

    if (isValidLogin === true) {
      const user = req.cookies.username;

      const updateCart = await usersCollection.updateOne({ "username": user }, { $pull: { shoppingCart: gameId } });

      if (updateCart.modifiedCount === 1) {
        res.json({ status: "Usunięto grę z koszyka" });
      } else {
        res.status(404).json({ status: "Nie znaleziono gry w koszyku" });
      }
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Wystąpił błąd serwera." });
  }
};

module.exports = { deleteFromCart };