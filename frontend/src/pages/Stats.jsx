import React, { useState, useEffect } from "react";
import { fetchStats, fetchVolatilityStats } from "../services/api";
import { BsCalendarDate } from "react-icons/bs";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from "chart.js";
import { FaSpinner, FaExclamationTriangle } from "react-icons/fa";
import Footer from "../components/Footer";
import Chatbot from "../components/Chatbot";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const Stats = () => {
  const [year, setYear] = useState("2020");
  const [stats, setStats] = useState(null);
  const [volatilityStats, setVolatilityStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Obtener las estadísticas
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const [statsResponse, volatilityResponse] = await Promise.all([
          fetchStats(year),
          fetchVolatilityStats(year)
        ]);

        if (!statsResponse?.data || !volatilityResponse?.data) {
          throw new Error("No se pudieron obtener los datos estadísticos");
        }

        setStats(statsResponse.data);
        setVolatilityStats(volatilityResponse.data);
      } catch (err) {
        console.error("Error al cargar estadísticas:", err);
        setError(err.message || "Error al cargar las estadísticas");
        setStats(null);
        setVolatilityStats(null);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [year]);

  const generateChartData = (data) => {
    if (!data || !Array.isArray(data)) return { labels: [], datasets: [] };
    
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

  const formatCurrency = (value) => {
    if (typeof value !== "number") return "N/A";
    return value.toFixed(2).replace(".", ",");
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
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

  if (!stats || !volatilityStats) {
    return (
      <div className="py-12 px-6 bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
        <div className="max-w-4xl mx-auto text-center p-8 bg-yellow-100 rounded-lg">
          <h1 className="text-3xl font-bold text-yellow-600 mb-4">Datos no disponibles</h1>
          <p className="text-xl text-yellow-800">
            No se encontraron estadísticas para el año seleccionado.
          </p>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="py-12 px-6 bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
      {/* Título */}
      <h1 className="text-4xl font-extrabold text-center text-gray-800 mb-6">
        Estadísticas de Criptomonedas
      </h1>

      {/* Filtro de Año */}
      <div className="flex justify-center mb-12">
        <div className="flex items-center border-2 border-blue-600 rounded-lg p-2 bg-gradient-to-r from-blue-500 to-indigo-500 shadow-lg">
          <BsCalendarDate className="text-white text-2xl mr-3" />
          <select
            className="bg-transparent p-3 text-lg text-white font-semibold rounded-md focus:outline-none appearance-none"
            value={year}
            onChange={(e) => setYear(e.target.value)}
          >
            {["2015", "2016", "2017", "2018", "2019", "2020", "2021", "2022", "2023", "2024"].map((yr) => (
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

      {/* Media global del precio */}
      <div className="mb-8 max-w-4xl mx-auto">
        <div className="bg-gradient-to-r from-blue-500 to-indigo-500 p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl text-white font-semibold mb-4">Media Global del Precio</h2>
          <p className="text-xl text-white">
            <strong>{formatCurrency(stats.global_mean)}</strong> USD
          </p>
        </div>
      </div>

      {/* Criptomoneda con menor desviación estándar */}
      <div className="mb-8 max-w-4xl mx-auto">
        <div className="bg-gradient-to-r from-green-500 to-teal-500 p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl text-white font-semibold mb-4">Criptomoneda con Menor Desviación Estándar</h2>
          <p className="text-xl text-white">
            <strong>{stats.lowest_std_dev_coin?.coin_name || "N/A"}</strong> con una desviación estándar de <strong>{stats.lowest_std_dev_coin?.std_dev || "N/A"}</strong>
          </p>
        </div>
      </div>

      {/* Criptomonedas más volátil y estable */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 max-w-6xl mx-auto">
        {/* Criptomoneda más estable */}
        <div>
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">
            Criptomoneda Más Estable del Año
          </h2>
          <div className="bg-gradient-to-r from-teal-500 to-green-500 p-6 rounded-lg shadow-lg">
            <h3 className="text-xl text-white font-semibold mb-4">{volatilityStats.most_stable_coin?.coin_name || "N/A"}</h3>
            <p className="text-white mb-4">Desviación Estándar: {volatilityStats.most_stable_coin?.std_dev || "N/A"}</p>
            <div className="h-80">
              <Line
                data={generateChartData(volatilityStats.stable_coin_data)}
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
                      grid: { display: false },
                      ticks: {
                        color: "#fff",
                      },
                    },
                    y: {
                      grid: { display: false },
                      ticks: {
                        color: "#fff",
                      },
                    },
                  },
                }}
              />
            </div>
          </div>
        </div>

        {/* Criptomoneda más volátil */}
        <div>
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">
            Criptomoneda Más Volátil del Año
          </h2>
          <div className="bg-gradient-to-r from-red-500 to-yellow-500 p-6 rounded-lg shadow-lg">
            <h3 className="text-xl text-white font-semibold mb-4">{volatilityStats.most_volatile_coin?.coin_name || "N/A"}</h3>
            <p className="text-white mb-4">Desviación Estándar: {volatilityStats.most_volatile_coin?.std_dev || "N/A"}</p>
            <div className="h-80">
              <Line
                data={generateChartData(volatilityStats.volatile_coin_data)}
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
                      grid: { display: false },
                      ticks: {
                        color: "#fff",
                      },
                    },
                    y: {
                      grid: { display: false },
                      ticks: {
                        color: "#fff",
                      },
                    },
                  },
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Top criptomonedas por encima de la media */}
      <div className="max-w-6xl mx-auto">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">
          Criptomonedas por Encima de la Media Global
        </h2>

        {stats.top_cryptos?.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {stats.top_cryptos.map((crypto, index) => (
              <div
                key={index}
                className="p-6 rounded-xl shadow-lg transition-transform duration-500 ease-in-out hover:scale-105 hover:shadow-2xl bg-gradient-to-br from-cyan-400 to-sky-500"
              >
                <h3 className="text-2xl font-semibold text-white mb-3 text-center">{crypto.coin_name || "N/A"}</h3>
                <p className="text-white text-sm mb-4 text-center">Media de precio: {formatCurrency(crypto.mean_price)} USD</p>
                <div className="h-64">
                  <Line
                    data={generateChartData(crypto.data)}
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
                          grid: { display: false },
                          ticks: {
                            color: "#fff",
                          },
                        },
                        y: {
                          grid: { display: false },
                          ticks: {
                            color: "#fff",
                          },
                        },
                      },
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center p-6 bg-yellow-100 rounded-lg">
            <p className="text-yellow-800 text-xl">No hay criptomonedas por encima de la media para este año</p>
          </div>
        )}
      </div>

      <Chatbot />

      <Footer />
    </div>
  );
};

export default Stats;