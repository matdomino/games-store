const { verifyAuth } = require('./auth');

const getRefunds = (req, res, usersCollection, pendingReturnsCollection, closedReturnsCollection, ObjectId) => {
  return new Promise(async (resolve, reject) => {
    try {
      const isValidLogin = await verifyAuth(req, res);

      if (isValidLogin === true) {
        const user = req.cookies.username;

        const userProfile = await usersCollection.findOne({ "username": user });

        const pending = await pendingReturnsCollection.find({ "user": new ObjectId(userProfile._id) }).toArray();
        const closed = await closedReturnsCollection.find({ "user": new ObjectId(userProfile._id) }).toArray();

        const result = {
          peding: pending,
          closed: closed
        };

        res.json(result);
      }
    } catch (err) {
      console.error(err);
      reject({ status: 500, error: "Wystąpił błąd serwera." });
    }
  });
};

module.exports = { getRefunds };
