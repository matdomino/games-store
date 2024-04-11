"use client";

import { useEffect, useContext, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "@/api/axios";
import UserContext from "../context/UserContext";
import { setUserData } from "../setUserContext";
import NavBar from "../NavBar";
import './style.scss';
import {FundsAdd, OrderFinalization, Return} from "./details";

const HISTORY_URL = '/gettransactionshistory';

export default function Notifications() {
  const { user, setUser } = useContext(UserContext);
  const [ history, setHistory ] = useState(null);
  const [ selectedId, setSelectedId ] = useState(null);
  const [ selectedDetails, setSelectedDetails ] = useState(null);
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

  const getHistoryList = async () => {
    try {
      const res = await axios.get(HISTORY_URL, { withCredentials: true });
      if (res.status === 200) {
        setHistory(res.data.transactions);
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

  useEffect(() => {
    getHistoryList();
  }, []);

  const FetchTransactionDetails = async (elem) => {
    const TRANSACTION_DETAILS_URL = `/gettransactiondetails/${elem}`;
    try {
      const res = await axios.get(TRANSACTION_DETAILS_URL, { withCredentials: true });
      if (res.status === 200) {
        setSelectedId(elem);
        setSelectedDetails(res.data);
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

  const TransactionDetails = ({details}) => {
    if (details.type === "Funds add to balance") {
      return(
        <FundsAdd details={details}/>
      );
    } else if (details.type === "Order finalization") {
      return(
        <OrderFinalization details={details}/>
      );
    } else {
      return(
        <Return details={details}/>
      );
    }
  };

  const HistoryList = ({history}) => {
    return (
      <div className="historyList">
        <h1>Historia transakcji:</h1>
        <ul>
          {history.map((elem, index) => {
            return(
              <li key={index} id={elem} onClick={() => FetchTransactionDetails(elem)}>
                ID: {elem} {selectedId === elem ? "▴" : "▾"}
                {selectedId === elem ? <TransactionDetails details={selectedDetails} /> : null}
              </li>
            );
          })}
        </ul>
      </div>
    );
  };

  return (
    <>
      {user.username && <NavBar user={user} />}
      <main>
        {history !== null ? (history.length > 0 ? <HistoryList history={history}/> : null) : null}
      </main>
    </>
  );
}
