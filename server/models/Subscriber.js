// subscriber.js
import { Schema, model } from "mongoose";

const subscriberSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    validate: {
      validator: function (value) {
        return /^\S+@\S+\.\S+$/.test(value);
      },
      message: "Invalid email address",
    },
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Subscriber = model("Subscriber", subscriberSchema);

export default Subscriber;
