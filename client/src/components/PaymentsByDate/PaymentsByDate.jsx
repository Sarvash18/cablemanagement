import { useState } from "react";
import axios from "axios";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const PaymentsByDate = () => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [paidSubscribers, setPaidSubscribers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [notFound, setNotFound] = useState(false);
  const [error, setError] = useState("");

  const handleDateChange = async (date) => {
    setSelectedDate(date);
    setLoading(true);
    setNotFound(false);
    setError("");

    try {
      const formattedDate = date.toISOString().split("T")[0];
      const response = await axios.get(
        `https://cablemanagement-backend.onrender.com/subscriber/paid/${formattedDate}`
      );

      if (response.data.length === 0) {
        setNotFound(true);
      } else {
        setPaidSubscribers(response.data);
      }
    } catch (error) {
      if (error.response) {
        // Handle 4xx and 5xx errors
        if (error.response.status === 404) {
          setNotFound(true);
        } else if (error.response.status === 400) {
          setError("Invalid date format");
        } else {
          setError("Server error. Please try again later.");
        }
      } else {
        setError("Network error. Please check your connection.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-4">
      <h2 className="text-center">
        <strong>Payments by Date</strong>
      </h2>

      <div className="d-flex justify-content-center mb-4">
        <DatePicker
          selected={selectedDate}
          onChange={handleDateChange}
          dateFormat="yyyy-MM-dd"
          className="form-control"
          placeholderText="Select a date"
        />
      </div>

      {loading ? (
        <p className="text-center">Loading...</p>
      ) : error ? (
        <p className="text-center text-danger">{error}</p>
      ) : notFound ? (
        <p className="text-center text-danger">
          No payments found for this date.
        </p>
      ) : (
        <div className="table-responsive">
          <table
            className="table table-striped table-hover mx-auto"
            style={{ maxWidth: "900px" }}
          >
            <thead className="table-dark">
              <tr>
                <th>#</th>
                <th>Customer ID</th>
                <th>Name</th>
                <th>Phone</th>
                <th>Street</th>
                <th>Amount Paid</th>
              </tr>
            </thead>
            <tbody>
              {paidSubscribers.map((subscriber, index) => (
                <tr key={subscriber.customerId}>
                  <th>{index + 1}</th>
                  <td>{subscriber.customerId}</td>
                  <td>{subscriber.name}</td>
                  <td>{subscriber.phn}</td>
                  <td>{subscriber.street}</td>
                  <td>{subscriber.subscriptionFee}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default PaymentsByDate;
