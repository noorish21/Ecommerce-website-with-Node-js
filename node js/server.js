import express from "express";
import path from "path";
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const __dirname = process.cwd();

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// MongoDB connection
mongoose.connect(process.env.MONGO_URI || "mongodb://localhost:27017/fashionista", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("✅ MongoDB connected"))
.catch(err => console.error("❌ MongoDB error:", err));

// Serve main pages
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.get("/cart", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "cart.html"));
});

app.get(["/success", "/success.html"], (req, res) => {
  res.sendFile(path.join(__dirname, "public", "success.html"));
});

app.get(["/cancel", "/cancel.html"], (req, res) => {
  res.sendFile(path.join(__dirname, "public", "cancel.html"));
});

// Catch-all for unknown routes
app.get("*", (req, res) => {
  res.status(404).send("Page not found");
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
