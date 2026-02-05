import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav style={{ padding: "10px", background: "#222" }}>
      <Link to="/" style={{ color: "#fff", textDecoration: "none" }}>
        Register
      </Link>
      <Link to="/" style={{ color: "#fff", textDecoration: "none" }}>
        Login
      </Link>
    </nav>
  );
}

export default Navbar;
