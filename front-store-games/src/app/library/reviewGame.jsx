import { useRouter } from "next/navigation";
import { useFormik } from 'formik';
import * as Yup from 'yup';
import axios from "@/api/axios";

const REVIEW_URL = '/reviewgame';

const inputStyle = "bg-gun-powder-950 shadow-custom border-1 rounded-custom pl-2";

export default function ReviewGame ({ elemId }) {
  const router = useRouter();

  const initialValues = {
    gameId: elemId,
    grade: '',
    comment: ''
  };

  const validationSchema = Yup.object({
    grade: Yup.string().required('Wybierz ocenę gry'),
    comment: Yup.string().min(5, "Za krótki komentarz").max(200, "Za długi komentarz").required('Komentarz nie może być pusty')
  });

  const onSubmit = async (values, { resetForm }) => {
    const data = {
      gameId: values.gameId,
      grade: parseInt(values.grade),
      comment: values.comment
    };

    try {
      const res = await axios.post(REVIEW_URL, data, { withCredentials: true });

      if (res.data.status === "success") {
        alert("Zrecenzowano grę");
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
      <div className="input">
        <h3>Zrecenzuj grę:</h3>
        <label>
          Ocena:
        </label>
        <select
          className={inputStyle}
          name="grade"
          value={values.grade}
          onChange={handleChange}
        >
          <option value="">Wybierz ocenę</option>
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
          <option value="4">4</option>
          <option value="5">5</option>
        </select>
        <label>
          Komentarz:
        </label>
        <textarea
          className={inputStyle}
          name="comment"
          value={values.comment}
          onChange={handleChange}
        />
      </div>
      <button type="submit">Wyślij</button>
      <div className="errs">
        <span className="text-xs text-vivid-violet-200">{errors.comment}</span>
      </div>
    </form>
  );
}
