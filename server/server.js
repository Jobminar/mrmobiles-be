import express, { json } from "express";
import { fileURLToPath } from "url";
import { dirname, resolve } from "path";
import mongoose from "mongoose";
import { createTransport } from "nodemailer";
import Subscriber from "./models/Subscriber.js";
import cors from "cors";
import { config } from "dotenv";
import apiRoutes from "./routes/index.js";
import path from "path";

config();

const app = express();

// Middleware
app.use(json());
app.use(cors());

// DB Connection
mongoose
  .connect(process.env.mongo_uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("DB Connected"))
  .catch((error) => console.log(error));

// Routes
app.use("/api", apiRoutes);

// POST route for subscribing to the newsletter
app.post("/subscribe", (req, res) => {
  const { email } = req.body;

  // Create a new subscriber document
  const subscriber = new Subscriber({ email });

  // Save the subscriber to the database
  subscriber
    .save()
    .then(() => {
      res.json({
        message: "You have successfully subscribed to the newsletter",
      });
    })
    .catch((error) => {
      if (error.code === 11000) {
        // Duplicate key error (email already exists)
        res
          .status(400)
          .json({ message: "Email address is already subscribed" });
      } else {
        res
          .status(500)
          .json({ message: "An error occurred. Please try again later" });
      }
    });
});

// Customer requests to mails

// Create a transporter for sending emails
const transporter = createTransport({
  service: "gmail",
  auth: {
    user: process.env.gmail,
    pass: process.env.gmail_password,
  },
});

// Route to handle contact-us submission
app.post("/contact-us", (req, res) => {
  const { name, email, mobile, subject, message } = req.body;

  // Email Message
  const mailOptions = {
    from: `${email}`,
    to: "jobminarinfo@gmail.com",
    subject: "Contact Form Submission",
    html: `
      <h2>Contact Form Submission</h2>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Phone Number:</strong> ${mobile}</p>
      <p><strong>Subject:</strong> ${subject}</p>
      <p><strong>Message:</strong> ${message}</p>
    `,
  };

  // Send the email
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      res.status(500).json({ message: "Error sending email", error });
    } else {
      res.status(200).json({ message: "Request sent successfully" });
    }
  });
});

// Route to handle faq submission
app.post("/faq", (req, res) => {
  const { name, email, phone, question, message } = req.body;

  // Email Message
  const mailOptions = {
    from: `${email}`,
    to: "jobminarinfo@gmail.com",
    subject: "FAQ Form Submission",
    html: `
      <h2>FAQ Form Submission</h2>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Phone Number:</strong> ${phone}</p>
      <p><strong>Question:</strong> ${question}</p>
      <p><strong>Message:</strong> ${message}</p>
    `,
  };

  // Send the email
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      res.status(500).json({ message: "Error sending email", error });
    } else {
      res.status(200).json({ message: "Question sent successfully" });
    }
  });
});

// Service-Schedule
app.post("/service-schedule", (req, res) => {
  const { name, email, mobile } = req.body;

  // Email Message
  const mailOptions = {
    from: `${email}`,
    to: "jobminarinfo@gmail.com",
    subject: "Service Schedule Form Submission",
    html: `
      <h2>Service Schedule Form Submission</h2>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Phone Number:</strong> ${mobile}</p>
    `,
  };

  // Send the email
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      res.status(500).json({ message: "Error sending email", error });
    } else {
      res.status(200).json({ message: "Request sent successfully" });
    }
  });
});

// Serve static files from the "public" directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Define the path to the public directory
const publicDirectoryPath = resolve(__dirname, "../client/public");

// Serve static files from the "public" directory
app.use(express.static(publicDirectoryPath));

// 404 Error Handler
app.use((req, res, next) => {
  res.status(404).sendFile(path.join(publicDirectoryPath, "404.html"));
});
// Start the server
const port = process.env.PORT || 5001;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
