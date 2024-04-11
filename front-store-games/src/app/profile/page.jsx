"use client";

import { useEffect, useState, useContext } from "react";
import { useRouter } from "next/navigation";
import UserContext from "../context/UserContext";
import { setUserData } from "../setUserContext";
import NavBar from "../NavBar";
import './style.scss';
import axios from "@/api/axios";
import EmailChange from "./EmailChange";
import UsernameChange from "./UsernameChange";
import AddressChange from "./AddressChange";
import PasswordChange from "./PasswordChange";

const USER_DATA_URL = "/getuserdata";

export default function Profile() {
  const { user, setUser } = useContext(UserContext);
  const [ userInfo, setUserInfo ] = useState({});
  const [ component, setComponent ] = useState("UserInfoComponent");
  const router = useRouter();

  useEffect(() => {
    const dataFetch = async () => {
      try {
        const res = await axios.get(USER_DATA_URL, { withCredentials: true });

        if (res.data.status === "success") {
          setUserInfo(res.data.data);
        }
      } catch (err) {
        console.error(err);
        if (err.message.includes('Network Error')) {
          alert('Brak odpowiedzi serwera. Skontaktuj się z administratorem.');
        } else {
          router.push('/');
        }
      }
    };
    dataFetch();
  }, []);

  useEffect(() => {
    if (Object.keys(user).length === 0) {
      const isLoggedIn = setUserData(setUser);
      if (!isLoggedIn) {
        router.push('/login');
      }
    }
  }, []);

  useEffect(() => {
  }, [component]);

  const toggleToEmailChange = () => {
    setComponent("EmailChange");
  };

  const toggleToUsernameChange = () => {
    setComponent("UsernameChange");
  };

  const toggleToAddressChange = () => {
    setComponent("AddressChange");
  };

  const toggleToPassChange = () => {
    setComponent("PasswordChange");
  };

  const toggleToUserInfoComponent = () => {
    setComponent('UserInfoComponent');
  };

  const UserInfoComponent = ({ user }) => {
    return(
      <div className="info">
        <h3>Dane:</h3>
        <div className="generalInfo">
          <h4>Email:</h4>
          <div className="email">
            <span>{user.email}</span>
            <button onClick={toggleToEmailChange}>Zmień</button>
          </div>
          <h4>Nazwa użytkownika:</h4>
          <div className="username">
            <span>{user.username}</span>
            <button onClick={toggleToUsernameChange}>Zmień</button>
          </div>
        </div>
        <div className="Address">
          <div className="addressInfo">
            <h4>Adres: </h4>
            <span>Imię: {user.address.firstName}</span>
            <span>Nazwisko: {user.address.lastName}</span>
            <span>Miasto: {user.address.city}</span>
            <span>Ulica: {user.address.street}</span>
            <span>Nr domu: {user.address.home}</span>
            <span>Nr mieszkania: {user.address.flat}</span>
            <span>Kod pocztowy: {user.address.postCode}</span>
            <button onClick={toggleToAddressChange}>Zmień</button>
          </div>
        </div>
        <div className="pass">
          <button onClick={toggleToPassChange}>Zmień hasło</button>
        </div>
      </div>
    );
  };

  const renderComponent = () => {
    switch (component) {
      case "EmailChange":
        return <EmailChange backFun={toggleToUserInfoComponent} />;
      case "UsernameChange":
        return <UsernameChange backFun={toggleToUserInfoComponent} />;
      case "AddressChange":
        return <AddressChange backFun={toggleToUserInfoComponent} />;
      case "PasswordChange":
        return <PasswordChange backFun={toggleToUserInfoComponent} />;
      default:
        return <UserInfoComponent user={userInfo} />;
    }
  };

  return (
    <>
      {user.username && <NavBar user={user} />}
      <main>
        {Object.keys(userInfo).length > 0 && renderComponent()}
      </main>
    </>
  );
}
