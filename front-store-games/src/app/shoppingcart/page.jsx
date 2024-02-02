"use client"

import { useEffect, useContext, useState } from "react";
import { useRouter } from "next/navigation";
import UserContext from "../context/UserContext";
import { setUserData } from "../setUserContext";
import axios from "@/api/axios";
import NavBar from "../NavBar";
import './style.scss';

const CHECKOUT_URL = '/checkout';
const FINALIZE_URL = '/finalizeorder';

export default function ShoppingCart() {
  const { user, setUser } = useContext(UserContext);
  const [ reload, setReload ] = useState(false);
  const [ checkoutData, setCheckoutData ] = useState(null);
  const router = useRouter();
  console.log(user);

  const getChekout = async () => {
    try {
      const res = await axios.get(CHECKOUT_URL, { withCredentials: true });

      if (res.status === 200) {
        setCheckoutData(res.data);
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
  };

  useEffect(() => {
    if (Object.keys(user).length === 0) {
      const isLoggedIn = setUserData(setUser);
      if (!isLoggedIn) {
        router.push('/login');
      }
    }

    getChekout();
  }, [reload]);

  const finalizeOrder = async () => {
    try {
      const res = await axios.post(FINALIZE_URL, { withCredentials: true });

      if (res.status === 200) {
        alert('Twoje zamówienie zostało zrealizowane!')
        setReload(!reload);
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

  const deleteFromCart = async (gameId) => {
    try {
      const DELETE_URL = `/deletefromcart/${gameId}`;
      const res = await axios.delete(DELETE_URL, { withCredentials: true });

      if (res.status === 200) {
        alert("Usunięto pozycje z koszyka");
        setReload(!reload);
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
  };

  const Cart = ({checkoutData}) => {
    console.log(checkoutData);
    return(
      <div className="cart">
          <h3>Koszyk:</h3>
          <div className="address">
            <h2>Adres:</h2>
            <ul>
              <li>Miasto: {checkoutData.address.city}</li>
              <li>Ulica: {checkoutData.address.street}</li>
              <li>Nr domu: {checkoutData.address.home}</li>
              <li>Nr mieszkania: {checkoutData.address.flat}</li>
              <li>Kod pocztowy: {checkoutData.address.postCode}</li>
            </ul>
          </div>
          <div className="gameslist">
            <h2>Gry:</h2>
            <ul>
              {checkoutData.shoppingCart.map((elem, index) => (
                <li>
                  {elem.name} {elem.price} zł <button onClick={() => deleteFromCart(elem._id)}>Usuń</button>
                </li>
              ))}
            </ul>
          </div>
          <button onClick={() => finalizeOrder()}>Kup gry</button>
      </div>
    );
  }

  return (
    <div>
      {user.username && <NavBar user={user} />}
      <main>
        <div className="cartMenu">
          { checkoutData ? <Cart checkoutData={checkoutData} /> : null }
        </div>
      </main>
    </div>

  );
}
