"use client";

import { useEffect, useContext } from "react";
import { useRouter } from "next/navigation";
import UserContext from "../context/UserContext";
import axios from "@/api/axios";

const LOGOUT_URL = '/logout';


export default function Logout() {
  const { setUser } = useContext(UserContext);
  const router = useRouter();

  const logout = async () => {
    try {
      const res = await axios.delete(LOGOUT_URL, { withCredentials: true });
      if (res.data.status) {
        setUser({});
        router.push('/');
      } else {
        alert('Wystąpił błąd podczas przetwarzania żądania.');
      }
    } catch {
      alert('Brak odpowiedzi serwera. Skontaktuj się z administratorem.');
    }
  };

  useEffect(() => {
    logout();
  }, []);

  return (
    <>
    </>
  );
}
