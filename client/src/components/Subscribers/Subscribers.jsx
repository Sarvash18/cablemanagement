import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { FaEdit } from "react-icons/fa"; // Import edit icon
import PaymentHistory from "../PaymentHistory/PaymentHistory";

const Subscribers = () => {
  const { customerId } = useParams();
  const [subscribers, setSubscribers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editedFee, setEditedFee] = useState("");
  const [showPayments, setShowPayments] = useState(false);

  useEffect(() => {
    const fetchSubscribers = async () => {
      setLoading(true);
      setNotFound(false);

      try {
        const url = customerId
          ? `https://cablemanagement-backend.onrender.com/subscriber/${customerId}`
          : "https://cablemanagement-backend.onrender.com/subscriber";

        const response = await axios.get(url);

        if (
          !response.data ||
          (Array.isArray(response.data) && response.data.length === 0)
        ) {
          setNotFound(true);
          setSubscribers([]);
        } else {
          setSubscribers(customerId ? [response.data] : response.data);
        }
      } catch (error) {
        setNotFound(true);
        setSubscribers([]);
      } finally {
        setLoading(false);
      }
    };

    fetchSubscribers();
  }, [customerId]);

  const handlePaymentUpdate = async (id) => {
    const todayDate = new Date().toISOString();

    try {
      await axios.put(`https://cablemanagement-backend.onrender.com/subscriber/${id}`, {
        paid: true,
        lastPaidDate: todayDate,
      });

      setSubscribers((prev) =>
        prev.map((sub) =>
          sub.customerId === id
            ? { ...sub, paid: true, lastPaidDate: todayDate }
            : sub
        )
      );
    } catch (error) {
      console.error("Error updating payment status", error);
    }
  };

  const handleEditClick = (id, fee) => {
    setEditingId(id);
    setEditedFee(fee);
  };

  const handleSaveFee = async (id) => {
    try {
      await axios.put(`https://cablemanagement-backend.onrender.com/subscriber/${id}`, {
        subscriptionFee: editedFee,
      });

      setSubscribers((prev) =>
        prev.map((sub) =>
          sub.customerId === id ? { ...sub, subscriptionFee: editedFee } : sub
        )
      );

      setEditingId(null);
    } catch (error) {
      console.error("Error updating subscription fee", error);
    }
  };

  return (
    <div className="container-fluid mt-4">
      <h2 className="text-center">
        <strong>
          {customerId
            ? `Search Result for ID: ${customerId}`
            : "Subscribers List"}
        </strong>
      </h2>

      {loading ? (
        <p className="text-center">Loading...</p>
      ) : notFound ? (
        <p className="text-center text-danger">No matching records found</p>
      ) : (
        <div className="table-wrapper">
          <div className="table-responsive">
            <table className="table table-striped table-hover">
              <thead className="table-dark">
                <tr>
                  <th>Customer ID</th>
                  <th>Name</th>
                  <th>Phone</th>
                  <th>Street</th>
                  <th>Subscription Fee</th>
                  <th>Last Paid Date</th>
                  <th>Paid</th>
                </tr>
              </thead>
              <tbody>
                {subscribers.map((subscriber) => (
                  <tr key={subscriber.customerId}>
                    <td>{subscriber.customerId}</td>
                    <td>{subscriber.name}</td>
                    <td>{subscriber.phn}</td>
                    <td>{subscriber.street}</td>
                    <td>
                      {editingId === subscriber.customerId ? (
                        <input
                          type="number"
                          value={editedFee}
                          onChange={(e) => setEditedFee(e.target.value)}
                          onBlur={() => handleSaveFee(subscriber.customerId)}
                          onKeyDown={(e) =>
                            e.key === "Enter" &&
                            handleSaveFee(subscriber.customerId)
                          }
                          autoFocus
                        />
                      ) : (
                        <>
                          {subscriber.subscriptionFee}{" "}
                          <FaEdit
                            style={{ cursor: "pointer", marginLeft: "8px" }}
                            onClick={() =>
                              handleEditClick(
                                subscriber.customerId,
                                subscriber.subscriptionFee
                              )
                            }
                          />
                        </>
                      )}
                    </td>
                    <td>
                      {subscriber.lastPaidDate
                        ? new Date(subscriber.lastPaidDate).toLocaleDateString()
                        : "N/A"}
                    </td>
                    <td>
                      <input
                        type="checkbox"
                        checked={subscriber.paid}
                        onChange={() =>
                          handlePaymentUpdate(subscriber.customerId)
                        }
                        disabled={subscriber.paid}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
      {customerId && (
        <div className="d-flex justify-content-center">
          <button
            className="btn btn-primary mt-3"
            onClick={() => setShowPayments(!showPayments)}
          >
            {showPayments ? "Hide Payment History" : "View Payments History"}
          </button>
        </div>
      )}
      {showPayments && <PaymentHistory customerId={customerId} />}
    </div>
  );
};

export default Subscribers;
