const register = async (req, res, usersCollection, bcrypt, jwt, tokenKey) => {
  try {
    const { email, user, pass, address } = req.body;

    let correctData = true;

    if (!email || typeof(email) !== "string" || email.length > 35 || !/^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/.test(email)) {
      correctData = false;
    } else if (!user || typeof(user) !== "string" || user.length < 4 || user.length > 20) {
      correctData = false;
    } else if (!pass || typeof(pass) !== "string" || pass.length < 5 || pass.length > 30) {
      correctData = false;
    } else if (!address.firstName || typeof(address.firstName) !== "string" || address.firstName.length < 2 || address.firstName.length > 20) {
      correctData = false;
    } else if (!address.lastName || typeof(address.lastName) !== "string" || address.lastName.length < 2 || address.lastName.length > 30) {
      correctData = false;
    } else if (!address.city || typeof(address.city) !== "string" || address.city.length < 3 || address.city.length > 30) {
      correctData = false;
    } else if (address.street && (typeof(address.street) !== "string" || address.street.length < 3 || address.street.length > 30)) {
      correctData = false;
    } else if (!address.home || typeof(address.home) !== "string" || address.home.length < 1 || address.home.length > 4) {
      correctData = false;
    } else if (address.flat && (typeof(address.flat) !== "number" || address.flat < 1 || address.flat > 100)) {
      correctData = false;
    } else if (!address.postCode || typeof(address.postCode) !== "string" || !/^\d{2}-\d{3}$/.test(address.postCode)) {
      correctData = false;
    }

    if (correctData) {
      const existingUsernameAcc = await usersCollection.findOne({ username: user });
      const existingEmailAcc = await usersCollection.findOne({ email: email });

      if (!existingUsernameAcc && !existingEmailAcc) {
        const encryptedPass = await bcrypt.hash(pass, 10);
        const newUser = {
          email: email,
          username: user,
          password: encryptedPass,
          role: 'user',
          walletBalance: 0,
          address: {
            firstName: address.firstName,
            lastName: address.lastName,
            city: address.city,
            street: address.street,
            home: address.home,
            flat: address.flat,
            postCode: address.postCode
          },
          games: [],
          favouriteGames: [],
          transactions: [],
          support: [],
          notifications: [],
          shoppingCart: []
        };

        const addUser = await usersCollection.insertOne(newUser);

        if (addUser.acknowledged === true) {
          const accessToken = jwt.sign({ user: user, role: newUser.role }, tokenKey, { expiresIn: '1h' });
          res.cookie('accessToken', accessToken, {
            httpOnly: true,
            maxAge: 60 * 60 * 1000
          });
          res.cookie('username', user, {
            maxAge: 60 * 60 * 1000
          });
          res.cookie('roleType', newUser.role, {
            maxAge: 60 * 60 * 1000
          });
          res.cookie('walletBalance', newUser.walletBalance, {
            maxAge: 60 * 60 * 1000
          });
          res.json({ status: 'success' });
        } else {
          return res.status(500).json({ error: 'Nie udało się dodać użytkoniwka.' });
        }

      } else {
        res.status(409).json({ error: "Użytkownik o podanym adresie email lub nazwie konta już istnieje" });
      }
    } else {
      res.status(400).json({ error: "Nieprawidłowe dane wejściowe." });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Wystąpił błąd serwera." });
  }
};

module.exports = { register };