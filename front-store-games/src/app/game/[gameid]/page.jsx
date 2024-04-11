"use client";

import { useEffect, useState, useContext } from "react";
import { useRouter } from "next/navigation";
import UserContext from "../../context/UserContext";
import { setUserData } from "../../setUserContext";
import NavBar from "../../NavBar";
import GameDetails from "./details";
import './style.scss';
import axios from "@/api/axios";

export default function Game({ params }) {
  const GAME_URL = `/gamedetails/${params.gameid}`;
  const ADD_TO_CART_URL = `/addgametocart/${params.gameid}`;

  const { user, setUser } = useContext(UserContext);
  const router = useRouter();
  const [ game, setGame ] = useState(null);

  const addToShoppingCart = async () => {
    try {
      const res = await axios.put(ADD_TO_CART_URL, { withCredentials: true });

      if (res.status === 200) {
        alert(res.data.status);
      }
    } catch (err) {
      if (err.response && err.response.data.error) {
        if (err.response.status === 401) {
          router.push('/');
        }
        alert(err.response.data.error);
      } else {
        alert('Brak odpowiedzi serwera. Skontaktuj się z administratorem.');
      }
    }
  };

  useEffect(() => {
    if (Object.keys(user).length === 0) {
      const isLoggedIn = setUserData(setUser);
      if (!isLoggedIn) {
        router.push('/login');
      }
    }

  }, [user]);

  useEffect(() => {
    const dataFetch = async () => {
      try {
        const res = await axios.get(GAME_URL, { withCredentials: true });

        if (res.data.status === "success") {
          setGame(res.data.game);
        }
      } catch (err) {
        console.error(err);
        if (err.message.includes('Network Error')) {
          alert('Brak odpowiedzi serwera. Skontaktuj się z administratorem.');
        } else if (err.response.status === 500) {
          setGame("NotFound");
        } else if (err.response.status === 404) {
          setGame("NotFound");
        } else {
          router.push('/');
        }
      }
    };
    dataFetch();
  }, []);

  const NotFound = () => {
    return(
      <div>
        404: Nie znaleziono podanej gry
      </div>
    );
  };

  return (
    <>
      {user.username && <NavBar user={user} />}
      <main>
      { game === "NotFound" ? <NotFound /> : game ? <GameDetails game={game} addToShoppingCart={addToShoppingCart} /> : null }
      </main>
    </>
  );
}
