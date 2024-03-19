// const CustomerRequest = require('../models/CustomerRequest');
import CustomerOnboarding from "../models/CustomerOnboarding.js";
// const ExcelJS = require('exceljs');
// const mailgunTransport = require('nodemailer-mailgun-transport');
import { createTransport } from "nodemailer";
import nodemailer from "nodemailer";
// Create a Nodemailer transporter using Mailgun SMTP transport
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true, // upgrade later with STARTTLS
  auth: {
    user: "jobminarinfo@gmail.com",
    pass: "rpvn zvcr efap poue",
  },
});

const sendStatusEmail = async (
  id,
  advancePay,
  status,
  recipientEmail,
  expectedDeliveryDate
) => {
  // console.log("adv",advancePay);
  // console.log("email:",recipientEmail)
  try {
    const mailOptions = {
      from: "elimillasrinivas@gmail.com", // Replace with your email address
      to: recipientEmail,
      subject: "Service Status Update",
      html: `
      <h3>Your Service ID: ${id}</h3>
      <h4>Your service status has been updated to <span style='color:green;'>${status}</span></h4>
      <p><b>Expected Delivery Date</b> : ${expectedDeliveryDate}</p>
      <p><b>Advance Paid</b> : ${advancePay}</p>

      `,
    };

    await transporter.sendMail(mailOptions);
    console.log("Email sent successfully");
  } catch (error) {
    console.error("Error sending email:", error);
  }
};

