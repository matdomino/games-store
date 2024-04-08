export default function NavBar(user) {
  return (
      <div className="navbar-navBar bg-gun-powder-950">
        <div className="flex justify-between w-3/5">
          <a href="/store">SKLEP</a>
          <a href="/library">BIBLIOTEKA</a>
          <a href="/support">POMOC</a>
          <a href="/notifications">POWIADOMIENIA</a>
          <a href="/shoppingcart">KOSZYK</a>
          <a href="/profile">{user.user.username.toUpperCase()}</a>
        </div>
        <div className="flex justify-between w-1/4" style={{ maxWidth: '18rem' }}>
        <a className="walletBalance" href="/wallet">Stan konta: {user.user.walletBalance}</a>
        <a href="/logout">Wyloguj się</a>
        </div>
      </div>
  );
}
