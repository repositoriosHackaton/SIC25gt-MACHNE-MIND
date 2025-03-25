import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Filler,
} from "chart.js";
import { fetchDetailedCryptoData, fetchAllNames } from "../services/api";
import { FiTrendingUp, FiTrendingDown, FiDatabase } from "react-icons/fi";
import {
  FaBitcoin,
  FaCoins,
  FaEthereum,
  FaMonero,
  FaDollarSign,
  FaGlobe,
} from "react-icons/fa";
import { MdDateRange } from "react-icons/md";
import Footer from "../components/Footer";
import { FaSpinner } from "react-icons/fa"; // Ícono de carga
import Chatbot from "../components/Chatbot";


ChartJS.register(
  Title,
  Tooltip,
  Legend,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Filler
);

const gradientColors = [
  "from-blue-500 to-purple-500",
  "from-green-400 to-teal-600",
  "from-yellow-400 to-orange-500",
  "from-pink-500 to-red-500",
  "from-indigo-500 to-blue-700",
];

const icons = [FaBitcoin, FaEthereum, FaMonero, FaDollarSign, FaGlobe];

const Dashboard = () => {
  const [bitcoinData, setBitcoinData] = useState([]);
  const [summary, setSummary] = useState({});
  const [allCryptos, setAllCryptos] = useState([]);
  const [loading, setLoading] = useState(true); // Estado de carga

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true); // Activamos el estado de carga

        const bitcoinResponse = await fetchDetailedCryptoData(
          "BITCOIN",
          "2020-01-01",
          "2020-12-31"
        );

        setBitcoinData(bitcoinResponse.data.data);
        setSummary(bitcoinResponse.data.summary);

        const cryptosResponse = await fetchAllNames();
        setAllCryptos(cryptosResponse.data);

        setLoading(false); // Desactivamos el estado de carga
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false); // Desactivamos el estado de carga si ocurre un error
      }
    };

    fetchData();
  }, []);

  const chartData = {
    labels: bitcoinData.map((item) => {
      const date = new Date(item.date);
      return date.toLocaleString("es-ES", { day : 'numeric', month : 'short' });
    }),
    datasets: [
      {
        label: "Precio de Bitcoin",
        data: bitcoinData.map((item) => item.price),
        borderColor: "#f59e0b",
        backgroundColor: "rgba(245, 158, 11, 0.4)",
        pointRadius: 2,
        pointBackgroundColor: "#f59e0b",
        pointHoverRadius: 8,
        tension: 0.4, // Suaviza la línea
        fill: true, // Rellena el área bajo la curva
        BsBorderWidth: 2,
      },
    ],
  };

  const getRandomItem = (array) => {
    return array[Math.floor(Math.random() * array.length)];
  };

  return (
    <div className="bg-gray-50 min-h-screen p-8">
      {/* Encabezado */}
      <header className="text-center mb-8">
        <h1 className="text-5xl font-bold text-yellow-500 flex justify-center items-center">
          <FaBitcoin className="mr-3" /> Panel de Criptomonedas
        </h1>
        <p className="text-gray-600 text-lg mt-2">
          Información actualizada sobre Bitcoin y otras criptomonedas
        </p>
      </header>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Resumen de Bitcoin */}
        <div className="bg-white p-6 rounded-lg shadow-lg border-l-4 border-yellow-500 lg:col-span-1">
          <h2 className="text-2xl font-semibold text-gray-800 flex items-center">
            <FiDatabase className="mr-2 text-yellow-500" /> Resumen de Bitcoin
          </h2>
          <ul className="text-gray-600 mt-4 space-y-2">
            <li>
              <MdDateRange className="inline mr-2 text-blue-500" />
              <strong>Fecha de inicio:</strong> {summary.start_date}
            </li>
            <li>
              <MdDateRange className="inline mr-2 text-blue-500" />
              <strong>Fecha de fin:</strong> {summary.end_date}
            </li>
            <li>
              <FiTrendingUp className="inline mr-2 text-green-500" />
              <strong>Precio inicial:</strong> $ {summary.initial_price?.toFixed(2)}
            </li>
            <li>
              <FiTrendingDown className="inline mr-2 text-red-500" />
              <strong>Precio final:</strong> ${summary.final_price?.toFixed(2)}
            </li>
            <li>
              <FaCoins className="inline mr-2 text-yellow-500" />
              <strong>Variación del precio:</strong> {summary.price_change_percentage?.toFixed(2)}%
            </li>
          </ul>
        </div>

        {/* Gráfico de Bitcoin */}
        <div className="bg-white p-6 rounded-lg shadow-xl hover:shadow-2xl transition-shadow duration-300 lg:col-span-2">
  <h2 className="text-2xl font-semibold text-gray-800 flex items-center">
    <FiTrendingUp className="mr-2 text-green-500 text-3xl" /> Precio de Bitcoin por Mes
  </h2>
  {loading ? (
    <div className="flex justify-center items-center">
      <FaSpinner className="text-4xl text-blue-500 animate-spin" />
    </div>
  ) : (
    <Line
      data={chartData}
      options={{
        responsive: true,
        scales: {
          x: {
            grid: {
              display: false,
            },
          },
          y: {
            grid: {
              display: false,
            },
            ticks: {
              color: "#333",
            },
          },
        },
        plugins: {
          legend: {
            labels: {
              font: {
                size: 14,
              },
            },
          },
        },
      }}
    />
  )}
</div>
      </div>
      {/* Lista de Criptomonedas */}
      <div className="bg-white p-6 mt-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-semibold text-gray-800 flex items-center">
          <FaCoins className="mr-2 text-blue-500" /> Lista de Criptomonedas
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 max-h-96 overflow-y-auto mt-6 scrollbar-thin scrollbar-thumb-blue-500 scrollbar-track-gray-100">
          {loading ? (
            <p className="text-gray-500 text-center col-span-full">
              Cargando lista de criptomonedas...
            </p>
          ) : (
            allCryptos.map((name, index) => {
              const RandomIcon = getRandomItem(icons);
              const randomGradient = getRandomItem(gradientColors);

              return (
                <div
                  key={index}
                  className={`relative group bg-gradient-to-br ${randomGradient} text-white rounded-lg shadow-lg overflow-hidden p-4 text-center transition-transform transform hover:scale-105 hover:shadow-2xl cursor-pointer`}
                >
                  {/* Icono decorativo */}
                  <div className="absolute top-3 right-3 text-3xl text-white opacity-30 group-hover:opacity-100">
                    <RandomIcon />
                  </div>

                  {/* Contenido principal */}
                  <div className="flex flex-col items-center justify-center">
                    <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mb-3 shadow-md">
                      <RandomIcon className="text-3xl text-blue-500" />
                    </div>
                    <p className="text-lg font-semibold capitalize group-hover:underline">
                      {name.toLowerCase()}
                    </p>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
      {/* Chatbot */}
      <Chatbot />
      {/* Pie de Página */}
      <Footer />
    </div>
  );
};

export default Dashboard;
