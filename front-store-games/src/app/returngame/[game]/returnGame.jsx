import { useRouter } from "next/navigation";
import { useFormik } from 'formik';
import * as Yup from 'yup';
import axios from "@/api/axios";

const RETURN_URL = '/returngame';

const inputStyle = "bg-gun-powder-950 border-1 rounded-custom pl-2";

export default function ReturnGameModule ({ elemId, gameName }) {
  const router = useRouter();

  const initialValues = {
    gameId: elemId,
    comment: ''
  };

  const validationSchema = Yup.object({
    comment: Yup.string().min(5, "Za krótki komentarz").max(200, "Za długi komentarz").required('Komentarz nie może być pusty')
  });

  const onSubmit = async (values, { resetForm }) => {
    const data = {
      gameId: values.gameId,
      comment: values.comment
    };

    try {
      const res = await axios.post(RETURN_URL, data, { withCredentials: true });

      if (res.data.status === "success") {
        alert("Wysłano żadanie zwrotu.");

        router.push('/library');
      }
    } catch (err) {
      if (err.response && err.response.data.error) {
        if (err.response.status === 401) {
          router.push('/');
        }
        alert(err.response.data.error);

        router.push('/library');
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
      <div className="input">
        <h3>Zwróć grę:</h3>
        <h4>{gameName}</h4>
        <label>
          Komentarz do zwrotu:
        </label>
        <textarea
          className={inputStyle}
          name="comment"
          value={values.comment}
          onChange={handleChange}
          rows={8}
        />
      </div>
      <button type="submit">Wyślij</button>
      <div className="errs">
        <span className="text-xs text-vivid-violet-200">{errors.comment}</span>
      </div>
    </form>
  );
}
