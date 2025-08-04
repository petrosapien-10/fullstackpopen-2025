import { Request, Response } from "express";
import diagnosisRouter from "./routes/diagnoses";
import patientRouter from "./routes/patients";

const express = require("express");
const cors = require("cors");
const app = express();

app.use(express.json());
app.use(cors());
const PORT = 3001;

app.get("/api/ping", (_req: Request, res: Response) => {
  console.log("someone pinged here");
  res.send("pong");
});

app.use("/api/diagnoses", diagnosisRouter);
app.use("/api/patients", patientRouter);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
