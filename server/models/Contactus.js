import { Schema, model } from "mongoose";

const contactSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone_number: { type: Number, required: true },
  msg_subject: { type: String, required: true },
  message: { type: String, required: true },
});

const Contact = model("Contact", contactSchema);

export default Contact;
