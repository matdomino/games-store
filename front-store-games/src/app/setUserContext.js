import cookie from 'js-cookie';

export const setUserData = (setUser) => {
  const userName = cookie.get('username');
  const role = cookie.get('role');

  if (userName && role) {
    setUser({ username: userName, role: role });

    return true;
  } else {
    return false;
  }
};
