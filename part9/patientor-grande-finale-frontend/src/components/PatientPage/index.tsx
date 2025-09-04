import patientService from "../../services/patients";
import diagnosisService from "../../services/diagnoses";
import { useState, useEffect } from "react";
import { useParams } from "react-router";
import { Patient, Diagnosis, Entry } from "../../types";
import { Gender } from "../../types";
import FemaleIcon from "@mui/icons-material/Female";
import MaleIcon from "@mui/icons-material/Male";
import TransgenderIcon from "@mui/icons-material/Transgender";
import { HospitalEntry } from "./HospitalEntry";
import { HealthCheckEntry } from "./HealthCheckEntry";
import { OccupationalHealthcareEntry } from "./OccupationalHealthcareEntry";

interface GenderIconProps {
  gender?: Gender;
}
const GenderIcon = ({ gender }: GenderIconProps) => {
  switch (gender) {
    case Gender.Male:
      return <MaleIcon />;
    case Gender.Female:
      return <FemaleIcon />;
    case Gender.Other:
      return <TransgenderIcon />;
    default:
      return null;
  }
};

export const PatientPage = () => {
  const [patient, setPatient] = useState<Patient | null>(null);
  const [diagnoses, setDiagnoses] = useState<Diagnosis[]>([]);
  const params = useParams();
  const id = params.patientId;
  const entryBoxStyle = {
    border: 1,
    borderColor: "black",
    borderRadius: 1,
    margin: 1,
    padding: 1,
  };

  useEffect(() => {
    const fetchPatient = async () => {
      if (id) {
        try {
          const fetchedPatient = await patientService.getPatient(id);
          setPatient(fetchedPatient);
        } catch (error: unknown) {
          console.error(error);
        }
      }
    };

    fetchPatient();
  }, [id]);
  useEffect(() => {
    const fetchDiagnoses = async () => {
      try {
        const fetchedDianoses = await diagnosisService.getAll();
        setDiagnoses(fetchedDianoses);
      } catch (error: unknown) {
        console.error(error);
      }
    };

    fetchDiagnoses();
  }, [id]);

  const getDiagnoseName = (code: string): string => {
    return diagnoses.find((d) => d.code === code)?.name ?? "unknown";
  };

  const assertNever = (value: never): never => {
    throw new Error(
      `Unhandled discriminated union member: ${JSON.stringify(value)}`
    );
  };

  const EntryDetails: React.FC<{ entry: Entry }> = ({ entry }) => {
    switch (entry.type) {
      case "Hospital":
        return (
          <HospitalEntry
            entry={entry}
            getDiagnoseName={getDiagnoseName}
            entryBoxStyle={entryBoxStyle}
          />
        );
      case "OccupationalHealthcare":
        return (
          <OccupationalHealthcareEntry
            entry={entry}
            getDiagnoseName={getDiagnoseName}
            entryBoxStyle={entryBoxStyle}
          />
        );
      case "HealthCheck":
        return (
          <HealthCheckEntry
            entry={entry}
            getDiagnoseName={getDiagnoseName}
            entryBoxStyle={entryBoxStyle}
          />
        );
      default:
        return assertNever(entry);
    }
  };

  return (
    <>
      <h2>
        {patient?.name} <GenderIcon gender={patient?.gender} />
      </h2>
      <p>ssn: {patient?.ssn}</p>
      <p>occupation: {patient?.occupation}</p>
      <h3>entries</h3>
      <div>
        {patient?.entries.map((entry) => (
          <EntryDetails entry={entry} />
        ))}
      </div>
    </>
  );
};
