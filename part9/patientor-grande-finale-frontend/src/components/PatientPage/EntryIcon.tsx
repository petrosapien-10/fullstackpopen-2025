import WorkIcon from "@mui/icons-material/Work";
import LocalHospitalIcon from "@mui/icons-material/LocalHospital";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
interface EntryIconProps {
  entryType: string;
}
export const EntryIcon = ({ entryType }: EntryIconProps) => {
  switch (entryType) {
    case "Hospital":
      return <LocalHospitalIcon />;
    case "OccupationalHealthcare":
      return <WorkIcon />;
    case "HealthCheck":
      return <CheckBoxIcon />;
  }
};
