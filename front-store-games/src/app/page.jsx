"use client"

import { useContext, useEffect } from "react";
import { useRouter } from "next/navigation";
import UserContext from "./context/UserContext";
import { setUserData } from "./setUserContext";

export default function App() {
  const { user, setUser } = useContext(UserContext);
  const router = useRouter();

  useEffect(() => {
    if (Object.keys(user).length === 0) {
      const isLoggedIn = setUserData(setUser);
      if (isLoggedIn) {
        router.push('/store');
      } else {
        router.push('/login');
      }
    }
  }, []);
}
