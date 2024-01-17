"use client"

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import cookie from 'js-cookie';

export default function Login() {
  const [ form, setForm ] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const isLoggedIn = cookie.get("isLoggedIn");
    if (isLoggedIn) {
      router.push('/');
    }
  }, []);

  const handleToggleForm = () => {
    setForm(!form);
  }

  return (
    <>
      <div className="navBar">
        <span className="name">Games Store</span>
        <a href="https://github.com/matdomino" target="_blank">Mateusz Domino 2023-2024</a>
      </div>
      <div className="form">
        {/* { form ? <SignIn toggleForm={handleToggleForm} /> : <SignUp toggleForm={handleToggleForm} /> } */}
      </div>
    </>
  );
}
