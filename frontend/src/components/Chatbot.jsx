import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiMessageSquare, FiSend, FiX } from 'react-icons/fi';
import { FaRobot } from 'react-icons/fa';

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: '¡Hola! Soy tu asistente de criptomonedas. ¿En qué puedo ayudarte hoy?',
      sender: 'bot',
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  // Mensajes de prueba estáticos
  const mockResponses = [
    "El precio de Bitcoin está actualmente en $42,380 con una tendencia alcista.",
    "Ethereum ha mostrado un crecimiento del 5.2% en las últimas 24 horas.",
    "Puedo mostrarte gráficos históricos de cualquier criptomoneda que necesites.",
    "¿Te interesa conocer las últimas noticias del mercado crypto?",
    "El volumen de trading en Binance ha aumentado un 15% esta semana."
  ];

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (inputValue.trim() === '') return;

    // Mensaje del usuario
    const newUserMessage = {
      id: Date.now(),
      text: inputValue,
      sender: 'user',
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, newUserMessage]);
    setInputValue('');
    setIsTyping(true);

    // Limpiar timeout anterior si existe
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Simular respuesta del backend
    typingTimeoutRef.current = setTimeout(() => {
      const randomResponse = mockResponses[Math.floor(Math.random() * mockResponses.length)];
      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        text: randomResponse,
        sender: 'bot',
        timestamp: new Date(),
      }]);
      setIsTyping(false);
    }, 1000 + Math.random() * 1000);
  };

  // Auto-scroll al recibir nuevos mensajes
  useEffect(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    }
  }, [messages]);

  // Limpiar timeout al desmontar
  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, []);

  // Animaciones
  const chatVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    visible: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: { 
        type: 'spring',
        stiffness: 300,
        damping: 20
      }
    }
  };

  const messageVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Botón flotante */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            onClick={() => setIsOpen(true)}
            className="bg-gradient-to-br from-yellow-500 to-yellow-600 text-white rounded-full p-4 shadow-xl"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
          >
            <FiMessageSquare className="text-2xl" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Ventana del chat */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="w-80 h-[500px] bg-white rounded-lg shadow-2xl overflow-hidden flex flex-col border border-gray-200"
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={chatVariants}
          >
            {/* Encabezado con degradado */}
            <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 p-4 text-white flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <motion.div
                  animate={{ 
                    rotate: [0, 10, -10, 0],
                    transition: { repeat: Infinity, duration: 3 }
                  }}
                >
                  <FaRobot className="text-xl" />
                </motion.div>
                <h3 className="font-semibold">Asistente Cripto</h3>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-white hover:text-gray-200"
              >
                <FiX className="text-xl" />
              </button>
            </div>

            {/* Área de mensajes con scroll */}
            <div 
              ref={messagesContainerRef}
              className="flex-1 p-4 overflow-y-auto bg-gradient-to-b from-gray-50 to-gray-100"
            >
              <AnimatePresence>
                {messages.map((message) => (
                  <motion.div
                    key={message.id}
                    className={`mb-4 flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                    variants={messageVariants}
                    initial="hidden"
                    animate="visible"
                  >
                    <div
                      className={`max-w-[80%] rounded-lg p-3 break-words ${
                        message.sender === 'user' 
                          ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-br-none' 
                          : 'bg-white text-gray-800 rounded-bl-none shadow'
                      }`}
                    >
                      <p className="text-sm">{message.text}</p>
                    </div>
                  </motion.div>
                ))}
                {isTyping && (
                  <motion.div 
                    className="flex justify-start mb-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <div className="bg-white text-gray-800 rounded-lg rounded-bl-none shadow p-3 flex items-center">
                      <div className="flex space-x-1 mr-2">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                      </div>
                      <span className="text-xs text-gray-500">escribiendo...</span>
                    </div>
                  </motion.div>
                )}
                <div ref={messagesEndRef} />
              </AnimatePresence>
            </div>

            {/* Área de entrada */}
            <form 
              onSubmit={handleSendMessage} 
              className="border-t border-gray-200 p-3 bg-white"
            >
              <div className="flex items-center">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Escribe tu mensaje..."
                  className="flex-1 border border-gray-300 rounded-l-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                />
                <motion.button
                  type="submit"
                  className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-white py-2 px-4 rounded-r-lg"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <FiSend />
                </motion.button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Chatbot;