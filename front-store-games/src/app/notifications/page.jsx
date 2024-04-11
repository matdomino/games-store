"use client";

import { useEffect, useContext, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "@/api/axios";
import UserContext from "../context/UserContext";
import { setUserData } from "../setUserContext";
import NavBar from "../NavBar";
import './style.scss';

const NOTIF_URL = '/notifications';
const CLEARNOTIF_URL = '/clearnotifications';

export default function Notifications() {
  const { user, setUser } = useContext(UserContext);
  const [ notif, setNotif ] = useState(null);
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

  const fetchNotifications = async () => {
    try {
      const res = await axios.get(NOTIF_URL, { withCredentials: true });
      if (res.data.status === "success") {
        setNotif(res.data.notifications);
      }
    } catch (err) {
      console.error(err);
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

  const clearNotifications = async () => {
    try {
      const res = await axios.delete(CLEARNOTIF_URL, { withCredentials: true });
      if (res.data.status === "success") {
        setNotif([]);
      }
    } catch (err) {
      console.error(err);
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

  useEffect(() => {}, [notif]);

  useEffect(() => {

    fetchNotifications();
  }, []);

  const NotificationsList = () => {
    return(
      <div className="notif">
        <div className="buttonBar">
          <h2>Powiadomienia: </h2>
          <button className="clearNotifications" onClick={clearNotifications}>Wyczyść</button>
        </div>
        <div className="notifList">
          <ul>
            {notif.map((elem, index) => {
              return <li key={index}>{elem}</li>;
            })}
          </ul>
        </div>
      </div>
    );
  };

  const NotificationsEmpty = () => {
    return(
      <div className="empty">
        Nie masz obecnie żadnych powiadomień
      </div>
    );
  };

  return (
    <>
      {user.username && <NavBar user={user} />}
      <main>
          {notif !== null ? (notif.length > 0 ? <NotificationsList /> : <NotificationsEmpty />) : null}
      </main>
    </>
  );
}
