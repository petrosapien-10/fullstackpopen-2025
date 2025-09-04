import patientService from "../../services/patients";
import diagnosisService from "../../services/diagnoses";
import { useState, useEffect } from "react";
import { useParams } from "react-router";
import {
  Patient,
  Diagnosis,
  Entry,
  EntryWithoutId,
  HealthCheckRating,
} from "../../types";
import { Gender } from "../../types";
import FemaleIcon from "@mui/icons-material/Female";
import MaleIcon from "@mui/icons-material/Male";
import TransgenderIcon from "@mui/icons-material/Transgender";
import { Box, Button, Alert, Typography } from "@mui/material";
import { HospitalEntry } from "./HospitalEntry";
import { HealthCheckEntry } from "./HealthCheckEntry";
import { OccupationalHealthcareEntry } from "./OccupationalHealthcareEntry";
import { AddHealthCheckEntryForm } from "./AddHealthCheckEntryForm";
import { AddHospitalEntryForm } from "./AddHospitalEntryForm";
import { AddOccupationalHealthcareEntryForm } from "./AddOccupationalEntryForm";

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
  const [showAddForm, setShowAddForm] = useState<string | null>(null);
  const [error, setError] = useState<string>("");
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
        const fetchedDiagnoses = await diagnosisService.getAll();
        setDiagnoses(fetchedDiagnoses);
      } catch (error: unknown) {
        console.error(error);
      }
    };

    fetchDiagnoses();
  }, []);

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

  const handleAddHealthCheckEntry = async (entryData: {
    description: string;
    date: string;
    specialist: string;
    healthCheckRating: string;
    diagnosisCodes?: string[];
  }) => {
    if (!id || !patient) return;

    try {
      setError("");

      const newEntryData: EntryWithoutId = {
        type: "HealthCheck",
        description: entryData.description,
        date: entryData.date,
        specialist: entryData.specialist,
        healthCheckRating: Number(
          entryData.healthCheckRating
        ) as HealthCheckRating,
        diagnosisCodes: entryData.diagnosisCodes,
      };

      const newEntry = await patientService.createEntry(newEntryData, id);

      setPatient({
        ...patient,
        entries: [...patient.entries, newEntry],
      });

      setShowAddForm(null);
    } catch (error: any) {
      console.error("Error adding entry:", error);
      handleErrorResponse(error, entryData);
    }
  };

  const handleAddHospitalEntry = async (entryData: {
    description: string;
    date: string;
    specialist: string;
    diagnosisCodes?: string[];
    discharge: {
      date: string;
      criteria: string;
    };
  }) => {
    if (!id || !patient) return;

    try {
      setError("");

      const newEntryData: EntryWithoutId = {
        type: "Hospital",
        description: entryData.description,
        date: entryData.date,
        specialist: entryData.specialist,
        diagnosisCodes: entryData.diagnosisCodes,
        discharge: entryData.discharge,
      };

      const newEntry = await patientService.createEntry(newEntryData, id);

      setPatient({
        ...patient,
        entries: [...patient.entries, newEntry],
      });

      setShowAddForm(null);
    } catch (error: any) {
      console.error("Error adding entry:", error);
      handleErrorResponse(error, entryData);
    }
  };

  const handleAddOccupationalEntry = async (entryData: {
    description: string;
    date: string;
    specialist: string;
    employerName: string;
    diagnosisCodes?: string[];
    sickLeave?: {
      startDate: string;
      endDate: string;
    };
  }) => {
    if (!id || !patient) return;

    try {
      setError("");

      const newEntryData: EntryWithoutId = {
        type: "OccupationalHealthcare",
        description: entryData.description,
        date: entryData.date,
        specialist: entryData.specialist,
        diagnosisCodes: entryData.diagnosisCodes,
        employerName: entryData.employerName,
        sickLeave: entryData.sickLeave,
      };

      const newEntry = await patientService.createEntry(newEntryData, id);

      setPatient({
        ...patient,
        entries: [...patient.entries, newEntry],
      });

      setShowAddForm(null);
    } catch (error: any) {
      console.error("Error adding entry:", error);
      handleErrorResponse(error, entryData);
    }
  };

  const handleErrorResponse = (error: any, entryData: any) => {
    if (error.response?.data?.error) {
      const backendErrors = error.response.data.error;
      const errorMessages = backendErrors.map((err: any) => {
        const field = err.path ? err.path[0] : "field";

        if (field === "healthCheckRating") {
          return `Value of healthCheckRating incorrect: ${
            err.received || entryData.healthCheckRating
          }`;
        } else if (field === "date") {
          return `Value of date incorrect: ${entryData.date}`;
        } else if (field === "description") {
          return `Value of description incorrect: ${entryData.description}`;
        } else if (field === "specialist") {
          return `Value of specialist incorrect: ${entryData.specialist}`;
        } else {
          return `Value of ${field} incorrect: ${
            err.received || "invalid value"
          }`;
        }
      });
      setError(errorMessages.join(", "));
    } else {
      setError("Something went wrong. Please try again.");
    }
  };

  return (
    <>
      <Typography variant="h4" component="h2" gutterBottom>
        {patient?.name} <GenderIcon gender={patient?.gender} />
      </Typography>
      <Typography variant="body1">ssn: {patient?.ssn}</Typography>
      <Typography variant="body1">occupation: {patient?.occupation}</Typography>
      <Typography variant="h5" component="h3" gutterBottom sx={{ mt: 3 }}>
        entries
      </Typography>

      {/* Error message displayed here, above any form */}
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {showAddForm === "healthcheck" ? (
        <AddHealthCheckEntryForm
          onSubmit={handleAddHealthCheckEntry}
          onCancel={() => {
            setShowAddForm(null);
            setError("");
          }}
          diagnoses={diagnoses}
        />
      ) : showAddForm === "hospital" ? (
        <AddHospitalEntryForm
          onSubmit={handleAddHospitalEntry}
          onCancel={() => {
            setShowAddForm(null);
            setError("");
          }}
          diagnoses={diagnoses}
        />
      ) : showAddForm === "occupational" ? (
        <AddOccupationalHealthcareEntryForm
          onSubmit={handleAddOccupationalEntry}
          onCancel={() => {
            setShowAddForm(null);
            setError("");
          }}
          diagnoses={diagnoses}
        />
      ) : (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mb: 3 }}>
          <Button
            variant="contained"
            onClick={() => setShowAddForm("healthcheck")}
            sx={{ alignSelf: "flex-start" }}
          >
            Add New Health Check Entry
          </Button>
          <Button
            variant="contained"
            onClick={() => setShowAddForm("hospital")}
            sx={{ alignSelf: "flex-start" }}
          >
            Add New Hospital Entry
          </Button>
          <Button
            variant="contained"
            onClick={() => setShowAddForm("occupational")}
            sx={{ alignSelf: "flex-start" }}
          >
            Add New Occupational Healthcare Entry
          </Button>
        </Box>
      )}
      <div>
        {patient?.entries.map((entry) => (
          <EntryDetails key={entry.id} entry={entry} />
        ))}
      </div>
    </>
  );
};
