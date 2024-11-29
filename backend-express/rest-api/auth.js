const jwt = require('jsonwebtoken');
const tokenKey = process.env.TOKEN_KEY;

const clearAllCookies = (res) => {
  res.clearCookie('accessToken');
  res.clearCookie('username');
  res.clearCookie('roleType');
  res.clearCookie('walletBalance');
};

const verifyAuth = async (req, res) => {
  const user = req.cookies.username;
  const accessToken = req.cookies.accessToken;
  const role = req.cookies.roleType;

  if (!user || !accessToken || !role) {
    clearAllCookies(res);
    return res.status(401).json({ error: "Brak autoryzacji." });
  }

  try {
    const decoded = await jwt.verify(accessToken, tokenKey);
    if (user !== decoded.user || role !== decoded.role) {
      clearAllCookies(res);
      return res.status(401).json({ error: "Brak autoryzacji." });
    }

    return true;
  } catch (err) {
    clearAllCookies(res);
    return res.status(401).json({ error: "Brak autoryzacji." });
  }
};

module.exports = { clearAllCookies, verifyAuth };