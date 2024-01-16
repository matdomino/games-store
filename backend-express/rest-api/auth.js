const jwt = require('jsonwebtoken');

const clearAllCookies = (res) => {
  res.clearCookie('LoggedInUser');
  res.clearCookie('accessToken');
  res.clearCookie('username');
};

const verifyAuth = async (req, res, tokenKey) => {
  const user = req.cookies.username;
  const accessToken = req.cookies.accessToken;
  const role = req.cookies.role;

  if (!user || !accessToken || !role) {
    clearAllCookies(res);
    return res.status(401).json({ error: "Brak autoryzacji." });
  }

  try {
    const decoded = await jwt.verify(accessToken, tokenKey)
    if (user !== decoded.user && role !== decoded.role) {
      clearAllCookies(res);
      return res.status(401).json({ error: "Brak autoryzacji." });
    }

    return true;
  } catch (err) {
    clearAllCookies(res);
    return res.status(401).json({ error: "Brak autoryzacji." });
  }
};

module.exports = { clearAllCookies, verifyAuth }