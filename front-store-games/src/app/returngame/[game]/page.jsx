"use client";

import { useEffect, useContext, useState } from "react";
import { useRouter } from "next/navigation";
import UserContext from "../../context/UserContext";
import { setUserData } from "../../setUserContext";
import NavBar from "../../NavBar";
import ReturnGameModule from "./returnGame";
import './style.scss';
import axios from "@/api/axios";

export default function ReturnGame({ params }) {
  const GAME_URL = `/gamedetails/${params.game}`;

  const { user, setUser } = useContext(UserContext);
  const [ game, setGame ] = useState(null);
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
  }, []);

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

  const goBack = () => {
    router.push('/library');
  };

  return (
    <main>
      {user.username && <NavBar user={user} />}
      <div className="return">
        <button className="backButton" onClick={goBack}>←</button>
        <div className="returnForm">
          { game === null ? null : game === "NotFound" ? <NotFound /> : <ReturnGameModule elemId={params.game} gameName={game.name}/>}
        </div>
      </div>
    </main>
  );
}
