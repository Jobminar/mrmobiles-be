// models/ServiceBooking.js

import { Schema, model } from "mongoose";

const serviceBookingSchema = new Schema({
  serviceType: { type: String, required: true },
  deviceName: { type: String, required: true },
  deviceType: { type: String, required: true },
  make: { type: String, required: true },
  itemModel: { type: String, required: true },
  customerName: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  description: { type: String, required: true },
});

const ServiceBooking = model("ServiceBooking", serviceBookingSchema);

export default ServiceBooking;
