import Stock from "../models/Stock.js";

const stockController = {
  getStocks: async (req, res) => {
    try {
      const stocks = await find();
      res.json(stocks);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  },

  addStock: async (req, res) => {
    try {
      const { name, model, quantity, type } = req.body;
      const stock = new Stock({ name, model, quantity, type });
      await stock.save();
      res.json({ stock, message: "Stock added" });
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: "Internal server error" });
    }
  },

  updateStock: async (req, res) => {
    try {
      const { id } = req.params;
      const { name, quantity } = req.body;
      const stock = await findByIdAndUpdate(id, { name, quantity });
      res.json({ message: "Stock updated successfully", stock });
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  },

  deleteStock: async (req, res) => {
    try {
      const { id } = req.params;
      await findByIdAndDelete(id);
      res.json({ message: "Stock deleted successfully" });
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  },
};

export default stockController;