const sendCustomerOnboardingEmail = async (
  id,
  userEmail,
  status,
  imeiNumber,
  mobilemodel,
  priceQuoted,
  advancePay,
  expectedDeliveryDate
) => {
  // console.log(id,userEmail,status,mobilemodel,priceQuoted,advancePay,expectedDeliveryDate);
  try {
    const mailOptions = {
      from: "jobminarinfo@gmail.com",
      to: userEmail,
      subject: "Mr.Mobiles Services",
      html: `
      <center>
        <h3>Thank you for choosing Mr.Mobiles services</h3>
        <p><b>Your Service ID :</b> ${id}</p>
        <p><b>Your Device IMEI:</b> ${imeiNumber}</p>
        <p><b>Your Device Model :</b> ${mobilemodel}</p>
        <p><b>Price Quotated :</b> ${priceQuoted}</p>
        <p><b>Advance Paid :</b> ${advancePay}</p>
        <p><b>Advance Paid :</b> ${expectedDeliveryDate}</p>
        <p><b>Your Service Status :</b> <span style='color:green'>${status}</span></p>
      </center>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log("Email sent successfully");
  } catch (error) {
    console.error("Error sending email:", error);
  }
};

const customerController = {
  // createRequest: async (req, res) => {
  //   try {
  //     const {id} = req.body;
  //     const request = CustomerOnboarding.findOne({id})
  //     if(request){
  //       await sendStatusRequest()
  //       res.json({message:"Request sent successfully"})
  //     }
  //     else{
  //       res.json({message:"You have not booked any of our services"})
  //     }
  //   } catch (error) {
  //     res.status(500).json({ error: 'Internal server error' });
  //   }
  // },

  getDetails: async (req, res) => {
    try {
      const { id } = req.params;
      // console.log(id);
      const details = await findById(id);
      if (!details) {
        return res
          .status(404)
          .json({ error: "You have not booked any of our services." });
      }
      res.json(details);
    } catch (error) {
      res.status(500).json({ error, message: "Internal server error" });
    }
  },

  createCustomer: async (req, res) => {
    try {
      const {
        name,
        mobile,
        email,
        mobileMake,
        mobileModel,
        imeiNumber,
        reference,
        issue,
        priceQuoted,
        advancePay,
        registeredDate,
        expectedDeliveryDate,
        comments,
      } = req.body;

      const user = new CustomerOnboarding({
        name,
        mobile,
        email,
        mobileMake,
        mobileModel,
        imeiNumber,
        reference,
        issue,
        priceQuoted,
        advancePay,
        registeredDate,
        expectedDeliveryDate,
        comments,
      });
      await user.save();
      sendCustomerOnboardingEmail(
        user._id,
        user.email,
        user.status,
        user.imeiNumber,
        user.mobileModel,
        user.priceQuoted,
        user.advancePay,
        user.expectedDeliveryDate
      );
      res.json({ user, message: "Customer onboarded successfully" });
    } catch (error) {
      console.log(error);
      res.status(500).json({ error, message: "Internal server error" });
    }
  },

  getCustomerReports: async (req, res) => {
    try {
      const { startDate, endDate } = req.query;

      let query = {}; // An empty query object to fetch all records if no date range is provided

      if (startDate && endDate) {
        // If both startDate and endDate are provided, add date range filter to the query
        const start = new Date(startDate);
        const end = new Date(endDate);

        query.registeredDate = {
          $gte: start,
          $lte: end,
        };
      }

      const reports = await find(query).select(
        "name mobile email mobileMake mobileModel imeiNumber reference issue priceQuoted advancePay registeredDate expectedDeliveryDate comments status"
      );

      res.json(reports);
    } catch (error) {
      res.status(500).json({ error, message: "Internal server error" });
    }
  },

  updateServiceStatus: async (req, res) => {
    try {
      const { id } = req.params;
      let { advancePay, status, email, expectedDeliveryDate } = req.body;
      // console.log(advancePay);
      advancePay = Number(advancePay);
      // Send email notification to the customer
      const request = await findByIdAndUpdate(
        id,
        { id, status, advancePay, expectedDeliveryDate },
        { new: true }
      );
      // const customer = await User.findById(request.customerId);

      await sendStatusEmail(
        id,
        advancePay,
        status,
        email,
        expectedDeliveryDate
      );

      res.json({ request, message: "Email sent successfully" });
    } catch (error) {
      res.status(500).json({ error, meesage: "Internal server error" });
    }
  },

  deleteCustomer: async (req, res) => {
    try {
      const { id } = req.params;

      // Find the customer to delete
      const customer = await findById(id);
      if (!customer) {
        return res.status(404).json({ error: "Customer not found" });
      }

      // Delete the customer
      await findByIdAndRemove(id);

      res.json({ message: "Customer deleted successfully" });
    } catch (error) {
      res.status(500).json({ error, message: "Internal server error" });
    }
  },

  // exportCustomerReports: async (req, res) => {
  //   try {
  //     const { startDate, endDate } = req.query; // Assuming the date range is provided as query parameters
  //     const start = new Date(startDate);
  //     const end = new Date(endDate);

  //     const reports = await CustomerOnboarding.find({
  //       registeredDate: {
  //         $gte: start,
  //         $lte: end,
  //       },
  //     }).select('name registeredDate mobileModel issue priceQuoted advancePay devicedeliverystatus');

  //     // Create a new workbook and worksheet
  //     const workbook = new ExcelJS.Workbook();
  //     const worksheet = workbook.addWorksheet('Customer Reports');

  //     // Add headers to the worksheet
  //     worksheet.addRow(['Name', 'Registered Date', 'Mobile Model', 'Issue', 'Quoted Price', 'Advance Payment', 'Delivery Status']);

  //     // Add data to the worksheet
  //     reports.forEach((report) => {
  //       worksheet.addRow([
  //         report.name,
  //         report.registeredDate,
  //         report.mobileModel,
  //         report.issue,
  //         report.priceQuoted,
  //         report.advancePay,
  //         report.devicedeliverystatus,
  //       ]);
  //     });

  //     // Generate the Excel file in memory
  //     const buffer = await workbook.xlsx.writeBuffer();

  //     // Set the appropriate headers for the response
  //     res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
  //     res.setHeader('Content-Disposition', 'attachment; filename=customer_reports.xlsx');

  //     // Send the generated Excel file as the response
  //     res.send(buffer);
  //   } catch (error) {
  //     res.status(500).json({ error: 'Internal server error' });
  //   }
  // },

  getAllCustomerReports: async (req, res) => {
    try {
      // No need to check for startDate and endDate

      // Empty query to fetch all records
      const query = {};

      // Select specific fields for the response
      const selectFields =
        "name mobile email mobileMake mobileModel imeiNumber reference issue priceQuoted advancePay registeredDate expectedDeliveryDate comments status";

      // Fetch reports based on the query and selected fields
      const reports = await find(query).select(selectFields);

      // Respond with the fetched reports
      res.json(reports);
    } catch (error) {
      // Handle any errors that may occur during the process
      res.status(500).json({ error, message: "Internal server error" });
    }
  },
};

export default customerController;
