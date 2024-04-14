import { useRouter } from "next/navigation";
import { useFormik } from 'formik';
import * as Yup from 'yup';
import axios from "@/api/axios";

const SEARCH_GAMES = '/searchgames';

const GET_GAMES = '/storegames';

const inputStyle = "bg-gun-powder-950 shadow-custom border-1 rounded-custom pl-2";

export default function FilterForm ({ setGames }) {
  const router = useRouter();

  const initialValues = {
    searchPhrase: '',
    sortBy: 'name',
    sortOrder: 'asc',
    filterBy: '',
    minPrice: '',
    maxPrice: ''
  };

  const validationSchema = Yup.object({
    searchPhrase: Yup.string().min(1, "Za krótka fraza").max(20, "Za długa fraza"),
    minPrice: Yup.number().typeError("Cena min musi być liczbą.").integer("Cena min musi być liczbą całkowitą").min(0, "Za niska cena min").max(100000, "Za wysoka cena min"),
    maxPrice: Yup.number().typeError("Cena max musi być liczbą.").integer("Cena max musi być liczbą całkowitą").min(0, "Za niska cena max").max(100000, "Za wysoka cena max"),
    sortBy: Yup.string().required("Wybierz sortowanie"),
    sortOrder: Yup.string().required("Wybierz kolejność sortowania")
  });

  const onSubmit = async (values, { resetForm }) => {
    const searchData = {
      searchPhrase: values.searchPhrase,
      sortBy: values.sortBy,
      sortOrder: values.sortOrder,
      filterBy: values.filterBy,
      minPrice: parseInt(values.minPrice),
      maxPrice: parseInt(values.maxPrice)
    };

    const filterData = {
      sortBy: values.sortBy,
      sortOrder: values.sortOrder,
      filterBy: values.filterBy,
      minPrice: parseInt(values.minPrice),
      maxPrice: parseInt(values.maxPrice)
    };

    try {
      let res = null;

      if (values.searchPhrase) {
        res = await axios.post(SEARCH_GAMES, searchData, { withCredentials: true });
      } else {
        res = await axios.post(GET_GAMES, filterData, { withCredentials: true });
      }

      if (res.data.status === "success") {
        setGames(res.data.games);
      } else {
        alert('Wystąpił błąd podczas przetwarzania żądania.');
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

  const { values, handleChange, handleSubmit, setFieldValue, errors } = formik;

  return(
    <form className="form" onSubmit={handleSubmit}>
      <h3>Filtruj: </h3>
      <div className="formOptions">
        <div>
          <label>
            Wyszukaj:
          </label>
          <input
            className={inputStyle}
            type="text"
            name="searchPhrase"
            value={values.searchPhrase}
            onChange={handleChange}
          />
        </div>
        <div>
          <select
            className={inputStyle}
            name="sortBy"
            value={values.sortBy}
            onChange={handleChange}
          >
            <option value="">Sortuj według:</option>
            <option value="name">Nazwa</option>
            <option value="price">Cena</option>
            <option value="releaseYear">Rok wydania</option>
          </select>
        </div>
        <div>
          <label>
            Kolejność:
          </label>
          <label className="radiolabel">
            <input
              className={inputStyle}
              type="radio"
              name="sortBy"
              value="asc"
              checked={values.sortOrder === "asc"}
              onChange={() => setFieldValue('sortOrder', 'asc')}
            />
            Rosnąco
          </label>
          <label className="radiolabel">
            <input
              className={inputStyle}
              type="radio"
              name="sortBy"
              value="desc"
              checked={values.sortOrder === "desc"}
              onChange={() => setFieldValue('sortOrder', 'desc')}
            />
            Malejąco
          </label>
        </div>
        <div>
          <select
            className={inputStyle}
            name="filterBy"
            value={values.filterBy}
            onChange={handleChange}
          >
            <option value="">Filtruj przez:</option>
            <option value="FPS">FPS</option>
            <option value="RPG">RPG</option>
            <option value="Przygodowe">Przygodowe</option>
            <option value="Drużynowe">Drużynowe</option>
            <option value="Sandbox">Sandbox</option>
            <option value="Turowe">Turowe</option>
            <option value="Symulatory">Symulatory</option>
            <option value="Survival">Survival</option>
          </select>
        </div>
        <div>
          <label>
            Cena min:
          </label>
          <input
            className={inputStyle}
            type="text"
            name="minPrice"
            value={values.minPrice}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>
            Cena max:
          </label>
          <input
            className={inputStyle}
            type="text"
            name="maxPrice"
            value={values.maxPrice}
            onChange={handleChange}
          />
        </div>
      </div>
      <button type="submit">Filtruj</button>
      <div className="errs">
        <span className="text-xs text-vivid-violet-200">{errors.searchPhrase}</span>
        <span className="text-xs text-vivid-violet-200">{errors.sortBy}</span>
        <span className="text-xs text-vivid-violet-200">{errors.sortOrder}</span>
        <span className="text-xs text-vivid-violet-200">{errors.minPrice}</span>
        <span className="text-xs text-vivid-violet-200">{errors.maxPrice}</span>
      </div>
    </form>
  );
}
