import FavoriteIcon from "@mui/icons-material/Favorite";
import { HealthCheckRating } from "../../types";
import { HealthCheckEntry as HealthCheckEntryType } from "../../types";
import { Box } from "@mui/material";
import { EntryIcon } from "./EntryIcon";

interface HealthCheckIconProps {
  entryHealthCheckRating: HealthCheckRating;
}
const HealthCheckIcon = ({ entryHealthCheckRating }: HealthCheckIconProps) => {
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

interface HealthCheckEntryProps {
  entry: HealthCheckEntryType;
  getDiagnoseName: (code: string) => string;
  entryBoxStyle: React.CSSProperties;
}
export const HealthCheckEntry: React.FC<HealthCheckEntryProps> = ({
  entry,
  getDiagnoseName,
  entryBoxStyle,
}) => {
  return (
    <Box sx={entryBoxStyle}>
      <p>
        {entry.date} <EntryIcon entryType={entry.type} />
      </p>
      <p>{entry.description}</p>
      <ul>
        {entry.diagnosisCodes?.map((code) => (
          <li key={code}>
            {code} {getDiagnoseName(code)}
          </li>
        ))}
      </ul>
      <HealthCheckIcon entryHealthCheckRating={entry.healthCheckRating} />
      <p>diagnose by {entry.specialist}</p>
    </Box>
  );
};
