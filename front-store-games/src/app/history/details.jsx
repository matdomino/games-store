function Address ({details}) {
  return(
    <div className="address">
          <h2>Adres:</h2>
          <ul>
            <li key={"city"}>Miasto: {details.billingInfo.city}</li>
            <li key={"street"}>Ulica: {details.billingInfo.street}</li>
            <li key={"home"}>Dom: {details.billingInfo.home}</li>
            <li key={"flat"}>Mieszkanie: {details.billingInfo.flat}</li>
            <li key={"postcode"}>Mieszkanie: {details.billingInfo.postCode}</li>
          </ul>
    </div>
  );
}

export function FundsAdd({ details }) {
  return(
    <div className="details">
        <div className="info">
          <h2>Dodanie środków do konta</h2>
          <div>Data: {new Date(details.date).toLocaleString()}</div>
          <h3>Wartość: {details.value}</h3>
          <div>Rodzaj płatności: {details.payment}</div>
          <div>Saldo konta przed: {details.oldBalance}</div>
          <div>Saldo konta po: {details.newBalance}</div>
        </div>
        <Address details={details} />
    </div>
  );
}

export function OrderFinalization({ details }) {
  return(
    <div className="details">
        <div className="info">
          <h2>Finalizacja zamówienia</h2>
          <div>Data: {new Date(details.date).toLocaleString()}</div>
          <h3>Koszyk: </h3>
          <ul>
            {details.cart.map((elem, index) => {
              return(
                <li key={index}>{elem.name} - {elem.price} zł</li>
              );
            })}
          </ul>
          <h3>Razem: {details.total}</h3>
          <div>Saldo konta przed: {details.oldBalance}</div>
          <div>Saldo konta po: {details.newBalance}</div>
        </div>
        <Address details={details} />
    </div>
  );
}

export function Return({ details }) {
  return(
    <div className="details">
        <div className="info">
          <h2>{details.returned}</h2>
          <div>Data: {new Date(details.date).toLocaleString()}</div>
          <h3>Wartość: {details.total}</h3>
          <div>Saldo konta przed: {details.oldBalance}</div>
          <div>Saldo konta po: {details.newBalance}</div>
        </div>
        <Address details={details} />
    </div>
  );
}