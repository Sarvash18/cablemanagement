import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar/Navbar";
import Subscribers from "./components/Subscribers/Subscribers";
import Home from "./components/Home/Home";
import Unpaid from "./components/Unpaid/Unpaid";
import PaymentsByDate from "./components/PaymentsByDate/PaymentsByDate";
import AdminPanel from "./components/Admin/AdminPanel";
function App() {
  return (
    <Router>
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/subscribers" element={<Subscribers />} />
        <Route path="/subscribers/:customerId" element={<Subscribers />} />
        <Route path="/unpaid" element={<Unpaid />} />
        <Route path="/payments-by-date" element={<PaymentsByDate />} />
        <Route path="/admin-panel" element={<AdminPanel />} />
      </Routes>
    </Router>
  );
}

export default App;
