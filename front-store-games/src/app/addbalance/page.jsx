"use client";

import { useEffect, useContext } from "react";
import { useRouter } from "next/navigation";
import UserContext from "../context/UserContext";
import { setUserData } from "../setUserContext";
import NavBar from "../NavBar";
import AddBalance from "./AddBalance";
import './style.scss';

export default function Balance() {
  const { user, setUser } = useContext(UserContext);
  const router = useRouter();

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

  return(
    <>
      {user.username && <NavBar user={user} />}
      <main>
        <AddBalance />
      </main>
    </>
  );
}