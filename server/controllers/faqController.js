import Faq from "../models/Faq.js";

function submitQuestion(req, res) {
  try {
    const { name, email, number, question, message } = req.body;

    const newQuestion = new Faq({
      name,
      email,
      phone: number,
      question,
      message,
    });

    newQuestion.save();

    res.status(201).json({ message: "Question submitted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
}
async function getFAQ(req, res) {
  try {
    // Fetch all FAQs from the database
    const faqs = await Faq.find();

    // Return the FAQs as a response
    res.status(200).json({ faqs });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
}
export default {
  submitQuestion,
  getFAQ,
};
