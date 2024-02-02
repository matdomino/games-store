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

  useEffect(() => {
    if (!userName) {
      setUser({});
      router.push('/login');
    }
    if (Object.keys(user).length === 0) {
      const isLoggedIn = setUserData(setUser);
      if (isLoggedIn) {
        router.push('/store');
      } else {
        router.push('/login');
      }
    } else {
      router.push('/login');
    }
  }, []);
}
