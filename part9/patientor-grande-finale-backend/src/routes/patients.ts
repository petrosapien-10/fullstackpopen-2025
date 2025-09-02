import express, { NextFunction, Request, Response } from "express";
import patientService from "../services/patientService";
import { NewPatientSchema } from "../utils";
import { z } from "zod";
import { NewPatient, NonSensitivePatient } from "../types";

const router = express.Router();

router.get("/", (_req, res) => {
  res.send(patientService.getPatientsWithoutSsn());
});

router.get("/:id", (req, res) => {
  const id = req.params.id;
  console.log("get id was run", id);
  res.send(patientService.getPatient(id));
});

const newPatientParser = (req: Request, _res: Response, next: NextFunction) => {
  try {
    NewPatientSchema.parse(req.body);
    console.log("red.body: ", req.body);
    next();
  } catch (error: unknown) {
    next(error);
  }
};

const errorMiddleware = (
  error: unknown,
  _req: Request,
  res: Response,
  next: NextFunction
) => {
  if (error instanceof z.ZodError) {
    res.status(400).send({ error: error.issues });
  } else {
    next(error);
  }
};

router.post(
  "/",
  newPatientParser,
  (
    req: Request<unknown, unknown, NewPatient>,
    res: Response<NonSensitivePatient>
  ) => {
    const addedPatient = patientService.addPatient(req.body);
    res.json(addedPatient);
  }
);

router.use(errorMiddleware);

export default router;
