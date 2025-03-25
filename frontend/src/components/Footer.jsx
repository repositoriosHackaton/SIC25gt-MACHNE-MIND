const Footer = () => {
    return (
      <footer className="bg-blue-500 text-white py-8 mt-12 shadow-lg">
        <div className="max-w-screen-xl mx-auto text-center">
          <div className="flex justify-center items-center space-x-4">
            <div className="bg-white text-gray-800 p-2 rounded-full shadow-md">
              <svg className="h-8 w-8" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zM12 21c-4.961 0-9-4.039-9-9s4.039-9 9-9 9 4.039 9 9-4.039 9-9 9z"/>
              </svg>
            </div>
            <div className="text-lg font-bold">
              <p>Machine Minds &copy; {new Date().getFullYear()}</p>
            </div>
          </div>
  
          <div className="mt-6 text-sm text-gray-100">
            <p>Hecho con ❤️</p>
          </div>
  
          <div className="mt-6 border-t border-blue-400 pt-4 text-gray-100 text-xs">
            <p>Todos los derechos reservados</p>
          </div>
        </div>
      </footer>
    );
  };
  
  export default Footer;
  