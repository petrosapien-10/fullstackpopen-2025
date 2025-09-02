import { z } from "zod";
import { NewPatientSchema } from "./utils";

export enum Gender {
  Male = "male",
  Female = "female",
  Other = "other",
}
export enum HealthCheckRating {
  "Healthy" = 0,
  "LowRisk" = 1,
  "HighRisk" = 2,
  "CriticalRisk" = 3,
}
export interface Diagnosis {
  code: string;
  name: string;
  latin?: string;
}
export type NewPatient = z.infer<typeof NewPatientSchema>;

export interface BaseEntry {
  id: string;
  description: string;
  date: string;
  specialist: string;
  diagnosisCodes?: Array<Diagnosis["code"]>;
}
export interface HealthCheckEntry extends BaseEntry {
  type: "HealthCheck";
  healthCheckRating: HealthCheckRating;
}
export interface HospitalEntry extends BaseEntry {
  type: "Hospital";
  discharge: {
    date: string;
    criteria: string;
  };
}
export interface OccupationalHealthcareEntry extends BaseEntry {
  type: "OccupationalHealthcare";
  employerName: string;
  sickLeave?: {
    startDate: string;
    endDate: string;
  };
}
export type Entry =
  | HospitalEntry
  | HealthCheckEntry
  | OccupationalHealthcareEntry;

type UnionOmit<T, K extends string | number | symbol> = T extends unknown
  ? Omit<T, K>
  : never;

export type EntryWithoutId = UnionOmit<Entry, "id">;

export interface Patient {
  id: string;
  name: string;
  ssn: string;
  occupation: string;
  gender: Gender;
  dateOfBirth: string;
  entries: Entry[];
}

export type NonSensitivePatient = Omit<Patient, "ssn" | "entries">;
