import { useContext } from "react";
import { useRouter } from "next/navigation";
import { useFormik } from 'formik';
import * as Yup from 'yup';
import axios from '@/api/axios';
import { setUserData } from "../setUserContext";
import UserContext from "../context/UserContext";

const REGISTER_URL = '/register';

const inputStyle = "bg-gun-powder-950 shadow-custom border-1 rounded-custom pl-2";

export default function SignUp ({ toggleForm }) {
  const { setUser } = useContext(UserContext);
  const router = useRouter();

  const initialValues = {
    email: '',
    username: '',
    password: '',
    passwordRep: '',
    firstName: '',
    lastName: '',
    city: '',
    street: '',
    home: '',
    flat: '',
    postCode: ''
  };

  const validationSchema = Yup.object({
    email: Yup.string().email('Niepoprawny adres email').max(35, 'Za długi email').required('Email nie może być pusty'),
    username: Yup.string().min(4, "Za krótka nazwa użytkownika").max(20, "Za długa nazwa użytkownika").required('Nazwa użytkownika nie może być pusta.'),
    password: Yup.string().min(5, 'Za krótkie hasło').max(30, "Za długie hasło").required('Hasło nie może być puste.'),
    passwordRep: Yup.string().oneOf([Yup.ref('password'), null], 'Hasła się nie zgadzają'),
    firstName: Yup.string().min(2, "Za krótkie imie").max(20, "Za długie imie").required('Imię nie może być puste'),
    lastName: Yup.string().min(2, "Za krótkie nazwisko").max(30, "Za długie nazwisko").required('Nazwisko nie może być puste'),
    city: Yup.string().min(3, "Za krótka nazwa miasta").max(30, "Za długa nazwa miasta").required("Miasto nie może być puste"),
    street: Yup.string().min(3, "Za krótka nazwa ulicy").max(30, "Za długa nazwa ulicy"),
    home: Yup.string().min(1, "Za krótki nr domu").max(4, "Za długi nr domu").required("Nr domu nie może być pusty"),
    flat: Yup.number().typeError("Nr mieszkania musi być liczbą.").integer("Nr mieszkania musi być liczbą całkowitą.").min(1, "Za mały nr domu").max(100, "Za duży nr domu"),
    postCode: Yup.string()
      .matches(/^\d{2}-\d{3}$/, "Niepoprawny kod pocztowy")
      .required("Kod pocztowy nie może być pusty")
  });

  const onSubmit = async (values, { resetForm }) => {
    const userData = {
      email: values.email,
      user: values.username,
      pass: values.password,
      address: {
        firstName: values.firstName,
        lastName: values.lastName,
        city: values.city,
        street: values.street,
        home: values.home,
        flat: values.flat !== '' ? parseInt(values.flat) : '',
        postCode: values.postCode
      }
    };

    try {
      const res = await axios.post(REGISTER_URL, userData, { withCredentials: true });

      if (res.data.status === 'success') {
        const isLoggedIn = setUserData(setUser);
        if (isLoggedIn) {
          router.push('/store');
        } else {
          router.push("/");
        }
      }
    } catch(err) {
      if (err.response && err.response.data.error) {
        alert(err.response.data.error);
      } else {
        alert('Brak odpowiedzi serwera. Skontaktuj się z administratorem.');
      }
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
    <div className="border-1 border-vivid-violet-300 rounded-custom shadow-custom p-4" style={{ width: '40rem' }}>
      <form onSubmit={handleSubmit}>
        <h2 className="text-2xl font-bold pb-4">Zarejestruj się</h2>
        <div className="flex w-full justify-between">
          <div className="adress w-1/2 mr-2">
            <div className="pb-2 flex flex-col">
              <label>
                Imię:
              </label>
              <input
                className={inputStyle}
                type="text"
                name="firstName"
                value={values.firstName}
                onChange={handleChange}
              />
            </div>
            <div className="pb-2 flex flex-col">
              <label>
                Nazwisko:
              </label>
              <input
                className={inputStyle}
                type="text"
                name="lastName"
                value={values.lastName}
                onChange={handleChange}
              />
            </div>
            <div className="pb-2 flex flex-col">
              <label>
                Miasto:
              </label>
              <input
                className={inputStyle}
                type="text"
                name="city"
                value={values.city}
                onChange={handleChange}
              />
            </div>
            <div className="pb-2 flex flex-col">
              <label>
                Ulica (opcjonalne):
              </label>
              <input
                className={inputStyle}
                type="text"
                name="street"
                value={values.street}
                onChange={handleChange}
              />
            </div>
            <div className="pb-2 flex flex-col">
              <label>
                Nr. domu:
              </label>
              <input
                className={inputStyle}
                type="text"
                name="home"
                value={values.home}
                onChange={handleChange}
              />
            </div>
            <div className="pb-2 flex flex-col">
              <label>
                Nr mieszkania (opcjonalne):
              </label>
              <input
                className={inputStyle}
                type="text"
                name="flat"
                value={values.flat}
                onChange={handleChange}
              />
            </div>
            <div className="pb-2 flex flex-col">
              <label>
                Kod pocztowy:
              </label>
              <input
                className={inputStyle}
                type="text"
                name="postCode"
                value={values.postCode}
                onChange={handleChange}
              />
            </div>
          </div>
          <div className="adress w-1/2 ml-2">
            <div className="pb-2 flex flex-col">
              <label>
                Email:
              </label>
              <input
              className={inputStyle}
                type="text"
                name="email"
                value={values.email}
                onChange={handleChange}
              />
            </div>
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
            <div className="pb-2 flex flex-col">
              <label>
                Powtórz hasło:
              </label>
              <input
                className={inputStyle}
                type="password"
                name="passwordRep"
                value={values.passwordRep}
                onChange={handleChange}
              />
            </div>
          </div>
        </div>
        <button type="submit" className="border-1 border-vivid-violet-900 p-2 rounded-custom text-vivid-violet-900 bg-vivid-violet-300 mt-2">Zarejestruj się</button>
        <div className="pb-2 pt-2">
          <a href="#" onClick={toggleForm}>Masz już konto? Kliknij tutaj.</a>
        </div>
        <div className="errs flex flex-col">
          <span className="text-xs text-vivid-violet-200">{errors.email}</span>
          <span className="text-xs text-vivid-violet-200">{errors.username}</span>
          <span className="text-xs text-vivid-violet-200">{errors.password}</span>
          <span className="text-xs text-vivid-violet-200">{errors.passwordRep}</span>
          <span className="text-xs text-vivid-violet-200">{errors.firstName}</span>
          <span className="text-xs text-vivid-violet-200">{errors.lastName}</span>
          <span className="text-xs text-vivid-violet-200">{errors.city}</span>
          <span className="text-xs text-vivid-violet-200">{errors.street}</span>
          <span className="text-xs text-vivid-violet-200">{errors.home}</span>
          <span className="text-xs text-vivid-violet-200">{errors.flat}</span>
          <span className="text-xs text-vivid-violet-200">{errors.postCode}</span>
        </div>
      </form>
    </div>
  );
}