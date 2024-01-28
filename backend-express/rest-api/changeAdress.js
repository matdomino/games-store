const { verifyAuth } = require('./auth');

const changeAdress = (req, res, usersCollection) => {
  return new Promise(async (resolve, reject) => {
    try {
      const isValidLogin = await verifyAuth(req, res);
      const { firstName, lastName, city, street, home, flat, postCode } = req.body;

      if (isValidLogin === true) {
        const username = req.cookies.username;

        let correctData = true;

        if (!firstName || typeof(firstName) !== "string" || firstName.length < 2 || firstName.length > 20) {
          correctData = false;
        } else if (!lastName || typeof(lastName) !== "string" || lastName.length < 2 || lastName.length > 30) {
          correctData = false;
        } else if (!city || typeof(city) !== "string" || city.length < 3 || city.length > 30) {
          correctData = false;
        } else if (street && (typeof(street) !== "string" || street.length < 3 || street.length > 30)) {
          correctData = false;
        } else if (!home || typeof(home) !== "string" || home.length < 1 || home.length > 4) {
          correctData = false;
        } else if (flat && (typeof(flat) !== "number" || flat < 1 || flat > 100)) {
          correctData = false;
        } else if (!postCode || typeof(postCode) !== "string" || !/^\d{2}-\d{3}$/.test(postCode)) {
          correctData = false;
        }

        if (correctData) {
          const newAddress = {
            firstName: firstName,
            lastName: lastName,
            city: city,
            street: street,
            home: home,
            flat: flat,
            postCode: postCode
          };

          const update = await usersCollection.updateOne({ "username": username }, { $set: { address: newAddress } });

          if (update.modifiedCount === 1) {
            resolve({ status: "success" });
          } else {
            reject({ status: 500, error: "Nie udało się zmienić adresu." });
          }

        } else {
          reject({ status: 400, error: "Dane nie spełniają wymagań." });
          return;
        }
      }
    } catch (err) {
      console.error(err);
      reject({ status: 500, error: "Wystąpił błąd serwera." });
    }
  });
};

module.exports = { changeAdress };