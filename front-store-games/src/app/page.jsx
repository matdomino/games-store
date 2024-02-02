"use client"

import { useContext, useEffect } from "react";
import { useRouter } from "next/navigation";
import UserContext from "./context/UserContext";
import { setUserData } from "./setUserContext";
import cookie from 'js-cookie';

export default function App() {
  const { user, setUser } = useContext(UserContext);
  const router = useRouter();
  const userName = cookie.get('username');
  const role = cookie.get('roleType');
  const walletBalance = cookie.get('walletBalance');

  useEffect(() => {
    if (userName && role && walletBalance) {
      router.push('/store');
    } else {
      router.push('login')
    }
  }, []);
}
