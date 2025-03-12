import express from "express";
import Subscriber from "../model/Subscriber.js";

const router = express.Router();

// GET all subscribers
router.get("/", async (req, res) => {
  try {
    const subscribers = await Subscriber.find().sort({ customerId: 1 });
    res.json(subscribers);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

//  GET payment history for a specific subscriber
router.get("/:customerId/payments", async (req, res) => {
  try {
    const { customerId } = req.params;

    // Find payment history by customer ID
    const paymentHistory = await Subscriber.findOne({ customerId });

    if (!paymentHistory) {
      return res.status(404).json({ message: "No payment history found" });
    }

    res.json(paymentHistory);
  } catch (error) {
    console.error("Error fetching payment history:", error);
    res.status(500).json({ message: "Server error" });
  }
});


// GET unpaid subscribers
router.get("/unpaid", async (req, res) => {
  try {
    const unpaidCustomers = await Subscriber.find({ paid: false }).sort({
      customerId: 1,
    });

    if (!unpaidCustomers.length) {
      return res.status(404).json({ message: "No unpaid customers found" });
    }

    res.json(unpaidCustomers);
  } catch (error) {
    console.error("Error fetching unpaid customers:", error);
    res.status(500).json({ message: "Error retrieving unpaid customers" });
  }
});

// GET subscriber by customerId
router.get("/:customerId", async (req, res) => {
  try {
    const subscriber = await Subscriber.findOne({
      customerId: req.params.customerId,
    });

    if (!subscriber) {
      return res.status(404).json({ message: "Subscriber not found" });
    }

    res.json(subscriber);
  } catch (error) {
    console.error("Error fetching subscriber:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ CREATE a new subscriber
router.post("/", async (req, res) => {
  try {
    const {
      customerId,
      name,
      phn,
      street,
      paid,
      lastPaidDate,
      subscriptionFee,
    } = req.body;

    // Check if the customer already exists
    const existingSubscriber = await Subscriber.findOne({ customerId });
    if (existingSubscriber) {
      return res.status(400).json({ message: "Customer ID already exists" });
    }

    // Create a new subscriber
    const newSubscriber = new Subscriber({
      customerId,
      name,
      phn,
      street,
      paid,
      lastPaidDate,
      subscriptionFee,
    });

    await newSubscriber.save();
    res
      .status(201)
      .json({ message: "Subscriber created successfully", newSubscriber });
  } catch (error) {
    console.error("Error creating subscriber:", error);
    res.status(500).json({ message: "Error creating subscriber", error });
  }
});

// ✅ UPDATE subscriber details (Name, Phone, Street, Subscription Fee, etc.)
router.put("/:customerId", async (req, res) => {
  try {
    const { name, phn, street, paid, lastPaidDate, subscriptionFee } = req.body;
    const updateFields = {};

    if (name !== undefined) updateFields.name = name;
    if (phn !== undefined) updateFields.phn = phn;
    if (street !== undefined) updateFields.street = street;
    if (paid !== undefined) updateFields.paid = paid;
    if (lastPaidDate !== undefined) updateFields.lastPaidDate = lastPaidDate;
    if (subscriptionFee !== undefined)
      updateFields.subscriptionFee = subscriptionFee;

    const updatedSubscriber = await Subscriber.findOneAndUpdate(
      { customerId: req.params.customerId },
      { $set: updateFields },
      { new: true }
    );

    if (!updatedSubscriber) {
      return res.status(404).json({ message: "Subscriber not found" });
    }

    res.json({ message: "Subscriber updated successfully", updatedSubscriber });
  } catch (error) {
    console.error("Error updating subscriber:", error);
    res.status(500).json({ message: "Error updating subscriber", error });
  }
});

// ✅ DELETE a subscriber
router.delete("/:customerId", async (req, res) => {
  try {
    const deletedSubscriber = await Subscriber.findOneAndDelete({
      customerId: req.params.customerId,
    });

    if (!deletedSubscriber) {
      return res.status(404).json({ message: "Subscriber not found" });
    }

    res.json({ message: "Subscriber deleted successfully" });
  } catch (error) {
    console.error("Error deleting subscriber:", error);
    res.status(500).json({ message: "Error deleting subscriber", error });
  }
});

// GET subscribers by payment date
router.get("/paid/:date", async (req, res) => {
  try {
    const { date } = req.params;
    const selectedDate = new Date(date);

    if (isNaN(selectedDate.getTime())) {
      return res.status(400).json({ message: "Invalid date format" });
    }

    const startOfDay = new Date(selectedDate);
    startOfDay.setUTCHours(0, 0, 0, 0);

    const endOfDay = new Date(selectedDate);
    endOfDay.setUTCHours(23, 59, 59, 999);

    const paidSubscribers = await Subscriber.find({
      paid: true,
      lastPaidDate: { $gte: startOfDay, $lte: endOfDay },
    });

    if (paidSubscribers.length === 0) {
      return res
        .status(404)
        .json({ message: "No payments found for this date." });
    }

    res.json(paidSubscribers);
  } catch (error) {
    console.error("Error fetching payments:", error);
    res.status(500).json({ message: "Error retrieving payments", error });
  }
});

export default router;
