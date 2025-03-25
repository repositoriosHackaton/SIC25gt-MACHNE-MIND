import React from "react";
import { Link } from "react-router-dom";
import {
  FaHome,
  FaChartLine,
  FaList,
  FaCogs,
  FaSearch,
  FaBitcoin,
} from "react-icons/fa";

const Navbar = () => {
  return (
    <nav className="bg-blue-500 p-4 text-white flex justify-between items-center">
      <div className="text-xl">
        <Link to="/" className="flex items-lef">
          <FaBitcoin className="text-5xl" />
        </Link>
      </div>
      <div className="flex space-x-5">
        <Link to="/" className="flex items-center">
          <FaHome className="mr-2" />
          Inicio
        </Link>
        <Link to="/yearly-cryptos" className="flex items-center">
          <FaList className="mr-2" />
          Yearly Cryptos
        </Link>
        <Link to="/top-cryptos" className="flex items-center">
          <FaChartLine className="mr-2" />
          Top Cryptos
        </Link>
        <Link to="/stats" className="flex items-center">
          <FaCogs className="mr-2" />
          Estadisticas
        </Link>
        <Link to="/crypto-detail" className="flex items-center">
          <FaSearch className="mr-2" />
          Buscar por Criptomoneda
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
