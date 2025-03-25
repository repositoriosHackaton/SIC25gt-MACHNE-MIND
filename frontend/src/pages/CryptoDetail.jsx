import React, { useState, useEffect } from "react";
import { fetchAllNames, fetchDetailedCryptoData } from "../services/api";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler } from "chart.js";
import { FaSpinner } from "react-icons/fa";
import { BsCalendarDate } from "react-icons/bs";
import { FiTrendingUp, FiTrendingDown, FiDatabase } from "react-icons/fi";
import { MdDateRange } from "react-icons/md";
import { FaCoins } from "react-icons/fa";
import Footer from "../components/Footer";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

const CryptoDetail = () => {
  const [coins, setCoins] = useState([]); // Lista de criptomonedas
  const [selectedCoin, setSelectedCoin] = useState(""); // Criptomoneda seleccionada
  const [startDate, setStartDate] = useState(""); // Fecha de inicio
  const [endDate, setEndDate] = useState(""); // Fecha de fin
  const [data, setData] = useState(null); // Datos de la criptomoneda
  const [loading, setLoading] = useState(false); // Estado de carga
  const [error, setError] = useState(null); // Estado de error
  const [dateError, setDateError] = useState(""); // Error de fechas

  // Cargar las criptomonedas disponibles
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await fetchAllNames();
        setCoins(response.data); // Asumiendo que esta función devuelve un array de nombres de criptos
      } catch (err) {
        setError("Error al cargar las criptomonedas.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Validar fechas
  const validateDates = () => {
    if (!selectedCoin || !startDate || !endDate) {
      setDateError("Por favor, selecciona una criptomoneda y ambas fechas.");
      return false;
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    if (start > end) {
      setDateError("La fecha de inicio no puede ser mayor que la fecha de fin.");
      return false;
    }

    setDateError(""); // Limpiar el error si las fechas son válidas
    return true;
  };

  // Obtener los datos de la criptomoneda según las fechas y la moneda seleccionada
  const handleFetchData = async () => {
    if (!validateDates()) return;

    setLoading(true);
    setError(null);
    try {
      const response = await fetchDetailedCryptoData(selectedCoin, startDate, endDate);
      setData(response.data);
    } catch (err) {
      if (err.response && err.response.status === 404) {
        setError("No se encontraron datos para las fechas seleccionadas.");
      } else {
        setError("Error al obtener los datos. Inténtalo de nuevo.");
      }
    } finally {
      setLoading(false);
    }
  };

  // Función para generar los datos de la gráfica
  const generateChartData = (data) => {
    const labels = data.map((item) => new Date(item.date).toLocaleDateString()); // Extraemos las fechas
    const prices = data.map((item) => item.price); // Extraemos los precios

    return {
      labels,
      datasets: [
        {
          label: "Precio de la Criptomoneda",
          data: prices,
          fill: true,
          backgroundColor: "rgba(96, 165, 250, 0.2)", // Fondo degradado (azul claro)
          borderColor: "#60A5FA", // Color azul-400 de Tailwind
          borderWidth: 2,
          pointRadius: 1, // Eliminar puntos
          tension: 0.4, // Suaviza la línea
        },
      ],
    };
  };

  // Función para obtener las fechas de las predicciones
  const getPredictionDates = (data) => {
    if (!data || data.length === 0) return [];

    const lastDate = new Date(data[data.length - 1].date); // Última fecha disponible
    const predictionDates = [];

    for (let i = 1; i <= 3; i++) {
      const nextDate = new Date(lastDate);
      nextDate.setDate(lastDate.getDate() + i);
      predictionDates.push(nextDate.toLocaleDateString());
    }

    return predictionDates;
  };

  return (
    <div className="bg-gray-50 min-h-screen p-8">
      {/* Encabezado */}
      <header className="text-center mb-8">
        <h1 className="text-5xl font-bold text-gray-800 flex justify-center items-center">
          <FaCoins className="mr-3 text-yellow-500" />
          {selectedCoin ? `Detalle de ${selectedCoin}` : "Seleccione una Criptomoneda"}
        </h1>
        <p className="text-gray-600 text-lg mt-2">
          Información detallada sobre la criptomoneda seleccionada.
        </p>
      </header>

      {/* Filtros de selección */}
      <div className="flex justify-center mt-8 space-x-4 mb-6">
        <div className="flex items-center">
          <BsCalendarDate className="text-gray-700 text-2xl mr-2" />
          <select
            className="bg-white p-3 text-lg text-gray-700 font-semibold rounded-md shadow-md focus:outline-none"
            value={selectedCoin}
            onChange={(e) => setSelectedCoin(e.target.value)}
          >
            <option value="">Selecciona una Criptomoneda</option>
            {coins.map((coin, index) => (
              <option key={index} value={coin}>
                {coin}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center">
          <label htmlFor="start-date" className="text-lg mr-2 text-gray-700">
            Fecha Inicio
          </label>
          <input
            type="date"
            id="start-date"
            className="p-3 text-lg text-gray-700 rounded-md shadow-md"
            onChange={(e) => setStartDate(e.target.value)}
          />
        </div>

        <div className="flex items-center">
          <label htmlFor="end-date" className="text-lg mr-2 text-gray-700">
            Fecha Fin
          </label>
          <input
            type="date"
            id="end-date"
            className="p-3 text-lg text-gray-700 rounded-md shadow-md"
            onChange={(e) => setEndDate(e.target.value)}
          />
        </div>

        <button
          onClick={handleFetchData}
          className="px-6 py-3 bg-blue-400 text-white rounded-md hover:bg-blue-500 shadow-md transition-colors"
        >
          Buscar Datos
        </button>
      </div>

      {/* Mensaje de error de fechas */}
      {dateError && <div className="text-center text-red-600 text-xl mb-4">{dateError}</div>}

      {/* Mensaje de error del servidor */}
      {error && <div className="text-center text-red-600 text-xl mb-4">{error}</div>}

      {/* Spinner de carga */}
      {loading && (
        <div className="flex justify-center items-center">
          <FaSpinner className="text-4xl text-blue-400 animate-spin" />
        </div>
      )}

      {/* Mostrar la gráfica y los datos */}
      {data && !loading && !error && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Resumen de la criptomoneda seleccionada */}
          <div className="bg-white p-6 rounded-lg shadow-lg border-l-4 border-blue-400 lg:col-span-1">
            <h2 className="text-2xl font-semibold text-gray-800 flex items-center">
              <FiDatabase className="mr-2 text-blue-400" /> Resumen
            </h2>
            <div className="text-gray-600 mt-4 space-y-2">
              <div>
                <MdDateRange className="inline mr-2 text-blue-400" />
                <strong>Fecha de inicio:</strong> {startDate}
              </div>
              <div>
                <MdDateRange className="inline mr-2 text-blue-400" />
                <strong>Fecha de fin:</strong> {endDate}
              </div>
              <div>
                <FiTrendingUp className="inline mr-2 text-green-500" />
                <strong>Precio inicial:</strong> ${data?.summary?.initial_price?.toFixed(2)}
              </div>
              <div>
                <FiTrendingDown className="inline mr-2 text-red-500" />
                <strong>Precio final:</strong> ${data?.summary?.final_price?.toFixed(2)}
              </div>
              <div>
                <FaCoins className="inline mr-2 text-yellow-500" />
                <strong>Variación del precio:</strong> {data?.summary?.price_change_percentage?.toFixed(2)}%
              </div>
            </div>
          </div>

          {/* Gráfico de la criptomoneda seleccionada */}
          <div className="bg-white p-6 rounded-lg shadow-lg lg:col-span-2">
            <h2 className="text-2xl font-semibold text-gray-800 flex items-center">
              <FiTrendingUp className="mr-2 text-green-500" /> Precio de la Criptomoneda por Periodo
            </h2>
            <Line
              data={generateChartData(data?.data || [])}
              options={{
                responsive: true,
                plugins: {
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
                      color: "#666",
                    },
                  },
                  y: {
                    grid: {
                      display: false,
                    },
                    ticks: {
                      color: "#666",
                    },
                  },
                },
              }}
            />
          </div>

          {/* Mostrar precios predichos */}
          {data?.summary?.predicted_prices && (
            <div className="bg-white p-6 rounded-lg shadow-lg lg:col-span-3">
              <h2 className="text-2xl font-semibold text-gray-800 flex items-center">
                <FiTrendingUp className="mr-2 text-green-500" /> Predicciones de Precios (Generadas con IA)
              </h2>
              <p className="text-gray-600 mt-2">
                Los siguientes valores representan el precio medio predicho para cada uno de los próximos 3 días.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                {data.summary.predicted_prices.map((price, index) => {
                  const predictionDates = getPredictionDates(data.data);
                  return (
                    <div key={index} className="bg-blue-400 text-white p-4 rounded-lg shadow-md">
                      <p className="text-lg font-semibold">Día {index + 1}</p>
                      <p className="text-sm text-gray-200">{predictionDates[index]}</p>
                      <p className="text-2xl mt-2">${price.toFixed(2)}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}

      {data == null && !loading && (
        <div className="text-center text-gray-600 text-xl">No hay información para los datos ingresados.</div>
      )}

      <Footer />
    </div>
  );
};

export default CryptoDetail;