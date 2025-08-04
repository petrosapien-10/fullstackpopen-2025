import { Gender, NewPatient, PatientWithoutSsn } from "../types";
import patients from "../data/patients";
import { v1 as uuid } from "uuid";

const getPatientsWithoutSsn = (): PatientWithoutSsn[] => {
  return patients.map(({ id, name, dateOfBirth, gender, occupation }) => ({
    id,
    name,
    dateOfBirth,
    gender: gender as Gender,
    occupation,
  }));
};

const addPatient = (patient: NewPatient) => {
  const newPatient = {
    id: uuid(),
    ...patient,
  };

  patients.push(newPatient);
  return newPatient;
};

export default {
  getPatientsWithoutSsn,
  addPatient,
};
