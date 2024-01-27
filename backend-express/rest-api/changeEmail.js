const { verifyAuth, clearAllCookies } = require('./auth');

const changeEmail = (req, res, usersCollection, bcrypt) => {
  return new Promise(async (resolve, reject) => {
    try {
      const isValidLogin = await verifyAuth(req, res);
      const { email, pass } = req.body;

      if (isValidLogin === true) {
        const username = req.cookies.username;

        if (email && pass) {
          if (typeof(email) !== "string" || email.length > 35 || !/^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/.test(email)) {
            reject({ status: 400, error: "Email nie spełnia wymagań." });
            return;
          }

          const existingEmail = await usersCollection.findOne({ email: email });

          if (existingEmail) {
            reject({ status: 400, error: "Podany adres email jest zajęty." });
            return;
          }

          const existingUser = await usersCollection.findOne({ username: username });

          if (await bcrypt.compare(pass, existingUser.password)) {
            const update = await usersCollection.updateOne({ _id: existingUser._id }, { $set: { email: email } });

            if (update.modifiedCount === 1) {
              clearAllCookies(res);
              resolve({ status: "success" });
            }
          } else {
            reject({ status: 400, error: "Niepoprawne hasło" });
          }
        } else {
          reject({ status: 400, error: "Brakuje danych do zmiany emailu." });
        }
      }
    } catch (err) {
      console.error(err);
      reject({ status: 500, error: "Wystąpił błąd serwera." });
    }
  });
};

module.exports = { changeEmail };