import { Schema, model } from "mongoose";

const customerOnboardingSchema = Schema({
  name: String,
  mobile: Number,
  email: String,
  mobileMake: String,
  mobileModel: String,
  imeiNumber: String,
  reference: String,
  issue: String,
  priceQuoted: Number,
  advancePay: Number,
  registeredDate: String,
  expectedDeliveryDate: String,
  comments: String,
  status: {
    type: String,
    default: "pending",
  },
});

const CustomerOnboarding = model(
  "CustomerOnboarding",
  customerOnboardingSchema
);

export default CustomerOnboarding;
