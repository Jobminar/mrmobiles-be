import Contact from "../models/Contactus.js";

const submitContactForm = async (req, res) => {
  try {
    const { name, email, phone_number, msg_subject, message } = req.body;

    const newContact = new Contact({
      name,
      email,
      phone_number,
      msg_subject,
      message,
    });

    await newContact.save();

    res.status(201).json({ message: "Message sent successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};
const getContactMessages = async (_req, res) => {
  try {
    // Fetch all contact messages from the database
    const contactMessages = await Contact.find();

    // Return the contact messages as a response
    res.status(200).json({ contactMessages });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export default { submitContactForm, getContactMessages };
