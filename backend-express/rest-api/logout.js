const { clearAllCookies } = require('./auth');

const logout = async (req, res) => {
  try {
    clearAllCookies(res);

    res.json({ status: "success" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Wystąpił błąd serwera." });
  }
};

module.exports = { logout };