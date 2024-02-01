"use client"

import { useEffect, useContext } from "react";
import { useRouter } from "next/navigation";
import UserContext from "../context/UserContext";
import { setUserData } from "../setUserContext";
import NavBar from "../NavBar";

export default function ShoppingCart() {
  const { user, setUser } = useContext(UserContext);
  const router = useRouter();
  console.log(user);

  useEffect(() => {
    if (Object.keys(user).length === 0) {
      const isLoggedIn = setUserData(setUser);
      if (!isLoggedIn) {
        router.push('/login');
      }
    }
  }, []);

  return (
    <div>
      {user.username && <NavBar user={user} />}
    </div>
  );
}
