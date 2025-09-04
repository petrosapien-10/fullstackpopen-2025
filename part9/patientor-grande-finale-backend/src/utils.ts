import { Gender, HealthCheckRating } from "./types";
import { z } from "zod";

export const NewPatientSchema = z.object({
  name: z.string(),
  dateOfBirth: z.string().date(),
  ssn: z.string(),
  gender: z.nativeEnum(Gender),
  occupation: z.string(),
});

// Base entry schema with common fields
const BaseEntrySchema = z.object({
  date: z.string().date(),
  specialist: z.string().min(1, "Specialist is required"),
  description: z.string().min(1, "Description is required"),
  diagnosisCodes: z.array(z.string()).optional(),
});

// HealthCheck entry schema
export const HealthCheckEntrySchema = BaseEntrySchema.extend({
  type: z.literal("HealthCheck"),
  healthCheckRating: z.nativeEnum(HealthCheckRating),
});

// Hospital entry schema
export const HospitalEntrySchema = BaseEntrySchema.extend({
  type: z.literal("Hospital"),
  discharge: z.object({
    date: z.string().date(),
    criteria: z.string().min(1, "Discharge criteria is required"),
  }),
});

// OccupationalHealthcare entry schema
export const OccupationalHealthcareEntrySchema = BaseEntrySchema.extend({
  type: z.literal("OccupationalHealthcare"),
  employerName: z.string().min(1, "Employer name is required"),
  sickLeave: z
    .object({
      startDate: z.string().date(),
      endDate: z.string().date(),
    })
    .optional(),
});

// Union schema for all entry types
export const NewEntrySchema = z.discriminatedUnion("type", [
  HealthCheckEntrySchema,
  HospitalEntrySchema,
  OccupationalHealthcareEntrySchema,
]);
