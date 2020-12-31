import React from 'react';
import { Link } from "react-router-dom";

const Navigation = () => (
  <nav>
  <ul>
    <li>
      <Link to="/">Repos with Lazy Get</Link>
    </li>
    <li>
      <Link to="/network-policy">Repos with network</Link>
    </li>
    <li>
      <Link to="/cache-policy">Repos with cache</Link>
    </li>
    <li>
      <Link to="/wall-feed">Repos on a wall feed</Link>
    </li>
  </ul>
</nav>
);

export default Navigation;
