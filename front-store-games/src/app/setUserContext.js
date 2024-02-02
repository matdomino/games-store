import cookie from 'js-cookie';
import axios from '@/api/axios';

const WALLET_BALANCE_URL = '/walletbalance';

export const setUserData = async (setUser) => {
  const res = await axios.get(WALLET_BALANCE_URL, { withCredentials: true });

  if (res.status === 200) {
    cookie.set('walletBalance', res.data.balance, { expires: 1 });
  } else {
    setUser({});
  }

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
