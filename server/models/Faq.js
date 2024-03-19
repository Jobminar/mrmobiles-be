import { Schema, model } from "mongoose";

const faqSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: Number, required: true },
  question: { type: String, required: true },
  message: { type: String },
});

const Faq = model("Faq", faqSchema);

export default Faq;
