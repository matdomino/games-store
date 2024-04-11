"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import cookie from 'js-cookie';
import SignIn from "./SignIn";
import SignUp from "./SignUp";
import './style.scss';

export default function Login() {
  const [ form, setForm ] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const userName = cookie.get('username');
    const role = cookie.get('roleType');
    const walletBalance = cookie.get('walletBalance');

    if (userName && role && walletBalance) {
      router.push('/store');
    }
  }, []);

  const handleToggleForm = () => {
    setForm(!form);
  };

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
