import React, { useState, useEffect } from "react";
import { fetchCryptoByYear } from "../services/api";
import { BsCalendarDate } from "react-icons/bs";
import { FaCoins, FaSpinner, FaExclamationTriangle } from "react-icons/fa";
import Footer from "../components/Footer";
import Chatbot from "../components/Chatbot";

const YearlyCrypto = () => {
  const [year, setYear] = useState("2020");
  const [cryptos, setCryptos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const gradients = [
    "from-pink-400 to-purple-500",
    "from-teal-400 to-cyan-500",
    "from-blue-400 to-indigo-500",
    "from-yellow-400 to-orange-500",
    "from-green-400 to-teal-500",
    "from-indigo-400 to-pink-500",
    "from-lime-400 to-pink-500",
    "from-purple-400 to-indigo-600",
    "from-red-400 to-yellow-500",
    "from-rose-400 to-yellow-400",
    "from-blue-300 to-teal-400",
    "from-cyan-400 to-teal-600",
  ];
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetchCryptoByYear(year);
        
        // Verificación robusta de la respuesta
        if (!response?.data?.data) {
          throw new Error("Datos no disponibles");
        }

        setCryptos(response.data.data);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("No se pudieron cargar los datos. Por favor intenta más tarde.");
        setCryptos([]); // Asegurarse que cryptos esté vacío en caso de error
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [year]);

  // Función para renderizar el contenido según el estado
  const renderContent = () => {
    if (loading) {
      return (
        <div className="col-span-full flex justify-center items-center">
          <FaSpinner className="animate-spin text-4xl text-blue-600" />
        </div>
      );
    }

    if (error) {
      return (
        <div className="col-span-full flex flex-col items-center justify-center p-8 bg-white rounded-lg shadow-md">
          <FaExclamationTriangle className="text-4xl text-yellow-500 mb-4" />
          <h3 className="text-xl font-semibold text-gray-800 mb-2">Error al cargar los datos</h3>
          <p className="text-gray-600 text-center">{error}</p>
        </div>
      );
    }

    if (!cryptos || cryptos.length === 0) {
      return (
        <div className="col-span-full flex flex-col items-center justify-center p-8 bg-white rounded-lg shadow-md">
          <FaCoins className="text-4xl text-blue-500 mb-4" />
          <h3 className="text-xl font-semibold text-gray-800 mb-2">No hay datos disponibles</h3>
          <p className="text-gray-600 text-center">No se encontraron criptomonedas para el año seleccionado.</p>
        </div>
      );
    }

    return cryptos.map((crypto, index) => (
      <div
        key={index}
        className={`p-6 rounded-xl shadow-xl transform transition-transform duration-500 ease-in-out hover:scale-105 hover:shadow-2xl hover:opacity-90 bg-gradient-to-br ${
          gradients[index % gradients.length]
        }`}
      >
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-lg">
            <FaCoins size={40} className="text-blue-600" />
          </div>
        </div>

        <h2 className="text-2xl font-semibold text-white mb-3 text-center">
          {crypto.coin_name}
        </h2>

        <p className="text-lg text-white text-center mt-2">
          <span className="font-bold">Market Cap: </span>$ 
          {crypto.market_cap?.toLocaleString() ?? "N/A"}
        </p>
      </div>
    ));
  };

  return (
    <div className="py-12 px-6 bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
      <h1 className="text-4xl font-extrabold text-center text-gray-800 mb-6">
        MarketCaps de Criptomonedas en el Año {year}
      </h1>

      <div className="flex justify-center mb-12">
        <div className="flex items-center border-2 border-blue-600 rounded-lg p-2 bg-gradient-to-r from-blue-500 to-indigo-500 shadow-lg">
          <BsCalendarDate className="text-white text-2xl mr-3" />
          <select
            className="bg-transparent p-3 text-lg text-white font-semibold rounded-md focus:outline-none appearance-none"
            value={year}
            onChange={(e) => setYear(e.target.value)}
          >
            {[
              "2015", "2016", "2017", "2018", "2019", "2020", "2021", "2022", "2023", "2024"
            ].map((yr) => (
              <option key={yr} value={yr} className="bg-gray-900 text-white">
                {yr}
              </option>
            ))}
          </select>
          <div className="absolute right-0 mr-3">
            <BsCalendarDate className="text-white text-2xl" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
        {renderContent()}
      </div>

      <Chatbot />

      <Footer />
    </div>
  );
};

export default YearlyCrypto;