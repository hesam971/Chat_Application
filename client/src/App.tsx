import { useState, useEffect } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const checkAuth = () => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsAuthenticated(true);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  return (

    <BrowserRouter>
    <Routes>
      <Route path="/register" element={isAuthenticated ? <Dashboard /> : <Register /> } />
      <Route path="/login" element={isAuthenticated ? <Dashboard />  : <Login setAuth={setIsAuthenticated} />  } />
      <Route path="/dashboard" element={isAuthenticated ? <Dashboard />  : <Register />  } />
      <Route path="/" element={isAuthenticated ? <Dashboard />  : <Register />  } />
    </Routes>
  </BrowserRouter>
  
  );
};

export default App;
