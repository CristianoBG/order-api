require("dotenv").config()

const express = require("express");
const mongoose = require("mongoose");
const orderRoutes = require("./routes/orderRoutes");

const app = express();

app.use(express.json());

mongoose.connect(process.env.MONGO_URI);

mongoose.connection.on("connected", () => {
  console.log("MongoDB conectado");
});

app.use("/", orderRoutes);

app.listen(3000, () => {
  console.log("Servidor rodando na porta 3000");
});