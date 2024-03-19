import { Router } from "express";
const router = Router();
import authController from "../controllers/authController.js";
// Import controllers
import stockController from "../controllers/stockController.js";
import customerController from "../controllers/customerController.js";
import serviceBookingController from "../controllers/serviceBookingController.js";
import faqController from "../controllers/faqController.js";
import ContactusController from "../controllers/contactusController.js";

// Admin routes
router.get(
  "/stocks",

  stockController.getStocks
);
router.post(
  "/stocks",

  stockController.addStock
);
router.put(
  "/stocks/:id",

  stockController.updateStock
);
router.delete(
  "/stocks/:id",

  stockController.deleteStock
);

router.post(
  "/customer/onboarding",

  customerController.createCustomer
);
router.put(
  "/service/status/:id",

  customerController.updateServiceStatus
);
router.delete(
  "/customer/:id",

  customerController.deleteCustomer
);
router.get("/customer/reports", customerController.getCustomerReports);
// router.get('/customer/reports/export', customerController.exportCustomerReports);
router.get("/customer/Allreports", customerController.getAllCustomerReports);
// Customer routes

// Customer routes
// router.post('/customer/requests', authController.authenticateToken, customerController.createRequest);
router.get(
  "/customer/requests/:id",

  customerController.getDetails
);

// Auth routes
router.post("/update-password", authController.updatePasswordController);
router.post("/register", authController.registerController);
router.post("/login", authController.loginController);
router.post("/reset-password", authController.resetPasswordController);
router.get("/get-all-users", authController.getAllUsers);
// POST request to book a service
router.post("/book-service", serviceBookingController.bookService);
router.post("/faq", faqController.submitQuestion);
router.get("/get-faq", faqController.getFAQ);
//Submit Contact form
router.post("/contact", ContactusController.submitContactForm);
router.get("/get-contact-messages", ContactusController.getContactMessages);
export default router;
