import React, { useState, useEffect } from "react";
import { fetchTopCryptosByYear } from "../services/api";
import { BsCalendarDate } from "react-icons/bs";
import { Line } from "react-chartjs-2";
import {
  FaBitcoin,
  FaEthereum,
  FaDollarSign,
  FaMoneyBillWave,
} from "react-icons/fa";
import { FaSpinner, FaExclamationTriangle } from "react-icons/fa";
import Footer from "../components/Footer";
import Chatbot from "../components/Chatbot";

const gradients = [
  "from-green-400 to-blue-500",
  "from-pink-400 to-yellow-500",
  "from-indigo-600 to-purple-700",
  "from-teal-500 to-cyan-500",
];

const icons = [
  <FaBitcoin className="text-4xl text-yellow-500" />,
  <FaEthereum className="text-4xl text-purple-500" />,
  <FaDollarSign className="text-4xl text-green-500" />,
  <FaMoneyBillWave className="text-4xl text-blue-500" />,
];

const TopCryptos = () => {
  const [year, setYear] = useState("2020");
  const [topCryptos, setTopCryptos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetchTopCryptosByYear(year);
        
        if (!response?.data?.top_cryptos) {
          throw new Error("No se encontraron datos para el año seleccionado");
        }
        
        setTopCryptos(response.data.top_cryptos);
      } catch (err) {
        console.error("Error al obtener datos:", err);
        setError(err.message || "Ocurrió un error al cargar los datos");
        setTopCryptos([]);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [year]);

  const getChartData = (data) => {
    if (!data) return { labels: [], datasets: [] };
    
    const chartLabels = data.map((point) => point.date);
    const chartData = data.map((point) => point.price);

    return {
      labels: chartLabels,
      datasets: [
        {
          label: "Precio",
          data: chartData,
          fill: true,
          borderColor: "rgba(255, 255, 255, 0.8)",
          backgroundColor: "rgba(255, 255, 255, 0.2)",
          tension: 0.4,
          borderWidth: 2,
          pointRadius: 1,
        },
      ],
    };
  };

  return (
    <div className="py-12 px-6 bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
      <h1 className="text-4xl font-extrabold text-center text-gray-800 mb-6">
        Las 4 Criptomonedas Más Interesantes en el Año {year}
      </h1>

      <div className="max-w-2xl mx-auto text-center text-gray-600 mb-12">
        <p className="text-lg">
          Estas criptomonedas fueron seleccionadas mediante un análisis de{" "}
          <span className="font-semibold text-blue-600">
            Inteligencia Artificial
          </span>{" "}
          que evaluó su destacada variación en el precio, volumen de
          transacciones y capitalización de mercado.
        </p>
      </div>

      <div className="flex justify-center mb-12">
        <div className="flex items-center border-2 border-blue-600 rounded-lg p-2 bg-gradient-to-r from-blue-500 to-indigo-500 shadow-lg">
          <BsCalendarDate className="text-white text-2xl mr-3" />
          <select
            className="bg-transparent p-3 text-lg text-white font-semibold rounded-md focus:outline-none appearance-none"
            value={year}
            onChange={(e) => setYear(e.target.value)}
          >
            {[
              "2015",
              "2016",
              "2017",
              "2018",
              "2019",
              "2020",
              "2021",
              "2022",
              "2023",
              "2024",
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

      {/* Contenido principal con manejo de estados */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
        {loading ? (
          <div className="col-span-2 flex justify-center items-center">
            <FaSpinner className="text-4xl text-blue-500 animate-spin" />
          </div>
        ) : error ? (
          <div className="col-span-full flex flex-col items-center justify-center p-8 bg-white rounded-lg shadow-md">
                    <FaExclamationTriangle className="text-4xl text-yellow-500 mb-4" />
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">Error al cargar los datos</h3>
                    <p className="text-gray-600 text-center">{error}</p>
                  </div>
        ) : topCryptos?.length > 0 ? (
          topCryptos.map((crypto, index) => (
            <div
              key={index}
              className={`bg-gradient-to-br ${gradients[index]} p-6 rounded-xl shadow-xl transform hover:scale-105 hover:shadow-2xl transition duration-500 ease-in-out`}
            >
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-lg">
                  {icons[index]}
                </div>
              </div>

              <h2 className="text-2xl font-semibold text-white mb-3 text-center">
                {crypto.coin_name}
              </h2>

              <div className="h-64">
                <Line
                  data={getChartData(crypto.data)}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      tooltip: {
                        backgroundColor: "rgba(0,0,0,0.7)",
                        titleColor: "#fff",
                        bodyColor: "#fff",
                      },
                      legend: {
                        display: false,
                      },
                    },
                    scales: {
                      x: {
                        grid: {
                          display: false,
                        },
                        ticks: {
                          color: "#fff",
                        },
                      },
                      y: {
                        grid: {
                          display: false,
                        },
                        ticks: {
                          color: "#fff",
                        },
                      },
                    },
                  }}
                />
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-2 text-center p-8 bg-yellow-50 rounded-xl">
            <h2 className="text-2xl font-bold text-yellow-600 mb-4">Sin datos</h2>
            <p className="text-yellow-700">No se encontraron criptomonedas para el año seleccionado</p>
          </div>
        )}
      </div>

      <Chatbot />
      <Footer />
    </div>
  );
};

export default TopCryptos;