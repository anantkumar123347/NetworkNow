import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";

const ProtectedRoute = ({ element }) => {
  const token = localStorage.getItem("token");
  return token ? element : <Navigate to="/login" />;
};

const PublicRoute = ({ element }) => {
  const token = localStorage.getItem("token");
  return token ? <Navigate to="/dashboard" /> : element;
};

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes (Redirect to Dashboard if logged in) */}
        <Route path="/" element={<PublicRoute element={<Home />} />} />
        <Route path="/register" element={<PublicRoute element={<Register />} />} />
        <Route path="/login" element={<PublicRoute element={<Login />} />} />

        {/* Protected Route for Dashboard (Only logged-in users can access) */}
        <Route path="/dashboard" element={<ProtectedRoute element={<Dashboard />} />} />
      </Routes>
    </Router>
  );
}

export default App;
