"use client";

import { useEffect, useState, useContext } from "react";
import { useRouter } from "next/navigation";
import UserContext from "../context/UserContext";
import { setUserData } from "../setUserContext";
import NavBar from "../NavBar";
import axios from "@/api/axios";
import './style.scss';
import FilterForm from "./FilterForm";


const GAMES_URL = '/storegames';

export default function Store() {
  const { user, setUser } = useContext(UserContext);
  const [ games, setGames ] = useState([]);
  const router = useRouter();

  const getGames = async (body) => {
    try {
      const res = await axios.post(GAMES_URL, body, { withCredentials: true });
      if (res.data.status === "success") {
        setGames(res.data.games);
      } else {
        router.push('/');
        alert('Wystąpił błąd podczas przetwarzania żądania.');
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
    const initialSearchBody = {
      "sortBy": "name",
      "sortOrder": "asc"
    };

    getGames(initialSearchBody);
  }, []);

  const redirectToGame = (gameId) => {
    router.push(`/game/${gameId}`);
  };

  const GamesList = ({ games }) => {
    return(
      <ul>
        {games.map((elem, index) => (
          <li key={index} onClick={() => redirectToGame(elem._id)}>
            <div>
              <h3>{elem.name}</h3>
              <img src={elem.mainPhoto} alt="Zdjęcie" />
              <div className="price">Cena: {elem.price} zł</div>
              <div className="avgGrade">Średnia ocen: {elem.averageGrade}</div>
              <ul>
                {elem.genres.map((elem, index) => (
                  <span key={index}>{elem}</span>
                ))}
              </ul>
            </div>
          </li>
        ))}
      </ul>
    );
  };

  return (
    <div>
      {user.username && <NavBar user={user} />}
      <main>
        <div className="gamesListClass">
          <div className="options">
            { games.length > 0 ? <FilterForm className="FilterForm" setGames={setGames} /> : null }
          </div>
          <div className="games">
            { games.length > 0 ? <GamesList games={games} /> : null }
          </div>
        </div>
      </main>
    </div>
  );
}
