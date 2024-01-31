export default function NavBar(user) {
  return (
      <div className="navbar-navBar">
        <div className="flex justify-between w-2/4">
          <a href="/store">SKLEP</a>
          <a href="/store">BIBLIOTEKA</a>
          <a href="/store">ZWROTY</a>
          <a href="/store">POMOC</a>
          <a href="/store">{user.user.username.toUpperCase()}</a>
        </div>
        <div className="flex justify-between w-1/4" style={{ maxWidth: '18rem' }}>
        <a className="walletBalance" href="#">Stan konta: {user.user.walletBalance}</a>
        <a href="#">Wyloguj się</a>
        </div>
      </div>
  );
}
