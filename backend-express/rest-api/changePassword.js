const { verifyAuth, clearAllCookies } = require('./auth');

const changePassword = (req, res, usersCollection, bcrypt) => {
  return new Promise(async (resolve, reject) => {
    try {
      const isValidLogin = await verifyAuth(req, res);
      const { newPass, oldPass } = req.body;

      if (isValidLogin === true) {
        const username = req.cookies.username;

        if (newPass && oldPass && newPass !== oldPass) {
          if (typeof(newPass) !== "string" || newPass.length < 5 || newPass.length > 30) {
            reject({ status: 400, error: "Hasło nie spełnia wymagań." });
            return;
          }

          const existingUser = await usersCollection.findOne({ username: username });

          if (await bcrypt.compare(oldPass, existingUser.password)) {
            const encryptedPass = await bcrypt.hash(newPass, 10);
            const update = await usersCollection.updateOne({ _id: existingUser._id }, { $set: { password: encryptedPass } });

            if (update.modifiedCount === 1) {
              clearAllCookies(res);
              resolve({ status: "success" });
            } else {
              reject({ status: 500, error: "Nie udało się zmienić hasła" });
            }
          } else {
            reject({ status: 400, error: "Niepoprawne hasło" });
          }
        } else {
          reject({ status: 400, error: "Hasła nie mogą być takie same" });
        }
      }

    } catch (err) {
      console.error(err);
      reject({ status: 500, error: "Wystąpił błąd serwera." });
    }
  });
};

module.exports = { changePassword };