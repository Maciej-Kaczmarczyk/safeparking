import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import "./App.css";
import ContentContainer from "./components/ContentContainer";
import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard.jsx"; // Upewnij się, że Dashboard jest zaimportowany
import useAuthStore from "./store/authStore";
import ReservationDetails from "./pages/ReservationDetails.jsx";
import AddReservation from "./pages/AddReservation.jsx";
import AddServices from "./pages/AddServices.jsx";
import ConfirmPayment from "./pages/ConfirmPayment.jsx";
import Cameras from "./pages/Cameras.jsx";
import ConfirmService from "./pages/ConfirmService.jsx";

function App() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  return (
    <Router>
      <Navbar />
      <ContentContainer>
        <Routes>
          <Route path="/" element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" />} />
          <Route path="/login" element={<Login />} />
          <Route path="/addReservation" element={<AddReservation />} />
          <Route path="/cameras" element={<Cameras />} />
          <Route path="/reservation/:id/services" element={<AddServices />} />
          <Route path="/reservation/:id/confirmService" element={<ConfirmService />} />
          <Route path="/reservation/:id/payment" element={<ConfirmPayment />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/reservation/:id" element={<ReservationDetails />} />
        </Routes>
      </ContentContainer>
    </Router>
  );
}

export default App;
