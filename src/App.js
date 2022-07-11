import React from "react";
import {
  Route,
  NavLink,
  Routes,
  BrowserRouter as Router,
} from "react-router-dom";
import Home from "./Home";
import Contact from "./Contact";
import TCP from "./TCP";

export default function App() {
  return (
    <Router>
      <div>
        <h1>Simple SPA</h1>
        <ul className="header">
          <li>
            <NavLink to="/">Home</NavLink>
          </li>
          <li>
            <NavLink to="/contact">Contact</NavLink>
          </li>
          <li>
            <NavLink to="/tcp">TCP</NavLink>
          </li>
        </ul>
      </div>
      <Routes>
        <Route exact path="/" element={<Home />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/tcp" element={<TCP />} />
      </Routes>
    </Router>
  );
}
