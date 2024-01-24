const  { verifyAuth } = require('./auth');

const addGame = async (req, res, gamesCollection) => {
  try {
    const isValidLogin = await verifyAuth(req, res);
    let correctData = true;
    const { name, price, publisher, mainPhoto, photos, genres, description, realseYear, location } = req.body;

    if (isValidLogin) {
      const role = req.cookies.roleType;

      if (role === "employee") {
        if (!name || typeof(name) !== "string" ) {
          correctData = false;
        } else if (!price || typeof(price) !== "number") {
          correctData = false;
        } else if (!publisher || typeof(publisher) !== "string") {
          correctData = false;
        } else if (!mainPhoto || typeof(mainPhoto) !== "string") {
          correctData = false;
        } else if (!photos || !Array.isArray(photos) || photos.some(elem => typeof elem !== "string")) {
          correctData = false;
        } else if (!genres || !Array.isArray(genres) || genres.some(elem => typeof elem !== "string")) {
          correctData = false;
        } else if (!description || typeof(description) !== "string") {
          correctData = false;
        } else if (!realseYear || typeof(realseYear) !== "number") {
          correctData = false;
        } else if (!location || typeof(location) !== "string") {
          correctData = false;
        }

        const correctGenres = [
          "FPS",
          "RPG",
          "Przygodowe",
          "Drużynowe",
          "Sandbox",
          "Turowe",
          "Symulatory",
          "Survival"
        ];

        genres.forEach((elem) => {
          if (!correctGenres.includes(elem)) {
            correctData = false;
          }
        });

        const game = {
          name: name,
          price: price,
          publisher: publisher,
          mainPhoto: mainPhoto,
          photos: photos,
          genres: genres,
          description: description,
          realseYear: realseYear,
          location: location,
          reviews: []
        }

        if (correctData) {
          const AddGame = await gamesCollection.insertOne(game);

          if (AddGame.acknowledged === true) {
            res.json({ status: "success" });
          }
        } else {
          return res.status(400).json({ error: "Nieprawidłowe dane wejściowe." });
        }
      }
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Wystąpił błąd serwera." });
  }
};

module.exports = { addGame };