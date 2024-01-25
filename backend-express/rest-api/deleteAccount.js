const { verifyAuth, clearAllCookies } = require('./auth');

const deleteAccount = (req, res, usersCollection, bcrypt) => {
  return new Promise(async (resolve, reject) => {
    try {
      const isValidLogin = await verifyAuth(req, res);
      const { user, pass } = req.body;

      if (isValidLogin === true) {
        const username = req.cookies.username;

        const userData = await usersCollection.findOne({ "username": username });
        if (user === username && await bcrypt.compare(pass, userData.password)) {
          const deleteAcc = await usersCollection.deleteOne({ _id: userData._id });

          if (deleteAcc.deletedCount === 1) {
            clearAllCookies(res);
            resolve({ status: "success" });
          } else {
            reject({ status: 500, error: "Nie udało się usunąć konta." });
            return;
          }
        } else {
          reject({ status: 400, error: "Niepoprawne dane logowania." });
          return;
        }
      }
    } catch (err) {
      console.error(err);
      reject({ status: 500, error: "Wystąpił błąd serwera." });
    }
  });
};

module.exports = { deleteAccount };