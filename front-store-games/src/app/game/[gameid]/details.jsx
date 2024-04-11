"use client";

import { useReducer } from 'react';

const initialState = {
  currentImageIndex: 0,
};

const reducer = (state, action) => {
  switch (action.type) {
    case 'NEXT_IMAGE':
      return {
        ...state,
        currentImageIndex: (state.currentImageIndex + 1) % action.images.length,
      };
    case 'PREV_IMAGE':
      return {
        ...state,
        currentImageIndex:
          (state.currentImageIndex - 1 + action.images.length) % action.images.length,
      };
    default:
      return state;
  }
};

const ImageBox = ({ images }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const nextImage = () => {
    dispatch({ type: 'NEXT_IMAGE', images });
  };

  const prevImage = () => {
    dispatch({ type: 'PREV_IMAGE', images });
  };

  return (
    <div>
      <img src={images[state.currentImageIndex]} alt="Zdjęcie" />
      <div className='buttons'>
        <button onClick={prevImage}>←</button>
        <span>{state.currentImageIndex + 1}/{images.length}</span>
        <button onClick={nextImage}>→</button>
      </div>
    </div>
  );
};

export default function GameDetails ({ game, addToShoppingCart }) {
  return(
    <div className='game'>
      <h2>{game.name}</h2>
      <h3>{game.publisher}</h3>
      <ImageBox images={game.photos} />
      <div className='price'>
        <span>Cena: {game.price} zł</span>
        <button onClick={addToShoppingCart}>Dodaj do koszyka</button>
      </div>
      <div className='description'>{game.description}</div>
      <div className='releaseYear'>
        <span>Data wydania: </span>
        <span>{game.releaseYear}</span>
      </div>
      <ul className='genres'>
        <span>Gatunki:</span>
        {game.genres.map((elem, index) => (
          <li key={index}>{elem}</li>
        ))}
      </ul>
      <div className='reviews'>
        <h3>Oceny:</h3>
        <ul>
          {game.reviews.map((elem, index) => (
            <li key={index}>
              <h4>Ocena: {elem.grade}</h4>
              <span>{elem.comment}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
