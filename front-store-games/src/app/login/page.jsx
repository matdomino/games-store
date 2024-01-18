"use client"

import { useState, useEffect, useContext } from "react";
import { useRouter } from "next/navigation";
import cookie from 'js-cookie';
import UserContext from "../context/UserContext";
import { setUserData } from "../setUserContext";

export default function Login() {
  const [ form, setForm ] = useState(true);
  const { user, setUser } = useContext(UserContext);
  const router = useRouter();

  useEffect(() => {
    if (Object.keys(user).length === 0) {
      const isLoggedIn = setUserData(setUser);
      if (isLoggedIn) {
        router.push('/store');
      }
    }
  }, []);

  const handleToggleForm = () => {
    setForm(!form);
  }

  return (
    <>
      <div className="navBar">
        <span className="name">Games Store</span>
        <a href="https://github.com/matdomino" target="_blank">Mateusz Domino 2024</a>
      </div>
      <div className="form">
        {/* { form ? <SignIn toggleForm={handleToggleForm} /> : <SignUp toggleForm={handleToggleForm} /> } */}
      </div>
    </>
  );
}
