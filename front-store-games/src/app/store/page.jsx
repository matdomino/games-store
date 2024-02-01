"use client"

import { useEffect, useState, useContext } from "react";
import { useRouter } from "next/navigation";
import UserContext from "../context/UserContext";
import { setUserData } from "../setUserContext";
import NavBar from "../NavBar";
import axios from "@/api/axios";

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
        alert('Wystąpił błąd podczas przetwarzania żądania.')
      }
    } catch {
      alert('Brak odpowiedzi serwera. Skontaktuj się z administratorem.')
    }
  };

  console.log(games);

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

  return (
    <div>
      {user.username && <NavBar user={user} />}
      <div className="flex justify-center items-center min-h-screen">
        <div className="flex w-3/5 justify-center h-full">
          <div className="w-1/3 mr-2 border-l-2 border-r-2 border-white border-solid border-opacity-20 h-full">
            <div>
              lewo
            </div>
            <div>
              <ul>
                
              </ul>
            </div>
          </div>
          <div className="w-2/3 ml-2 border-l-2 border-r-2 border-white border-solid border-opacity-20 h-full">
            test-prawo
          </div>
        </div>
      </div>
    </div>
  );
}
