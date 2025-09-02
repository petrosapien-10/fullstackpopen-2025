import { Diagnosis } from "../types";
import diagnoses from "../data/diagnoses";

const getDiagnoses = (): Diagnosis[] => {
  return diagnoses;
};

export default {
  getDiagnoses,
};
