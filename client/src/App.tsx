import {BrowserRouter, Route, Routes} from "react-router-dom";
import Register from './pages/Register'
import Login from './pages/Login'

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Register />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
