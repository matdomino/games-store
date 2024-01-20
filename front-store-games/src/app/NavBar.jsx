export default function NavBar(user) {
  return (
      <div className="navBar">
        <div>
          <a href="/store">SKLEP</a>
          <a href="/store">BIBLIOTEKA</a>
          <a href="/store">POMOC</a>
          <a href="/store">{user.user.username.toUpperCase()}</a>
        </div>
        <div>
        <a className="walletBalance" href="#">Stan konta: {user.user.walletBalance}</a>
        <a href="#">Wyloguj się</a>
        </div>
      </div>
  );
}
