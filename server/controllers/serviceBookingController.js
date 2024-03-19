// controllers/serviceBookingController.js

import ServiceBooking from "../models/ServiceBooking.js";

const bookService = async (req, res) => {
  try {
    const {
      serviceType,
      deviceName,
      deviceType,
      make,
      itemModel,
      customerName,
      phoneNumber,
      description,
    } = req.body;

    const newBooking = new ServiceBooking({
      serviceType,
      deviceName,
      deviceType,
      make,
      itemModel,
      customerName,
      phoneNumber,
      description,
    });

    await newBooking.save();

    res.status(201).json({ message: "Service booked successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export default { bookService };
