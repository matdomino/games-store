export const setUserData = (setUser) => {
    const userData = { data: "data" };    // zmienic to dla testu

    setUser(userData);

    return false;    // dodac sprawdzania ciasteczek - dla testow
};


// dodac tu ze jesli context UserContext pusty to pobieranie danych z bazy