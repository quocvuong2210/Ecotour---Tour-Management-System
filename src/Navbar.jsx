import React from "react";
import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav className="flex items-center justify-between px-6 py-3 bg-emerald-700 text-white shadow">
      <h1 className="font-bold text-lg">🌿 Ecotour</h1>
      <ul className="flex gap-4">
        <li>
          <Link className="hover:underline" to="/">
            Home
          </Link>
        </li>
        <li>
          <Link className="hover:underline" to="/membership">
            Membership
          </Link>
        </li>
        <li>
          <Link className="hover:underline" to="/users">
            Users
          </Link>
        </li>
        <li>
          <Link className="hover:underline" to="/admin">
            Admin
          </Link>
        </li>
      </ul>
    </nav>
  );
}

export default Navbar;
