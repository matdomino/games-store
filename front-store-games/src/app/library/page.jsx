"use client";

import { useEffect, useContext, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import UserContext from "../context/UserContext";
import { setUserData } from "../setUserContext";
import NavBar from "../NavBar";
import axios from "@/api/axios";
import ReviewGame from "./reviewGame";
import "./style.scss";

const GAMES_LIBRARY = '/getownedgames';
const ADD_FAV = '/addtofavourites';

export default function Library() {
  const { user, setUser } = useContext(UserContext);
  const router = useRouter();
  const [ games, setGames ] = useState([]);
  const [ selectedDetails, setSelectedDetails ] = useState(null);
  const [ refresh, setRefresh ] = useState(false);
  const [ favGames, setFavGames ] = useState([]);
  const [ type, setType ] = useState(null);
  const selectedRef = useRef(null);

  const getLibrary = async () => {
    try {
      const res = await axios.get(GAMES_LIBRARY, { withCredentials: true });

      if (res.status === 200) {
        setGames(res.data.games);
        setFavGames(res.data.favouriteGames);
      }
    } catch (err) {
      if (err.response && err.response.data.error) {
        if (err.response.status === 401) {
          console.error(user);
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
    getLibrary();
  }, [refresh]);

  const getGamesDetails = async (elemId) => {
    const GAME_URL = `/gamedetails/${elemId}`;

    try {
      const res = await axios.get(GAME_URL, { withCredentials: true });
      if (res.data.status === "success") {
        setSelectedDetails(res.data.game);
      }
    } catch (err) {
      console.error(err);
      if (err.message.includes('Network Error')) {
        alert('Brak odpowiedzi serwera. Skontaktuj się z administratorem.');
      } else if (err.response.status === 500) {
        setType(null);
      } else if (err.response.status === 404) {
        setType(null);
      } else {
        router.push('/');
      }
    }
  };

  const handleClickFavourite = async (elemId) => {
    selectedRef.current = elemId;
    await getGamesDetails(elemId);
    setType("fav");
  };

  const handleClick = async (elemId) => {
    selectedRef.current = elemId;
    await getGamesDetails(elemId);
    setType("normal");
  };

  const GamesList = ({ games, favGames }) => {
    return(
      <div className="gamesList">
        <h3>Ulubione:</h3>
        <ul className="favourite">
          {favGames.map((elem, index) => (
            <li key={index} onClick={() => handleClickFavourite(elem.id)}>
              {elem.name}
            </li>
          ))}
        </ul>
        <h3>Wszystkie gry:</h3>
        <ul className="games">
          {games.map((elem, index) => (
            !favGames.some(favGame => favGame.id === elem.id) && (
              <li key={index} onClick={() => handleClick(elem.id)}>
                {elem.name}
              </li>
            )
          ))}
        </ul>
      </div>
    );
  };

  const addTofav = async () => {
    try {
      const data = {
        gameId: selectedRef.current
      };
      const res = await axios.post(ADD_FAV, data, { withCredentials: true });

      if (res.status === 200) {
        if (type === "fav") {
          setType("normal");
        }
        if (type === "normal") {
          setType("fav");
        }
        setRefresh(!refresh);
      }
    } catch (err) {
      if (err.response && err.response.data.error) {
        if (err.response.status === 401) {
          console.error(user);
          router.push('/');
        }
        alert(err.response.data.error);
      } else {
        alert('Brak odpowiedzi serwera. Skontaktuj się z administratorem.');
      }
    }
  };

  const redirectToReturn = () => {
    router.push(`/returngame/${selectedRef.current}`);
  };

  const GamesOptions = ({type}) => {
    return(
      <div className="GameDetails">
        <img src={selectedDetails.mainPhoto} alt="" />
        <div className="navBar">
          <button className="fav" onClick={addTofav}>{type === "normal" ? "Dodaj do ulubionych" : "Usuń z ulubionych"}</button>
        </div>
        <div className="options">
          <div className="review">
            <ReviewGame elemId={selectedRef.current} />
          </div>
        </div>
        <div className="returnUrl">
            <a href="#" onClick={redirectToReturn}>Nie podoba Ci się gra? Zwróć ją tutaj.</a>
          </div>
      </div>
    );
  };

  const ShowNonePrompt = () => {
    return(
      <div className="nonePrompt">
        Wybierz grę aby zobaczyć opcje
      </div>
    );
  };

  return (
    <div>
      {user.username && <NavBar user={user} />}
      <main>
        <div className="gamesMenu">
          <GamesList games={games} favGames={favGames} />
          <div className="optionDiv">
            {type ? <GamesOptions gameId={selectedRef.current} type={type}/> : <ShowNonePrompt />}
          </div>
        </div>
      </main>
    </div>
  );
}