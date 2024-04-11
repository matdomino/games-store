import { useRouter } from "next/navigation";
import { useFormik } from 'formik';
import * as Yup from 'yup';
import axios from "@/api/axios";

const PASSWORD_CHANGE = '/changepassword';

const inputStyle = "bg-gun-powder-950 shadow-custom border-1 rounded-custom pl-2";

export default function PasswordChange ({ backFun }) {
  const router = useRouter();

  const initialValues = {
    newPassword: '',
    password: ''
  };

  const validationSchema = Yup.object({
    newPassword: Yup.string().min(5, 'Za krótkie hasło').max(30, "Za długie hasło").required('Hasło nie może być puste.'),
    password: Yup.string().required('Podaj hasło')
  });

  const onSubmit = async (values, { resetForm }) => {
    const userData = {
      newPass: values.newPassword,
      oldPass: values.password
    };

    try {
      const res = await axios.put(PASSWORD_CHANGE, userData, { withCredentials: true });

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
        <h3>Zmień hasło:</h3>
        <label>
          Nowe hasło:
        </label>
        <input
          className={inputStyle}
          type="password"
          name="newPassword"
          value={values.newPassword}
          onChange={handleChange}
        />
        <label>
          Stare hasło:
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
        <span className="text-xs text-vivid-violet-200">{errors.newPassword}</span>
        <span className="text-xs text-vivid-violet-200">{errors.password}</span>
      </div>
    </form>
  );
}
