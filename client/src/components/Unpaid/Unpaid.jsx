import { useEffect, useState } from "react";
import axios from "axios";


const Unpaid = () => {
  const [unpaidCustomers, setUnpaidCustomers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUnpaidCustomers = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5050/subscriber/unpaid"
        );
        setUnpaidCustomers(response.data);
      } catch (error) {
        console.error("Error fetching unpaid customers", error);
      } finally {
        setLoading(false);
      }
    };
    fetchUnpaidCustomers();
  }, []);

  return (
    <div className="container mt-4">
      <h2 className="text-center">
        <strong>Unpaid Customers</strong>
      </h2>
      {loading ? (
        <p>Loading...</p>
      ) : unpaidCustomers.length === 0 ? (
        <p className="text-success">All customers have paid!</p>
      ) : (
        <div className="table-responsive">
          <table className="table ">
            <thead className="table-dark">
              <tr>
                <th>Customer ID</th>
                <th>Name</th>
                <th>Phone</th>
                <th>Street</th>
                <th>Subscription Fee</th>
              </tr>
            </thead>
            <tbody>
              {unpaidCustomers.map((customer) => (
                <tr key={customer.customerId}>
                  <td>{customer.customerId}</td>
                  <td>{customer.name}</td>
                  <td>{customer.phn}</td>
                  <td>{customer.street}</td>
                  <td>₹{customer.subscriptionFee}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Unpaid;
