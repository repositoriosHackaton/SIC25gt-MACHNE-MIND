import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiMessageSquare, FiSend, FiX } from "react-icons/fi";
import { FaRobot } from "react-icons/fa";

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showButton, setShowButton] = useState(true);
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "¡Hola! Soy tu asistente de criptomonedas. ¿En qué puedo ayudarte hoy?",
      sender: "bot",
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  const handleOpenChat = () => {
    setShowButton(false);
    setIsOpen(true);
  };

  const handleCloseChat = () => {
    setIsOpen(false);
    setTimeout(() => {
      setShowButton(true);
    }, 500);
  };

  const fetchBotResponse = async (question) => {
    try {
      const response = await fetch("http://127.0.0.1:5000/api/crypto/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ question }),
      });

      if (!response.ok) {
        throw new Error("Error en la respuesta de la API");
      }

      const data = await response.json();
      return data.response;
    } catch (error) {
      console.error("Error al obtener respuesta del bot:", error);
      return "Lo siento, hubo un error al procesar tu solicitud. Por favor intenta nuevamente.";
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (inputValue.trim() === "") return;

    const newUserMessage = {
      id: Date.now(),
      text: inputValue,
      sender: "user",
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, newUserMessage]);
    setInputValue("");

    const typingMessage = {
      id: "typing-msg",
      text: "escribiendo...",
      sender: "bot",
      isTyping: true,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, typingMessage]);
    setIsTyping(true);

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    try {
      const botResponse = await fetchBotResponse(inputValue);
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === "typing-msg"
            ? {
                id: Date.now() + 1,
                text: botResponse,
                sender: "bot",
                timestamp: new Date(),
              }
            : msg
        )
      );
    } catch (error) {
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === "typing-msg"
            ? {
                id: Date.now() + 1,
                text: "Lo siento, ocurrió un error al procesar tu solicitud.",
                sender: "bot",
                timestamp: new Date(),
              }
            : msg
        )
      );
    } finally {
      setIsTyping(false);
    }
  };

  useEffect(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop =
        messagesContainerRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, []);

  const chatVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 25,
      },
    },
  };

  const messageVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {showButton && (
        <motion.button
          onClick={handleOpenChat}
          className="bg-gradient-to-br from-yellow-500 to-yellow-600 text-white rounded-full p-4 shadow-xl"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{
            duration: 0.3,
          }}
        >
          <FiMessageSquare className="text-2xl" />
        </motion.button>
      )}

      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="w-80 h-[500px] bg-white rounded-lg shadow-2xl overflow-hidden flex flex-col border border-gray-200"
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={chatVariants}
          >
            <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 p-4 text-white flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <motion.div
                  animate={{
                    rotate: [0, 10, -10, 0],
                    transition: { repeat: Infinity, duration: 3 },
                  }}
                >
                  <FaRobot className="text-xl" />
                </motion.div>
                <h3 className="font-semibold">Asistente Cripto</h3>
              </div>
              <button
                onClick={handleCloseChat}
                className="text-white hover:text-gray-200"
              >
                <FiX className="text-xl" />
              </button>
            </div>

            <div
              ref={messagesContainerRef}
              className="flex-1 p-4 overflow-y-auto bg-gradient-to-b from-gray-50 to-gray-100"
            >
              <AnimatePresence>
                {messages.map((message) => (
                  <motion.div
                    key={message.id}
                    className={`mb-4 flex ${
                      message.sender === "user"
                        ? "justify-end"
                        : "justify-start"
                    }`}
                    variants={messageVariants}
                    initial="hidden"
                    animate="visible"
                    transition={{ duration: 0.2 }}
                  >
                    <div
                      className={`max-w-[80%] rounded-lg p-3 break-words ${
                        message.sender === "user"
                          ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-br-none"
                          : "bg-white text-gray-800 rounded-bl-none shadow"
                      }`}
                    >
                      {message.isTyping ? (
                        <div className="flex items-center">
                          <div className="flex space-x-1 mr-2">
                            <div
                              className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                              style={{ animationDelay: "0ms" }}
                            ></div>
                            <div
                              className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                              style={{ animationDelay: "150ms" }}
                            ></div>
                            <div
                              className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                              style={{ animationDelay: "300ms" }}
                            ></div>
                          </div>
                          <span className="text-xs text-gray-500">
                            {message.text}
                          </span>
                        </div>
                      ) : (
                        <p className="text-sm whitespace-pre-line">
                          {message.text}
                        </p>
                      )}
                    </div>
                  </motion.div>
                ))}
                <div ref={messagesEndRef} />
              </AnimatePresence>
            </div>

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
