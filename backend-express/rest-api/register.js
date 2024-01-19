const register = async (req, res, usersCollection, bcrypt, jwt, tokenKey) => {
  try {
    const { email, user, pass } = req.body;

    let correctData = true;

    if (!email || typeof(email) !== "string" || email.length > 35) {
      correctData = false;
    } else if (!user || typeof(user) !== "string" || user.length < 4 || user.length > 20) {
      correctData = false;
    } else if (!pass || typeof(pass) !== "string" || pass.length < 5 || pass.length > 30) {
      correctData = false;
    }

    if (correctData) {
      const existingUsernameAcc = await usersCollection.findOne({ username: user });
      const existingEmailAcc = await usersCollection.findOne({ email: email });

      if (existingUsernameAcc === null && existingEmailAcc === null) {
        const encryptedPass = await bcrypt.hash(pass, 10);
        const newUser = {
          email: email,
          username: user,
          password: encryptedPass,
          role: 'user',
          walletBalance: 0,
          address: {
            postCode: "",
            city: "",
            street: "",
            house: "",
            flat: ""
          },
          games: [],
          transactions: [],
          support: []
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