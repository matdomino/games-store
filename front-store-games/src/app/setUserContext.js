import cookie from 'js-cookie';

export const setUserData = (setUser) => {
  const userName = cookie.get('username');
  const role = cookie.get('roleType');
  const walletBalance = cookie.get('walletBalance');

  if (userName && role && walletBalance) {
    setUser({ username: userName, role: role, walletBalance: walletBalance });

    return true;
  } else {
    return false;
  }
};
