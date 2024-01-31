"use client"

import { useState, useEffect, useContext } from "react";
import { useRouter } from "next/navigation";
import UserContext from "../context/UserContext";
import { setUserData } from "../setUserContext";
import SignIn from "./SignIn";
import SignUp from "./SignUp";

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
      <div className="navbar-navBar">
        <span className="name text-xl font-bold text-primary50">Games Store</span>
        <a href="https://github.com/matdomino" target="_blank" className="text-primary200">Mateusz Domino 2024</a>
      </div>
      <div className="form flex justify-center items-center min-h-screen">
        { form ? <SignIn toggleForm={handleToggleForm} /> : <SignUp toggleForm={handleToggleForm} /> }
      </div>
    </>
  );
}
