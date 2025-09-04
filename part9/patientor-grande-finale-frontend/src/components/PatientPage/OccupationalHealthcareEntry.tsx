import { OccupationalHealthcareEntry as OccupationalHealthcareEntryType } from "../../types";
import { EntryIcon } from "./EntryIcon";
import { Box } from "@mui/material";

interface OccupationalHealthcareEntryProps {
  entry: OccupationalHealthcareEntryType;
  getDiagnoseName: (code: string) => string;
  entryBoxStyle: React.CSSProperties;
}

export const OccupationalHealthcareEntry: React.FC<
  OccupationalHealthcareEntryProps
> = ({ entry, getDiagnoseName, entryBoxStyle }) => {
  return (
    <Box sx={entryBoxStyle}>
      {entry.date} <EntryIcon entryType={entry.type} /> {entry.employerName}
      <p>{entry.description}</p>
      <ul>
        {entry.diagnosisCodes?.map((code) => (
          <li>
            {code} {getDiagnoseName(code)}
          </li>
        ))}
      </ul>
      <p>diagnose by {entry.specialist}</p>
    </Box>
  );
};
