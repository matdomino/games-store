import { useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useFormik } from 'formik';
import * as Yup from 'yup';
import axios from '@/api/axios';
import UserContext from "../context/UserContext";
import { setUserData } from "../setUserContext";

const ADDBALANCE_URL = '/addbalance';
const inputStyle = "bg-gun-powder-950 shadow-custom border-1 rounded-custom pl-2";

export default function AddBalance () {
  const { user, setUser } = useContext(UserContext);
  const [ isLoading, setIsLoading ] = useState(false);
  const router = useRouter();

  useEffect(() => {}, [user]);

  const initialValues = {
    paymentOption: '',
    balanceOption: ''
  };

  const validationSchema = Yup.object({
    paymentOption: Yup.string().required('Wybierz rodzaj płatności.'),
    balanceOption: Yup.number().required('Wybierz kwotę.')
  });

  const onSubmit = async (values, { resetForm }) => {
    setIsLoading(true);

    const data = {
      paymentOption: values.paymentOption,
      balanceOption: parseInt(values.balanceOption, 10)
    };

    try {
      const res = await axios.put(ADDBALANCE_URL, data, { withCredentials: true });
      if (res.data.status === "success") {
        try {
          await setUserData(setUser);
        } catch (error) {
          console.error(error);
          router.push('/login');
        }

        alert("Pomyślnie dodano środki na konto.");

        router.push('/wallet');
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

    resetForm();
    setIsLoading(false);
  };

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit
  });

  const backButton = () => {
    router.push('/wallet');
  };

  const { values, handleChange, handleSubmit, errors } = formik;

  return(
    <form onSubmit={handleSubmit}>
        <button onClick={backButton} className={"text-2xl "}>←</button>
        <h2 className="text-2xl font-bold pb-4 mb-4">Dodaj środki na konto</h2>
        <div className="pb-2 flex flex-col mb-4">
          <label className="text-vivid-violet-400 text-lg">
            Kwota:
          </label>
          <select
            name="balanceOption"
            value={values.balanceOption}
            onChange={handleChange}
            className={inputStyle}
          >
            <option value="" defaultValue>Wybierz</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
            <option value={200}>200</option>
            <option value={500}>500</option>
          </select>
        </div>
        <div className="pb-2 flex flex-col mb-4">
          <label className="text-vivid-violet-400 text-lg">
            Rodzaj płatności:
          </label>
          <div>
            <input
              type="radio"
              id="Card"
              name="paymentOption"
              value="Card"
              checked={values.paymentOption === "Card"}
              onChange={handleChange}
            />
            <label className="ml-2">Karta płatnicza</label>
          </div>
          <div>
            <input
              type="radio"
              id="Blik"
              name="paymentOption"
              value="Blik"
              checked={values.paymentOption === "Blik"}
              onChange={handleChange}
            />
            <label className="ml-2">Blik</label>
          </div>
          <div>
            <input
              type="radio"
              id="PayPal"
              name="paymentOption"
              value="PayPal"
              checked={values.paymentOption === "PayPal"}
              onChange={handleChange}
            />
            <label className="ml-2">PayPal</label>
          </div>
          <div>
            <input
              type="radio"
              id="Przelewy24"
              name="paymentOption"
              value="Przelewy24"
              checked={values.paymentOption === "Przelewy24"}
              onChange={handleChange}
            />
            <label className="ml-2">Przelewy24</label>
          </div>
        </div>
        <button type="submit" className="submit" disabled={isLoading}>
          {isLoading ? <div className="spinner-box"><div className="spinner"></div></div> : 'Dodaj środki'}
        </button>
        <div className="errs flex flex-col">
          <span className="text-xs text-vivid-violet-200">{errors.paymentOption}</span>
          <span className="text-xs text-vivid-violet-200">{errors.balanceOption}</span>
        </div>
      </form>
  );
}