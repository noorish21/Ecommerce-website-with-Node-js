import express from "express";
import mongoose from "mongoose";
import path from "path";
import dotenv from "dotenv";
import cors from "cors";
import bodyParser from "body-parser";

dotenv.config();

const app = express();
const __dirname = process.cwd();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "public")));

// Connect MongoDB
mongoose
  .connect(process.env.MONGO_URI || "mongodb://localhost:27017/fashionista")
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// Order Schema
const orderSchema = new mongoose.Schema({
  items: [
    {
      id: Number,
      title: String,
      price: Number,
      quantity: Number,
      image: String,
    },
  ],
  total: Number,
  date: { type: Date, default: Date.now },
});

const Order = mongoose.model("Order", orderSchema);

// Serve HTML pages
app.get("/", (req, res) =>
  res.sendFile(path.join(__dirname, "public", "index.html"))
);

app.get("/cart", (req, res) =>
  res.sendFile(path.join(__dirname, "public", "cart.html"))
);

app.get("/success", (req, res) =>
  res.sendFile(path.join(__dirname, "public", "success.html"))
);

app.get("/success.html", (req, res) =>
  res.sendFile(path.join(__dirname, "public", "success.html"))
);

app.get("/cancel", (req, res) =>
  res.sendFile(path.join(__dirname, "public", "cancel.html"))
);

app.get("/cancel.html", (req, res) =>
  res.sendFile(path.join(__dirname, "public", "cancel.html"))
);

// ✅ Handle checkout: save order in MongoDB
app.post("/create-order", async (req, res) => {
  try {
    const { items } = req.body;
    if (!items || items.length === 0) {
      return res
        .status(400)
        .json({ success: false, message: "Your cart is empty!" });
    }

    const total = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

    const newOrder = new Order({ items, total });
    await newOrder.save();

    console.log("🛒 New Order Saved:", newOrder);
    res.json({ success: true, message: "Order placed successfully" });
  } catch (err) {
    console.error("❌ Order Error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () =>
  console.log(`🚀 Server running at http://localhost:${PORT}`)
);
