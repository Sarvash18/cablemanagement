import { useEffect, useState } from "react";
import axios from "axios";

const PaymentsHistory = ({ customerId }) => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPaymentHistory = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5050/subscriber/${customerId}/payments/`
        );
        setPayments(response.data.payments);
      } catch (error) {
        console.error("Error fetching payment history:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPaymentHistory();
  }, [customerId]);

  return (
    <div>
      {loading ? (
        <p className="ms-5">Loading payment history...</p>
      ) : payments.length === 0 ? (
        <p>No payment history found.</p>
      ) : (
        <div className="d-flex justify-content-center">
          <table className="table table-bordered mt-3 w-50 text-center">
            <thead className="table-dark">
              <tr>
                <th>Month</th>
                <th>Amount Paid (₹)</th>
              </tr>
            </thead>
            <tbody>
              {payments.map((payment, index) => (
                <tr key={index}>
                  <td>
                    {new Date(payment.datePaid).toLocaleString("default", {
                      month: "long",
                      year: "numeric",
                    })}
                  </td>
                  <td>₹ {payment.amountPaid}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default PaymentsHistory;
