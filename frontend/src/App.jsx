import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Allposts from "./components/Allposts";
import Profile from "./pages/Profile";
import Discover from "./pages/Discover";
import PublicProfile from "./pages/PublicProfile";
import Myconnections from "./pages/Myconnections";
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
        {/* Public Routes */}
        <Route path="/" element={<PublicRoute element={<Home />} />} />
        <Route path="/register" element={<PublicRoute element={<Register />} />} />
        <Route path="/login" element={<PublicRoute element={<Login />} />} />

        {/* Protected Dashboard Routes */}
        <Route path="/dashboard" element={<ProtectedRoute element={<Dashboard />} />}>
          <Route index element={<Allposts />} />
          <Route path="profile" element={<Profile />} />

          {/* Nested under /dashboard/discover */}
          <Route path="discover" element={<Discover />} />
          <Route path="myconnections" element={<Myconnections />} />
          <Route path="discover/user-profile/:userId" element={<PublicProfile />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
