const login = async (req, res, usersCollection, bcrypt, jwt, tokenKey) => {
  try {
    const { user, pass } = req.body;
    const existingUser = await usersCollection.findOne({ username: user });

    if (existingUser && await bcrypt.compare(pass, existingUser.password)) {
      const accessToken = jwt.sign({ user: existingUser.username, role: existingUser.role }, tokenKey, { expiresIn: '1h' });
      res.cookie('accessToken', accessToken, {
        httpOnly: true,
        maxAge: 60 * 60 * 1000
      });
      res.cookie('username', user, {
        maxAge: 60 * 60 * 1000
      });
      res.cookie('roleType', existingUser.role, {
        maxAge: 60 * 60 * 1000
      });
      res.cookie('walletBalance', existingUser.walletBalance, {
        maxAge: 60 * 60 * 1000
      });
      res.json({ status: 'success', notifications: existingUser.notifications });
    } else {
      res.send({ status: 'failure' });
    }
  } catch(err) {
    console.error(err);
    res.status(500).json({ error: "Wystąpił błąd serwera." });
  }
};

module.exports = { login };