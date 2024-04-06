"use client"

import { useEffect, useContext } from "react";
import { useRouter } from "next/navigation";
import UserContext from "../context/UserContext";
import { setUserData } from "../setUserContext";
import NavBar from "../NavBar";

export default function Wallet() {
  const { user, setUser } = useContext(UserContext);
  const router = useRouter();
  console.log(user);

  const userName = user.username;
  const balance = user.walletBalance;

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (Object.keys(user).length === 0) {
          await setUserData(setUser);
        }
      } catch (error) {
        console.error(error);
        router.push('/login');
      }
    };

    fetchData();
  });

  return (
    <div>
      {user.username && <NavBar user={user} />}
    </div>
  );
}
