import express, { NextFunction, Request, Response } from "express";
import patientService from "../services/patientService";
import { NewPatientSchema, NewEntrySchema } from "../utils";
import { z } from "zod";
import {
  Entry,
  EntryWithoutId,
  NewPatient,
  NonSensitivePatient,
} from "../types";

const router = express.Router();

router.get("/", (_req, res) => {
  res.send(patientService.getPatientsWithoutSsn());
});

router.get("/:id", (req, res) => {
  const id = req.params.id;
  res.send(patientService.getPatient(id));
});

const newPatientParser = (req: Request, _res: Response, next: NextFunction) => {
  try {
    NewPatientSchema.parse(req.body);
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

const newEntryParser = (req: Request, _res: Response, next: NextFunction) => {
  try {
    NewEntrySchema.parse(req.body);
    next();
  } catch (error: unknown) {
    next(error);
  }
};

router.post(
  "/:id/entries",
  newEntryParser,
  (
    req: Request<{ id: string }, unknown, EntryWithoutId>,
    res: Response<Entry>,
    next: NextFunction
  ) => {
    try {
      const patientId = req.params.id;
      console.log("PatientId: ", patientId);
      const addedEntry = patientService.addEntry(patientId, req.body);
      res.json(addedEntry);
    } catch (error: unknown) {
      next(error);
    }
  }
);

router.use(errorMiddleware);

export default router;
