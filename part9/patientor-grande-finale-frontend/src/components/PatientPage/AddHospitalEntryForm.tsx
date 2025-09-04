import React, { useState } from "react";
import { Diagnosis } from "../../types";
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  OutlinedInput,
  Chip,
  SelectChangeEvent,
} from "@mui/material";

interface AddHospitalEntryFormProps {
  onSubmit: (entry: {
    description: string;
    date: string;
    specialist: string;
    diagnosisCodes?: string[];
    discharge: {
      date: string;
      criteria: string;
    };
  }) => void;
  onCancel: () => void;
  diagnoses: Diagnosis[];
}

export const AddHospitalEntryForm: React.FC<AddHospitalEntryFormProps> = ({
  onSubmit,
  onCancel,
  diagnoses,
}) => {
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [specialist, setSpecialist] = useState("");
  const [dischargeDate, setDischargeDate] = useState("");
  const [dischargeCriteria, setDischargeCriteria] = useState("");
  const [diagnosisCodes, setDiagnosisCodes] = useState<string[]>([]);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    onSubmit({
      description,
      date,
      specialist,
      diagnosisCodes: diagnosisCodes.length > 0 ? diagnosisCodes : undefined,
      discharge: {
        date: dischargeDate,
        criteria: dischargeCriteria,
      },
    });
  };

  const handleDiagnosisChange = (event: SelectChangeEvent<string[]>) => {
    const value = event.target.value;
    setDiagnosisCodes(typeof value === "string" ? value.split(",") : value);
  };

  return (
    <Paper elevation={3} sx={{ p: 3, mb: 2 }}>
      <Typography variant="h5" component="h3" gutterBottom>
        New Hospital Entry
      </Typography>
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{ display: "flex", flexDirection: "column", gap: 2 }}
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
          label="Discharge Date"
          type="date"
          value={dischargeDate}
          onChange={(e) => setDischargeDate(e.target.value)}
          required
          fullWidth
          InputLabelProps={{
            shrink: true,
          }}
        />

        <TextField
          label="Discharge Criteria"
          value={dischargeCriteria}
          onChange={(e) => setDischargeCriteria(e.target.value)}
          required
          fullWidth
        />

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
