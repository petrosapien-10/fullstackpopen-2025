import patientService from "../../services/patients";
import diagnosisService from "../../services/diagnoses";
import { useState, useEffect } from "react";
import { useParams } from "react-router";
import {
  Patient,
  Diagnosis,
  Entry,
  HealthCheckEntry,
  HealthCheckRating,
  OccupationalHealthcareEntry,
} from "../../types";
import { Gender } from "../../types";
import FemaleIcon from "@mui/icons-material/Female";
import MaleIcon from "@mui/icons-material/Male";
import TransgenderIcon from "@mui/icons-material/Transgender";
import { Box } from "@mui/material";
import WorkIcon from "@mui/icons-material/Work";
import LocalHospitalIcon from "@mui/icons-material/LocalHospital";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import FavoriteIcon from "@mui/icons-material/Favorite";

export const PatientPage = () => {
  const [patient, setPatient] = useState<Patient | null>(null);
  const [diagnoses, setDiagnoses] = useState<Diagnosis[]>([]);
  const params = useParams();
  const id = params.patientId;

  console.log(id);

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

  console.log("patient: ", patient);

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

  interface EntryIconProps {
    entryType: string;
  }
  const EntryIcon = ({ entryType }: EntryIconProps) => {
    switch (entryType) {
      case "Hospital":
        return <LocalHospitalIcon />;
      case "OccupationalHealthcare":
        return <WorkIcon />;
      case "HealthCheck":
        return <CheckBoxIcon />;
    }
  };

  interface HealthCheckIconProps {
    entryHealthCheckRating: HealthCheckRating;
  }

  //   "Healthy" = 0,
  // "LowRisk" = 1,
  // "HighRisk" = 2,
  // "CriticalRisk" = 3,
  const HealthCheckIcon = ({
    entryHealthCheckRating,
  }: HealthCheckIconProps) => {
    switch (entryHealthCheckRating) {
      case HealthCheckRating.Healthy:
        return <FavoriteIcon sx={{ color: "green" }} />;
      case HealthCheckRating.LowRisk:
        return <FavoriteIcon sx={{ color: "gold" }} />;
      case HealthCheckRating.HighRisk:
        return <FavoriteIcon sx={{ color: "orange" }} />;
      case HealthCheckRating.CriticalRisk:
        return <FavoriteIcon sx={{ color: "red" }} />;
      default:
        return <></>;
    }
  };

  const getDiagnoseDescription = (code: string): string => {
    return diagnoses.find((d) => d.code === code)?.name ?? "uknown";
  };

  const HospitalEntry = () => {
    return <></>;
  };

  const OccupationalHealthcare: React.FC<{
    entry: OccupationalHealthcareEntry;
  }> = ({ entry }) => {
    return (
      <Box
        sx={{
          border: 1,
          borderColor: "black",
          borderRadius: 1,
          margin: 1,
          padding: 1,
        }}
      >
        {entry.date} <EntryIcon entryType={entry.type} /> {entry.employerName}
        <p>{entry.description}</p>
        <p>diagnose by {entry.specialist}</p>
      </Box>
    );
  };

  const HealthCheck: React.FC<{ entry: HealthCheckEntry }> = ({ entry }) => {
    return (
      <Box
        sx={{
          border: 1,
          borderColor: "black",
          borderRadius: 1,
          margin: 1,
          padding: 1,
        }}
      >
        <p>
          {entry.date} <EntryIcon entryType={entry.type} />
        </p>
        <p>{entry.description}</p>
        <HealthCheckIcon entryHealthCheckRating={entry.healthCheckRating} />
        <p>dianose by {entry.specialist}</p>
      </Box>
    );
  };

  const assertNever = (value: never): never => {
    throw new Error(
      `Unhandled discriminated union member: ${JSON.stringify(value)}`
    );
  };

  const EntryDetails: React.FC<{ entry: Entry }> = ({ entry }) => {
    switch (entry.type) {
      case "Hospital":
        return <HospitalEntry />;
      case "OccupationalHealthcare":
        return <OccupationalHealthcare entry={entry} />;
      case "HealthCheck":
        return <HealthCheck entry={entry} />;
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
        {/* {patient?.entries.map((entry) => (
          <>
            <p>
              {entry.date} {entry.description}
            </p>
            <ul>
              {entry.diagnosisCodes?.map((code) => (
                <li>
                  {code} {getDiagnoseDescription(code)}
                </li>
              ))}
            </ul>
          </>
        ))} */}
        {patient?.entries.map((entry) => (
          <EntryDetails entry={entry} />
        ))}
      </div>
    </>
  );
};
