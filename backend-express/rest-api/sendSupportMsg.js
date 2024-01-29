const { verifyAuth } = require('./auth');

const sendSupportMsg = async (req, res, usersCollection, pendingSupportCollection) => {
  return new Promise(async (resolve, reject) => {
    try {
      const { topic, msg } = req.body;
      const isValidLogin = await verifyAuth(req, res);

      if (isValidLogin === true) {
        const username = req.cookies.username;

        if (topic && msg) {
          if (typeof(msg) !== "string" || msg.length < 3 || msg.length > 500) {
            reject({ status: 400, error: "Niepoprawne opcje dla komentarza" });
            return;
          }

          if (typeof(topic) !== "string" || topic.length < 3 || topic.length > 50) {
            reject({ status: 400, error: "Niepoprawne opcje dla tematu" });
            return;
          }

          const userProfile = await usersCollection.findOne({ "username": username });

          const supportMsg = {
            user: userProfile._id,
            topic: topic,
            msg: msg,
            date: new Date()
          };

          const isMsgInCollection = await pendingSupportCollection.findOne({ user: userProfile._id, topic: topic });

          if (!isMsgInCollection) {
            const addMsg = await pendingSupportCollection.insertOne(supportMsg);

            if (addMsg.acknowledged === true) {
              const updateUser = await usersCollection.updateOne({ _id: userProfile._id }, { $push: { support: addMsg.insertedId } });

              if (!updateUser.acknowledged === true) {
                resolve({ status: 500, error: "Wystąpił błąd serwera podczas aktualizacji użytkownika." });
                return;
              }

              resolve({ status: "success" });
            } else {
              reject({ status: 400, error: "Wiadomość została już wysłana." });
            }
          } else {
            reject({ status: 400, error: "Wiadomość została już wysłana." });
          }

        }
      }
    } catch (err) {
      console.error(err);
      reject({ status: 500, error: "Wystąpił błąd serwera." });
    }
  });
};

module.exports = { sendSupportMsg };