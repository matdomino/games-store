import { useRouter } from "next/navigation";
import { useFormik } from 'formik';
import * as Yup from 'yup';
import axios from "@/api/axios";

const ADDRESS_CHANGE = '/changeaddress';

const inputStyle = "bg-gun-powder-950 shadow-custom border-1 rounded-custom pl-2";

export default function PasswordChange ({ backFun }) {
  const router = useRouter();

  const initialValues = {
    firstName: '',
    lastName: '',
    city: '',
    street: '',
    home: '',
    flat: '',
    postCode: ''
  };

  const validationSchema = Yup.object({
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
      firstName: values.firstName,
      lastName: values.lastName,
      city: values.city,
      street: values.street,
      home: values.home,
      flat: values.flat,
      postCode: values.postCode
    };

    try {
      const res = await axios.put(ADDRESS_CHANGE, userData, { withCredentials: true });

      if (res.data.status === "success") {
        router.push('/store');
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

    resetForm();
  };

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit
  });

  const { values, handleChange, handleSubmit, errors } = formik;

  return(
    <form className="form" onSubmit={handleSubmit}>
      <button className="goBack" onClick={backFun}>←</button>
      <div className="input">
        <h3>Zmień adres:</h3>
        <label>
          Imie:
        </label>
        <input
          className={inputStyle}
          type="text"
          name="firstName"
          value={values.firstName}
          onChange={handleChange}
        />
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
        <label>
          Nr domu:
        </label>
        <input
          className={inputStyle}
          type="text"
          name="home"
          value={values.home}
          onChange={handleChange}
        />
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
      <button type="submit">Zmień</button>
      <div className="errs">
        <span className="text-xs text-vivid-violet-200">{errors.firstName}</span>
        <span className="text-xs text-vivid-violet-200">{errors.lastName}</span>
        <span className="text-xs text-vivid-violet-200">{errors.city}</span>
        <span className="text-xs text-vivid-violet-200">{errors.street}</span>
        <span className="text-xs text-vivid-violet-200">{errors.home}</span>
        <span className="text-xs text-vivid-violet-200">{errors.flat}</span>
        <span className="text-xs text-vivid-violet-200">{errors.postCode}</span>
      </div>
    </form>
  );
}
