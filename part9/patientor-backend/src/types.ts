import { z } from "zod";
import { NewPatientSchema } from "./utils";

export enum Gender {
  Male = "male",
  Female = "female",
  Other = "other",
}

export interface Diagnosis {
  code: string;
  name: string;
  latin?: string;
}

export type NewPatient = z.infer<typeof NewPatientSchema>;
export interface Patient extends NewPatient {
  id: string;
}
export type PatientWithoutSsn = Omit<Patient, "ssn">;
