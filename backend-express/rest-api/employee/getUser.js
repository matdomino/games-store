const { verifyAuth } = require('../auth');

const getUser = async (req, res, usersCollection, ObjectId) => {
  try {
    const isValidLogin = await verifyAuth(req, res);

    if (isValidLogin === true) {
      const role = req.cookies.roleType;

      if (role === "employee") {
        const user = await usersCollection.findOne(
          { _id: new ObjectId(req.params.id) },
          { projection: { _id: 1, username: 1, email: 1, role: 1, walletBalance: 1, address: 1, games: 1 } }
        );

        if (user) {
          res.json({ status: 'success', user: user });
        } else {
          res.status(404).json({ error: "Nie znaleziono użytkownika o podanym id" });
        }

      } else {
        res.status(401).json({ error: "Nie masz wymaganych uprawnień" });
      }
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Wystąpił błąd serwera." });
  }
};

module.exports = { getUser };