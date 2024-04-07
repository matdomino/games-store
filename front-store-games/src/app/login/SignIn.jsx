import { useContext } from "react";
import { useRouter } from "next/navigation";
import { useFormik } from 'formik';
import * as Yup from 'yup';
import axios from '@/api/axios';
import { setUserData } from "../setUserContext";
import UserContext from "../context/UserContext";

const LOGIN_URL = '/login';

const inputStyle = "bg-gun-powder-950 shadow-custom border-1 rounded-custom pl-2";

export default function SignIn ({ toggleForm }) {
  const { setUser } = useContext(UserContext);
  const router = useRouter();

  const initialValues = {
    username: '',
    password: ''
  };

  const validationSchema = Yup.object({
    username: Yup.string().required('Nazwa użytkownika nie może być pusta.'),
    password: Yup.string().required('Hasło nie może być puste.')
  });

  const onSubmit = async (values, { resetForm }) => {
    const userData = {
      user: values.username,
      pass: values.password
    };

    try {
      const res = await axios.post(LOGIN_URL, userData, { withCredentials: true });
      if (res.data.status === 'success') {
        const isLoggedIn = setUserData(setUser);
        if (isLoggedIn) {
          const notifications = res.data.notifications.length;
          if (notifications > 0) {
            alert(`Masz ${notifications} nowych powiadomień.`);
          }
          router.push('/store');
        } else {
          router.push("/");
        }
      } else {
        alert('Niepoprawne dane logowania.');
      }
    } catch (err) {
      alert('Brak odpowiedzi serwera. Skontaktuj się z administratorem.');
    }

    resetForm();
  };

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit
  });

  const { values, handleChange, handleSubmit, errors } = formik;

  return(
    <div className="border-1 border-vivid-violet-300 rounded-custom shadow-custom p-4" style={{ width: '25rem' }}>
      <form onSubmit={handleSubmit}>
        <h2 className="text-2xl font-bold pb-4">Zaloguj się</h2>
        <div className="pb-2 flex flex-col">
          <label>
            Nazwa użytkownika:
          </label>
          <input
            className={inputStyle}
            type="text"
            name="username"
            value={values.username}
            onChange={handleChange}
          />
        </div>
        <div className="pb-2 flex flex-col">
          <label>
            Hasło:
          </label>
          <input
            className={inputStyle}
            type="password"
            name="password"
            value={values.password}
            onChange={handleChange}
          />
        </div>
        <button type="submit" className="border-1 border-vivid-violet-900 p-2 rounded-custom text-vivid-violet-900 bg-vivid-violet-300 mt-2">Zaloguj się</button>
        <div className="pb-2 pt-2">
          <a href="#" onClick={toggleForm}>Nie masz konta? Kliknij tutaj.</a>
        </div>
        <div className="errs flex flex-col">
          <span className="text-xs text-vivid-violet-200">{errors.username}</span>
          <span className="text-xs text-vivid-violet-200">{errors.password}</span>
        </div>
      </form>
    </div>
  );
}