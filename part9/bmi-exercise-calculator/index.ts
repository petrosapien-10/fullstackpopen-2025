import express from "express";
import { calculateBmi } from "./bmiCalculator";
import { calculateExercises } from "./exerciseCalculator";

interface ExercisePayload {
  daily_exercises: number[];
  target: number;
}

const app = express();

app.use(express.json());

app.get("/bmi", (req, res) => {
  const height = Number(req.query.height);
  const weight = Number(req.query.weight);

  if (!height || !weight || isNaN(height) || isNaN(weight)) {
    res.status(400).send({ error: "malformatted parameters" });
  }
  console.log("typeof height: ", typeof height);

  const bmi = calculateBmi(height, weight);

  const returnObject = {
    weight,
    height,
    bmi,
  };

  res.send(returnObject);
});

app.post("/exercises", (req, res) => {
  const body = req.body as ExercisePayload;
  const target = body.target;
  const daily_exercises = body.daily_exercises;

  if (target === undefined || daily_exercises === undefined) {
    return res.status(400).send({
      error: "parameters missing",
    });
  }

  if (
    !Array.isArray(daily_exercises) ||
    isNaN(Number(target)) ||
    !daily_exercises.every((hour) => typeof hour === "number")
  ) {
    return res.status(400).send({
      error: "malformatted parameters",
    });
  }

  const result = calculateExercises(daily_exercises, target);

  return res.send(result);
});

const PORT = 3003;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
