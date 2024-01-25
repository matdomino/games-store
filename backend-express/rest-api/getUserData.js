const  { verifyAuth } = require('./auth');

const getUserData = async (req, res, usersCollection) => {
  try {
    const isValidLogin = await verifyAuth(req, res);

    if (isValidLogin) {
      const user = req.cookies.username;
      const userData = await usersCollection.findOne(
        { "username": user },
        { projection: {
          _id: 0,
          email: 1,
          username: 1,
          role: 1,
          address: 1
        }}
      );
      
      if (userData) {
        res.json({ status: "success", data: userData });
      } else {
        res.status(500).json({ error: "Wystąpił błąd podczas pobierania informacji" });
      }
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Wystąpił błąd serwera." });
  }
};

module.exports = { getUserData };