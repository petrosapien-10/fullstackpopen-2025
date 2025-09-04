import {
  Entry,
  EntryWithoutId,
  Gender,
  NewPatient,
  NonSensitivePatient,
  Patient,
} from "../types";
import patients from "../data/patients";

import { v1 as uuid } from "uuid";

const getPatientsWithoutSsn = (): NonSensitivePatient[] => {
  return patients.map(({ id, name, dateOfBirth, gender, occupation }) => ({
    id,
    name,
    dateOfBirth,
    gender: gender as Gender,
    occupation,
  }));
};

const getPatient = (id: string): Patient | undefined => {
  const patient = patients.find((p) => p.id === id);
  if (!patient) return undefined;
  return {
    id: patient.id,
    name: patient.name,
    dateOfBirth: patient.dateOfBirth,
    ssn: patient.ssn,
    gender: patient.gender as Gender,
    occupation: patient.occupation,
    entries: [...patient.entries],
  };
};

const addPatient = (patient: NewPatient): NonSensitivePatient => {
  const newPatient: Patient = {
    id: uuid(),
    entries: [],
    ...patient,
  };

  patients.push(newPatient);

  const nonSensitivePatient: NonSensitivePatient = {
    id: newPatient.id,
    name: newPatient.name,
    dateOfBirth: newPatient.dateOfBirth,
    gender: newPatient.gender,
    occupation: newPatient.occupation,
  };

  return nonSensitivePatient;
};

const addEntry = (patientId: string, entry: EntryWithoutId): Entry => {
  const newEntry: Entry = {
    id: uuid(),
    ...entry,
  };

  const patient = patients.find((p) => p.id === patientId);
  patient?.entries.push(newEntry);

  return newEntry;
};

export default {
  getPatientsWithoutSsn,
  getPatient,
  addPatient,
  addEntry,
};
