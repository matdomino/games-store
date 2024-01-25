const  { verifyAuth } = require('./auth');

const searchGames = async (req, res, gamesCollection) => {
  try {
    const isValidLogin = await verifyAuth(req, res);
    const { searchPhrase, filterBy, sortBy, sortOrder, minPrice, maxPrice } = req.body;

    filterByOptions = [
      "FPS",
      "RPG",
      "Przygodowe",
      "Drużynowe",
      "Sandbox",
      "Turowe",
      "Symulatory",
      "Survival"
    ];

    sortByOptions = [
      "name",
      "price",
      "releaseYear"
    ]

    sortOrderOptions = [
      "asc",
      "desc"
    ]

    if (isValidLogin === true) {
      let query = {};
      const sortOptions = {}
      if (filterBy && filterByOptions.includes(filterBy)) {
        query.genres = { $in: [filterBy] };
      }

      if (searchPhrase) {
        const isNumeric = !isNaN(parseInt(searchPhrase));
        if (isNumeric) {
          query.$or = [
            { name: { $regex: searchPhrase, $options: 'i' } },
            { publisher: { $regex: searchPhrase, $options: 'i' } },
            { releaseYear: parseInt(searchPhrase) }
          ];
        } else {
          query.$or = [
            { name: { $regex: searchPhrase, $options: 'i' } },
            { publisher: { $regex: searchPhrase, $options: 'i' } }
          ];
        }
      }

      if (minPrice || maxPrice) {
        query.price = {};
        if (minPrice) {
          query.price.$gte = minPrice;
        }
        if (maxPrice) {
          query.price.$lte = maxPrice;
        }
      }

      if ( sortBy && sortOrder && sortByOptions.includes(sortBy) && sortOrderOptions.includes(sortOrder)) {
        sortOptions[sortBy] = sortOrder === "asc" ? 1 : -1;
      }

      const games = await gamesCollection.aggregate([
        { $match: query },
        { $addFields: { averageGrade: { $avg: "$reviews.grade" } } }, 
        { $project: { _id: 1, name: 1, price: 1, genres: 1, averageGrade: 1, mainPhoto: 1, realseYear: 1 } },
        { $sort: sortOptions }
      ]).toArray();
      res.json({ status: "success", games: games });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Wystąpił błąd serwera." });
  }
};

module.exports = { searchGames };