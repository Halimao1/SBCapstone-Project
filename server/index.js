require("dotenv").config();
const mongoose = require("mongoose");
const express = require("express");
const cookieParser = require("cookie-parser");
const authRoutes = require("./routes/auth");
const evaluationsRoutes = require("./routes/evaluations");
const decisionRoutes = require("./routes/decisions");
const path = require("path");
const app = express();
const port = process.env.PORT || 3000;

app.use(cookieParser());
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/evaluations", evaluationsRoutes);
app.use("/api/decisions", decisionRoutes);
app.get("/api/health", (req, res) => {
  return res.json({ message: "API is running" });
});
const clientDistPath = path.join(__dirname, "../client/dist");
if (process.env.NODE_ENV === "production") {
  app.use(express.static(clientDistPath));

  app.use((req, res, next) => {
    if (req.method === "GET" && !req.path.startsWith("/api")) {
      return res.sendFile(path.join(clientDistPath, "index.html"));
    }
    return next();
  });
}
const startServer = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  } catch (error) {
    console.error("Could not connect to database");
    console.error(error);
  }
};
startServer();
