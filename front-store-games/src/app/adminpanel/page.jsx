"use client";

import { useEffect, useContext, useState } from "react";
import { useRouter } from "next/navigation";
import UserContext from "../context/UserContext";
import { setUserData } from "../setUserContext";
import NavBar from "../NavBar";
import cookie from 'js-cookie';
import './style.scss';
import axios from "@/api/axios";

const ADD_GAME = "/addgame";

export default function AdminPanel() {
  const { user, setUser } = useContext(UserContext);
  const router = useRouter();
  const [selectedFile, setSelectedFile] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const role = cookie.get('roleType');
    if (role !== "employee") {
      router.push('/store');
    }
    if (Object.keys(user).length === 0) {
      const isLoggedIn = setUserData(setUser);
      if (!isLoggedIn) {
        router.push('/login');
      }
    }
  }, []);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
    if (file && file.type !== 'application/json') {
      setError("Nieprawidłowy format pliku JSON.");
    } else {
      setError(null);
    }
  };

  const handleSubmit = async () => {
    if (selectedFile) {
      const formData = new FormData();
      formData.append('file', selectedFile);

      try {
        const res = await axios.post(ADD_GAME, formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
        if (res.status === 200) {
          alert("Dodano grę do bazy!");
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
    }
  };

  return (
    <>
      <div>
        {user.username && <NavBar user={user} />}
      </div>
      <div className="addGameMenuContainer">
        <div className="addGameMenu">
          <h2>Dodaj grę:</h2>
          <input type="file" accept=".json" onChange={handleFileChange} />
          {error && <p className="error">{error}</p>}
          <button onClick={handleSubmit}>Dodaj grę</button>
        </div>
      </div>
    </>
  );
}
