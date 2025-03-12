import React, { useState } from "react";
import axios from "axios";

const AdminPanel = () => {
  const [formData, setFormData] = useState({
    customerId: "",
    name: "",
    phn: "",
    street: "",
    paid: false,
    lastPaidDate: "",
    subscriptionFee: "",
  });

  const [searchId, setSearchId] = useState(""); // For fetching customer details
  const [customerDetails, setCustomerDetails] = useState(null); // Holds customer details for update/delete
  const [message, setMessage] = useState(""); // Success/Error messages

  // Handle form input change
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  // Create a new customer
  const handleCreate = async () => {
    try {
      const response = await axios.post(
        "https://cablemanagement-backend.onrender.com/subscriber",
        formData
      );
      setMessage(response.data.message);
      setFormData({
        customerId: "",
        name: "",
        phn: "",
        street: "",
        paid: false,
        lastPaidDate: "",
        subscriptionFee: "",
      });
    } catch (error) {
      setMessage("Error creating customer");
      console.error(error);
    }
  };

  // Fetch customer details for update/delete
  const handleFetchCustomer = async () => {
    try {
      const response = await axios.get(
        `https://cablemanagement-backend.onrender.com/subscriber/${searchId}`
      );
      setCustomerDetails(response.data);
      setMessage("");
    } catch (error) {
      setMessage("Customer not found");
      setCustomerDetails(null);
    }
  };

  // Update customer details
  const handleUpdate = async () => {
    try {
      await axios.put(
        `https://cablemanagement-backend.onrender.com/subscriber/${searchId}`,
        customerDetails
      );
      setMessage("Customer updated successfully");
      setCustomerDetails(null);
      setSearchId("");
    } catch (error) {
      setMessage("Error updating customer");
    }
  };

  // Delete a customer
  const handleDelete = async () => {
    try {
      await axios.delete(`https://cablemanagement-backend.onrender.com/subscriber/${searchId}`);
      setMessage("Customer deleted successfully");
      setCustomerDetails(null);
      setSearchId("");
    } catch (error) {
      setMessage("Error deleting customer");
    }
  };

  return (
    <div className="container mt-4">
      <h2 className="text-center">
        <strong>Admin Panel</strong>
      </h2>

      {/* Create Customer Form */}
      <div className="card p-3 mb-4">
        <h4>Create New Customer</h4>
        <input
          type="text"
          name="customerId"
          value={formData.customerId}
          onChange={handleChange}
          placeholder="Customer ID"
          className="form-control mb-2"
        />
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Name"
          className="form-control mb-2"
        />
        <input
          type="text"
          name="phn"
          value={formData.phn}
          onChange={handleChange}
          placeholder="Phone"
          className="form-control mb-2"
        />
        <input
          type="text"
          name="street"
          value={formData.street}
          onChange={handleChange}
          placeholder="Street"
          className="form-control mb-2"
        />
        <input
          type="date"
          name="lastPaidDate"
          value={formData.lastPaidDate}
          onChange={handleChange}
          className="form-control mb-2"
        />
        <input
          type="text"
          name="subscriptionFee"
          value={formData.subscriptionFee}
          onChange={handleChange}
          placeholder="Subscription Fee"
          className="form-control mb-2"
        />
        <label className="me-2">
          <input
            type="checkbox"
            name="paid"
            checked={formData.paid}
            onChange={handleChange}
          />{" "}
          Paid
        </label>
        <button onClick={handleCreate} className="btn btn-success mt-2">
          Create Customer
        </button>
      </div>

      {/* Fetch & Edit Customer */}
      <div className="card p-3 mb-4">
        <h4>Update or Delete Customer</h4>
        <input
          type="text"
          value={searchId}
          onChange={(e) => setSearchId(e.target.value)}
          placeholder="Enter Customer ID"
          className="form-control mb-2"
        />
        <button onClick={handleFetchCustomer} className="btn btn-primary">
          Fetch Customer
        </button>

        {customerDetails && (
          <div className="mt-3">
            <h5>Customer Details</h5>
            <input
              type="text"
              name="name"
              value={customerDetails.name}
              onChange={(e) =>
                setCustomerDetails({ ...customerDetails, name: e.target.value })
              }
              className="form-control mb-2"
            />
            <input
              type="text"
              name="phn"
              value={customerDetails.phn}
              onChange={(e) =>
                setCustomerDetails({ ...customerDetails, phn: e.target.value })
              }
              className="form-control mb-2"
            />
            <input
              type="text"
              name="street"
              value={customerDetails.street}
              onChange={(e) =>
                setCustomerDetails({
                  ...customerDetails,
                  street: e.target.value,
                })
              }
              className="form-control mb-2"
            />
            <input
              type="date"
              name="lastPaidDate"
              value={
                customerDetails.lastPaidDate
                  ? customerDetails.lastPaidDate.split("T")[0]
                  : ""
              }
              onChange={(e) =>
                setCustomerDetails({
                  ...customerDetails,
                  lastPaidDate: e.target.value,
                })
              }
              className="form-control mb-2"
            />
            <input
              type="text"
              name="subscriptionFee"
              value={customerDetails.subscriptionFee}
              onChange={(e) =>
                setCustomerDetails({
                  ...customerDetails,
                  subscriptionFee: e.target.value,
                })
              }
              className="form-control mb-2"
            />
            <label className="me-2">
              <input
                type="checkbox"
                name="paid"
                checked={customerDetails.paid}
                onChange={(e) =>
                  setCustomerDetails({
                    ...customerDetails,
                    paid: e.target.checked,
                  })
                }
              />{" "}
              Paid
            </label>
            <button
              onClick={handleUpdate}
              className="btn btn-warning mt-2 me-2"
            >
              Update Customer
            </button>
            <button onClick={handleDelete} className="btn btn-danger mt-2">
              Delete Customer
            </button>
          </div>
        )}
      </div>

      {/* Message Display */}
      {message && <div className="alert alert-info mt-3">{message}</div>}
    </div>
  );
};

export default AdminPanel;
