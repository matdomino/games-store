const { verifyAuth } = require('../auth');

const respondToSupport = async (req, res, pendingSupportCollection, closedSupportCollection, usersCollection, ObjectId) => {
  try {
    const isValidLogin = await verifyAuth(req, res);
    const { pendingId, response } = req.body;

    if (isValidLogin === true) {
      const role = req.cookies.roleType;

      if (!response) {
        return res.status(400).json({ error: "Brak wiadomosci." });
      }

      if (role === "employee") {
        const msg = await pendingSupportCollection.findOne({ _id: new ObjectId(pendingId) });

        if (msg) {
          const newObj = {
            _id: msg._id,
            user: msg.user,
            topic: msg.topic,
            msg: msg.msg,
            date: msg.date,
            response: response
          };

          const addToclosed = await closedSupportCollection.insertOne(newObj);

          if (!addToclosed.acknowledged === true) {
            return res.status(500).json({ error: "Nie udało się dodać wiadomości do zamkniętych." });
          }

          const addNotification = await usersCollection.updateOne({ _id: new ObjectId(msg.user) }, { $push: { notifications: `Otrzymałeś/aś odpowiedź na temat: ${msg.topic}` } });

          if (!addNotification.modifiedCount === 1) {
            return res.status(404).json({ error: "Nie znaleziono użytkownika o podanym id" });
          }

          const deleteOld = await pendingSupportCollection.deleteOne({ _id: new ObjectId(pendingId) });

          if (!deleteOld.deletedCount === 1) {
            return res.status(500).json({ error: "Nie udało się usunąć starej wiadomości" });
          }

          return res.json({ status: "success" });

        } else {
          res.status(400).json({ error: "Nie znaleziono żądanej wiadomości" });
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

module.exports = { respondToSupport };