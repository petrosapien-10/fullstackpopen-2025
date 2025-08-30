import patientService from "../../services/patients";
import { useState, useEffect } from "react";
import { useParams } from "react-router";
import { Patient } from "../../types";
import { Gender } from "../../types";
import FemaleIcon from "@mui/icons-material/Female";
import MaleIcon from "@mui/icons-material/Male";
import TransgenderIcon from "@mui/icons-material/Transgender";

export const PatientPage = () => {
  const [patient, setPatient] = useState<Patient>();
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
          console.log(error);
        }
      }
    };

    fetchPatient();
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
  return (
    <>
      <h2>
        {patient?.name} <GenderIcon gender={patient?.gender} />
      </h2>
      <p>ssn: {patient?.ssn}</p>
      <p>occupation: {patient?.occupation}</p>
    </>
  );
};
