const { verifyAuth } = require('../auth');

const getUsers = async (req, res, usersCollection) => {
  try {
    const isValidLogin = await verifyAuth(req, res);

    if (isValidLogin === true) {
      const role = req.cookies.roleType;

      if (role === "employee") {
        const users = await usersCollection.find(
          {},
          { projection: { _id: 1, username: 1, email: 1, role: 1 } }
        ).toArray();

        res.json({ status: 'success', users: users });
      } else {
        res.status(401).json({ error: "Nie masz wymaganych uprawnień" });
      }
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Wystąpił błąd serwera." });
  }
};

module.exports = { getUsers };