import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SocketProvider } from "./context/SocketContext";
import Navbar from "./components/Navbar";
import ExpertList from "./pages/ExpertList";
import ExpertDetail from "./pages/ExpertDetail";
import BookingPage from "./pages/BookingPage";
import MyBookings from "./pages/MyBookings";
import AdminBookings from "./pages/AdminBookings";
import "./styles.css";

const App = () => {
  return (
    <SocketProvider>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<ExpertList />} />
          <Route path="/experts/:id" element={<ExpertDetail />} />
          <Route path="/booking/:expertId" element={<BookingPage />} />
          <Route path="/book/:expertId" element={<BookingPage />} />
          <Route path="/my-bookings" element={<MyBookings />} />
          <Route path="/admin-bookings" element={<AdminBookings />} />
        </Routes>
      </BrowserRouter>
    </SocketProvider>
  );
};

export default App;
