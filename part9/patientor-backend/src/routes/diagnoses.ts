import express from "express";

const router = express.Router();

router.get("/", (_req, res) => {
  res.send("Fetching all diagnoses");
});

export default router;
