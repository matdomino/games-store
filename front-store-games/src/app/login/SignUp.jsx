import { useContext } from "react";
import { useRouter } from "next/navigation";
import { useFormik } from 'formik';
import * as Yup from 'yup';
import axios from '@/api/axios';
import { setUserData } from "../setUserContext";
import UserContext from "../context/UserContext";

const REGISTER_URL = '/register';

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
    <div>
      <form onSubmit={handleSubmit}>
        <h2>Zarejestruj się</h2>
        <div className="general">
          <div>
            <label>
              Email:
            </label>
            <input
              type="text"
              name="email"
              value={values.email}
              onChange={handleChange}
            />
          </div>
          <div>
            <label>
              Nazwa użytkownika:
            </label>
            <input
              type="text"
              name="username"
              value={values.username}
              onChange={handleChange}
            />
          </div>
          <div>
            <label>
              Hasło:
            </label>
            <input
              type="password"
              name="password"
              value={values.password}
              onChange={handleChange}
            />
          </div>
          <div>
            <label>
              Powtórz hasło:
            </label>
            <input
              type="password"
              name="passwordRep"
              value={values.passwordRep}
              onChange={handleChange}
            />
          </div>
        </div>
        <div className="adress">
          <div>
            <label>
              Imię:
            </label>
            <input
              type="text"
              name="firstName"
              value={values.firstName}
              onChange={handleChange}
            />
          </div>
          <div>
            <label>
              Nazwisko:
            </label>
            <input
              type="text"
              name="lastName"
              value={values.lastName}
              onChange={handleChange}
            />
          </div>
          <div>
            <label>
              Miasto:
            </label>
            <input
              type="text"
              name="city"
              value={values.city}
              onChange={handleChange}
            />
          </div>
          <div>
            <label>
              Ulica (opcjonalne):
            </label>
            <input
              type="text"
              name="street"
              value={values.street}
              onChange={handleChange}
            />
          </div>
          <div>
            <label>
              Nr. domu:
            </label>
            <input
              type="text"
              name="home"
              value={values.home}
              onChange={handleChange}
            />
          </div>
          <div>
            <label>
              Nr mieszkania (opcjonalne):
            </label>
            <input
              type="text"
              name="flat"
              value={values.flat}
              onChange={handleChange}
            />
          </div>
          <div>
            <label>
              Kod pocztowy:
            </label>
            <input
              type="text"
              name="postCode"
              value={values.postCode}
              onChange={handleChange}
            />
          </div>
        </div>
        <button type="submit">Zarejestruj się</button>
        <div>
          <a href="#" onClick={toggleForm}>Masz już konto? Kliknij tutaj.</a>
        </div>
        <div className='errs'>
          <span>{errors.email}</span>
          <span>{errors.username}</span>
          <span>{errors.password}</span>
          <span>{errors.passwordRep}</span>
          <span>{errors.firstName}</span>
          <span>{errors.lastName}</span>
          <span>{errors.city}</span>
          <span>{errors.street}</span>
          <span>{errors.home}</span>
          <span>{errors.flat}</span>
          <span>{errors.postCode}</span>
        </div>
      </form>
    </div>
  );
}