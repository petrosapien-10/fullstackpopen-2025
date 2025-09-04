import { HospitalEntry as HospitalEntryType } from "../../types";
import { Box } from "@mui/material";
import { EntryIcon } from "./EntryIcon";

interface HospitalEntryProps {
  entry: HospitalEntryType;
  getDiagnoseName: (code: string) => string;
  entryBoxStyle: React.CSSProperties;
}

export const HospitalEntry: React.FC<HospitalEntryProps> = ({
  entry,
  getDiagnoseName,
  entryBoxStyle,
}) => {
  return (
    <Box sx={entryBoxStyle}>
      {entry.date} <EntryIcon entryType={entry.type} />
      <p>{entry.description}</p>
      <ul>
        {entry.diagnosisCodes?.map((code) => (
          <li>
            {code} {getDiagnoseName(code)}
          </li>
        ))}
      </ul>
      <p>diagnose by {entry.specialist}</p>
      <p>
        discharge {entry.discharge.date} {entry.discharge.criteria}
      </p>
    </Box>
  );
};
