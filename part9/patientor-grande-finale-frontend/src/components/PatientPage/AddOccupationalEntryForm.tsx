import React, { useState } from "react";
import { Diagnosis } from "../../types";
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  FormControlLabel,
  Checkbox,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  OutlinedInput,
  Chip,
  SelectChangeEvent,
} from "@mui/material";

interface AddOccupationalEntryFormProps {
  onSubmit: (entryData: {
    description: string;
    date: string;
    specialist: string;
    employerName: string;
    diagnosisCodes?: string[];
    sickLeave?: {
      startDate: string;
      endDate: string;
    };
  }) => void;
  onCancel: () => void;
  diagnoses: Diagnosis[];
}

export const AddOccupationalHealthcareEntryForm: React.FC<
  AddOccupationalEntryFormProps
> = ({ onSubmit, onCancel, diagnoses }) => {
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [specialist, setSpecialist] = useState("");
  const [employerName, setEmployerName] = useState("");
  const [sickLeaveStartDate, setSickLeaveStartDate] = useState("");
  const [sickLeaveEndDate, setSickLeaveEndDate] = useState("");
  const [hasSickLeave, setHasSickLeave] = useState(false);
  const [diagnosisCodes, setDiagnosisCodes] = useState<string[]>([]);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    const sickLeave =
      hasSickLeave && sickLeaveStartDate && sickLeaveEndDate
        ? { startDate: sickLeaveStartDate, endDate: sickLeaveEndDate }
        : undefined;

    onSubmit({
      description,
      date,
      specialist,
      employerName,
      diagnosisCodes: diagnosisCodes.length > 0 ? diagnosisCodes : undefined,
      sickLeave,
    });
  };

  const handleDiagnosisChange = (event: SelectChangeEvent<string[]>) => {
    const value = event.target.value;
    setDiagnosisCodes(typeof value === "string" ? value.split(",") : value);
  };

  return (
    <Paper elevation={3} sx={{ p: 3, mb: 2 }}>
      <Typography variant="h5" component="h3" gutterBottom>
        New Occupational Healthcare Entry
      </Typography>
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 2,
        }}
      >
        <TextField
          label="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
          fullWidth
        />

        <TextField
          label="Date"
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
          fullWidth
          InputLabelProps={{
            shrink: true,
          }}
        />

        <TextField
          label="Specialist"
          value={specialist}
          onChange={(e) => setSpecialist(e.target.value)}
          required
          fullWidth
        />

        <TextField
          label="Employer Name"
          value={employerName}
          onChange={(e) => setEmployerName(e.target.value)}
          required
          fullWidth
        />

        <FormControlLabel
          control={
            <Checkbox
              checked={hasSickLeave}
              onChange={(e) => setHasSickLeave(e.target.checked)}
            />
          }
          label="Has Sick Leave"
        />

        {hasSickLeave && (
          <>
            <TextField
              label="Sick Leave Start Date"
              type="date"
              value={sickLeaveStartDate}
              onChange={(e) => setSickLeaveStartDate(e.target.value)}
              fullWidth
              InputLabelProps={{
                shrink: true,
              }}
            />

            <TextField
              label="Sick Leave End Date"
              type="date"
              value={sickLeaveEndDate}
              onChange={(e) => setSickLeaveEndDate(e.target.value)}
              fullWidth
              InputLabelProps={{
                shrink: true,
              }}
            />
          </>
        )}

        <FormControl fullWidth>
          <InputLabel>Diagnosis Codes</InputLabel>
          <Select
            multiple
            value={diagnosisCodes}
            onChange={handleDiagnosisChange}
            input={<OutlinedInput label="Diagnosis Codes" />}
            MenuProps={{
              PaperProps: {
                style: {
                  maxHeight: 224,
                  width: 250,
                },
              },
            }}
            renderValue={(selected) => (
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                {selected.map((value) => (
                  <Chip key={value} label={value} />
                ))}
              </Box>
            )}
          >
            {diagnoses.map((diagnosis) => (
              <MenuItem key={diagnosis.code} value={diagnosis.code}>
                {diagnosis.code} - {diagnosis.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Box
          sx={{
            display: "flex",
            gap: 2,
            justifyContent: "flex-end",
          }}
        >
          <Button variant="outlined" onClick={onCancel}>
            CANCEL
          </Button>
          <Button variant="contained" type="submit">
            ADD
          </Button>
        </Box>
      </Box>
    </Paper>
  );
};
