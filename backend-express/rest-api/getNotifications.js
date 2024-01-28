const { verifyAuth } = require('./auth');

const getNotifications = async (req, res, usersCollection) => {
  try {
    const isValidLogin = await verifyAuth(req, res);

    if (isValidLogin === true) {
      const user = req.cookies.username;
      const UserNotifications = await usersCollection.findOne({ "username": user }, { $project: { notifications: 1 } });

      if (UserNotifications) {
        res.json({ status: "success", notifications: UserNotifications.notifications });
      } else {
        res.status(500).json({ error: "Wystąpił błąd podczas pobierania powiadomień" });
      }
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Wystąpił błąd serwera." });
  }
};

module.exports = { getNotifications };