import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Verify from './components/Verify';
import Register from './components/Register';
import Contact from './components/Contact';

const App = () => {
  const [darkMode, setDarkMode] = useState(false);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <Router>
      <div className={darkMode ? 'dark' : ''}>
        {/* Navigation bar */}
        <nav className="bg-white dark:bg-gray-800 shadow-lg">
          <div className="container mx-auto px-4 py-3 flex justify-between items-center">
            <Link to="/" className="flex items-center">
              <img src="/clearlogo.png" alt="logo" className="w-12 h-12 mr-2" />
              <span className="text-xl font-bold text-gradient">Express Pap!</span>
            </Link>
            <div className="flex items-center space-x-4">
              <button
                onClick={toggleDarkMode}
                className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
              >
                {darkMode ? '🌞' : '🌙'}
              </button>
              <ul className="flex space-x-6">
                <li>
                  <Link to="/" className="text-gray-800 dark:text-white hover:text-blue-500 dark:hover:text-blue-400">
                    Home
                  </Link>
                </li>
                <li>
                  <Link to="/register" className="text-gray-800 dark:text-white hover:text-blue-500 dark:hover:text-blue-400">
                    Register Vehicle
                  </Link>
                </li>
                <li>
                  <Link to="/verify" className="text-gray-800 dark:text-white hover:text-blue-500 dark:hover:text-blue-400">
                    Verify Vehicle
                  </Link>
                </li>
                <li>
                  <Link to="/contact" className="text-gray-800 dark:text-white hover:text-blue-500 dark:hover:text-blue-400">
                    Contact
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </nav>

        {/* Main content with Routes */}
        <main className="min-h-screen bg-dark-100 dark:bg-gray-900 py-8">

         
            <div className="container mx-auto px-4">
              <Routes>
                <Route
                  path="/"
                  element={
                    <div>
                      <img src="./clearlogo.png" alt="Hero Banner" />
                      <h1>
                        Welcome To <span className="text-gradient">Express Pap!</span>
                      </h1>
                      <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg">
                        <p className="text-lg leading-relaxed mb-6 text-gray-700 dark:text-gray-300">
                          Welcome to our IoT-Based Toll System project! This innovative solution is designed to streamline toll collection, addressing the pressing issue of congestion and delays on busy toll roads.
                        </p>

                        <h2 className="text-2xl font-semibold mt-6 mb-4 text-gray-800 dark:text-white">Registration</h2>
                        <p className="text-lg leading-relaxed mb-6 text-gray-700 dark:text-gray-300">
                          Registration involves inputting vehicle details such as the registration number, color of the car, the car brand, name of the owner, contact details, and the date of registration.
                        </p>
                        <Link
                          to="/register"
                          className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition duration-300"
                        >
                          Register Vehicle
                        </Link>

                        <h2 className="text-2xl font-semibold mt-8 mb-4 text-gray-800 dark:text-white">Verification</h2>
                        <p className="text-lg leading-relaxed mb-6 text-gray-700 dark:text-gray-300">
                          To verify the user, you enter the vehicle registration number and the phone number to identify them.
                        </p>
                        <Link
                          to="/verify"
                          className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition duration-300"
                        >
                          Verify Vehicle
                        </Link>
                      </div>
                    </div>
                  }
                />
                <Route path="/verify" element={<Verify />} />
                <Route path="/register" element={<Register />} />
                <Route path="/contact" element={<Contact />} />
              </Routes>
            </div>
          
        </main>

        {/* Footer */}
        <footer className="bg-white dark:bg-gray-800 py-6 mt-8">
          <div className="container mx-auto px-4">
            <ul className="flex justify-center space-x-6 border-b pb-4 mb-4">
              <li>
                <Link to="/register" className="text-gray-800 dark:text-white hover:text-blue-500 dark:hover:text-blue-400">
                  Vehicle Registration
                </Link>
              </li>
              <li>
                <Link to="/verify" className="text-gray-800 dark:text-white hover:text-blue-500 dark:hover:text-blue-400">
                  Toll Payment
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-800 dark:text-white hover:text-blue-500 dark:hover:text-blue-400">
                  Contacts
                </Link>
              </li>
            </ul>
            <p className="text-center text-gray-700 dark:text-gray-300">
              © IoT Toll System, Final Year Project.<br />
              Gideon Maina<br />
              Tonyblaire Odhiambo<br />
              Millicent Mbuka
            </p>
          </div>
        </footer>
      </div>
    </Router>
  );
};

export default App;
