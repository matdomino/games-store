const { verifyAuth, clearAllCookies } = require('./auth');

const changeUsername = (req, res, usersCollection, bcrypt) => {
  return new Promise(async (resolve, reject) => {
    try {
      const isValidLogin = await verifyAuth(req, res);
      const { user, pass } = req.body;

      if (isValidLogin === true) {
        const username = req.cookies.username;

        if (user && pass) {
          const existingUsername = await usersCollection.findOne({ username: user });

          if (existingUsername) {
            reject({ status: 400, error: "Podana nazwa użytkownika jest zajęta." });
            return;
          }

          const existingUser = await usersCollection.findOne({ username: username });

          if (await bcrypt.compare(pass, existingUser.password)) {
            const update = await usersCollection.updateOne({ _id: existingUser._id }, { $set: { username: user } });

            if (update.modifiedCount === 1) {
              clearAllCookies(res);
              resolve({ status: "success" });
            }
          } else {
            reject({ status: 400, error: "Niepoprawne hasło" });
          }
        } else {
          reject({ status: 400, error: "Brakuje danych do zmiany username." });
        }
      }
    } catch (err) {
      console.error(err);
      reject({ status: 500, error: "Wystąpił błąd serwera." });
    }
  });
};

module.exports = { changeUsername };
