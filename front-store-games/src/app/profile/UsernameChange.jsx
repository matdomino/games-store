import { useRouter } from "next/navigation";
import { useFormik } from 'formik';
import * as Yup from 'yup';
import axios from "@/api/axios";

const USERNAME_CHANGE = '/changeusername';

const inputStyle = "bg-gun-powder-950 shadow-custom border-1 rounded-custom pl-2";

export default function EmailChange ({ backFun }) {
  const router = useRouter();

  const initialValues = {
    username: '',
    password: ''
  };

  const validationSchema = Yup.object({
    username: Yup.string().min(4, "Za krótka nazwa użytkownika").max(20, "Za długa nazwa użytkownika").required('Nazwa użytkownika nie może być pusta.'),
    password: Yup.string().required("Hasło nie może być puste")
  });

  const onSubmit = async (values, { resetForm }) => {
    const userData = {
      user: values.username,
      pass: values.password
    };

    try {
      const res = await axios.put(USERNAME_CHANGE, userData, { withCredentials: true });

      if (res.data.status === "success") {
        router.push('/');
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
        <h3>Zmień nazwe użytkownika:</h3>
        <label>
          Nazwa:
        </label>
        <input
          className={inputStyle}
          type="text"
          name="username"
          value={values.username}
          onChange={handleChange}
        />
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
      <button type="submit">Zmień</button>
      <div className="errs">
        <span className="text-xs text-vivid-violet-200">{errors.username}</span>
        <span className="text-xs text-vivid-violet-200">{errors.password}</span>
      </div>
    </form>
  );
}
