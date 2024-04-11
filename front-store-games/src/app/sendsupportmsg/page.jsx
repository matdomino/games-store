"use client";

import { useContext, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useFormik } from 'formik';
import * as Yup from 'yup';
import axios from '@/api/axios';
import NavBar from "../NavBar";
import { setUserData } from "../setUserContext";
import UserContext from "../context/UserContext";
import './style.scss';

const SEND_URL = '/sendsupportmsg';

const inputStyle = "bg-gun-powder-950 shadow-custom border-1 rounded-custom pl-2";

export default function SendSupportMsg () {
  const { user, setUser } = useContext(UserContext);
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

  const initialValues = {
    topic: '',
    msg: ''
  };

  const validationSchema = Yup.object({
    topic: Yup.string().required('Temat jest wymagany.'),
    msg: Yup.string().required('Wiadomość jest wymagana.')
  });

  const onSubmit = async (values, { resetForm }) => {
    const messageData = {
      topic: values.topic,
      msg: values.msg
    };

    try {
      const sendMsg = await axios.post(SEND_URL, messageData, { withCredentials: true });

      if (sendMsg.status === 200) {
        alert('Wysłano wiadomość.');
        router.push('/support');
      }

      resetForm();
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

  const backButton = () => {
    router.push('/support');
  };

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit
  });

  const { values, handleChange, handleSubmit, errors } = formik;

  return(
    <>
      {user.username && <NavBar user={user} />}
      <div className="form-container">
        <div className="supportForm">
          <form onSubmit={handleSubmit}>
            <button className="backButton" onClick={backButton}>←</button>
            <h2 className="text-2xl font-bold pb-4">Wyślij wiadomość</h2>
            <div className="pb-2 flex flex-col">
              <label>
                Temat:
              </label>
              <input
                className={inputStyle}
                type="text"
                name="topic"
                value={values.topic}
                onChange={handleChange}
              />
              <span className="text-xs text-vivid-violet-200">{errors.topic}</span>
            </div>
            <div className="pb-2 flex flex-col">
              <label>
                Wiadomość:
              </label>
              <textarea
                className={inputStyle}
                name="msg"
                value={values.msg}
                onChange={handleChange}
                rows={6}
              />
              <span className="text-xs text-vivid-violet-200">{errors.msg}</span>
            </div>
            <button type="submit" className="border-1 border-vivid-violet-900 p-2 rounded-custom text-vivid-violet-900 bg-vivid-violet-300 mt-2">Wyślij</button>
          </form>
        </div>
      </div>
    </>
  );
}
