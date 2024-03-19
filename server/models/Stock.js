import { Schema, model as _model } from "mongoose";

const stockSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  model: {
    type: String,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
});

const Stock = _model("Stock", stockSchema);

export default Stock;
