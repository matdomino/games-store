const { verifyAuth } = require('./auth');

const checkOut = async (req, res, usersCollection, gamesCollection, ObjectId) => {
  try {
    const isValidLogin = await verifyAuth(req, res);

    if (isValidLogin === true) {
      const user = req.cookies.username;

      const userData = await usersCollection.findOne({ "username": user });
      const address = userData.address;

      const shoppingCartIds = userData.shoppingCart;
      const shoppingCart = await Promise.all(shoppingCartIds.map(async (elem) => {
        const elemData = await gamesCollection.findOne({ _id: new ObjectId(elem) }, { projection: { _id: 1, name: 1, price: 1 } });
        return elemData;
      }));

      const total = shoppingCart.reduce((acc, elem) => acc + elem.price, 0);
      const roundedTotal = Number(total.toFixed(2));

      const data = {
        address: address,
        shoppingCart: shoppingCart,
        total: roundedTotal
      };

      res.json(data);
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Wystąpił błąd serwera." });
  }
};

module.exports = { checkOut };