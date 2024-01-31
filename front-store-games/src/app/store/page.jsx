"use client"

import { useEffect, useState, useContext } from "react";
import { useRouter } from "next/navigation";
import UserContext from "../context/UserContext";
import { setUserData } from "../setUserContext";
import NavBar from "../NavBar";

const GAMES_URL = '//storegames';

export default function Store() {
  const { user, setUser } = useContext(UserContext);
  const [ games, setGames ] = useState([]);
  const router = useRouter();

  const userName = user.username;
  const balance = user.walletBalance;

  const getGames = async (body) => {
    try {
      const res = await axios.get(GAMES_URL, { withCredentials: true, data: body });
      console.log(res.data);
      if (res.data.status) {
        setGames(res.data.games);
        console.log(games);
      } else {
        alert('Wystąpił błąd podczas przetwarzania żądania.')
      }
    } catch {
      alert('Brak odpowiedzi serwera. Skontaktuj się z administratorem.')
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
