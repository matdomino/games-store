const { verifyAuth } = require('./auth');

const clearNotifications = async (req, res, usersCollection) => {
  try {
    const isValidLogin = await verifyAuth(req, res);

    if (isValidLogin === true) {
      const user = req.cookies.username;
      const updateNotifications = await usersCollection.updateOne({ "username": user }, { $set: { "notifications": [] } });
      if (updateNotifications.acknowledged === true && updateNotifications.matchedCount === 1 ) {
        res.json({ status: "success" });
      } else {
        res.status(500).json({ status: "Wystąpił błąd podczas czyszczenia powiadomień" });
      }
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Wystąpił błąd serwera." });
  }
};

module.exports = { clearNotifications };