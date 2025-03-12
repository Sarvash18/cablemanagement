import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "./Home.css";

const Home = () => {
  const [totalCustomers, setTotalCustomers] = useState(0);
  const [paidCustomers, setPaidCustomers] = useState(0);
  const [unpaidCustomers, setUnpaidCustomers] = useState(0);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [todayPayments, setTodayPayments] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "https://cablemanagement-backend.onrender.com/subscriber"
        );
        const customers = response.data;

        const paid = customers.filter((c) => c.paid);
        const unpaid = customers.filter((c) => !c.paid);
        const revenue = paid.length * 280; // Assuming ₹280 per customer

        // Get today's date in YYYY-MM-DD format
        const today = new Date().toISOString().split("T")[0];

        // Filter customers who paid today
        const todayPaidCustomers = paid.filter(
          (c) =>
            c.lastPaidDate &&
            new Date(c.lastPaidDate).toISOString().split("T")[0] === today
        );

        setTotalCustomers(customers.length);
        setPaidCustomers(paid.length);
        setUnpaidCustomers(unpaid.length);
        setTotalRevenue(revenue);
        setTodayPayments(todayPaidCustomers); // Store customers who paid today
      } catch (error) {
        console.error("Error fetching data", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="container mt-4">
      <h2>
        <strong>Dashboard</strong>
      </h2>
      <div className="row">
        <div className=" col-md-3">
          <div className="card text-bg-primary mb-3">
            <div className="card-body">
              <h5 className="card-title">Total Customers</h5>
              <p className="card-text ">{totalCustomers}</p>
            </div>
          </div>
        </div>
        <div className="col-6 col-md-3">
          <div className="card text-bg-success mb-3">
            <div className="card-body">
              <h5 className="card-title">Paid Customers</h5>
              <p className="card-text">{paidCustomers}</p>
            </div>
          </div>
        </div>
        <div className="col-6 col-md-3 mleft">
          <div className="card text-bg-danger mb-3">
            <div className="card-body">
              <h5 className="card-title unpaid">Unpaid Customers</h5>
              <p className="card-text unpaid">{unpaidCustomers}</p>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card text-bg-warning mb-3">
            <div className="card-body">
              <h5 className="card-title">Total Revenue</h5>
              <p className="card-text">₹{totalRevenue}</p>
            </div>
          </div>
        </div>
      </div>

      <h3>
        <strong>Today's Payments</strong>
      </h3>
      {todayPayments.length > 0 ? (
        <table className="table table-bordered">
          <thead>
            <tr>
              <th>Customer ID</th>
              <th>Name</th>
              <th>Subscription Fee</th>
            </tr>
          </thead>
          <tbody>
            {todayPayments.map((customer) => (
              <tr key={customer.customerId}>
                <td>{customer.customerId}</td>
                <td>{customer.name}</td>
                <td>{customer.subscriptionFee}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className="text-muted">No payments made today.</p>
      )}

      <div className="mt-4">
        <Link to="/subscribers" className="btn btn-primary me-2">
          View All Customers
        </Link>
        <Link to="/unpaid" className="btn btn-danger">
          View Unpaid Customers
        </Link>
      </div>
    </div>
  );
};

export default Home;
