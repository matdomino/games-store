const { verifyAuth } = require('../auth');

const getFullTransactionHistory = async (req, res, transactionsCollection) => {
  try {
    const isValidLogin = await verifyAuth(req, res);

    if (isValidLogin === true) {
      const role = req.cookies.roleType;

      if (role === "employee") {
        const list = await transactionsCollection.find().toArray();

        res.json({ list: list });
      } else {
        res.status(401).json({ error: "Nie masz wymaganych uprawnień" });
      }
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Wystąpił błąd serwera." });
  }
};

module.exports = { getFullTransactionHistory };